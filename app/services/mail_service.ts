import nodemailer from 'nodemailer'
import env from '#start/env'

// Transporter Gmail SMTP réutilisable
const transporter = nodemailer.createTransport({
  host: env.get('SMTP_HOST'),
  port: env.get('SMTP_PORT'),
  secure: true,
  auth: {
    user: env.get('SMTP_USER'),
    pass: env.get('SMTP_PASSWORD'),
  },
})

const FROM = `"${env.get('MAIL_FROM_NAME')}" <${env.get('MAIL_FROM_ADDRESS')}>`

export default class MailService {
  private static async send(to: string, subject: string, html: string) {
    await transporter.sendMail({ from: FROM, to, subject, html })
  }

  // Confirmation soumission demande (CDC §3.1)
  static async confirmationDemande(to: string, data: {
    fullName: string
    demandeId: number
    typeForage: string
    localisation: string
  }) {
    await this.send(to, '✅ Confirmation de votre demande de forage', `
      <h2>Bonjour ${data.fullName},</h2>
      <p>Votre demande de forage a bien été reçue et est en cours de traitement.</p>
      <table border="1" cellpadding="8" style="border-collapse:collapse">
        <tr><td><strong>N° Demande</strong></td><td>#${data.demandeId}</td></tr>
        <tr><td><strong>Type de forage</strong></td><td>${data.typeForage}</td></tr>
        <tr><td><strong>Localisation</strong></td><td>${data.localisation}</td></tr>
        <tr><td><strong>Statut</strong></td><td>En attente de validation</td></tr>
      </table>
      <p>Vous serez notifié à chaque changement de statut.</p>
      <p>— ${env.get('MAIL_FROM_NAME')}</p>
    `)
  }

  // Changement de statut demande (CDC §3.1)
  static async statutDemande(to: string, data: {
    fullName: string
    demandeId: number
    statut: string
  }) {
    const labels: Record<string, string> = {
      validee: 'Validée — En cours de traitement',
      appel_offre_lance: "Appel d'offre lancé",
      offres_recues: 'Offres reçues',
      offre_envoyee: 'Offre finale disponible — Action requise',
      acceptee: 'Offre acceptée — Mise en relation en cours',
      refusee: 'Offre refusée',
      cloturee: 'Demande clôturée',
    }
    await this.send(to, `📋 Mise à jour de votre demande #${data.demandeId}`, `
      <h2>Bonjour ${data.fullName},</h2>
      <p>Le statut de votre demande <strong>#${data.demandeId}</strong> a été mis à jour.</p>
      <p><strong>Nouveau statut :</strong> ${labels[data.statut] ?? data.statut}</p>
      ${data.statut === 'offre_envoyee' ? '<p><strong>⚠️ Action requise :</strong> Connectez-vous pour consulter et accepter ou refuser l\'offre.</p>' : ''}
      <p>— ${env.get('MAIL_FROM_NAME')}</p>
    `)
  }

  // Offre finale envoyée au client (CDC §3.1 + §3.3)
  static async offreFinaleClient(to: string, data: {
    fullName: string
    demandeId: number
    prixFinalClient: number
    delaiExecution: number
    resumePrestation: string
  }) {
    await this.send(to, `💼 Offre reçue pour votre demande #${data.demandeId}`, `
      <h2>Bonjour ${data.fullName},</h2>
      <p>Une offre a été préparée pour votre demande de forage.</p>
      <table border="1" cellpadding="8" style="border-collapse:collapse">
        <tr><td><strong>Prestation</strong></td><td>${data.resumePrestation}</td></tr>
        <tr><td><strong>Prix</strong></td><td>${data.prixFinalClient.toLocaleString('fr-CI')} FCFA</td></tr>
        <tr><td><strong>Délai d'exécution</strong></td><td>${data.delaiExecution} jours</td></tr>
      </table>
      <p><strong>Connectez-vous pour accepter ou refuser cette offre.</strong></p>
      <p>— ${env.get('MAIL_FROM_NAME')}</p>
    `)
  }

