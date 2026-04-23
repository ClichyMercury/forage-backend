import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(6).maxLength(32)
const telephone = () => vine.string().regex(/^(\+225)?[0-9]{10}$/)

export const signupValidator = vine.create({
  fullName: vine.string().minLength(2),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
  telephone: telephone(),
  userType: vine.enum(['particulier', 'entreprise'] as const).optional(),
})

export const signupEntrepriseValidator = vine.create({
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
  telephone: telephone(),
  raisonSociale: vine.string(),
  rccm: vine.string().optional(),
  domaines: vine.array(vine.enum(['eau', 'geotechnique', 'petrolier', 'autre'] as const)).minLength(1),
  zonesGeographiques: vine.array(vine.string()).minLength(1),
})

export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

export const updateProfileValidator = vine.create({
  fullName: vine.string().minLength(2).optional(),
  telephone: telephone().optional(),
  userType: vine.enum(['particulier', 'entreprise'] as const).optional(),
})
