import vine from '@vinejs/vine'

export const createAppelOffreValidator = vine.create({
  demandeId: vine.number().positive(),
  entrepriseIds: vine.array(vine.number().positive()),
  delaiReponse: vine.date({ formats: ['YYYY-MM-DDTHH:mm:ss.SSSZ', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'] }),
})
