// src/pages/PayPage.tsx
import { useState, useEffect } from 'react';
import { Check, ShieldCheck, Lock } from 'lucide-react';
import { PLANS, Plan } from '../lib/plans';

type BillingPeriod = 'monthly' | 'annually';

interface PayPageProps {
  onNavigate: (path: string) => void;
}

// Plan benefits shown on payment page
const PLAN_BENEFITS: Record<string, string[]> = {
  starter: [
    '100 analyses / month',
    '10 analyses / day',
    '3 Agent Mode runs / month',
    'File upload up to 10 MB',
    '50 history logs',
    'PDF export',
    '3-day free trial',
  ],
  pro: [
    '500 analyses / month',
    '30 analyses / day',
    '50 Agent Mode runs / month',
    'File upload up to 25 MB',
    '200 history logs',
    'PDF + DOCX export',
    'Priority processing queue',
  ],
  max: [
    '1,500 analyses / month',
    '80 analyses / day',
    '150 Agent Mode runs / month',
    'File upload up to 50 MB',
    '500 history logs',
    'All export formats',
    'Priority email support',
    '3-day free trial',
  ],
};

const ANNUAL_DISPLAY: Record<string, { monthly: string; annual: string; savings: string }> = {
  starter: { monthly: '$3.25', annual: '$38.99/yr', savings: 'Save ~18%' },
  pro:     { monthly: '$6.58', annual: '$78.99/yr', savings: 'Save ~18%' },
  max:     { monthly: '$13.25', annual: '$158.99/yr', savings: 'Save ~18%' },
};

