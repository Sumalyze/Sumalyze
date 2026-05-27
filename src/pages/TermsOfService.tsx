export default function TermsOfService({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a000f',
      color: 'white',
      fontFamily: "Inter, system-ui, sans-serif",
      padding: '100px 20px 80px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Back button */}
        <button
          onClick={onClose}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13, cursor: 'pointer', marginBottom: 48,
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          ← Back to Sumalyze
        </button>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 32,
            background: 'rgba(226,62,87,0.06)',
            border: '1px solid rgba(226,62,87,0.2)',
            marginBottom: 20,
          }}>
            <span style={{
              fontSize: 13, fontWeight: 500,
              background: 'linear-gradient(90deg, #ff8fa3 0%, #E23E57 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Legal</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>
            Last updated: May 27, 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          <Section title="About Sumalyze">
            <p>
              Sumalyze is a free, nonprofit AI communication intelligence platform. By using Sumalyze, you agree to these terms. If you do not agree, please do not use the service.
            </p>
          </Section>

          <Section title="The Service">
            <p>Sumalyze provides AI-powered text analysis tools including summarization, tone detection, intent analysis, and communication scoring. The service is provided free of charge with no mandatory account required.</p>
            <p>We reserve the right to modify, suspend, or discontinue the service at any time without notice, though we aim to provide continuity as a nonprofit project.</p>
          </Section>

          <Section title="Acceptable Use">
            <p>You agree not to use Sumalyze to:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                'Analyze or generate content that is illegal, harmful, or abusive',
                'Attempt to reverse-engineer, scrape, or overload our systems',
                'Use the service for spam or bulk automated analysis',
                'Impersonate others or submit their private communications without consent',
                'Violate any applicable laws or regulations',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#E23E57', flexShrink: 0 }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Your Content">
            <p>
              Text you submit for analysis is yours. We do not claim ownership of your content. We do not store your submitted text on our servers (see our{' '}
              <a
                href="#privacy"
                onClick={() => { window.location.hash = 'privacy'; }}
                style={{ color: '#ff8fa3', cursor: 'pointer' }}
              >
                Privacy Policy
              </a>
              ).
            </p>
            <p>
              By submitting text for analysis, you confirm you have the right to do so and that it does not violate any third party's rights.
            </p>
          </Section>

          <Section title="No Warranty">
            <p>
              Sumalyze is provided <strong style={{ color: 'white' }}>"as is"</strong> without warranty of any kind. AI analysis results are for informational purposes only and should not be relied upon for legal, medical, financial, or other critical decisions.
            </p>
            <p>
              We do not guarantee the accuracy, completeness, or reliability of any analysis output.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Sumalyze and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>
            <p>
              Our total liability to you shall not exceed the amount you paid us in the past 12 months (which, for most users, is $0).
            </p>
          </Section>

          <Section title="Accounts">
            <p>
              If you create an account, you are responsible for keeping your credentials secure. You agree to notify us immediately at{' '}
              <a href="mailto:hello@sumalyze.space" style={{ color: '#ff8fa3' }}>hello@sumalyze.space</a>{' '}
              of any unauthorized access.
            </p>
            <p>
              We reserve the right to suspend accounts that violate these terms.
            </p>
          </Section>

          <Section title="Donations">
            <p>
              Donations via Ko-fi are voluntary and do not entitle you to any specific features, levels of service, or refunds. All donations support the continued operation of Sumalyze as a nonprofit project.
            </p>
          </Section>

          <Section title="Changes to Terms">
            <p>
              We may update these terms from time to time. Continued use of the service after changes are posted constitutes acceptance of the new terms. The date at the top reflects the most recent update.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These terms are governed by applicable law. Any disputes shall be resolved through good-faith negotiation. Contact us first at{' '}
              <a href="mailto:hello@sumalyze.space" style={{ color: '#ff8fa3' }}>hello@sumalyze.space</a>.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms? Email{' '}
              <a href="mailto:hello@sumalyze.space" style={{ color: '#ff8fa3' }}>hello@sumalyze.space</a>
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.018)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: '28px 28px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(226,62,87,0.2), transparent)',
      }} />
      <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', letterSpacing: '-0.01em', marginBottom: 16 }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: '22px' }}>
        {children}
      </div>
    </div>
  );
}
