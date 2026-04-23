import Document from '#models/document'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import string from '@adonisjs/core/helpers/string'
import { createReadStream, existsSync } from 'node:fs'

// Extensions autorisées 
const ALLOWED_EXTENSIONS = [
  'pdf',
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'svg',
  'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp',
  'dwg', 'dxf', 'dgn', 'dwf', 'rvt', 'ifc',
  'zip', 'rar', '7z',
]

export default class DocumentsController {
  /**
   * POST /api/v1/documents
   * Upload d'un document sur une demande ou une offre
   * Accès restreint par rôle (CDC §5.2)
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const entityType = request.input('entity_type') as 'demande' | 'offre'
    const entityId = Number(request.input('entity_id'))

    if (!['demande', 'offre'].includes(entityType) || !entityId) {
      return response.badRequest({ message: 'entity_type (demande|offre) et entity_id sont requis' })
    }

    const file = request.file('fichier', { size: '10mb', extnames: ALLOWED_EXTENSIONS })
    if (!file) return response.badRequest({ message: 'Aucun fichier fourni' })
    if (!file.isValid) return response.badRequest({ message: file.errors })

    // Contrôle d'accès par rôle (CDC §5.2)
    if (entityType === 'demande') {
      const Demande = (await import('#models/demande')).default
      const demande = await Demande.findOrFail(entityId)
      if (user.role === 'client' && demande.clientId !== user.id) {
        return response.forbidden({ message: 'Accès refusé' })
      }
      if (user.role === 'entreprise') {
        return response.forbidden({ message: 'Les entreprises ne peuvent pas joindre des fichiers aux demandes' })
      }
    }

    if (entityType === 'offre') {
      const Offre = (await import('#models/offre')).default
      const offre = await Offre.findOrFail(entityId)
      if (user.role === 'entreprise' && offre.entrepriseId !== user.id) {
        return response.forbidden({ message: 'Accès refusé' })
      }
      if (user.role === 'client') {
        return response.forbidden({ message: 'Accès refusé' })
      }
    }

    const fileName = `${string.generateRandom(32)}.${file.extname}`
    await file.move(app.makePath('uploads'), { name: fileName })

    const document = await Document.create({
      entityType,
      entityId,
      nomFichier: file.clientName,
      chemin: `uploads/${fileName}`,
      mimeType: file.type ? `${file.type}/${file.subtype}` : null,
      uploadedBy: user.id,
    })

    return response.created({
      message: 'Document uploadé avec succès.',
      document,
    })
  }

  /**
   * GET /api/v1/documents?entity_type=demande&entity_id=1
   * Liste des documents d'une entité avec contrôle d'accès par rôle
   */
  async index({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const entityType = request.qs().entity_type as 'demande' | 'offre'
    const entityId = Number(request.qs().entity_id)

    if (!['demande', 'offre'].includes(entityType) || !entityId) {
      return response.badRequest({ message: 'entity_type et entity_id sont requis' })
    }

    // Contrôle d'accès
    if (entityType === 'demande') {
      const Demande = (await import('#models/demande')).default
      const demande = await Demande.findOrFail(entityId)
      if (user.role === 'client' && demande.clientId !== user.id) {
        return response.forbidden({ message: 'Accès refusé' })
      }
      if (user.role === 'entreprise') {
        return response.forbidden({ message: 'Accès refusé' })
      }
    }

    if (entityType === 'offre') {
      const Offre = (await import('#models/offre')).default
      const offre = await Offre.findOrFail(entityId)
      if (user.role === 'entreprise' && offre.entrepriseId !== user.id) {
        return response.forbidden({ message: 'Accès refusé' })
      }
      if (user.role === 'client') {
        return response.forbidden({ message: 'Accès refusé' })
      }
    }

    const documents = await Document.query()
      .where('entity_type', entityType)
      .where('entity_id', entityId)
      .orderBy('created_at', 'desc')

    return response.ok(documents)
  }

  /**
   * GET /api/v1/documents/:id/download
   * Téléchargement sécurisé d'un fichier avec contrôle d'accès par rôle (CDC §5.2)
   * Aucun fichier n'est accessible directement sans authentification
   */
  async download({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const document = await Document.findOrFail(params.id)

    // Contrôle d'accès selon le type d'entité
    if (document.entityType === 'demande') {
      const Demande = (await import('#models/demande')).default
      const demande = await Demande.findOrFail(document.entityId)

      if (user.role === 'client' && demande.clientId !== user.id) {
        return response.forbidden({ message: 'Accès refusé' })
      }
      if (user.role === 'entreprise') {
        return response.forbidden({ message: 'Accès refusé' })
      }
    }

    if (document.entityType === 'offre') {
      const Offre = (await import('#models/offre')).default
      const offre = await Offre.findOrFail(document.entityId)

      if (user.role === 'entreprise' && offre.entrepriseId !== user.id) {
        return response.forbidden({ message: 'Accès refusé' })
      }
      if (user.role === 'client') {
        return response.forbidden({ message: 'Accès refusé' })
      }
    }

    const filePath = app.makePath(document.chemin)

    if (!existsSync(filePath)) {
      return response.notFound({ message: 'Fichier introuvable' })
    }

    response.header('Content-Disposition', `attachment; filename="${document.nomFichier}"`)
    if (document.mimeType) {
      response.header('Content-Type', document.mimeType)
    }

    return response.stream(createReadStream(filePath))
  }

  /**
   * DELETE /api/v1/documents/:id
   * Suppression d'un document (uploader ou admin uniquement)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const document = await Document.findOrFail(params.id)

    if (user.role !== 'admin' && document.uploadedBy !== user.id) {
      return response.forbidden({ message: 'Accès refusé' })
    }

    const filePath = app.makePath(document.chemin)
    if (existsSync(filePath)) {
      const { unlink } = await import('node:fs/promises')
      await unlink(filePath)
    }

    await document.delete()

    return response.ok({ message: 'Document supprimé.' })
  }
}