function navTo(path: string) {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function PayPage({ onNavigate }: PayPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annually');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Read ?plan= from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('plan') || 'pro';
    const period = params.get('billing') as BillingPeriod | null;
    if (period === 'monthly' || period === 'annually') setBillingPeriod(period);
    const found = PLANS.find(p => p.id === planId && p.id !== 'free');
    setSelectedPlan(found || PLANS.find(p => p.id === 'pro') || null);
  }, []);

  useEffect(() => {
    document.title = 'Checkout | Sumalyze';
    return () => { document.title = 'Sumalyze'; };
  }, []);

  const getPriceDisplay = (plan: Plan) => {
    if (billingPeriod === 'annually') {
      return ANNUAL_DISPLAY[plan.id]?.monthly ?? `$${plan.priceMonthly}`;
    }
    return `$${plan.priceMonthly}`;
  };

  const getAnnualNote = (plan: Plan) => {
    if (billingPeriod === 'annually') {
      return `Billed as ${ANNUAL_DISPLAY[plan.id]?.annual} · ${ANNUAL_DISPLAY[plan.id]?.savings}`;
    }
    return `Billed monthly · Cancel anytime`;
  };

  const handleCheckout = () => {
    if (!selectedPlan) return;
    const params = new URLSearchParams({
      plan: selectedPlan.id,
      billing: billingPeriod,
    });
    navTo(`/checkout?${params.toString()}`);
    onNavigate(`/checkout?${params.toString()}`);
  };

  const isPro = selectedPlan?.id === 'pro';
  const benefits = selectedPlan ? (PLAN_BENEFITS[selectedPlan.id] ?? []) : [];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a000f',
      color: 'white',
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top minimal bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
        padding: '28px 0 0',
      }}>
        <button
          onClick={() => navTo('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0,
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
            boxShadow: '0 4px 12px rgba(226,62,87,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 5h12M3 9h8M3 13h10" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="14" cy="13" r="2.5" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>Sumalyze</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          <Lock size={12} />
          Secure checkout via Paddle
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 0 80px',
      }}>
        {!selectedPlan ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Loading plan...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
            maxWidth: 860,
            width: '100%',
          }}>

            {/* Left: Plan summary */}
            <div style={{
              background: 'rgba(255,255,255,0.015)',
              border: isPro ? '1px solid rgba(226,62,87,0.4)' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              padding: '36px 32px',
              boxShadow: isPro ? '0 12px 40px rgba(226,62,87,0.08)' : 'none',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative top line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: isPro
                  ? 'linear-gradient(90deg, transparent, rgba(226,62,87,0.5), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              }} />

              {isPro && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'linear-gradient(90deg, #E23E57, #88304E)',
                  borderRadius: 20,
                  padding: '3px 12px',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 16,
                }}>
                  Most Popular
                </div>
              )}

              <h2 style={{
                fontSize: 22, fontWeight: 700, color: 'white',
                marginBottom: 4, letterSpacing: '-0.02em',
              }}>
                {selectedPlan.name} Plan
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 28, lineHeight: '20px' }}>
                {selectedPlan.description}
              </p>

              {/* Billing toggle */}
              <div style={{
                display: 'inline-flex',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 32,
                padding: 3,
                marginBottom: 24,
                gap: 2,
              }}>
                {(['monthly', 'annually'] as BillingPeriod[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setBillingPeriod(p)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 32,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: 'none',
                      background: billingPeriod === p ? '#E23E57' : 'transparent',
                      color: billingPeriod === p ? 'white' : 'rgba(255,255,255,0.45)',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                  >
                    {p === 'monthly' ? 'Monthly' : 'Annually'}
                    {p === 'annually' && <span style={{ fontSize: 9, color: billingPeriod === 'annually' ? '#6ee7b7' : '#34d399', marginLeft: 4, fontWeight: 700 }}>−18%</span>}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: 'white', letterSpacing: '-0.03em' }}>
                  {getPriceDisplay(selectedPlan)}
                </span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>/mo</span>
              </div>
              <p style={{ fontSize: 12, color: '#34d399', fontWeight: 500, marginBottom: 28 }}>
                {getAnnualNote(selectedPlan)}
              </p>

              {/* Benefits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  What you get
                </div>
                {benefits.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                    <Check size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                    {b}
                  </div>
                ))}
              </div>

              {/* Plan selector links */}
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Compare plans</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PLANS.filter(p => p.id !== 'free').map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlan(p)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: selectedPlan.id === p.id ? 600 : 400,
                        cursor: 'pointer',
                        border: selectedPlan.id === p.id ? '1px solid rgba(226,62,87,0.5)' : '1px solid rgba(255,255,255,0.07)',
                        background: selectedPlan.id === p.id ? 'rgba(226,62,87,0.1)' : 'transparent',
                        color: selectedPlan.id === p.id ? '#ff8fa3' : 'rgba(255,255,255,0.45)',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s',
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: CTA + trust */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* CTA card */}
              <div style={{
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20,
                padding: '32px 28px',
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 6 }}>
                  Ready to get started?
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: '20px', marginBottom: 24 }}>
                  You'll complete checkout securely via Paddle. Your subscription starts immediately after payment.
                </p>

                {/* Order summary */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  marginBottom: 20,
                }}>
                  {[
                    { label: 'Plan', value: `${selectedPlan.name}` },
                    { label: 'Billing', value: billingPeriod === 'annually' ? 'Annual' : 'Monthly' },
                    {
                      label: 'Price',
                      value: billingPeriod === 'annually'
                        ? `${getPriceDisplay(selectedPlan)}/mo (${ANNUAL_DISPLAY[selectedPlan.id]?.annual})`
                        : `${getPriceDisplay(selectedPlan)}/mo`,
                    },
                  ].map(row => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 13, marginBottom: 8,
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                      <span style={{ color: 'white', fontWeight: 500, textAlign: 'right', maxWidth: 180 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  id="pay-cta-button"
                  onClick={handleCheckout}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(226,62,87,0.35)',
                    fontFamily: 'inherit',
                    transition: 'opacity 0.2s, transform 0.15s',
                    marginBottom: 12,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Continue to Checkout →
                </button>

                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: '16px' }}>
                  14-day refund window · Cancel anytime · No hidden fees
                </p>
              </div>

              {/* Trust badges */}
              <div style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 16,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {[
                  { icon: <ShieldCheck size={14} />, text: 'Payments processed by Paddle as Merchant of Record' },
                  { icon: <Lock size={14} />, text: 'PCI-compliant. Your card data is never stored by us.' },
                  { icon: <Check size={14} />, text: 'Subscription managed entirely through Paddle' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '18px' }}>
                    <span style={{ color: '#34d399', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Legal links */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px 16px',
                justifyContent: 'center',
              }}>
                {[
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Refund Policy', href: '/refund' },
                  { label: 'Support', href: '/support' },
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={e => {
                      e.preventDefault();
                      navTo(link.href);
                    }}
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.3)',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer strip */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '16px 20px',
        textAlign: 'center',
        fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
      }}>
        © {new Date().getFullYear()} Sumalyze · Payments handled by{' '}
        <a href="https://www.paddle.com" target="_blank" rel="noopener noreferrer"
          style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'underline' }}>
          Paddle
        </a>
        {' '}· <a href="mailto:billing@sumalyze.space" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'underline' }}>billing@sumalyze.space</a>
      </div>
    </div>
  );
}
