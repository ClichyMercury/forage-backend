import Demande from '#models/demande'
import OffreFinale from '#models/offre_finale'
import Offre from '#models/offre'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class AdminAnalyticsController {
  async dashboard({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin') return response.forbidden({ message: 'Accès refusé' })

    // Période : semaine | mois | année (défaut: mois)
    const { periode = 'mois' } = request.qs()

    let dateDebut: DateTime
    const maintenant = DateTime.now()

    if (periode === 'semaine') {
      dateDebut = maintenant.startOf('week')
    } else if (periode === 'annee') {
      dateDebut = maintenant.startOf('year')
    } else {
      dateDebut = maintenant.startOf('month')
    }

    const dateDebutSQL = dateDebut.toSQL()!

    const [
      totalDemandesPeriode,
      totalDemandesGlobal,
      demandesAcceptees,
      demandesEnAttente,
      offresFinales,
      repartitionTypeForage,
      repartitionGeo,
      classementEntreprises,
      demandesSansReponse,
    ] = await Promise.all([
      // Demandes sur la période
      Demande.query().where('created_at', '>=', dateDebutSQL).count('* as total').first(),

      // Total global
      Demande.query().count('* as total').first(),

      // Demandes acceptées (pour taux de conversion)
      Demande.query().where('statut', 'acceptee').count('* as total').first(),

      // Demandes en attente
      Demande.query().where('statut', 'en_attente').count('* as total').first(),

      // CA et marges sur la période
      OffreFinale.query()
        .where('created_at', '>=', dateDebutSQL)
        .select(
          db.raw('SUM(prix_final_client) as chiffre_affaires'),
          db.raw('SUM(marge_admin) as marges_cumulees')
        )
        .first(),

      // Répartition par type de forage
      db
        .from('demandes')
        .select('type_forage')
        .count('* as count')
        .groupBy('type_forage'),

      // Répartition géographique (lat/lng pour carte)
      db
        .from('demandes')
        .select('localisation_adresse', 'localisation_lat', 'localisation_lng', 'statut')
        .whereNotNull('localisation_lat')
        .whereNotNull('localisation_lng'),

      // Classement entreprises : taux de sélection, prix moyen, délai moyen
      db
        .from('offres')
        .join('users', 'users.id', 'offres.entreprise_id')
        .select(
          'users.id',
          'users.full_name',
          db.raw('COUNT(*) as total_offres'),
          db.raw('SUM(CASE WHEN offres.statut = "retenue" THEN 1 ELSE 0 END) as offres_retenues'),
          db.raw('AVG(offres.prix_ttc) as prix_moyen'),
          db.raw('AVG(offres.delai_execution) as delai_moyen'),
          db.raw(
            'ROUND(SUM(CASE WHEN offres.statut = "retenue" THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as taux_selection'
          )
        )
        .groupBy('users.id', 'users.full_name')
        .orderBy('taux_selection', 'desc')
        .limit(10),

      // Alertes: demandes sans réponse depuis plus de 7 jours
      // Cas 1 : demande en_attente depuis +7j (pas encore validée)
      // Cas 2 : AO lancé depuis +7j sans aucune offre soumise
      db
        .from('demandes')
        .leftJoin('appels_offres', 'appels_offres.demande_id', 'demandes.id')
        .leftJoin('offres', 'offres.appel_offre_id', 'appels_offres.id')
        .select(
          'demandes.id',
          'demandes.localisation_adresse',
          'demandes.type_forage',
          'demandes.created_at',
          'demandes.statut'
        )
        .where((q) => {
          q.where((sub) => {
            // Cas 1 : en attente depuis +7j
            sub
              .where('demandes.statut', 'en_attente')
              .where('demandes.created_at', '<=', DateTime.now().minus({ days: 7 }).toSQL()!)
          }).orWhere((sub) => {
            // Cas 2 : AO lancé mais aucune offre reçue depuis +7j
            sub
              .where('demandes.statut', 'appel_offre_lance')
              .whereNull('offres.id')
              .where('demandes.created_at', '<=', DateTime.now().minus({ days: 7 }).toSQL()!)
          })
        })
        .groupBy('demandes.id')
        .orderBy('demandes.created_at', 'asc')
        .limit(20),
    ])

    const totalGlobal = Number((totalDemandesGlobal as any).$extras.total)
    const totalAcceptees = Number((demandesAcceptees as any).$extras.total)
    const tauxConversion = totalGlobal > 0 ? ((totalAcceptees / totalGlobal) * 100).toFixed(2) : '0.00'

    return response.ok({
      periode,
      demandes: {
        total_periode: Number((totalDemandesPeriode as any).$extras.total),
        total_global: totalGlobal,
        en_attente: Number((demandesEnAttente as any).$extras.total),
        acceptees: totalAcceptees,
        taux_conversion: tauxConversion + '%',
      },
      finances: {
        chiffre_affaires: (offresFinales as any)?.$extras?.chiffre_affaires ?? 0,
        marges_cumulees: (offresFinales as any)?.$extras?.marges_cumulees ?? 0,
      },
      repartition_type_forage: repartitionTypeForage,
      repartition_geographique: repartitionGeo,
      classement_entreprises: classementEntreprises,
      alertes_sans_reponse: {
        count: demandesSansReponse.length,
        demandes: demandesSansReponse,
      },
    })
  }
}