  // Invitation appel d'offre à l'entreprise (CDC §3.2)
  static async appelOffreEntreprise(to: string, data: {
    raisonSociale: string
    appelOffreId: number
    typeForage: string
    localisation: string
    delaiReponse: string
  }) {
    await this.send(to, `📢 Nouvel appel d'offre #${data.appelOffreId}`, `
      <h2>Bonjour ${data.raisonSociale},</h2>
      <p>Vous avez été invité à soumettre une offre pour une prestation de forage.</p>
      <table border="1" cellpadding="8" style="border-collapse:collapse">
        <tr><td><strong>N° Appel d'offre</strong></td><td>#${data.appelOffreId}</td></tr>
        <tr><td><strong>Type de forage</strong></td><td>${data.typeForage}</td></tr>
        <tr><td><strong>Localisation</strong></td><td>${data.localisation}</td></tr>
        <tr><td><strong>Date limite</strong></td><td>${data.delaiReponse}</td></tr>
      </table>
      <p>Connectez-vous pour soumettre votre offre avant la date limite.</p>
      <p>— ${env.get('MAIL_FROM_NAME')}</p>
    `)
  }

  // Décision sur l'offre entreprise (CDC §3.2)
  static async decisionOffreEntreprise(to: string, data: {
    raisonSociale: string
    offreId: number
    demandeId: number
    retenue: boolean
  }) {
    await this.send(
      to,
      `${data.retenue ? '✅ Offre retenue' : '❌ Offre non retenue'} — Demande #${data.demandeId}`,
      `
      <h2>Bonjour ${data.raisonSociale},</h2>
      <p>Votre offre <strong>#${data.offreId}</strong> pour la demande <strong>#${data.demandeId}</strong>
      ${data.retenue ? 'a été <strong>retenue</strong>. Vous serez contacté prochainement.' : "n'a pas été retenue pour cette demande."}</p>
      <p>— ${env.get('MAIL_FROM_NAME')}</p>
    `)
  }

  // Nouveau message reçu (CDC §5.1 — notification email à chaque étape clé)
  static async nouveauMessage(to: string, data: {
    destinataire: string
    expediteur: string
    demandeId: number
    apercu: string
  }) {
    await this.send(to, `💬 Nouveau message — Demande #${data.demandeId}`, `
      <h2>Bonjour ${data.destinataire},</h2>
      <p>Vous avez reçu un nouveau message de <strong>${data.expediteur}</strong> concernant la demande <strong>#${data.demandeId}</strong>.</p>
      <div style="background:#f1f5f9;border-left:4px solid #3b82f6;padding:12px 16px;border-radius:8px;margin:16px 0;">
        <p style="margin:0;color:#334155;font-style:italic;">"${data.apercu}"</p>
      </div>
      <p>Connectez-vous pour lire et répondre au message.</p>
      <p>— ${env.get('MAIL_FROM_NAME')}</p>
    `)
  }

  // Validation compte entreprise (CDC §3.2)
  static async compteEntrepriseValide(to: string, data: { raisonSociale: string }) {    await this.send(to, '✅ Votre compte entreprise a été validé', `
      <h2>Bonjour ${data.raisonSociale},</h2>
      <p>Votre compte entreprise a été validé par notre équipe.</p>
      <p>Vous pouvez maintenant vous connecter et répondre aux appels d'offres.</p>
      <p>— ${env.get('MAIL_FROM_NAME')}</p>
    `)
  }

  // Réinitialisation mot de passe
  static async resetPassword(to: string, data: { fullName: string; token: string }) {
    const frontendUrl = env.get('FRONTEND_URL') ?? 'http://localhost:5173'
    const resetLink = `${frontendUrl}/reset-password?token=${data.token}`

    await this.send(to, '🔐 Réinitialisation de votre mot de passe — ForageCI', `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
        <h2 style="color:#1e3fff">Bonjour ${data.fullName},</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
        <div style="text-align:center;margin:32px 0">
          <a href="${resetLink}"
            style="background:#1e3fff;color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="color:#64748b;font-size:13px">
          Ce lien est valable <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez cet email.
        </p>
        <p style="color:#64748b;font-size:12px;word-break:break-all">
          Lien direct : ${resetLink}
        </p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
        <p style="color:#94a3b8;font-size:12px">— ${env.get('MAIL_FROM_NAME')}</p>
      </div>
    `)
  }
}
