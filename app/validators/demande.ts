import vine from '@vinejs/vine'

export const createDemandeValidator = vine.create({
  typeForage: vine.enum(['eau', 'geotechnique', 'petrolier', 'autre'] as const),
  description: vine.string().minLength(10),
  localisationAdresse: vine.string(),
  localisationLat: vine.number().optional(),
  localisationLng: vine.number().optional(),
  profondeurEstimee: vine.number().positive().optional(),
  budgetMax: vine.number().positive(),
  delaiSouhaite: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
})
