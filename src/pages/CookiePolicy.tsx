import LegalPageLayout, { LegalSection, LegalItem } from '../components/LegalPageLayout';

export default function CookiePolicy() {
  const triggerCookieSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('sumalyze-open-cookie-settings'));
  };

  return (
    <LegalPageLayout
      title="Cookie Policy"
      lastUpdated="June 1, 2026"
      intro="This Cookie Policy explains how Sumalyze utilizes cookies, local storage, and similar web tracking technologies on our workspace at https://sumalyze.space. We use these technologies to provide core functions, remember your settings, and evaluate feature performance using privacy-safe analytics."
    >
      <LegalSection title="1. Understanding Cookies & Local Storage">
        <p>
          "Cookies" refer to small text files placed on your browser or device when visiting websites. 
          "Local Storage" and "Session Storage" are built-in web browser storage mechanisms that store application state directly on your device. 
          Throughout this policy, we refer to all of these client-side storage technologies collectively as "cookies."
        </p>
      </LegalSection>

      <LegalSection title="2. Categories of Cookies We Use">
        <p>We classify the cookies used on our platform into four key categories:</p>
        
        <LegalItem label="1. Strictly Necessary Cookies">
          <p>These cookies are required for the core security, stability, and authentication of the application. Without them, you cannot use our account services:</p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '6px 0 0 16px', listStyleType: 'circle', fontSize: 13 }}>
            <li><strong>Supabase Auth:</strong> Keeps you securely logged in as you navigate between pages or sessions.</li>
            <li><strong>Cloudflare Turnstile:</strong> Cloudflare Turnstile protects selected forms from spam and abuse.</li>
            <li><strong>Upstash & API Limits:</strong> Server-side rate limiting may use request metadata, but it does not require browser cookies.</li>
            <li><strong>Consent Settings:</strong> Saves your cookie preferences in the `sumalyze_cookie_consent` local storage key so you aren't prompted repeatedly.</li>
          </ul>
        </LegalItem>

        <LegalItem label="2. Preference Cookies">
          <p>These allow our application to remember choices you make to personalize your workspace layout:</p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '6px 0 0 16px', listStyleType: 'circle', fontSize: 13 }}>
            <li>Saved display options, text sizes, and interface preferences and workspace settings.</li>
            <li>Your waitlist submission flag to prevent showing waitlist cards after you have signed up.</li>
          </ul>
        </LegalItem>

        <LegalItem label="3. Analytics Cookies">
          <p>These allow us to track platform usage, feature popularity, and speed performance in a privacy-respecting manner. We use PostHog for product telemetry to transmit privacy-safe product events, which will only initialize or record if you explicitly enable analytics consent.</p>
        </LegalItem>

        <LegalItem label="4. Marketing Cookies">
          <p>We do not use advertising trackers, retargeting pixels, Facebook Pixels, or cross-site marketing cookies. We have no interest in tracking your web activity outside of Sumalyze.</p>
        </LegalItem>
      </LegalSection>

      <LegalSection title="3. Third-Party Integrations Setting Cookies">
        <p>
          When you use specific functions or sections of our platform, the following third-party integrations may load cookies or local storage settings:
        </p>
        
        <LegalItem label="Supabase">
          Sets authentication tokens to verify your login session and profile.
        </LegalItem>

        <LegalItem label="PostHog">
          Analyzes feature clicks and page flows. It is strictly opt-in and does not transmit raw text summaries or email addresses.
        </LegalItem>

        <LegalItem label="Cloudflare Turnstile">
          Cloudflare Turnstile protects selected forms from spam and abuse.
        </LegalItem>

        <LegalItem label="Paddle">
          Our checkout engine and payment processor. Setting cookies is required during subscription checkouts to process credit cards, detect fraud, and manage subscription portals.
        </LegalItem>

        <LegalItem label="Ko-fi">
          If you open the optional Ko-fi support link from our pages, Ko-fi may set session cookies to track donations or support verification.
        </LegalItem>
      </LegalSection>

      <LegalSection title="4. Managing and Re-opening Cookie Preferences">
        <p>
          You have full control over cookie preferences on Sumalyze. You can choose to accept all cookies, necessary only, or customize settings at any time.
        </p>
        <p>
          <strong>Re-open Cookie Settings:</strong> You can re-open your consent choices and toggle Preferences or Analytics cookies on/off by clicking the button below:
        </p>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={triggerCookieSettings}
            style={{
              display: 'inline-flex',
              padding: '8px 18px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
              border: 'none',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(226, 62, 87, 0.25)',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(226, 62, 87, 0.35)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(226, 62, 87, 0.25)'}
          >
            Adjust Cookie Settings
          </button>
        </div>
        <p style={{ marginTop: 14 }}>
          Alternatively, you can block or clear cookies via your web browser settings. Note that disabling strictly necessary cookies will prevent you from logging in, maintaining workspace sessions, or executing billing checkouts on Sumalyze.
        </p>
      </LegalSection>

      <LegalSection title="5. Contact Information">
        <p>
          If you have any questions or require support regarding our use of cookies, please contact us at{' '}
          <a href="mailto:privacy@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>privacy@sumalyze.space</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
