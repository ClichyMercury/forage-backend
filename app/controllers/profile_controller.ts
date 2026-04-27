import UserTransformer from '#transformers/user_transformer'
import { updateProfileValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import string from '@adonisjs/core/helpers/string'
import { unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const AVATAR_ACCEPTED = ['jpg', 'jpeg', 'png', 'webp', 'gif']
const AVATAR_MAX_SIZE = '2mb'

export default class ProfileController {
  // GET /api/v1/account/profile
  async show({ auth, serialize }: HttpContext) {
    return serialize(UserTransformer.transform(auth.getUserOrFail()))
  }

  // PATCH /api/v1/account/profile
  async update({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(updateProfileValidator)
    user.merge(data)
    await user.save()
    return serialize(UserTransformer.transform(user))
  }

  // POST /api/v1/account/profile/avatar
  async uploadAvatar({ auth, request, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const file = request.file('avatar', { size: AVATAR_MAX_SIZE, extnames: AVATAR_ACCEPTED })
    if (!file) return response.badRequest({ message: 'Aucun fichier reçu.' })
    if (!file.isValid) {
      return response.unprocessableEntity({
        message: file.errors[0]?.message ?? 'Fichier invalide.',
      })
    }

    // Supprimer l'ancienne photo si elle existe
    if (user.avatarUrl) {
      const oldPath = app.makePath(user.avatarUrl)
      if (existsSync(oldPath)) await unlink(oldPath).catch(() => {})
    }

    const fileName = `avatar_${user.id}_${string.generateRandom(12)}.${file.extname}`
    await file.move(app.makePath('uploads/avatars'), { name: fileName })

    user.avatarUrl = `uploads/avatars/${fileName}`
    await user.save()

    return serialize(UserTransformer.transform(user))
  }

  // DELETE /api/v1/account/profile/avatar
  async removeAvatar({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.avatarUrl) {
      const filePath = app.makePath(user.avatarUrl)
      if (existsSync(filePath)) await unlink(filePath).catch(() => {})
      user.avatarUrl = null
      await user.save()
    }

    return serialize(UserTransformer.transform(user))
  }
}
