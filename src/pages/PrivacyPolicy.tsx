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
            Last updated: May 29, 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          <Section title="Overview">
            <p>Sumalyze is an independent AI communication intelligence workspace. We are committed to protecting your privacy. This policy explains what data we collect, why we use it, and how your data is handled.</p>
            <p>The short version: <strong style={{ color: 'white' }}>we collect as little as possible, we don't sell your data, and we do not use your submissions for training models.</strong></p>
          </Section>

          <Section title="What We Collect & Process">
            <Item label="Submitted Text content">
              Text you paste for analysis is processed in-flight using secure serverless Netlify functions. For guest users, this text is processed transiently and is never stored on our database. For signed-in users, the text and its analysis results are saved in your account history only if you run the tools or save them.
            </Item>
            <Item label="Account & Auth data">
              If you sign up for an account, we store your email address and authentication credentials securely via Supabase. We do not store plain-text passwords.
            </Item>
            <Item label="Saved history & Bookmarks">
              If you are logged in, we store your single tools history, agent step logs (such as goal stepper progress), and saved bookmarks (clarity reports and reply drafts) in your Supabase database profile so you can manage them.
            </Item>
            <Item label="Usage & Anti-abuse logs">
              To enforce usage limits (50 daily runs for tools, 10 for agent mode) and prevent spam attacks, we track usage counters. For guest users, we process and temporarily check incoming IP addresses in-memory server-side to enforce our rate limit (5 requests per 60 seconds). Guest IP logs are regularly pruned and are not permanently saved.
            </Item>
            <Item label="Feedback submissions">
              If you submit feedback, suggestions, or bug reports via our Feedback modal, we save the category (bug/suggestion/other), message rating (1-5), and feedback content. If you are signed in, your user ID is attached to the feedback; if you are logged out, submissions are saved anonymously.
            </Item>
          </Section>

          <Section title="Why We Use Your Data">
            <p>We process and store data strictly for the following purposes:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                'To provide AI text analysis, summaries, and reply recommendations',
                'To let you save, review, and delete your history and bookmarked outputs',
                'To enforce fair-use usage limits and guest rate-limiting boundaries',
                'To process your bugs, feature suggestions, or ratings to improve the platform',
                'To ensure the security, integrity, and stability of our serverless APIs',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#34d399', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Third-Party Processors">
            <p>To power Sumalyze, we share in-flight text content or use services hosted by these trusted providers:</p>
            <Item label="Google AI (Gemini)">
              Our primary AI provider. In-flight text is sent to Google's Gemini models for processing. Under their terms, API data is not used to train Google's models.
            </Item>
            <Item label="OpenRouter">
              Used as our backup fallback AI processor. In-flight text is processed in accordance with their privacy policies.
            </Item>
            <Item label="Supabase">
              Handles user authentication, session state management, usage limit data, history tables, and user feedback records.
            </Item>
            <Item label="Netlify">
              Hosts our static assets and serverless function routes. Temporarily routes IP headers for rate-limiting verification.
            </Item>
            <Item label="Ko-fi">
              Used for voluntary contributions to support the project. Sumalyze does not process or store payment cards; Ko-fi handles contributions directly.
            </Item>
          </Section>

          <Section title="Your Rights & Control">
            <p>You have complete control over your data on Sumalyze:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                'You can view and delete individual logs from your History dashboard at any time',
                'You can delete saved replies and clarity bookmarks whenever you want',
                'You can request complete deletion of your account and all records by contacting hello@sumalyze.space',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#818cf8', flexShrink: 0 }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="AI Disclaimer & Security">
            <p>We use industry-standard HTTPS transfer protocols and secure database access layers to protect your account. However, please note that AI outputs are generated by machine models and may contain inaccuracies. Users should review and verify critical, legal, or financial analyses independently.</p>
          </Section>

          <Section title="Changes to This Policy">
            <p>We may update this policy occasionally as we refine the MVP. We will post updates on this page and date the top of the policy accordingly.</p>
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
