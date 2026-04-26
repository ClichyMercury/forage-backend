import User from '#models/user'
import EntrepriseProfile from '#models/entreprise_profile'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class TestUsersSeeder extends BaseSeeder {
  async run() {
    const admin = await User.findBy('email', 'admin@forage.ci')

    const existingClient = await User.findBy('email', 'client@forage.ci')
    if (!existingClient) {
      await User.create({
        fullName: 'Jean Client',
        email: 'client@forage.ci',
        password: 'Client@2025',
        telephone: '0701010101',
        role: 'client',
        userType: 'particulier',
        isActive: true,
      })
      console.log('Compte client créé : client@forage.ci / Client@2025')
    } else {
      console.log('Client déjà existant, ignoré.')
    }

    const existingEntreprise = await User.findBy('email', 'entreprise@forage.ci')
    if (!existingEntreprise) {
      const entrepriseUser = await User.create({
        fullName: 'Forage Pro SARL',
        email: 'entreprise@forage.ci',
        password: 'Entreprise@2025',
        telephone: '0702020202',
        role: 'entreprise',
        userType: 'entreprise',
        isActive: true,
      })

      await EntrepriseProfile.create({
        userId: entrepriseUser.id,
        raisonSociale: 'Forage Pro SARL',
        rccm: 'CI-ABJ-2025-B-12345',
        domaines: ['eau', 'geotechnique'],
        zonesGeographiques: ['Abidjan', 'Yamoussoukro', 'Bouaké'],
        validatedBy: admin?.id ?? null,
        validatedAt: DateTime.now(),
      })

      console.log('Compte entreprise créé : entreprise@forage.ci / Entreprise@2025 (validé)')
    } else {
      console.log('Entreprise déjà existante, ignorée.')
    }
  }
}
