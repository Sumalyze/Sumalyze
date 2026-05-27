export default function PrivacyPolicy({ onClose }: { onClose: () => void }) {
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>
            Last updated: May 27, 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          <Section title="Overview">
            <p>Sumalyze is a nonprofit AI communication intelligence tool. We are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.</p>
            <p>The short version: <strong style={{ color: 'white' }}>we collect as little as possible, we don't sell anything, and we never share your text with third parties.</strong></p>
          </Section>

          <Section title="What We Collect">
            <Item label="Text you analyze">
              Text you paste into the analysis tool is processed locally in your browser using our AI modules. <strong style={{ color: 'white' }}>We do not store your text on our servers.</strong>
            </Item>
            <Item label="Account data (optional)">
              If you create an account, we store your email address and encrypted password via Supabase. We never store your password in plain text.
            </Item>
            <Item label="Analytics">
              We may use privacy-respecting analytics (such as PostHog) to understand how the product is used. This data is aggregated and anonymized. No personal text content is sent to analytics services.
            </Item>
            <Item label="Cookies">
              We use session cookies only for authentication. No tracking cookies. No cross-site cookies.
            </Item>
          </Section>

          <Section title="What We Don't Collect">
            <p>We do not collect, store, or sell:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                'The text content you analyze',
                'Your IP address (beyond what Supabase requires)',
                'Payment information',
                'Your contacts or social connections',
                'Any data for advertising purposes',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#34d399', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Third-Party Services">
            <Item label="Supabase">
              We use Supabase for authentication and database. Supabase is GDPR compliant. See their privacy policy at{' '}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8fa3' }}>supabase.com/privacy</a>.
            </Item>
            <Item label="Ko-fi">
              If you choose to support us via Ko-fi, your payment is handled directly by Ko-fi. We receive only confirmation of your support. See{' '}
              <a href="https://ko-fi.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8fa3' }}>ko-fi.com/privacy</a>.
            </Item>
          </Section>

          <Section title="Your Rights">
            <p>You have the right to:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                'Request deletion of your account and all associated data',
                'Access the data we hold about you',
                'Opt out of analytics at any time',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#818cf8', flexShrink: 0 }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 16 }}>
              To exercise these rights, contact us at{' '}
              <a href="mailto:hello@sumalyze.space" style={{ color: '#ff8fa3' }}>hello@sumalyze.space</a>.
            </p>
          </Section>

          <Section title="Data Security">
            <p>All data is transmitted over HTTPS. Account passwords are hashed and never stored in plain text. We regularly review our security practices.</p>
          </Section>

          <Section title="Changes to This Policy">
            <p>We may update this policy occasionally. If changes are significant, we'll notify registered users via email. The date at the top of this page reflects the last update.</p>
          </Section>

          <Section title="Contact">
            <p>
              Questions? Email us at{' '}
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

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: '22px' }}>{children}</p>
    </div>
  );
}
