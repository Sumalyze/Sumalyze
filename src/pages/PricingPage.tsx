// src/pages/PricingPage.tsx
import { useState, useEffect } from 'react';
import { Check, X, MessageSquare } from 'lucide-react';
import { PLANS, TEAM_PLAN, Plan } from '../lib/plans';
import { useAuth } from '../hooks/useAuth';
import { captureEvent } from '../lib/analytics';
import { useToast } from '../components/Toast';

type Page = 'home' | 'privacy' | 'terms' | 'cookies' | 'refund' | 'billing' | 'data-deletion' | 'support' | 'tools' | 'tooldetail' | 'agent' | 'workflows' | 'usecases' | 'history' | 'pricing' | 'login' | 'signup' | 'forgot-password' | 'settings' | 'team-workspace';

interface PricingPageProps {
  onNavigate: (p: Page) => void;
}

const PLAN_FEATURES: Record<string, { included: string[]; excluded: string[] }> = {
  free: {
    included: [
      '15 analyses/day limit',
      'Core tools access',
      'Last 5 history items',
      'File upload max 2 MB',
      'Exports: Copy, TXT, Markdown'
    ],
    excluded: [
      'No Agent Mode access',
      'No PDF export',
      'No DOCX export',
      'No priority processing queue',
      'No Team Workspace access'
    ]
  },
  starter: {
    included: [
      '100 analyses/month',
      'Max 10 analyses/day',
      '3 Agent Mode runs/month',
      'File upload max 10 MB',
      '50 analyses history logs',
      'PDF basic export',
      '3-day free trial'
    ],
    excluded: [
      'DOCX export not included',
      'No priority processing queue',
      'No Team Workspace access'
    ]
  },
  pro: {
    included: [
      '500 analyses/month',
      'Max 30 analyses/day',
      '50 Agent Mode runs/month',
      'File upload max 25 MB',
      '200 analyses history logs',
      'PDF + DOCX export',
      'Priority processing queue',
      'Supporter 7 days Pro access'
    ],
    excluded: [
      'No Team Workspace access',
      'Max usage limits not included'
    ]
  },
  max: {
    included: [
      '1500 analyses/month',
      'Max 80 analyses/day',
      '150 Agent Mode runs/month',
      'File upload max 50 MB',
      '500 analyses history logs',
      'All exports included',
      'Priority email support',
      '3-day free trial'
    ],
    excluded: [
      'No Team Workspace seats',
      'Custom team onboarding not included'
    ]
  }
};

