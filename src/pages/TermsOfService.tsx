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
            Last updated: May 29, 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          <Section title="About Sumalyze">
            <p>
              Sumalyze is an independent AI communication intelligence platform. By using Sumalyze (either as a guest or as a registered account holder), you agree to these terms. If you do not agree, please do not use the workspace.
            </p>
          </Section>

          <Section title="The Service & Usage Limits">
            <p>Sumalyze provides AI-powered text analysis tools including summarization, tone detection, intent analysis, risk spotting, and agent-driven clarity workflows. The service is provided free of charge during our MVP stage.</p>
            <p>To ensure fair access and prevent abuse, we enforce usage limit tiers (such as 50 daily single tool runs and 10 agent mode runs for registered accounts). Guest interactions are subject to an in-memory IP rate limiter (5 requests per 60 seconds). Bypassing, scraping, or programmatic loading of these endpoints is strictly prohibited.</p>
          </Section>

          <Section title="Acceptable Use">
            <p>You agree not to use Sumalyze to:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                'Analyze or process text that contains illegal, harmful, or abusive materials',
                'Attempt to reverse-engineer, scan, scrape, or flood our serverless API routes',
                'Submit private personal communications of others without their explicit consent',
                'Violate any local, national, or international laws or regulations',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#E23E57', flexShrink: 0 }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Your Content & Data Ownership">
            <p>
              Text you submit for analysis is yours. We do not claim ownership of your inputs. Submitted text is processed by our backend Netlify functions and sent to third-party AI APIs (Google Gemini or OpenRouter fallback) in-flight.
            </p>
            <p>
              Signed-in users may save their text and analysis outcomes to their account history tables. Feedback submissions (bug reports, suggestion texts, ratings) are saved in our database. Guest users' text is processed transiently and is never stored.
            </p>
          </Section>

          <Section title="No Warranty / Professional Disclaimer">
            <p>
              Sumalyze is provided <strong style={{ color: 'white' }}>"as is"</strong> without warranties of any kind. AI outputs can be inaccurate, incomplete, or wrong. Sumalyze does NOT provide professional, legal, medical, or financial advice. You are solely responsible for how you interpret and use the AI analysis and reply recommendations.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Sumalyze and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you paid us (which is $0 for all free tiers).
            </p>
          </Section>

          <Section title="Accounts">
            <p>
              If you create an account, you are responsible for maintaining the confidentiality of your credentials. We reserve the right to suspend or terminate accounts that violate these terms or trigger excessive system load.
            </p>
          </Section>

          <Section title="Donations via Ko-fi">
            <p>
              Support contributions via Ko-fi are completely voluntary. Contributions do not entitle you to any specific Service Level Agreements, features, or refunds.
            </p>
          </Section>

          <Section title="Changes to Terms">
            <p>
              We may update these terms from time to time. Continued use of the workspace after changes are posted constitutes acceptance of the new terms.
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

