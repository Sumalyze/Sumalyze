import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

export default function SupportPage() {
  return (
    <LegalPageLayout
      title="Contact & Support"
      lastUpdated="June 1, 2026"
      intro="Need help with your workspace, account, or billing? Have a suggestion or technical issue? Our support team is here to assist you."
    >
      <LegalSection title="1. How to Contact Us">
        <p>
          You can contact Sumalyze support by sending an email to:
        </p>
        <p style={{ fontSize: 16, fontWeight: 600, margin: '12px 0' }}>
          ✉ <a href="mailto:support@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>support@sumalyze.space</a>
        </p>
        <p>
          All support inquiries are processed via email. We do not provide phone support or live chat at this stage.
        </p>
      </LegalSection>

      <LegalSection title="2. Support Request Categories">
        <p>
          To help us resolve your query efficiently, please specify which category your request relates to:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          <li>
            <strong>Account:</strong> Registration, credentials, password reset, or authentication errors.
          </li>
          <li>
            <strong>Billing:</strong> Pricing plans, renewals, failed transactions, invoices, or cancellations when paid plans are enabled.
          </li>
          <li>
            <strong>Data & Privacy:</strong> Account deletion, data deletion requests, or privacy questions.
          </li>
          <li>
            <strong>Technical Issue:</strong> Performance glitches, tool crashes, display bugs, or error messages.
          </li>
          <li>
            <strong>Feedback:</strong> Feature suggestions, tool ideas, or recommendations.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Information to Include">
        <p>
          To help us assist you, please include the following details in your message where applicable:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li>Your registered account email address.</li>
          <li>A clear description of the issue or request.</li>
          <li>Your web browser and operating system details.</li>
          <li>Screenshots or error messages if you encountered a bug.</li>
          <li>Your billing reference or transaction ID (for billing requests).</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Expected Response Time">
        <p>
          We are a small team and review incoming emails in the order they are received. We aim to respond to support inquiries within <strong>24 to 48 hours</strong> on business days.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