export default function PricingPage({ onNavigate }: PricingPageProps) {
  const { user } = useAuth();
  const toast = useToast();
  
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('annually');
  
  // Upgrade Modal State
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<Plan | null>(null);
  const [notifyEmail, setNotifyEmail] = useState<string>('');
  const [notifySuccess, setNotifySuccess] = useState<boolean>(false);
  const [notifyLoading, setNotifyLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Pricing Plans | Sumalyze';
    return () => {
      document.title = 'Sumalyze';
    };
  }, []);

  useEffect(() => {
    if (user && user.email) {
      setNotifyEmail(user.email);
    }
  }, [user]);

  const handlePaidCtaClick = (plan: Plan) => {
    // 1. Track upgrade clicked event securely
    captureEvent('upgrade_clicked', {
      plan: plan.name,
      billing_interval: billingPeriod
    });

    if (!user) {
      // Logged out: redirect to signup
      toast.info(`Please sign up to configure your ${plan.name} access.`);
      onNavigate('signup');
    } else {
      // Logged in: show info modal
      setSelectedPlanForUpgrade(plan);
      setNotifySuccess(false);
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim()) return;

    setNotifyLoading(true);
    // Track interest event in PostHog securely
    captureEvent('upgrade_interest_registered', {
      plan: selectedPlanForUpgrade?.name,
      billing_interval: billingPeriod
    });

    setTimeout(() => {
      setNotifyLoading(false);
      setNotifySuccess(true);
      toast.success("Interest registered! We'll notify you soon.");
    }, 800);
  };

  const getPriceDisplay = (plan: Plan) => {
    if (plan.priceMonthly === 0) return '$0';
    if (billingPeriod === 'annually') {
      if (plan.id === 'starter') return '$3.25';
      if (plan.id === 'pro') return '$6.58';
      if (plan.id === 'max') return '$13.25';
    }
    return `$${plan.priceMonthly}`;
  };

  const getIntervalLabel = (plan: Plan) => {
    if (plan.priceMonthly === 0) return '';
    return '/ month';
  };

  // Styling helpers
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(10,0,15,0.6)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    fontSize: 14,
    color: 'white',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <div style={{ padding: '120px 20px 80px', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }} className="animate-reveal">
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 44px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: 16,
          }}
        >
          Pick your clarity
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.45)', maxWidth: 650, margin: '0 auto 32px', lineHeight: '24px' }}>
          Choose a plan that fits your workload. Paid plans are in private preview before checkout integration is finalized.
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
              border: 'none',
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
              border: 'none',
            }}
          >
            Annually <span style={{ fontSize: 10, color: '#6ee7b7', fontWeight: 600, marginLeft: 2 }}>Save ~18%</span>
          </button>
        </div>
      </div>

      {/* Plan Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 24,
          marginBottom: 48,
        }}
        className="animate-reveal delay-100"
      >
        {PLANS.map((plan) => {
          const isPro = plan.id === 'pro';
          return (
            <div
              key={plan.id}
              className="hover-card"
              style={{
                background: 'rgba(255, 255, 255, 0.015)',
                border: isPro ? '1px solid rgba(226,62,87,0.45)' : '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: 20,
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isPro ? '0 12px 40px rgba(226,62,87,0.08)' : 'none',
              }}
            >
              {isPro && (
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
                  Best Value
                </div>
              )}

              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 8 }}>{plan.name}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', minHeight: 40, lineHeight: '18px', marginBottom: 20 }}>
                {plan.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>{getPriceDisplay(plan)}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{getIntervalLabel(plan)}</span>
              </div>

              {/* Annual billing detail */}
              {billingPeriod === 'annually' && plan.priceAnnually > 0 ? (
                <div style={{ fontSize: 11, color: '#6ee7b7', marginBottom: 20, fontWeight: 500 }}>
                  Billed annually at ${plan.priceAnnually}/year
                </div>
              ) : (
                <div style={{ height: plan.priceMonthly > 0 ? 16 : 0, marginBottom: plan.priceMonthly > 0 ? 20 : 0 }} />
              )}

              {/* CTA Button */}
              {plan.id === 'free' ? (
                <a
                  href="/tools"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('tools');
                  }}
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
                    marginBottom: 24,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  onClick={() => handlePaidCtaClick(plan)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: 'none',
                    background: isPro
                      ? 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)'
                      : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    boxShadow: isPro ? '0 4px 16px rgba(226,62,87,0.3)' : 'none',
                    marginBottom: 24,
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                {/* Included features */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    You Get
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {PLAN_FEATURES[plan.id]?.included.map((feat) => (
                      <li key={feat} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: '18px' }}>
                        <Check size={14} style={{ color: '#34d399', flexShrink: 0, marginTop: 2 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excluded features */}
                {PLAN_FEATURES[plan.id]?.excluded.length > 0 && (
                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      Limits
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {PLAN_FEATURES[plan.id]?.excluded.map((feat) => (
                        <li key={feat} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: '18px' }}>
                          <X size={14} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 2 }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Workspace Card (Centered, Rectangular) */}
      <div
        className="hover-card animate-reveal delay-150"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 10, 30, 0.45) 0%, rgba(10, 5, 20, 0.65) 100%)',
          border: '1px solid rgba(226, 62, 87, 0.3)',
          borderRadius: 24,
          padding: '28px 32px',
          maxWidth: 900,
          margin: '0 auto 48px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 32,
          }}
          className="team-rectangular-layout"
        >
          <style>{`
            @media(max-width: 768px) {
              .team-rectangular-layout {
                flex-direction: column !important;
                align-items: stretch !important;
                text-align: center !important;
                gap: 20px !important;
              }
            }
          `}</style>
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, justifyContent: 'flex-start' }} className="team-title-layout">
              <style>{`
                @media(max-width: 768px) {
                  .team-title-layout {
                    justify-content: center !important;
                  }
                }
              `}</style>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'white', margin: 0 }}>{TEAM_PLAN.name}</h3>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#ff8fa3', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(226,62,87,0.1)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(226,62,87,0.2)' }}>
                {TEAM_PLAN.priceDescription}
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: '22px', margin: '0 0 16px 0' }}>
              For teams that need shared clarity, saved outputs, member roles, and custom usage.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} className="team-chips-layout">
              <style>{`
                @media(max-width: 768px) {
                  .team-chips-layout {
                    justify-content: center !important;
                  }
                }
              `}</style>
              {['Shared history', 'Member roles', 'Custom usage', 'Manual onboarding'].map(chip => (
                <span key={chip} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 20 }}>
                  • {chip}
                </span>
              ))}
            </div>
          </div>

          <div style={{ flexShrink: 0 }}>
            <button
              onClick={() => onNavigate('team-workspace')}
              style={{
                padding: '14px 28px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                color: 'white',
                boxShadow: '0 4px 16px rgba(226,62,87,0.3)',
                fontFamily: 'inherit',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {TEAM_PLAN.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Relocated Mission / Ledgers Section */}
      <MissionSection />

      {/* Paid Plan Informational Modal */}
      {selectedPlanForUpgrade && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedPlanForUpgrade(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              animation: 'backdropFadeIn 0.2s ease both',
            }}
          />
          {/* Modal content */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              width: 'calc(100% - 32px)',
              maxWidth: 440,
              background: 'rgba(14,4,22,0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '32px 28px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
              animation: 'modalFadeInCenter 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlanForUpgrade(null)}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)',
                fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <MessageSquare size={20} style={{ color: '#E23E57' }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', margin: 0 }}>
                {selectedPlanForUpgrade.name} Plan
              </h3>
            </div>

            {notifySuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <span style={{ fontSize: 32 }}>🎉</span>
                <h4 style={{ fontSize: 15, color: '#34d399', fontWeight: 600, marginTop: 8, marginBottom: 4 }}>You're on the preview list!</h4>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  We will contact you once {selectedPlanForUpgrade.name} is ready for activation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500, margin: 0 }}>
                  Billing is almost ready!
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: '18px', margin: 0 }}>
                  We are integrating Paddle checkout for safe and recur-compliant billing. We will notify you as soon as the {selectedPlanForUpgrade.name} plan goes live.
                </p>
                
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Plan:</span>
                    <span style={{ color: 'white', fontWeight: 500 }}>{selectedPlanForUpgrade.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Pricing:</span>
                    <span style={{ color: 'white', fontWeight: 500 }}>
                      {getPriceDisplay(selectedPlanForUpgrade)}{getIntervalLabel(selectedPlanForUpgrade)}
                    </span>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Notification Email</label>
                  <input
                    type="email"
                    required
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPlanForUpgrade(null)}
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
                    disabled={notifyLoading}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: notifyLoading ? 'not-allowed' : 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                      color: 'white',
                      fontFamily: 'inherit',
                    }}
                  >
                    {notifyLoading ? 'Submitting...' : 'Notify Me'}
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

/* ─── Relocated Mission / cost ledger ─────────────────────────────── */

function MissionSection() {
  return (
    <section id="mission" style={{ padding: '60px 0 20px', marginTop: 40 }}>
      <div 
        style={{ 
          maxWidth: 900, 
          margin: '0 auto', 
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 24,
          padding: '40px 32px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: '1.2', letterSpacing: '-0.02em', color: 'white', margin: '0 0 12px' }}>
            Built lean. Priced fairly.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: '22px', maxWidth: 600, margin: '0 auto 20px' }}>
            Start free, upgrade only when Sumalyze actually saves you time. Supporters help keep the product moving while billing rolls out.
          </p>

          <div style={{ display: 'inline-flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '8px 16px', borderRadius: 32, border: '1px solid rgba(255,255,255,0.04)' }}>
            {[
              'Free access stays useful',
              'Paid plans unlock heavier usage',
              'Ko-fi supporters can receive 7 days of Pro access'
            ].map(val => (
              <span key={val} style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#ff8fa3', fontWeight: 600 }}>✓</span> {val}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, justifyContent: 'center', maxWidth: 460, margin: '0 auto' }}>
          {/* Ledger Transparency Card */}
          <div className="hover-card" style={{
            background: 'linear-gradient(145deg, rgba(226,62,87,0.1) 0%, rgba(10,0,15,0.4) 100%)',
            border: '1px solid rgba(226,62,87,0.22)',
            borderRadius: 20, padding: 24,
            boxShadow: '0 12px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#ff8fa3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Project Ledgers</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Hosting Cost Coverage</span>
            </div>
            
            {/* Cost Ledger Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12, marginBottom: 12 }}>
              {[
                { item: 'AI API Processing', cost: '$0.001 / query' },
                { item: 'Server Hosting & Database', cost: '$45 / month' },
                { item: 'SSL & Domain Maintenance', cost: '$12 / year' }
              ].map(row => (
                <div key={row.item} style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{row.item}</span>
                  <span style={{ color: 'white', fontFamily: 'monospace' }}>{row.cost}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Average Coffee Support</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: 'white', margin: 0 }}>$3.00 / donor</p>
              </div>
              <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer"
                className="hover-glow"
                onClick={() => captureEvent('upgrade_clicked', { plan: 'Supporter', type: 'ko_fi_ledger' })}
                style={{
                  padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500, color: 'white', textDecoration: 'none',
                  background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                  boxShadow: '0 4px 12px rgba(226,62,87,0.3)', display: 'inline-flex', alignItems: 'center', gap: 6
                }}>
                ☕ Support on Ko-fi
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
