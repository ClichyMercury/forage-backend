import vine from '@vinejs/vine'

// Entreprise: soumettre une offre
export const createOffreValidator = vine.create({
  prixHt: vine.number().positive(),
  prixTtc: vine.number().positive(),
  delaiExecution: vine.number().positive(),
  descriptionTechnique: vine.string().optional(),
})

// Admin: retenir une offre + appliquer la marge en une seule action
export const retenirOffreValidator = vine.create({
  margeAdmin: vine.number().positive(),
  resumePrestation: vine.string().minLength(10),
})

// Admin: générer et envoyer le récapitulatif au client (étape 2)
// Body: seulement prestation, prix final et délai (CDC §3.3)
export const createOffreFinaleValidator = vine.create({
  resumePrestation: vine.string().minLength(10),
  prixFinalClient: vine.number().positive(),
  delaiExecution: vine.number().positive(),
})
