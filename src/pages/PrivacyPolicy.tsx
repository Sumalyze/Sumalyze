import LegalPageLayout, { LegalSection, LegalItem } from '../components/LegalPageLayout';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="June 1, 2026"
      intro="Sumalyze is an AI clarity workspace hosted at https://sumalyze.space. We are committed to transparency, security, and data minimization. This Privacy Policy details what information we collect, how we use it, who we share it with, and your rights regarding your data."
    >
      <LegalSection title="1. Overview & Core Principles">
        <p>
          Sumalyze provides tools for AI text and document summarization, key points extraction, tone and intent analysis, action steps extraction, and interactive AI Agent workspace modes. We collect only the information necessary to provide, billing-enable, and secure this service. 
        </p>
        <p>
          We do not sell your personal data or user-submitted content to third parties, and we do not use your inputs or outputs to train Sumalyze-owned public AI models.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We process several categories of information to run our services:</p>
        
        <LegalItem label="Account Data">
          Your registered email address, optional name, and profile information. Authentication and passwords are handled securely by our auth partner, Supabase. If you choose to log in using Google or GitHub OAuth, we collect your basic social profile metadata (e.g. name, email, avatar URL) as permitted by those providers.
        </LegalItem>

        <LegalItem label="User Content">
          The text snippets you submit for analysis, uploaded files and documents (which are parsed and processed transiently, and not stored permanently except for text outputs saved in your history), generated outputs (summaries, key points, action items, tone analyses, Agent run logs), and saved workspace histories.
        </LegalItem>

        <LegalItem label="Support & Communication Data">
          Content of emails, feedback forms, and support requests you submit to us, including your waitlist questionnaire responses for the Team Workspace.
        </LegalItem>

        <LegalItem label="Payment & Subscription Metadata">
          We use Paddle as our Merchant of Record and payment processor. While your credit card and raw payment credentials are processed directly by Paddle, we receive and store subscription state metadata, transaction IDs, subscription renew/cancel timestamps, and billing plans (Free, Starter, Pro, Max). We do not store full credit card numbers on our servers.
        </LegalItem>

        <LegalItem label="Technical, Security, & Usage Data">
          To prevent abuse, secure the platform, and monitor usage limits, we record: IP addresses, rate-limiting counters, browser/device metadata (operating system, browser version), and overall feature usage counters.
        </LegalItem>
      </LegalSection>

      <LegalSection title="3. AI Processing & Third-Party AI Providers">
        <p>
          To generate summaries, extract key points, analyze tone, and run the Agent Mode, the text you submit and files you upload are transmitted in real-time to our primary AI provider, Google Gemini, or our fallback provider, OpenRouter.
        </p>
        <p>
          These providers process your content through professional API endpoints designed to protect confidentiality. Under our terms with these providers, submitted text is not used to train public models. However, users should avoid submitting highly sensitive, proprietary, or regulated personal data unless necessary for their workspace needs.
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies & Local Storage">
        <p>
          We use cookies and browser local storage to operate and optimize the application:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li><strong>Authentication:</strong> Supabase session identifiers to maintain your logged-in state.</li>
          <li><strong>Preferences:</strong> Saving user interface layout settings, toggle states, and theme choices.</li>
          <li><strong>Application Status:</strong> Tracking cookie consent preferences and waitlist sign-up status.</li>
          <li><strong>Analytics:</strong> PostHog anonymous tracking cookies, which are strictly initialized only if you grant analytics consent.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Third-Party Data Processors & Sub-processors">
        <p>
          We share data with the following partners only to the extent required to execute our contract with you or maintain legitimate interests:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {[
            { label: 'Supabase', desc: 'Provides our secure cloud database, authentication, and storage where enabled.' },
            { label: 'Google Gemini', desc: 'Acts as our primary generative AI engine for analyzing inputs and creating outputs.' },
            { label: 'OpenRouter', desc: 'Serves as our secondary/fallback AI gateway provider.' },
            { label: 'Paddle', desc: 'Our payment processor and Merchant of Record. Handles all checkouts, subscriptions, renewals, taxes, and invoices.' },
            { label: 'PostHog', desc: 'Collects privacy-safe telemetry and usage metrics. No raw user content, uploaded documents, generated outputs, or full email addresses are sent to PostHog.' },
            { label: 'Resend', desc: 'Sends transactional alerts, account notifications, and Waitlist support emails.' },
            { label: 'Zoho & ImprovMX', desc: 'Manages incoming business emails, forwarding, and support communication routing.' },
            { label: 'Cloudflare Turnstile', desc: 'Provides anti-spam verification and bot protection on our forms.' },
            { label: 'Upstash Redis', desc: 'Enforces API rate limiting and provides key-value caching to prevent platform abuse.' },
            { label: 'Ko-fi', desc: 'Allows optional user donations and support. If you connect your support payment, it may grant limited promotional Pro access.' }
          ].map((item, idx) => (
            <li key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 14 }}>
              <span style={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>{item.label}</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{item.desc}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="6. Legal Basis for Processing">
        <p>If you reside in the European Economic Area (EEA) or United Kingdom, we process your personal data under the following legal bases:</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li><strong>Performance of Contract:</strong> To set up your account, process payments, and provide the summarization/Agent services.</li>
          <li><strong>Legitimate Interests:</strong> To secure the platform against fraud or DDoS attacks, rate-limit access, and maintain application stability.</li>
          <li><strong>Consent:</strong> For setting optional preferences and executing anonymous analytics (PostHog tracking). You can withdraw this consent at any time.</li>
          <li><strong>Legal Obligation:</strong> To maintain accounting records and tax compliance required by our payment processors and applicable tax, billing, and legal obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Data Retention & International Processing">
        <p>
          We retain your account profile, saved history, saved outputs, and related workspace data for as long as your account remains active. If you delete items from your history dashboard, they are permanently expunged from our active database layers (backups may persist for up to 30 days for disaster recovery). 
        </p>
        <p>
          Sumalyze operates globally. Your data will be transferred to and processed in the United States and other regions where our sub-processors (like Supabase, Google, and Paddle) maintain servers. These transfers are secured under standard contractual clauses and data processing agreements.
        </p>
      </LegalSection>

      <LegalSection title="8. Children's Privacy">
        <p>
          Sumalyze is not directed to children under the age of 13. If you are under the digital consent age in your country, you must only use our workspace with the explicit consent and supervision of a parent or legal guardian.
        </p>
      </LegalSection>

      <LegalSection title="9. Your Rights & Security Measures">
        <p>
          You have the right to access, correct, delete, or export your account profile and workspace history. You can restrict or object to certain processing activities, and withdraw any consent you have previously given. 
        </p>
        <p>
          To protect your data, we enforce secure HTTPS transit encryption, database-level row-level security (RLS) policies in Supabase, and rate-limiting blocks. While we employ professional-grade safeguards, no cloud service is 100% secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="10. Data Deletion Requests & Contact">
        <p>
          To delete your account and remove all personal information, please visit our <a href="/data-deletion" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>Data Deletion Page</a> or email us at <a href="mailto:privacy@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>privacy@sumalyze.space</a>.
        </p>
        <p>
          For general security and policy inquiries, contact us at <a href="mailto:support@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>support@sumalyze.space</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
