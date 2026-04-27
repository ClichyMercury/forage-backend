import Demande from '#models/demande'
import OffreFinale from '#models/offre_finale'
import Document from '#models/document'
import Notification from '#models/notification'
import { createDemandeValidator } from '#validators/demande'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import string from '@adonisjs/core/helpers/string'

const ALLOWED_EXTENSIONS = [
  'pdf',
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'svg',
  'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp',
  'dwg', 'dxf', 'dgn', 'dwf', 'rvt', 'ifc',
  'zip', 'rar', '7z',
]

export default class DemandesController {
  /**
   * POST /api/v1/demandes
   */
  async store({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'client') return response.forbidden({ message: 'Accès refusé' })

    const data = await request.validateUsing(createDemandeValidator)

    // Créer la demande
    const demande = await Demande.create({
      ...data,
      clientId: user.id,
      statut: 'en_attente',
    })

    // Traiter les documents joints optionnels (multipart)
    const fichiers = request.files('documents', {
      size: '10mb',
      extnames: ALLOWED_EXTENSIONS,
    })

    if (fichiers && fichiers.length > 0) {
      for (const fichier of fichiers) {
        if (!fichier.isValid) continue

        const fileName = `${string.generateRandom(32)}.${fichier.extname}`
        await fichier.move(app.makePath('uploads'), { name: fileName })

        await Document.create({
          entityType: 'demande',
          entityId: demande.id,
          nomFichier: fichier.clientName,
          chemin: `uploads/${fileName}`,
          mimeType: fichier.type ? `${fichier.type}/${fichier.subtype}` : null,
          uploadedBy: user.id,
        })
      }
    }

    // Notification interne pour l'admin
    await Notification.create({
      userId: user.id,
      type: 'nouvelle_demande',
      canal: 'interne',
      contenu: `Nouvelle demande de forage soumise par ${user.fullName} — Type: ${demande.typeForage}`,
      lu: false,
    })

    // Confirmation par email au client (CDC §3.1)
    try {
      const MailService = (await import('#services/mail_service')).default
      await MailService.confirmationDemande(user.email, {
        fullName: user.fullName ?? user.email,
        demandeId: demande.id,
        typeForage: demande.typeForage,
        localisation: demande.localisationAdresse,
      })
    } catch (e) {
      console.error('Erreur email:', (e as any)?.message ?? e)
    }

    // Charger les documents créés pour la réponse
    const documents = await Document.query()
      .where('entity_type', 'demande')
      .where('entity_id', demande.id)

    return response.created({
      message: 'Demande soumise avec succès. Vous recevrez une confirmation par email.',
      demande: { ...demande.toJSON(), documents },
    })
  }

  /**
   * GET /api/v1/demandes/offres-finales
   * Client: toutes ses offres finales reçues
   */
  async mesOffresFinales({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'client') return response.forbidden({ message: 'Accès refusé' })

    const offresFinales = await OffreFinale.query()
      .whereHas('demande' as any, (q: any) => q.where('client_id', user.id))
      .preload('demande' as any)
      .orderBy('created_at', 'desc')

    return response.ok(offresFinales)
  }

  /**
   * GET /api/v1/demandes
   * CDC §3.1 — Tableau de bord client avec statut en temps réel
   * Statuts: En attente → Offres en cours → Offre reçue → Acceptée / Refusée / Clôturée
   * Filtre: ?statut=
   */
  async index({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'client') return response.forbidden({ message: 'Accès refusé' })

    const { statut } = request.qs()

    const query = Demande.query()
      .where('client_id', user.id)
      .orderBy('created_at', 'desc')

    if (statut) query.where('statut', statut)

    const demandes = await query

    // Inclure l'offre finale si disponible
    const result = await Promise.all(
      demandes.map(async (demande) => {
        const json = demande.toJSON()

        if (['offre_envoyee', 'acceptee', 'refusee'].includes(demande.statut)) {
          const offreFinale = await OffreFinale.query()
            .where('demande_id', demande.id)
            .select(['id', 'prix_final_client', 'delai_execution', 'resume_prestation', 'statut', 'created_at'])
            .first()

          return { ...json, offre_finale: offreFinale ?? null }
        }

        return { ...json, offre_finale: null }
      })
    )

    return response.ok(result)
  }

  /**
   * GET /api/v1/demandes/:id
   * CDC §3.1 — Détail d'une demande avec documents
   */
  async show({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const demande = await Demande.findOrFail(params.id)

    if (user.role === 'client' && demande.clientId !== user.id) {
      return response.forbidden({ message: 'Accès refusé' })
    }

    const documents = await Document.query()
      .where('entity_type', 'demande')
      .where('entity_id', demande.id)

    return response.ok({ ...demande.toJSON(), documents })
  }

  /**
   * GET /api/v1/demandes/:id/offre-finale
   */
  async offreFinale({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const demande = await Demande.findOrFail(params.id)

    if (user.role !== 'client' || demande.clientId !== user.id) {
      return response.forbidden({ message: 'Accès refusé' })
    }

    if (!['offre_envoyee', 'acceptee', 'refusee'].includes(demande.statut)) {
      return response.notFound({ message: 'Aucune offre finale disponible pour cette demande' })
    }

    const offreFinale = await OffreFinale.query()
      .where('demande_id', demande.id)
      .select(['id', 'demande_id', 'prix_final_client', 'delai_execution', 'resume_prestation', 'statut', 'created_at'])
      .firstOrFail()

    return response.ok(offreFinale)
  }

  /**
   * PATCH /api/v1/demandes/:id/decision
   * CDC §3.1 — Acceptation ou refus de l'offre depuis l'interface
   */
  async decision({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const demande = await Demande.findOrFail(params.id)

    if (user.role !== 'client' || demande.clientId !== user.id) {
      return response.forbidden({ message: 'Accès refusé' })
    }
    if (demande.statut !== 'offre_envoyee') {
      return response.badRequest({ message: 'Aucune offre en attente de décision' })
    }

    const { decision } = request.only(['decision'])
    if (!['acceptee', 'refusee'].includes(decision)) {
      return response.badRequest({ message: 'Décision invalide. Valeurs: acceptee | refusee' })
    }

    demande.statut = decision
    await demande.save()

    await OffreFinale.query()
      .where('demande_id', demande.id)
      .update({ statut: decision })

    // Notifier l'admin de la décision du client
    const admin = await (await import('#models/user')).default.query().where('role', 'admin').first()
    if (admin) {
      await Notification.create({
        userId: admin.id,
        type: decision === 'acceptee' ? 'offre_acceptee' : 'offre_refusee',
        canal: 'interne',
        contenu: `Le client a ${decision === 'acceptee' ? 'accepté' : 'refusé'} l'offre pour la demande #${demande.id}.`,
        lu: false,
      })
    }

    // Notification interne
    await Notification.create({
      userId: user.id,
      type: decision === 'acceptee' ? 'offre_acceptee' : 'offre_refusee',
      canal: 'interne',
      contenu: `Le client ${user.fullName} a ${decision === 'acceptee' ? 'accepté' : 'refusé'} l'offre pour la demande #${demande.id}`,
      lu: false,
    })

    return response.ok({
      message: decision === 'acceptee'
        ? 'Offre acceptée. Les parties vont être mises en contact.'
        : 'Offre refusée.',
      demande,
    })
  }
}
