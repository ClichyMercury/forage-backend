import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class AdminSeeder extends BaseSeeder {
  async run() {
    const existing = await User.findBy('email', 'admin@forage.ci')
    if (existing) {
      console.log('Admin déjà existant, seeder ignoré.')
      return
    }

    await User.create({
      fullName: 'Administrateur',
      email: 'idriss@jeko.africa',
      password: 'admin2026',
      telephone: '0708377704',
      role: 'admin',
      isActive: true,
    })

    console.log('✅ Compte admin créé : admin@forage.ci / Admin@2025')
  }
}
