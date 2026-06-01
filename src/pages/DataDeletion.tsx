import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

export default function DataDeletion() {
  return (
    <LegalPageLayout
      title="Data Deletion Policy"
      lastUpdated="June 1, 2026"
      intro="At Sumalyze, you have full ownership of your data. This policy details how you can request the deletion of your personal data, what information is permanently removed, and what data we are legally or operationally required to retain."
    >
      <LegalSection title="1. Right to Deletion & Overview">
        <p>
          We believe in data minimization. You have the right to request the permanent deletion of your Sumalyze account and all associated personal information. Deleting your data is irreversible.
        </p>
      </LegalSection>

      <LegalSection title="2. What Data Can Be Deleted">
        <p>Upon receiving and verifying a deletion request, we will permanently delete or anonymize the following information:</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li><strong>Account Profile:</strong> Your email address, profile names, and account profile and authentication records, excluding raw passwords which are not stored by Sumalyze.</li>
          <li><strong>Saved Workspace History:</strong> Bookmarks, past tool run inputs, generated summaries, tone insights, and next-step extraction logs.</li>
          <li><strong>Agent Mode Logs:</strong> Agent Mode run history, outputs, and related workspace records.</li>
          <li><strong>User Uploads:</strong> uploaded documents or extracted text submitted for processing, where stored.</li>
          <li><strong>Custom Preferences:</strong> Saved settings, theme toggles, and user preferences.</li>
          <li><strong>Support & Waitlist Metadata:</strong> Contact support tickets and Team Workspace waitlist files, where technically feasible.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. What Information We May Retain">
        <p>
          We are legally or operationally required to retain certain records for compliance, security, and accounting. We do not delete:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li><strong>Billing & Invoices:</strong> Transaction records, invoice histories, and payment references managed through our Merchant of Record, Paddle, which must be stored for tax, billing, fraud prevention, and legal compliance.</li>
          <li><strong>Security & Abuse Prevention Logs:</strong> Security metadata, blocklists, and IP address rate limit logs are retained for a limited time (typically 90 days) to prevent DDoS attacks, fraud, or platform scraping.</li>
          <li><strong>Backup Copies:</strong> Data residing on automated database backups will persist until the backup files are rotated and overwritten in the normal course of backup cycles (within 30 days).</li>
          <li><strong>Aggregated Analytics:</strong> Anonymized usage data stored in PostHog that does not contain identifiers may be retained for application performance analysis.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. How to Request Data Deletion">
        <p>
          You can request account and data deletion by contacting us directly:
        </p>
        <p style={{ margin: '12px 0 6px 0' }}>
          ✉ Email: <a href="mailto:privacy@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>privacy@sumalyze.space</a>
        </p>
        <p>
          Please send the email from the address registered with your Sumalyze account and include the subject line <strong>"Account Data Deletion Request"</strong>.
        </p>
      </LegalSection>

      <LegalSection title="5. Identity Verification & Deletion Timeline">
        <p>
          <strong>Verification:</strong> To protect your privacy and prevent unauthorized account deletions, we may verify your identity before processing the request. This may include sending a confirmation link to your registered email or asking for details of your recent account activity.
        </p>
        <p>
          <strong>Timeline:</strong> Once your identity is verified, we will process and confirm the deletion within <strong>30 days</strong>.
        </p>
      </LegalSection>

      <LegalSection title="6. Important Notes on Subscriptions">
        <p style={{ color: '#ff8fa3', fontWeight: 500 }}>
          ⚠️ IMPORTANT: Deleting your Sumalyze account or requesting data deletion does NOT automatically cancel or refund your active paid subscription.
        </p>
        <p style={{ marginTop: 8 }}>
          Before requesting data deletion, you must cancel any active billing cycles to prevent future charges. You can cancel your subscription via the billing customer portal in your account settings, or by contacting the Paddle customer portal or <a href="mailto:billing@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>billing@sumalyze.space</a>. If you require billing-related assistance, please email <a href="mailto:billing@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>billing@sumalyze.space</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
