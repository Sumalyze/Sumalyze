// src/pages/TeamWorkspacePage.tsx
import React, { useState, useEffect } from 'react';
import { Users, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { TEAM_PLAN } from '../lib/plans';
import { useAuth } from '../hooks/useAuth';
import { captureEvent } from '../lib/analytics';
import { useToast } from '../components/Toast';

type Page = 'home' | 'privacy' | 'terms' | 'cookies' | 'refund' | 'billing' | 'data-deletion' | 'support' | 'tools' | 'tooldetail' | 'agent' | 'workflows' | 'usecases' | 'history' | 'pricing' | 'login' | 'signup' | 'forgot-password' | 'settings' | 'team-workspace';

interface TeamWorkspacePageProps {
  onNavigate: (p: Page) => void;
}

export default function TeamWorkspacePage({ onNavigate }: TeamWorkspacePageProps) {
  const { user } = useAuth();
  const toast = useToast();

  // Waitlist Form States
  const [teamEmail, setTeamEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [teamSize, setTeamSize] = useState<string>('');
  const [expectedUsage, setExpectedUsage] = useState<string>('');
  const [useCase, setUseCase] = useState<string>('');
  const [teamMessage, setTeamMessage] = useState<string>('');
  const [teamLoading, setTeamLoading] = useState<boolean>(false);

  // Waitlist Request Status States (localStorage persisted)
  const [waitlistStatus, setWaitlistStatus] = useState<string | null>(null);
  const [storedDetails, setStoredDetails] = useState<{ teamSize: string; useCase: string; expectedUsage: string; submittedAt: string } | null>(null);

  useEffect(() => {
    document.title = 'Team Workspace | Sumalyze';

    // Check localStorage waitlist submission status on mount
    const status = localStorage.getItem('sumalyze_team_waitlist_status');
    if (status === 'submitted') {
      setWaitlistStatus('submitted');
      setStoredDetails({
        teamSize: localStorage.getItem('sumalyze_team_waitlist_team_size') || '',
        useCase: localStorage.getItem('sumalyze_team_waitlist_use_case') || '',
        expectedUsage: localStorage.getItem('sumalyze_team_waitlist_expected_usage') || '',
        submittedAt: localStorage.getItem('sumalyze_team_waitlist_submitted_at') || ''
      });
    }

    return () => {
      document.title = 'Sumalyze';
    };
  }, []);

  useEffect(() => {
    if (user && user.email) {
      if (!teamEmail) {
        setTeamEmail(user.email);
      }
    }
  }, [user]);

  const handleTeamWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamEmail.trim() || !companyName.trim() || !teamSize || !expectedUsage || !useCase.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setTeamLoading(true);

    try {
      const response = await fetch('/api/send-team-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workEmail: teamEmail.trim(),
          companyName: companyName.trim(),
          teamSize,
          useCase: useCase.trim(),
          expectedUsage,
          message: teamMessage.trim(),
          pageUrl: window.location.href,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit waitlist request.');
      }

      setTeamLoading(false);

      // Track waitlist submission securely without long raw texts or email details
      captureEvent('team_waitlist_submitted', {
        team_size: teamSize,
        use_case: useCase.substring(0, 100),
        expected_usage: expectedUsage
      });

      // Persist in localStorage (excluding long messages or email content)
      localStorage.setItem('sumalyze_team_waitlist_status', 'submitted');
      localStorage.setItem('sumalyze_team_waitlist_team_size', teamSize);
      localStorage.setItem('sumalyze_team_waitlist_use_case', useCase.trim());
      localStorage.setItem('sumalyze_team_waitlist_expected_usage', expectedUsage);
      const subTime = new Date().toLocaleString();
      localStorage.setItem('sumalyze_team_waitlist_submitted_at', subTime);

      setStoredDetails({
        teamSize,
        useCase: useCase.trim(),
        expectedUsage,
        submittedAt: subTime
      });
      setWaitlistStatus('submitted');

      toast.success('Joined waitlist! We will contact you soon.');

      // Clear sensitive form states
      setCompanyName('');
      setTeamSize('');
      setExpectedUsage('');
      setUseCase('');
      setTeamMessage('');
    } catch (err: any) {
      setTeamLoading(false);
      toast.error(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleUpdateRequest = () => {
    // Re-open form by removing localStorage keys
    localStorage.removeItem('sumalyze_team_waitlist_status');
    localStorage.removeItem('sumalyze_team_waitlist_team_size');
    localStorage.removeItem('sumalyze_team_waitlist_use_case');
    localStorage.removeItem('sumalyze_team_waitlist_expected_usage');
    localStorage.removeItem('sumalyze_team_waitlist_submitted_at');

    setWaitlistStatus(null);
    setStoredDetails(null);
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

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.8)',
    appearance: 'none',
    backgroundPosition: 'right 14px center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundSize: '16px',
    paddingRight: '40px',
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
    <div style={{ padding: '120px 20px 80px', maxWidth: 1000, margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* Back to Pricing Link */}
      <button
        onClick={() => onNavigate('pricing')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.45)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          padding: 0,
          marginBottom: 32,
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#ff8fa3'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)'}
      >
        <ArrowLeft size={16} />
        Back to pricing
      </button>

      {/* Hero Header */}
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
            ENTERPRISE CLARITY
          </span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: 16,
          }}
        >
          Sumalyze for Teams
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)', maxWidth: 600, margin: '0 auto', lineHeight: '24px' }}>
          Collaborate on analyses, pool workspace resource quotas, manage user permissions, and aggregate payment workflows in a centralized account.
        </p>
      </div>

      <div
        className="animate-reveal delay-100"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 10, 30, 0.65) 0%, rgba(10, 5, 20, 0.85) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 24,
          padding: '40px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }} className="team-waitlist-layout">
          <style>{`
            @media(max-width: 800px) {
              .team-waitlist-layout {
                grid-template-columns: 1fr !important;
                gap: 32px !important;
              }
            }
          `}</style>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Users size={22} style={{ color: '#E23E57' }} />
              <h2 style={{ fontSize: 22, fontWeight: 600, color: 'white', margin: 0 }}>{TEAM_PLAN.name} Features</h2>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: '22px', marginBottom: 24 }}>
              Unlock structured coordination for research groups, legal offices, and cross-functional teams.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: '20px' }}>
                <Check size={16} style={{ color: '#ff8fa3', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Shared Clarity Workspace</strong>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Organize tool inputs and summaries in group directories.</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: '20px' }}>
                <Check size={16} style={{ color: '#ff8fa3', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Team History</strong>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Search across your entire team's analysis logs.</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: '20px' }}>
                <Check size={16} style={{ color: '#ff8fa3', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Shared Exports</strong>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Configure export templates and formats shared with everyone.</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: '20px' }}>
                <Check size={16} style={{ color: '#ff8fa3', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Member Roles & Permissions</strong>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Assign Admins, Editors, and Viewers in your organization.</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: '20px' }}>
                <Check size={16} style={{ color: '#ff8fa3', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Custom Usage Limits</strong>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Aggregate token allocations and set individual user boundaries.</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: '20px' }}>
                <Check size={16} style={{ color: '#ff8fa3', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Manual Onboarding Support</strong>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Get set up by our product team directly with custom quotas.</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Waitlist Form or Premium Status Card */}
          <div>
            {waitlistStatus === 'submitted' && storedDetails ? (
              <div 
                className="page-enter"
                style={{
                  background: 'rgba(14,4,22,0.98)',
                  border: '1px solid rgba(226,62,87,0.35)',
                  borderRadius: 16,
                  padding: '28px 24px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={labelStyle}>Team Workspace Request</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#34d399',
                      boxShadow: '0 0 8px #34d399',
                      animation: 'premiumPulse 2s infinite'
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      On waitlist
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: 'white', fontWeight: 500, lineHeight: '22px', margin: 0 }}>
                  We received your Team Workspace request. We’ll review the details and contact you when workspace access is ready.
                </p>

                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: '18px', margin: 0 }}>
                  For now, Team Workspace is reviewed manually before automated billing and onboarding are enabled.
                </p>

                {/* Safe Fields Summary */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginTop: 4,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, gap: 10 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Team Size:</span>
                    <span style={{ color: 'white', fontWeight: 500 }}>{storedDetails.teamSize} members</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, gap: 10 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Expected Usage:</span>
                    <span style={{ color: 'white', fontWeight: 500 }}>{storedDetails.expectedUsage} analyses/mo</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, gap: 10 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Use Case:</span>
                    <span style={{ color: 'white', fontWeight: 500, textAlign: 'right', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {storedDetails.useCase}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 8, marginTop: 4 }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>Requested At:</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{storedDetails.submittedAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    onClick={handleUpdateRequest}
                    style={{
                      flex: 1,
                      padding: '9px 16px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  >
                    Update request
                  </button>
                  <a
                    href="mailto:info@sumalyze.space?subject=Team%20Workspace%20Waitlist%20Inquiry"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '9px 16px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      border: '1px solid rgba(226,62,87,0.3)',
                      background: 'rgba(226,62,87,0.06)',
                      color: '#ff8fa3',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,62,87,0.12)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(226,62,87,0.06)'; e.currentTarget.style.color = '#ff8fa3'; }}
                  >
                    Contact support
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(10,0,15,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '28px 24px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 16 }}>Join Team Waitlist</h3>
                <form onSubmit={handleTeamWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Work Email *</label>
                    <input
                      type="email"
                      required
                      value={teamEmail}
                      onChange={(e) => setTeamEmail(e.target.value)}
                      placeholder="you@company.com"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Company / Team Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Corp"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Team Size *</label>
                      <select
                        required
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        style={selectStyle}
                      >
                        <option value="">Select size...</option>
                        <option value="2-5">2-5 members</option>
                        <option value="6-15">6-15 members</option>
                        <option value="16-50">16-50 members</option>
                        <option value="50+">50+ members</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Expected Usage *</label>
                      <select
                        required
                        value={expectedUsage}
                        onChange={(e) => setExpectedUsage(e.target.value)}
                        style={selectStyle}
                      >
                        <option value="">Select analyses...</option>
                        <option value="<500">&lt; 500 / month</option>
                        <option value="500-2000">500–2,000 / month</option>
                        <option value="2000-10000">2,000–10,000 / month</option>
                        <option value="10000+">10,000+ / month</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Primary Use Case *</label>
                    <input
                      type="text"
                      required
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      placeholder="e.g. legal summaries, research papers review"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Additional Message (Optional)</label>
                    <textarea
                      value={teamMessage}
                      onChange={(e) => setTeamMessage(e.target.value)}
                      placeholder="Tell us more about your needs..."
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={teamLoading}
                    style={{
                      padding: '12px',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: teamLoading ? 'not-allowed' : 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(226,62,87,0.3)',
                      fontFamily: 'inherit',
                      transition: 'opacity 0.2s',
                      marginTop: 8,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    {teamLoading ? 'Joining Waitlist...' : TEAM_PLAN.cta}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
