// src/pages/PricingPage.tsx
import { useState } from 'react';
import { Check, Sparkles, Heart, Users, MessageSquare } from 'lucide-react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('annually');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistPlan, setWaitlistPlan] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setWaitlistSubmitted(true);
      setTimeout(() => {
        setWaitlistSubmitted(false);
        setWaitlistEmail('');
        setWaitlistPlan('');
      }, 5000);
    }
  };

  const getPrice = (monthly: number, annualMonthly: number) => {
    return billingPeriod === 'annually' ? annualMonthly : monthly;
  };

  const corePlans = [
    {
      name: 'Free',
      price: 0,
      description: 'For quick summaries and basic understanding.',
      cta: 'Start Free',
      ctaType: 'free',
      features: [
        'Text summarization',
        'Basic file upload (.txt)',
        'Tone analysis',
        'Simple key points',
        'Limited monthly usage (10 uses/day)',
        'Basic summary history',
        'Access to core workspace',
      ],
    },
    {
      name: 'Starter',
      price: getPrice(4.99, 3.99),
      annualTotal: 47.88,
      description: 'For students, light readers, and casual users.',
      cta: 'Join Waitlist',
      ctaPlanName: 'Starter',
      features: [
        'More monthly summaries (50/day)',
        'Longer text input (up to 15k chars)',
        'More file uploads (.txt, .pdf, .docx)',
        'Better summary structure',
        'Saved history',
        'Copy-ready outputs',
        'Faster processing than Free',
      ],
    },
    {
      name: 'Pro',
      price: getPrice(9.99, 7.99),
      annualTotal: 95.88,
      isPopular: true,
      description: 'For people who use Sumalyze seriously.',
      cta: 'Join Waitlist',
      ctaPlanName: 'Pro',
      features: [
        'High monthly usage limits (200/day)',
        'Larger file uploads (up to 10MB)',
        'PDF & document summaries',
        'Advanced tone analysis',
        'Key takeaways & action points',
        'Smart rewrite options',
        'Export to Markdown / PDF',
        'Priority processing',
        'Better summary depth',
      ],
    },
    {
      name: 'Max',
      price: getPrice(19.99, 15.99),
      annualTotal: 191.88,
      description: 'For heavy users who want a daily clarity workspace.',
      cta: 'Join Waitlist',
      ctaPlanName: 'Max',
      features: [
        'Very high monthly usage limits',
        'Batch document processing',
        'Larger uploads (up to 25MB)',
        'Longer summaries & detail control',
        'Advanced analysis modes',
        'Saved workspaces / folders',
        'Priority queue access',
        'Early access to new features',
        'Premium 24/7 support',
      ],
    },
  ];

  return (
    <div style={{ padding: '120px 20px 80px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }} className="animate-reveal">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
            padding: '5px 14px 5px 10px',
            borderRadius: 32,
            border: '1px solid rgba(226,62,87,0.2)',
            background: 'rgba(226,62,87,0.04)',
          }}
        >
          <Sparkles size={14} style={{ color: '#E23E57' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#ff8fa3', letterSpacing: '0.05em' }}>
            PRICING PLANS
          </span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: 16,
          }}
        >
          Flexible plans for any workload
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)', maxWidth: 600, margin: '0 auto 32px', lineHeight: '24px' }}>
          Select the option that fits your workflow. Billed transparently with zero hidden fees.
        </p>

        {/* Billed Toggle */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 32,
            padding: 4,
          }}
        >
          <button
            onClick={() => setBillingPeriod('monthly')}
            style={{
              padding: '8px 18px',
              borderRadius: 32,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: billingPeriod === 'monthly' ? '#E23E57' : 'transparent',
              color: billingPeriod === 'monthly' ? 'white' : 'rgba(255,255,255,0.5)',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annually')}
            style={{
              padding: '8px 18px',
              borderRadius: 32,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: billingPeriod === 'annually' ? '#E23E57' : 'transparent',
              color: billingPeriod === 'annually' ? 'white' : 'rgba(255,255,255,0.5)',
            }}
          >
            Annually <span style={{ fontSize: 10, color: '#6ee7b7', fontWeight: 600, marginLeft: 2 }}>Save ~20%</span>
          </button>
        </div>
      </div>

      {/* Honest Note */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 12,
          padding: '12px 20px',
          maxWidth: 720,
          margin: '0 auto 48px',
          textAlign: 'center',
          fontSize: 13,
          color: 'rgba(255, 255, 255, 0.45)',
          lineHeight: '18px',
        }}
        className="animate-reveal delay-75"
      >
        ℹ️ <strong>Developer Notice:</strong> Payment gateway integrations are currently inactive. Free tiers are fully operational. Billed plans are in private preview — sign up to join the waitlist.
      </div>

      {/* 4 Core Plans Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          marginBottom: 32,
        }}
        className="animate-reveal delay-100"
      >
        {corePlans.map((plan) => (
          <div
            key={plan.name}
            className="hover-card"
            style={{
              background: 'rgba(255, 255, 255, 0.015)',
              border: plan.isPopular ? '1px solid rgba(226,62,87,0.4)' : '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: 20,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.isPopular ? '0 12px 40px rgba(226,62,87,0.06)' : 'none',
            }}
          >
            {plan.isPopular && (
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(90deg, #E23E57, #88304E)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  padding: '4px 14px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 12px rgba(226,62,87,0.3)',
                }}
              >
                Most Popular
              </div>
            )}

            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 8 }}>{plan.name}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', minHeight: 40, lineHeight: '18px', marginBottom: 20 }}>
              {plan.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: 'white' }}>${plan.price}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>/month</span>
            </div>

            {billingPeriod === 'annually' && plan.annualTotal && (
              <div style={{ fontSize: 11, color: '#6ee7b7', marginTop: -20, marginBottom: 20, fontWeight: 500 }}>
                Billed annually (${plan.annualTotal}/year)
              </div>
            )}

            {plan.ctaType === 'free' ? (
              <a
                href="/tools"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  marginBottom: 28,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                {plan.cta}
              </a>
            ) : (
              <button
                onClick={() => setWaitlistPlan(plan.name)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: 'none',
                  background: plan.isPopular
                    ? 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)'
                    : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  boxShadow: plan.isPopular ? '0 4px 16px rgba(226,62,87,0.3)' : 'none',
                  marginBottom: 28,
                  fontFamily: 'inherit',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {plan.cta}
              </button>
            )}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {plan.features.map((feat) => (
                <li key={feat} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: '18px' }}>
                  <Check size={14} style={{ color: plan.isPopular ? '#ff8fa3' : '#34d399', flexShrink: 0, marginTop: 2 }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 2. Team Plan - Wide Banner */}
      <div
        className="hover-card animate-reveal delay-150"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 10, 30, 0.4) 0%, rgba(10, 5, 20, 0.6) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: 20,
          padding: '36px 40px',
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Users size={18} style={{ color: '#E23E57' }} />
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'white', margin: 0 }}>Team Workspace</h3>
            <span style={{ fontSize: 11, background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>MIN 3 USERS</span>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)', lineHeight: '22px', margin: 0 }}>
            Shared workspaces, centralized billing, custom quotas, and collaborated analysis summaries. Ideal for startups, research groups, and operational teams.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>${getPrice(12, 9)}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>/user/month</span>
          </div>
          {billingPeriod === 'annually' && (
            <span style={{ fontSize: 11, color: '#6ee7b7', marginBottom: 16, fontWeight: 500 }}>Billed annually ($108/user/year)</span>
          )}
          <button
            onClick={() => setWaitlistPlan('Team')}
            style={{
              padding: '10px 24px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid rgba(226,62,87,0.35)',
              background: 'rgba(226,62,87,0.06)',
              color: '#ff8fa3',
              width: '100%',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(226,62,87,0.12)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(226,62,87,0.06)'; e.currentTarget.style.color = '#ff8fa3'; }}
          >
            Join Team Waitlist
          </button>
        </div>
      </div>

      {/* 3. Supporter - Pay What You Want */}
      <div
        className="hover-card animate-reveal delay-200"
        style={{
          background: 'rgba(10, 0, 15, 0.6)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 20,
          padding: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', maxWidth: 640 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(226,62,87,0.08)', border: '1px solid rgba(226,62,87,0.2)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#E23E57' }}>
            <Heart size={20} fill="#E23E57" />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 6 }}>Supporter (Pay what you want)</h3>
            <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.45)', lineHeight: '18px', margin: 0 }}>
              Help keep Sumalyze accessible and free for everyone. Supporters receive a special profile badge, optional name listing on the supporter wall, and early feature access.
            </p>
          </div>
        </div>
        <div>
          <a
            href="https://ko-fi.com/sumalyze"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 28px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              background: '#FF5E5B',
              color: 'white',
              boxShadow: '0 4px 16px rgba(255,94,91,0.25)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Support on Ko-fi
          </a>
        </div>
      </div>

      {/* Waitlist Modal (Centered immediately overlay) */}
      {waitlistPlan && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setWaitlistPlan('')}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              animation: 'backdropFadeIn 0.2s ease both',
            }}
          />
          {/* Box */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              width: 'calc(100% - 32px)',
              maxWidth: 420,
              background: 'rgba(14,4,22,0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '32px 28px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
              animation: 'modalFadeInCenter 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <MessageSquare size={20} style={{ color: '#E23E57' }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', margin: 0 }}>Join {waitlistPlan} Waitlist</h3>
            </div>
            
            {waitlistSubmitted ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <span style={{ fontSize: 32 }}>🎉</span>
                <p style={{ fontSize: 14, color: '#34d399', fontWeight: 500, margin: '8px 0 4px' }}>You're on the list!</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>We'll notify you as soon as {waitlistPlan} is ready.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: '18px', margin: 0 }}>
                  Enter your email address below to secure your early access pricing. We will contact you once the tier launches.
                </p>
                <div>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'rgba(10,0,15,0.6)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.9)',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setWaitlistPlan('')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.6)',
                      fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 20px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                      color: 'white',
                      fontFamily: 'inherit',
                    }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
