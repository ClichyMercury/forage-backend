import vine from '@vinejs/vine'

export const createMessageValidator = vine.create({
  contenu: vine.string().minLength(1).maxLength(2000),
})
