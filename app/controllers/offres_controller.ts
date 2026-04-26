import Offre from '#models/offre'
import Document from '#models/document'
import AppelOffre from '#models/appel_offre'
import Notification from '#models/notification'
import { createOffreValidator } from '#validators/offre'
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

export default class OffresController {
  /**
   * POST /api/v1/appels-offres/:appelOffreId/offres
   * CDC §3.2 — Soumission d'une offre avec documents joints optionnels
   * Documents: devis formel, certifications, références de projets similaires
   * Une seule offre par entreprise par appel d'offre
   */
  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'entreprise') return response.forbidden({ message: 'Accès refusé' })

    if (!user.isActive) {
      return response.forbidden({ message: 'Votre compte est en attente de validation.' })
    }

    const appelOffre = await AppelOffre.findOrFail(params.appelOffreId)

    if (appelOffre.statut !== 'ouvert') {
      return response.badRequest({ message: "Cet appel d'offre est clôturé" })
    }

    const maintenant = new Date()
    if (new Date(appelOffre.delaiReponse as any) < maintenant) {
      return response.badRequest({ message: "Le délai de réponse pour cet appel d'offre est dépassé" })
    }

    const invited = await appelOffre.related('entreprises').query().where('users.id', user.id).first()
    if (!invited) {
      return response.forbidden({ message: "Vous n'êtes pas invité sur cet appel d'offre" })
    }

    const offreExistante = await Offre.query()
      .where('appel_offre_id', appelOffre.id)
      .where('entreprise_id', user.id)
      .first()

    if (offreExistante) {
      return response.badRequest({
        message: "Vous avez déjà soumis une offre pour cet appel d'offre.",
        offre_existante_id: offreExistante.id,
      })
    }

    const data = await request.validateUsing(createOffreValidator)

    const offre = await Offre.create({
      ...data,
      appelOffreId: appelOffre.id,
      entrepriseId: user.id,
      statut: 'soumise',
    })

    // Documents joints optionnels (CDC §3.2 : devis, certifications, références)
    const fichiers = request.files('documents', {
      size: '10mb',
      extnames: ALLOWED_EXTENSIONS,
    })

    const documentsCreated: Document[] = []
    if (fichiers && fichiers.length > 0) {
      for (const fichier of fichiers) {
        if (!fichier.isValid) continue

        const fileName = `${string.generateRandom(32)}.${fichier.extname}`
        await fichier.move(app.makePath('uploads'), { name: fileName })

        const doc = await Document.create({
          entityType: 'offre',
          entityId: offre.id,
          nomFichier: fichier.clientName,
          chemin: `uploads/${fileName}`,
          mimeType: fichier.type ? `${fichier.type}/${fichier.subtype}` : null,
          uploadedBy: user.id,
        })
        documentsCreated.push(doc)
      }
    }

    // Notifier l'admin
    const User = (await import('#models/user')).default
    const admin = await User.query().where('role', 'admin').first()
    if (admin) {
      await Notification.create({
        userId: admin.id,
        type: 'offre_soumise',
        canal: 'interne',
        contenu: `Une entreprise a soumis une offre sur l'appel d'offre #${appelOffre.id}. Prix TTC: ${data.prixTtc} FCFA — Délai: ${data.delaiExecution} jours. ${documentsCreated.length} document(s) joint(s).`,
        lu: false,
      })
    }

    return response.created({
      message: 'Offre soumise avec succès.',
      offre,
      documents: documentsCreated,
    })
  }

  /**
   * GET /api/v1/mes-offres
   * CDC §3.2 — Historique des offres soumises avec statut (soumise, retenue, non_retenue)
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'entreprise') return response.forbidden({ message: 'Accès refusé' })

    const offres = await Offre.query()
      .where('entreprise_id', user.id)
      .preload('appelOffre' as any, (q: any) =>
        q.preload('demande', (dq: any) =>
          dq.select(['id', 'type_forage', 'localisation_adresse', 'statut'])
        )
      )
      .orderBy('created_at', 'desc')

    return response.ok(offres)
  }
}
