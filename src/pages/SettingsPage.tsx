import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { captureEvent } from '../lib/analytics';

type Page = 'home' | 'privacy' | 'terms' | 'cookies' | 'refund' | 'billing' | 'data-deletion' | 'support' | 'tools' | 'tooldetail' | 'agent' | 'workflows' | 'usecases' | 'history' | 'pricing' | 'login' | 'signup' | 'forgot-password' | 'settings';

interface SettingsPageProps {
  onNavigate: (p: Page) => void;
}

type SettingsTab = 'profile' | 'security' | 'subscription' | 'danger';

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { user, resetPassword, signOut } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  // Database plan states
  const [dbPlan, setDbPlan] = useState<string>('free');
  const [isQueryReliable, setIsQueryReliable] = useState<boolean>(true);
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<{
    plan: string;
    status: string;
    billingInterval: string | null;
    currentPeriodEnd: string | null;
    trialEndsAt: string | null;
  } | null>(null);

  // Password reset states
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  // Account deletion states
  const [deleteInput, setDeleteInput] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Danger zone modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  // Advanced settings toggle state
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Settings | Sumalyze';
    return () => {
      document.title = 'Sumalyze';
    };
  }, []);

  // Fetch plan status from subscriptions table (with public.user_profiles fallback)
  useEffect(() => {
    async function fetchPlan() {
      if (!user) return;
      setDbLoading(true);
      try {
        // Try querying public.subscriptions table
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('plan, status, billing_interval, current_period_end, trial_ends_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subError) {
          // If table does not exist yet or triggers error, fail gracefully and fall back to user_profiles
          console.warn('[Settings] Subscriptions table query failed (possibly not migrated yet):', subError.message);
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('plan')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) {
            console.error('[Settings] Error querying user_profiles plan:', profileError);
            setIsQueryReliable(false);
            setDbPlan('free');
          } else {
            setDbPlan(profileData?.plan || 'free');
            setIsQueryReliable(true);
          }
          setSubscription(null);
        } else if (subData) {
          setDbPlan(subData.plan || 'free');
          setSubscription({
            plan: subData.plan || 'free',
            status: subData.status || 'free',
            billingInterval: subData.billing_interval || null,
            currentPeriodEnd: subData.current_period_end || null,
            trialEndsAt: subData.trial_ends_at || null,
          });
          setIsQueryReliable(true);
        } else {
          // No subscription row exists, check user_profiles
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('plan')
            .eq('id', user.id)
            .maybeSingle();

          setDbPlan(profileData?.plan || 'free');
          setSubscription(null);
          setIsQueryReliable(true);
        }
      } catch (err) {
        console.error('[Settings] Exception reading plan from database:', err);
        setIsQueryReliable(false);
        setDbPlan('free');
        setSubscription(null);
      } finally {
        setDbLoading(false);
      }
    }
    fetchPlan();
  }, [user]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    // Secure analytics: Only send tab name, no user ID/email
    captureEvent('settings_tab_changed', { tab });
  };

  const handleTriggerPasswordReset = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    setResetSuccess(null);
    setResetError(null);
    
    // Secure analytics: Safe event name, no user details
    captureEvent('settings_password_reset_clicked');

    try {
      const { error } = await resetPassword(user.email);
      if (error) {
        setResetError('Could not send reset email. Please try again.');
        toast.error('Password reset request failed.');
      } else {
        setResetSuccess('Password reset email sent. Check your inbox.');
        toast.success('Reset link sent successfully.');
      }
    } catch (err: any) {
      setResetError('Could not send reset email. Please try again.');
      toast.error('Password reset request failed.');
    } finally {
      setResetLoading(false);
    }
  };

  const openDeleteModal = () => {
    setDeleteInput('');
    setDeleteError(null);
    setDeleteSuccess(null);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Authentication session not found. Please log in again.');
      }

      const response = await fetch('/api/request-account-deletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to request account deletion.');
      }

      captureEvent('account_deletion_requested');
      setDeleteSuccess('Account scheduled for deletion. Logging out...');
      toast.success('Account deletion requested.');

      setTimeout(async () => {
        setDeleteConfirmOpen(false);
        await signOut();
        window.location.href = '/';
      }, 3000);

    } catch (err: any) {
      setDeleteError(err.message || 'Could not request account deletion. Please try again.');
      toast.error('Account deletion request failed.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '120px 20px 80px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: 'white', marginBottom: 16 }}>Account Settings</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
          Please sign in to access and manage your workspace settings.
        </p>
      </div>
    );
  }

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: '120px 20px 80px',
    maxWidth: 1000,
    margin: '0 auto',
    boxSizing: 'border-box',
  };

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    gap: 32,
    marginTop: 32,
    flexWrap: 'wrap',
  };

  const sidebarStyle: React.CSSProperties = {
    flex: '1 1 240px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  };

  const contentAreaStyle: React.CSSProperties = {
    flex: '3 3 500px',
  };

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    background: 'rgba(14,4,22,0.97)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20,
    padding: '32px 28px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
    boxSizing: 'border-box',
    width: '100%',
  };

  const topAccentStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: activeTab === 'danger'
      ? 'linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(226,62,87,0.5), transparent)',
    borderRadius: '20px 20px 0 0',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(10,0,15,0.6)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const fieldGroupStyle: React.CSSProperties = {
    marginBottom: 20,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 8,
  };

  const tabButtonStyle = (tab: SettingsTab): React.CSSProperties => {
    const isActive = activeTab === tab;
    return {
      padding: '12px 16px',
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 500,
      textAlign: 'left',
      background: isActive ? 'rgba(226,62,87,0.1)' : 'transparent',
      border: isActive ? '1px solid rgba(226,62,87,0.3)' : '1px solid transparent',
      color: isActive ? '#ff8fa3' : 'rgba(255,255,255,0.6)',
      cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    };
  };

  return (
    <div style={containerStyle}>
      {/* Title */}
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 600, letterSpacing: '-0.02em', color: 'white', marginBottom: 8 }}>
          Account Settings
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>
          Manage your personal information, security preferences, and subscription plan.
        </p>
      </div>

      <div style={layoutStyle}>
        {/* Sidebar Nav */}
        <div style={sidebarStyle}>
          <button style={tabButtonStyle('profile')} onClick={() => handleTabChange('profile')}>
            <span>👤</span> Profile Details
          </button>
          <button style={tabButtonStyle('security')} onClick={() => handleTabChange('security')}>
            <span>🔒</span> Password & Security
          </button>
          <button style={tabButtonStyle('subscription')} onClick={() => handleTabChange('subscription')}>
            <span>💳</span> Plan & Subscription
          </button>
          <button style={tabButtonStyle('danger')} onClick={() => handleTabChange('danger')}>
            <span>⚠️</span> Danger Zone
          </button>
        </div>

        {/* Content Area */}
        <div style={contentAreaStyle}>
          {activeTab === 'profile' && (
            <div style={cardStyle}>
              <div style={topAccentStyle} />
              <h2 style={{ fontSize: 20, fontWeight: 500, color: 'white', marginBottom: 6 }}>Profile Details</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
                Your account identity, plan status, and details.
              </p>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={user.email || ''} readOnly disabled style={inputStyle} />
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Display Name</label>
                <input 
                  type="text" 
                  value={user.user_metadata?.full_name || 'Sumalyze User'} 
                  readOnly 
                  disabled 
                  style={inputStyle} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Current Plan</label>
                  <input 
                    type="text" 
                    value={dbPlan.charAt(0).toUpperCase() + dbPlan.slice(1)} 
                    readOnly 
                    disabled 
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Plan Status</label>
                  <input 
                    type="text" 
                    value="Active" 
                    readOnly 
                    disabled 
                    style={inputStyle} 
                  />
                </div>
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Account Created Date</label>
                <input 
                  type="text" 
                  value={new Date(user.created_at).toLocaleDateString()} 
                  readOnly 
                  disabled 
                  style={inputStyle} 
                />
              </div>

              {/* Advanced Toggle */}
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: 9 }}>{advancedOpen ? '▼' : '▶'}</span> Advanced Settings
                </button>

                {advancedOpen && (
                  <div style={{ marginTop: 16 }}>
                    <div style={fieldGroupStyle}>
                      <label style={labelStyle}>Account Reference</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input
                          type="text"
                          value={user.id}
                          readOnly
                          disabled
                          style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: 13 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(user.id);
                            toast.success('Account reference copied!');
                          }}
                          style={{
                            padding: '10px 16px',
                            borderRadius: 10,
                            fontSize: 13,
                            fontWeight: 500,
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.04)',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={cardStyle}>
              <div style={topAccentStyle} />
              <h2 style={{ fontSize: 20, fontWeight: 500, color: 'white', marginBottom: 6 }}>Password & Security</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
                Request a password change link via email.
              </p>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '20px',
                marginBottom: 24,
              }}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: '22px', margin: '0 0 12px 0' }}>
                  We’ll send a secure password reset link to your account email.
                </p>
                {user?.email && (
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                    Reset link will be sent to: <strong style={{ color: 'white', fontWeight: 500 }}>{user.email}</strong>
                  </p>
                )}
              </div>

              {resetError && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 9,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  fontSize: 13, color: '#fca5a5',
                  marginBottom: 20,
                }}>
                  ⚠ {resetError}
                </div>
              )}

              {resetSuccess && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 9,
                  background: 'rgba(52,211,153,0.1)',
                  border: '1px solid rgba(52,211,153,0.25)',
                  fontSize: 13, color: '#6ee7b7',
                  marginBottom: 20,
                }}>
                  ✓ {resetSuccess}
                </div>
              )}

              <button
                onClick={handleTriggerPasswordReset}
                disabled={resetLoading || !user?.email}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: (resetLoading || !user?.email) ? 'not-allowed' : 'pointer',
                  border: 'none',
                  background: (resetLoading || !user?.email)
                    ? 'rgba(255,255,255,0.05)'
                    : 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                  color: 'white',
                  boxShadow: (resetLoading || !user?.email) ? 'none' : '0 4px 16px rgba(226,62,87,0.25)',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {resetLoading ? 'Sending Reset Email...' : 'Send Password Reset Email'}
              </button>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div style={cardStyle}>
              <div style={topAccentStyle} />
              <h2 style={{ fontSize: 20, fontWeight: 500, color: 'white', marginBottom: 6 }}>Plan & Subscription</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
                Review plan details and manage payment settings.
              </p>

              {dbLoading ? (
                <div style={{ padding: '20px 0', color: 'rgba(255,255,255,0.4)' }}>
                  Loading plan information...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={labelStyle}>Current Plan</span>
                        <span style={{ fontSize: 20, fontWeight: 600, color: 'white', display: 'block', marginTop: 4 }}>
                          {dbPlan.charAt(0).toUpperCase() + dbPlan.slice(1)}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: subscription?.status === 'past_due'
                          ? 'rgba(239,68,68,0.1)'
                          : subscription?.status === 'canceled'
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(52,211,153,0.1)',
                        color: subscription?.status === 'past_due'
                          ? '#f87171'
                          : subscription?.status === 'canceled'
                          ? 'rgba(255,255,255,0.4)'
                          : '#34d399',
                      }}>
                        {subscription ? subscription.status.replace('_', ' ') : 'Active'}
                      </span>
                    </div>

                    {/* Additional Details */}
                    {subscription && (
                      <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {subscription.billingInterval && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Billing Interval:</span>
                            <span style={{ color: 'white', fontWeight: 500 }}>
                              {subscription.billingInterval.charAt(0).toUpperCase() + subscription.billingInterval.slice(1)}
                            </span>
                          </div>
                        )}
                        {subscription.trialEndsAt && subscription.status === 'trialing' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Trial Period Ends:</span>
                            <span style={{ color: 'white', fontWeight: 500, fontFamily: 'monospace' }}>
                              {new Date(subscription.trialEndsAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {subscription.currentPeriodEnd && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                              {subscription.status === 'canceled' ? 'Subscription Ends:' : 'Next Renewal Date:'}
                            </span>
                            <span style={{ color: 'white', fontWeight: 500, fontFamily: 'monospace' }}>
                              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(226,62,87,0.02)',
                    border: '1px solid rgba(226,62,87,0.15)',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: '20px',
                  }}>
                    ℹ️ <strong>Billing Setup in Progress:</strong>
                    <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.5)' }}>
                      Billing setup is in progress. Paddle checkout and customer portal will be connected here.
                    </p>
                  </div>

                  {/* Available plans preview list */}
                  <div style={{
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    padding: '18px 20px',
                  }}>
                    <h4 style={{ ...labelStyle, marginBottom: 12 }}>Available Premium Tiers</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Starter Plan</span>
                        <span style={{ color: 'white', fontWeight: 500 }}>$3.99 / month</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Pro Plan</span>
                        <span style={{ color: 'white', fontWeight: 500 }}>$7.99 / month</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Max Plan</span>
                        <span style={{ color: 'white', fontWeight: 500 }}>$15.99 / month</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Team Workspace</span>
                        <span style={{ color: '#ff8fa3', fontWeight: 500 }}>Waitlist Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Sync warning note */}
                  {(!isQueryReliable || dbPlan.toLowerCase() === 'free') && (
                    <div style={{
                      padding: 14,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', margin: 0 }}>
                        TODO: sync plan from Paddle/user profile later
                      </p>
                    </div>
                  )}

                  {/* Billing Action Buttons */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => onNavigate('pricing')}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 500,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    >
                      View Pricing →
                    </button>
                    
                    <button
                      disabled
                      style={{
                        padding: '10px 18px',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 500,
                        border: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.02)',
                        color: 'rgba(255,255,255,0.3)',
                        cursor: 'not-allowed',
                        fontFamily: 'inherit',
                      }}
                    >
                      Manage Billing (Coming soon)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'danger' && (
            <div style={{ ...cardStyle, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={topAccentStyle} />
              <h2 style={{ fontSize: 20, fontWeight: 500, color: '#f87171', marginBottom: 6 }}>Danger Zone</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
                Irreversible account changes and deletions.
              </p>

              <div style={{
                background: 'rgba(239,68,68,0.04)',
                border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: 12,
                padding: 18,
                marginBottom: 24,
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#fca5a5', marginBottom: 6 }}>Delete Account & Clean Data</h4>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: '20px', margin: 0 }}>
                  Deleting your account removes all saved insights, custom tool configurations, and history logs permanently. This action cannot be reversed.
                </p>
              </div>

              <button
                onClick={openDeleteModal}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.06)',
                  color: '#f87171',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                }}
              >
                Delete Account...
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {deleteConfirmOpen && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(5,2,8,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, zIndex: 10000,
            animation: 'backdropFadeIn 0.2s ease both',
          }} 
          onClick={() => {
            if (!deleteLoading && !deleteSuccess) {
              setDeleteConfirmOpen(false);
            }
          }}
        >
          <div 
            style={{
              background: '#12071a', border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 24, padding: 32, maxWidth: 440, width: '100%',
              position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
              animation: 'modalFadeInCenter 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
              boxSizing: 'border-box',
            }} 
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            {!deleteLoading && !deleteSuccess && (
              <button 
                onClick={() => setDeleteConfirmOpen(false)} 
                style={{
                  position: 'absolute', top: 20, right: 20,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)', border: 'none',
                  color: 'rgba(255,255,255,0.6)', fontSize: 16, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            )}

            <div 
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent)',
                borderRadius: '24px 24px 0 0',
              }} 
            />

            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>
              Delete Account
            </h3>
            
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: '20px', marginBottom: 20 }}>
              This action will schedule your account and all associated data (insights, history logs, settings) for permanent deletion. Your account will enter a pending state for a <strong>24-hour grace period</strong>. You can cancel this request anytime during the grace period by simply logging back in.
            </p>

            {deleteError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 9,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                fontSize: 12, color: '#fca5a5',
                marginBottom: 20,
              }}>
                ⚠ {deleteError}
              </div>
            )}

            {deleteSuccess && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 9,
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.25)',
                fontSize: 13, color: '#6ee7b7',
                marginBottom: 20,
              }}>
                ✓ {deleteSuccess}
              </div>
            )}

            {!deleteSuccess && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Please type DELETE to confirm:
                </label>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value)}
                  placeholder="Type DELETE here"
                  disabled={deleteLoading}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: 'rgba(10,0,15,0.6)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 10,
                    fontSize: 14,
                    color: 'white',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              {!deleteSuccess && (
                <button 
                  onClick={() => setDeleteConfirmOpen(false)} 
                  disabled={deleteLoading}
                  style={{
                    padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.7)', cursor: deleteLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
              )}
              {!deleteSuccess && (
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteInput !== 'DELETE'}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                    background: (deleteLoading || deleteInput !== 'DELETE')
                      ? 'rgba(255,255,255,0.05)'
                      : 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
                    color: (deleteLoading || deleteInput !== 'DELETE') ? 'rgba(255,255,255,0.3)' : 'white',
                    cursor: (deleteLoading || deleteInput !== 'DELETE') ? 'not-allowed' : 'pointer',
                    border: 'none',
                    boxShadow: (deleteLoading || deleteInput !== 'DELETE') ? 'none' : '0 4px 16px rgba(239, 68, 68, 0.25)',
                    fontFamily: 'inherit',
                  }}
                >
                  {deleteLoading ? 'Processing Deletion...' : 'Confirm Delete'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
