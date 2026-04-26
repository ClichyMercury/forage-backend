/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import vine, { SimpleMessagesProvider, VineDate } from '@vinejs/vine'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

/*
|--------------------------------------------------------------------------
| Messages d'erreur en français
|--------------------------------------------------------------------------
| Traduit les erreurs Vine par défaut. Le placeholder `{{ field }}` est
| remplacé par le nom du champ (utiliser `vine.messagesProvider` avec
| `fields` pour des libellés humains spécifiques par champ).
*/

const fields: Record<string, string> = {
  fullName: 'nom complet',
  full_name: 'nom complet',
  email: 'email',
  password: 'mot de passe',
  passwordConfirmation: 'confirmation du mot de passe',
  password_confirmation: 'confirmation du mot de passe',
  telephone: 'téléphone',
  userType: 'type de compte',
  raisonSociale: 'raison sociale',
  rccm: 'RCCM',
  domaines: 'domaines',
  zonesGeographiques: 'zones géographiques',
  description: 'description',
  typeForage: 'type de forage',
  type_forage: 'type de forage',
  localisationAdresse: 'adresse',
  localisation_adresse: 'adresse',
  localisationLat: 'latitude',
  localisationLng: 'longitude',
  budgetMax: 'budget maximum',
  budget_max: 'budget maximum',
  delaiSouhaite: 'délai souhaité',
  delai_souhaite: 'délai souhaité',
  profondeurEstimee: 'profondeur estimée',
  profondeur_estimee: 'profondeur estimée',
  prixHt: 'prix HT',
  prix_ht: 'prix HT',
  prixTtc: 'prix TTC',
  prix_ttc: 'prix TTC',
  delaiExecution: 'délai d\'exécution',
  delai_execution: 'délai d\'exécution',
  descriptionTechnique: 'description technique',
  resumePrestation: 'résumé de la prestation',
  resume_prestation: 'résumé de la prestation',
  margeAdmin: 'marge',
  marge_admin: 'marge',
  contenu: 'contenu',
  receiverId: 'destinataire',
  receiver_id: 'destinataire',
  delaiReponse: 'délai de réponse',
  delai_reponse: 'délai de réponse',
  entreprises: 'entreprises',
}

const messages: Record<string, string> = {
  // Génériques
  'required': 'Le champ {{ field }} est requis.',
  'string': 'Le champ {{ field }} doit être une chaîne de caractères.',
  'number': 'Le champ {{ field }} doit être un nombre.',
  'boolean': 'Le champ {{ field }} doit être vrai ou faux.',
  'array': 'Le champ {{ field }} doit être une liste.',
  'object': 'Le champ {{ field }} doit être un objet.',
  'enum': 'La valeur du champ {{ field }} n\'est pas autorisée.',
  'date': 'Le champ {{ field }} doit être une date valide.',
  'date.format': 'Le champ {{ field }} n\'est pas dans le bon format.',

  // Longueur / taille
  'minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères.',
  'maxLength': 'Le champ {{ field }} ne peut pas dépasser {{ max }} caractères.',
  'fixedLength': 'Le champ {{ field }} doit contenir exactement {{ size }} caractères.',
  'array.minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} élément(s).',
  'array.maxLength': 'Le champ {{ field }} ne peut pas dépasser {{ max }} élément(s).',
  'min': 'Le champ {{ field }} doit être supérieur ou égal à {{ min }}.',
  'max': 'Le champ {{ field }} doit être inférieur ou égal à {{ max }}.',
  'range': 'Le champ {{ field }} doit être entre {{ min }} et {{ max }}.',

  // Formats spécifiques
  'email': 'L\'adresse email n\'est pas valide.',
  'mobile': 'Le numéro de téléphone n\'est pas valide.',
  'url': 'L\'URL n\'est pas valide.',
  'regex': 'Le format du champ {{ field }} est invalide.',
  'alpha': 'Le champ {{ field }} ne doit contenir que des lettres.',
  'alphaNumeric': 'Le champ {{ field }} ne doit contenir que des lettres et des chiffres.',
  'uuid': 'Le champ {{ field }} doit être un identifiant valide.',
  'ip': 'Le champ {{ field }} doit être une adresse IP valide.',

  // Confirmation / égalité
  'confirmed': 'La confirmation du champ {{ field }} ne correspond pas.',
  'sameAs': 'Le champ {{ field }} doit être identique à {{ otherField }}.',
  'notSameAs': 'Le champ {{ field }} doit être différent de {{ otherField }}.',

  // Base de données (si lucid_db utilisé)
  'database.unique': 'Cette valeur est déjà utilisée.',
  'database.exists': 'Cette valeur n\'existe pas dans nos enregistrements.',

  // Fichiers
  'file': 'Le fichier est invalide.',
  'file.size': 'Le fichier est trop volumineux.',
  'file.extname': 'Le format du fichier n\'est pas autorisé.',
}

vine.messagesProvider = new SimpleMessagesProvider(messages, fields)
