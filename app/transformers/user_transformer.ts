import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'
import env from '#start/env'

function buildAvatarUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  // "uploads/avatars/xxx.jpg" → "http://localhost:3333/uploads/avatars/xxx.jpg"
  const base = env.get('APP_URL', 'http://localhost:3333')
  return `${base}/${path}`
}

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const base = this.pick(this.resource, [
      'id',
      'fullName',
      'email',
      'telephone',
      'role',
      'userType',
      'isActive',
      'createdAt',
      'updatedAt',
      'initials',
    ])
    return {
      ...base,
      avatarUrl: buildAvatarUrl(this.resource.avatarUrl),
    }
  }
}
