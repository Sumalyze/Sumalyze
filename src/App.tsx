import { useState, useEffect, useRef } from 'react';
import { analyzeText } from './utils/mockAnalyzer';
import type { AnalysisResult } from './utils/mockAnalyzer';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AuthModal from './components/AuthModal';
import FeedbackModal from './components/FeedbackModal';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import RefundPolicy from './pages/RefundPolicy';
import BillingTerms from './pages/BillingTerms';
import DataDeletion from './pages/DataDeletion';
import SupportPage from './pages/SupportPage';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';
import AgentPage from './pages/AgentPage';
import CookieConsent from './components/CookieConsent';
import WorkflowsPage from './pages/WorkflowsPage';
import UseCasesPage from './pages/UseCasesPage';
import HistoryPage from './pages/HistoryPage';
import PricingPage from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';
import TeamWorkspacePage from './pages/TeamWorkspacePage';
import MaintenancePage from './pages/MaintenancePage';
import sumalyzeLogo from './assets/sumalyzelogo.png';
import { ToastProvider } from './components/Toast';
import { parseFile } from './utils/fileParser';
import { TOOLS } from './data/tools';
import { useCurrentPlan } from './hooks/useCurrentPlan';
import { getFileUploadLimitMB } from './lib/plans';
import HeroMockup from './components/HeroMockup';
import HomeModesScrollSection from './components/HomeModesScrollSection';
import UseCaseStorySection from './components/UseCaseStorySection';
import DemoRevealSection from './components/DemoRevealSection';
import WhySumalyzeSection from './components/WhySumalyzeSection';
import TrustSection from './components/TrustSection';
import { initAnalytics, captureEvent, capturePageView } from './lib/analytics';



/* ============================================================
   Sumalyze — AI Clarity Workspace
   ============================================================ */

type Page = 'home' | 'privacy' | 'terms' | 'cookies' | 'refund' | 'billing' | 'data-deletion' | 'support' | 'tools' | 'tooldetail' | 'agent' | 'workflows' | 'usecases' | 'history' | 'pricing' | 'login' | 'signup' | 'forgot-password' | 'settings' | 'team-workspace';

const hashToPathMap: Record<string, string> = {
  tools: '/tools',
  agent: '/agent',
  workflows: '/workflows',
  usecases: '/use-cases',
  history: '/history',
  settings: '/settings',
  privacy: '/privacy',
  terms: '/terms',
  pricing: '/pricing',
  'team-workspace': '/team-workspace',
  cookies: '/cookies',
  refund: '/refund',
  billing: '/billing',
  'data-deletion': '/data-deletion',
  support: '/support'
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [toolSlug, setToolSlug] = useState<string>('');
  const [authOpen, setAuthOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    initAnalytics();
    const handleConsentChange = () => {
      initAnalytics();
    };
    window.addEventListener('sumalyze-cookie-consent-changed', handleConsentChange);
    return () => {
      window.removeEventListener('sumalyze-cookie-consent-changed', handleConsentChange);
    };
  }, []);

  useEffect(() => {
    const handleGlobalNav = (e: Event) => {
      const customEvent = e as CustomEvent<Page>;
      if (customEvent.detail) {
        navigate(customEvent.detail);
      }
    };
    window.addEventListener('sz-navigate', handleGlobalNav);
    return () => window.removeEventListener('sz-navigate', handleGlobalNav);
  }, []);

  useEffect(() => {
    capturePageView(window.location.pathname, `${page.charAt(0).toUpperCase() + page.slice(1)} | Sumalyze`);
    
    // Specifically track legal_page_viewed
    const legalPages = ['privacy', 'terms', 'cookies', 'refund', 'billing', 'data-deletion', 'support'];
    if (legalPages.includes(page)) {
      captureEvent('legal_page_viewed', { page });
    }
  }, [page]);

  // Pathname-based routing with backward compatibility for hash routes
  useEffect(() => {
    const handleLocationChange = () => {
      // 1. Backward compatibility check
      const hash = window.location.hash.replace('#', '');
      if (hash && hashToPathMap[hash]) {
        const targetPath = hashToPathMap[hash];
        window.history.replaceState(null, '', targetPath);
        window.location.hash = ''; // clear hash
      }

      // 2. Parse current pathname
      const path = window.location.pathname;
      if (path === '/' || path === '/index.html') {
        setPage('home');
        setToolSlug('');
      } else if (path === '/tools') {
        setPage('tools');
        setToolSlug('');
      } else if (path.startsWith('/tools/')) {
        // Individual tool page
        const slug = path.replace('/tools/', '');
        setToolSlug(slug);
        setPage('tooldetail');
      } else if (path === '/agent') {
        setPage('agent');
      } else if (path === '/workflows') {
        setPage('workflows');
      } else if (path === '/use-cases') {
        setPage('usecases');
      } else if (path === '/history') {
        setPage('history');
      } else if (path === '/settings') {
        setPage('settings');
      } else if (path === '/pricing') {
        setPage('pricing');
      } else if (path === '/team-workspace') {
        setPage('team-workspace');
      } else if (path === '/privacy') {
        setPage('privacy');
      } else if (path === '/terms') {
        setPage('terms');
      } else if (path === '/cookies') {
        setPage('cookies');
      } else if (path === '/refund') {
        setPage('refund');
      } else if (path === '/billing') {
        setPage('billing');
      } else if (path === '/data-deletion') {
        setPage('data-deletion');
      } else if (path === '/support') {
        setPage('support');
      } else if (path === '/login') {
        setPage('login');
      } else if (path === '/signup') {
        setPage('signup');
      } else if (path === '/forgot-password') {
        setPage('forgot-password');
      } else {
        setPage('home');
        setToolSlug('');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  // Auth Redirection: If logged in user is on home, login, or signup, send to tools. If not logged in and on settings, send to login.
  useEffect(() => {
    if (user && (page === 'home' || page === 'login' || page === 'signup')) {
      navigate('tools');
    } else if (!user && page === 'settings') {
      navigate('login');
    }
  }, [user, page]);

  const navigate = (p: Page) => {
    let path = '/';
    if (p === 'usecases') path = '/use-cases';
    else if (p === 'forgot-password') path = '/forgot-password';
    else if (p === 'team-workspace') path = '/team-workspace';
    else if (p !== 'home') path = `/${p}`;
    
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      setPage(p);
    }
  };

  /** Navigate to a specific tool by slug */
  const navigateToTool = (slug: string) => {
    const path = `/tools/${slug}`;
    window.history.pushState(null, '', path);
    setToolSlug(slug);
    setPage('tooldetail');
  };

  /** Navigate to any path string (used by ToolDetailPage) */
  const navigatePath = (path: string) => {
    if (path === '/tools') { navigate('tools'); return; }
    if (path.startsWith('/tools/')) { navigateToTool(path.replace('/tools/', '')); return; }
    if (path === '/agent') { navigate('agent'); return; }
    navigate('home');
  };

  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  const isProtectedRoute = ['home', 'tools', 'tooldetail', 'agent', 'workflows', 'history', 'settings', 'login', 'signup', 'forgot-password'].includes(page);

  if (isMaintenanceMode && isProtectedRoute) {
    return <MaintenancePage />;
  }

  return (
    <div style={{ background: '#0a000f', color: '#fff', minHeight: '100vh', fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
      <Header onNavigate={navigate} onNavigateTool={navigateToTool} onFeedbackClick={() => setFeedbackOpen(true)} currentPage={page} />

      {page === 'tools' && (
        <div className="page-enter">
          <ToolsPage onSignIn={() => setAuthOpen(true)} onNavigateTool={navigateToTool} />
        </div>
      )}
      {page === 'tooldetail' && (
        <div className="page-enter">
          <ToolDetailPage slug={toolSlug} onNavigate={navigatePath} onSignIn={() => setAuthOpen(true)} />
        </div>
      )}
      {page === 'agent' && (
        <div className="page-enter">
          <AgentPage onSignIn={() => setAuthOpen(true)} />
        </div>
      )}
      {page === 'workflows' && (
        <div className="page-enter">
          <WorkflowsPage onNavigateAgent={() => navigate('agent')} />
        </div>
      )}
      {page === 'usecases' && (
        <div className="page-enter">
          <UseCasesPage onNavigateTools={() => navigate('tools')} onNavigateAgent={() => navigate('agent')} />
        </div>
      )}
      {page === 'pricing' && (
        <div className="page-enter">
          <PricingPage onNavigate={navigate} />
        </div>
      )}
      {page === 'team-workspace' && (
        <div className="page-enter">
          <TeamWorkspacePage onNavigate={navigate} />
        </div>
      )}
      {page === 'history' && (
        <div className="page-enter">
          <HistoryPage />
        </div>
      )}
      {page === 'settings' && (
        <div className="page-enter">
          <SettingsPage onNavigate={navigate} />
        </div>
      )}
      {page === 'privacy' && (
        <div className="page-enter">
          <PrivacyPolicy />
        </div>
      )}
      {page === 'terms' && (
        <div className="page-enter">
          <TermsOfService />
        </div>
      )}
      {page === 'cookies' && (
        <div className="page-enter">
          <CookiePolicy />
        </div>
      )}
      {page === 'refund' && (
        <div className="page-enter">
          <RefundPolicy />
        </div>
      )}
      {page === 'billing' && (
        <div className="page-enter">
          <BillingTerms />
        </div>
      )}
      {page === 'data-deletion' && (
        <div className="page-enter">
          <DataDeletion />
        </div>
      )}
      {page === 'support' && (
        <div className="page-enter">
          <SupportPage />
        </div>
      )}
      {page === 'login' && (
        <div className="page-enter">
          <LoginPage onNavigate={navigate} />
        </div>
      )}
      {page === 'signup' && (
        <div className="page-enter">
          <SignupPage onNavigate={navigate} />
        </div>
      )}
      {page === 'forgot-password' && (
        <div className="page-enter">
          <ForgotPasswordPage onNavigate={navigate} />
        </div>
      )}
      {page === 'home' && (
        <>
          <Hero onNavigate={navigate} />
          <HomeModesScrollSection onNavigate={navigate} />
          <UseCaseStorySection />
          <WhySumalyzeSection />
          <TrustSection />
          <DemoSection onNavigate={navigate} onSignUpClick={() => setAuthOpen(true)} />
        </>
      )}

      <Footer onNavigate={navigate} onFeedbackClick={() => setFeedbackOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onNavigate={navigate} />
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <CookieConsent />
    </div>
  );
}

/* ============================================================
   HEADER — Clean nav: Home, Tools, Agent, More dropdown
   ============================================================ */

function Header({ onNavigate, onNavigateTool, onFeedbackClick, currentPage }: {
  onNavigate: (p: Page) => void;
  onNavigateTool: (slug: string) => void;
  onFeedbackClick: () => void;
  currentPage: Page;
}) {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    if (!moreOpen && !toolsOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-more-dropdown]')) setMoreOpen(false);
      if (!(e.target as HTMLElement).closest('[data-tools-dropdown]')) setToolsOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMoreOpen(false); setToolsOpen(false); }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen, toolsOpen]);

  const moreLinks: { label: string; page?: Page; href?: string; onClick?: () => void }[] = [
    { label: 'Workflows',  page: 'workflows' },
    { label: 'Use Cases',  page: 'usecases' },
    { label: 'Feedback',   onClick: onFeedbackClick },
    { label: 'Support',    page: 'support' },
    { label: 'Privacy',    page: 'privacy' },
    { label: 'Terms',      page: 'terms' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
      padding: '0 20px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: scrolled ? 'rgba(10,0,15,0.92)' : 'rgba(10,0,15,0.08)',
      transition: 'background 0.3s ease',
    }}>
      <div style={{ maxWidth: 1248, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'radial-gradient(62.87% 100% at 50% 100%, rgba(226,62,87,0.15) 0%, transparent 100%)' }} />

        {/* Logo */}
        <a href="/" onClick={e => { e.preventDefault(); onNavigate('home'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'white', zIndex: 2 }}>
          <img src={sumalyzeLogo} alt="Sumalyze logo" style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />
          <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em' }}>Sumalyze</span>
        </a>

        {/* Center pill nav — desktop only */}
        <nav style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 8, display: 'flex', alignItems: 'center', padding: '4px 6px', gap: 2,
        }} className="header-nav-desktop">
          {/* Home */}
          <NavPillItem label="Home" active={currentPage === 'home'} onClick={() => onNavigate('home')} />

          {/* Tools dropdown */}
          <div style={{ position: 'relative' }} data-tools-dropdown>
            <button
              onClick={() => { setToolsOpen(o => !o); setMoreOpen(false); }}
              aria-haspopup="true"
              aria-expanded={toolsOpen}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13, color: (toolsOpen || currentPage === 'tools') ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: (toolsOpen || currentPage === 'tools') ? 600 : 500,
                padding: '6px 12px', borderRadius: 6, background: (toolsOpen || currentPage === 'tools') ? 'rgba(226,62,87,0.1)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
              }}
            >
              Tools
              <span style={{ fontSize: 9, opacity: 0.5, transform: toolsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
            </button>
            {toolsOpen && (
              <div data-tools-dropdown style={{
                position: 'absolute', top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(12,4,20,0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '20px',
                minWidth: 640,
                boxShadow: '0 32px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(226,62,87,0.05)',
                zIndex: 200,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
              }}>
                {TOOLS.map(tool => (
                  <button key={tool.id}
                    onClick={() => { setToolsOpen(false); onNavigateTool(tool.slug); }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '12px 14px', borderRadius: 12,
                      background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      textAlign: 'left', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `${tool.accent}12`}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: `${tool.accent}12`, border: `1px solid ${tool.accent}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: tool.accent
                    }}>
                      {tool.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'white', margin: 0, lineHeight: '1.2' }}>{tool.name}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0', lineHeight: '1.4' }}>{tool.description}</p>
                    </div>
                  </button>
                ))}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0', paddingTop: 10 }}>
                  <button onClick={() => { setToolsOpen(false); onNavigate('tools'); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(226,62,87,0.08)', border: '1px solid rgba(226,62,87,0.2)', color: '#ff8fa3', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    View all tools →
                  </button>
                </div>
              </div>
            )}
          </div>

          <NavPillItem label="Agent" active={currentPage === 'agent'} onClick={() => onNavigate('agent')} />
          <NavPillItem label="Pricing" active={currentPage === 'pricing'} onClick={() => onNavigate('pricing')} />
          {user && (
            <NavPillItem label="History" active={currentPage === 'history'} onClick={() => onNavigate('history')} />
          )}
          {/* More dropdown */}
          <div style={{ position: 'relative' }} data-more-dropdown>
            <button
              onClick={() => setMoreOpen(o => !o)}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13, color: moreOpen ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: 500,
                padding: '6px 12px', borderRadius: 6, background: moreOpen ? 'rgba(226,62,87,0.08)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
              }}
            >
              More
              <span style={{ fontSize: 9, opacity: 0.5, transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
            </button>
            {moreOpen && (
              <div className="nav-dropdown" data-more-dropdown style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(14,4,22,0.97)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, padding: '6px', minWidth: 160,
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                zIndex: 200,
              }}>
                {moreLinks.map(link => (
                  <button key={link.label}
                    onClick={() => {
                      setMoreOpen(false);
                      if (link.page) onNavigate(link.page);
                      else if (link.href) window.open(link.href, '_blank', 'noopener,noreferrer');
                      else if (link.onClick) link.onClick();
                    }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(226,62,87,0.07)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'none'; }}
                  >
                    {link.label === 'Support' ? '♥ ' : ''}{link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop actions */}
        <div className="header-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 2 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => onNavigate('settings')} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
                background: currentPage === 'settings' ? 'rgba(226,62,87,0.1)' : 'rgba(255,255,255,0.04)',
                color: currentPage === 'settings' ? '#ff8fa3' : 'rgba(255,255,255,0.8)',
                fontFamily: 'inherit',
              }}>
                Settings
              </button>
              <button onClick={() => { captureEvent('logout_clicked'); signOut(); }} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
                fontFamily: 'inherit',
              }}>
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => { captureEvent('cta_clicked', { cta_name: 'Sign In', location: 'Header', destination: 'login' }); onNavigate('login'); }} style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit',
              }}>
                Sign In
              </button>
              <button onClick={() => { captureEvent('cta_clicked', { cta_name: 'Sign Up', location: 'Header', destination: 'signup' }); onNavigate('signup'); }} style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: '1px solid rgba(207,184,255,0.2)',
                background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)',
                boxShadow: 'inset 0 0 12px rgba(191,151,255,0.24)',
                color: '#f4f0ff', fontFamily: 'inherit',
              }}>
                Sign Up
              </button>
            </>
          )}
          <HeaderBtn onClick={() => { captureEvent('cta_clicked', { cta_name: 'Try Agent', location: 'Header', destination: 'agent' }); onNavigate('agent'); }}>Try Agent ✧</HeaderBtn>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="header-mobile-only"
          onClick={() => setMobileMenuOpen(o => !o)}
          style={{
            zIndex: 2, width: 36, height: 36, borderRadius: 9,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'white', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit',
          }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-open mobile-menu-scrollable" style={{
          background: 'rgba(10,0,15,0.98)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '12px 20px 20px',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {[
            { label: 'Home', page: 'home' as Page },
            { label: 'Agent', page: 'agent' as Page },
            { label: 'Pricing', page: 'pricing' as Page },
            ...(user ? [
              { label: 'History', page: 'history' as Page },
              { label: 'Settings', page: 'settings' as Page }
            ] : []),
            { label: 'Workflows', page: 'workflows' as Page },
            { label: 'Use Cases', page: 'usecases' as Page },
          ].map((l) => (
            <button
              key={l.label}
              onClick={() => { onNavigate(l.page); setMobileMenuOpen(false); }}
              style={{
                padding: '11px 12px', borderRadius: 10, fontSize: 15, fontWeight: 500,
                display: 'block', textAlign: 'left', background: currentPage === l.page ? 'rgba(226,62,87,0.08)' : 'none',
                border: 'none', cursor: 'pointer', color: currentPage === l.page ? '#ff8fa3' : 'rgba(255,255,255,0.75)',
                fontFamily: 'inherit',
              }}
            >
              {l.label}
            </button>
          ))}

          {/* Mobile Tools accordion */}
          <div>
            <button
              onClick={() => setMobileToolsOpen(o => !o)}
              style={{
                width: '100%', padding: '11px 12px', borderRadius: 10, fontSize: 15, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: (currentPage === 'tools' || currentPage === 'tooldetail') ? 'rgba(226,62,87,0.08)' : 'none',
                border: 'none', cursor: 'pointer',
                color: (currentPage === 'tools' || currentPage === 'tooldetail') ? '#ff8fa3' : 'rgba(255,255,255,0.75)',
                fontFamily: 'inherit',
              }}
            >
              <span>Tools</span>
              <span style={{ fontSize: 10, opacity: 0.5, transform: mobileToolsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
            </button>
            {mobileToolsOpen && (
              <div style={{ paddingLeft: 8, paddingRight: 8, paddingBottom: 8, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <button
                  onClick={() => { onNavigate('tools'); setMobileMenuOpen(false); setMobileToolsOpen(false); }}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                    display: 'block', textAlign: 'center', background: 'rgba(226,62,87,0.08)',
                    border: '1px solid rgba(226,62,87,0.2)', cursor: 'pointer',
                    color: '#ff8fa3', fontFamily: 'inherit', marginBottom: 4,
                  }}
                >
                  All Tools directory →
                </button>
                {TOOLS.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => { onNavigateTool(tool.slug); setMobileMenuOpen(false); setMobileToolsOpen(false); }}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.85)', fontFamily: 'inherit',
                    }}
                  >
                    <div style={{
                      width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                      background: `${tool.accent}12`, border: `1px solid ${tool.accent}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: tool.accent
                    }}>
                      {tool.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'white', margin: 0 }}>{tool.name}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '1px 0 0', lineHeight: '1.2' }}>{tool.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => { onFeedbackClick(); setMobileMenuOpen(false); }}
            style={{
              padding: '11px 12px', borderRadius: 10, fontSize: 15, fontWeight: 500,
              display: 'block', textAlign: 'left', background: 'none',
              border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.75)',
              fontFamily: 'inherit',
            }}
          >
            Feedback
          </button>
          <a
            href="https://ko-fi.com/sumalyze"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '11px 12px', borderRadius: 10, fontSize: 15, color: '#ff8fa3', fontWeight: 600, display: 'block' }}
          >
            ♥ Support Sumalyze
          </a>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
          {user ? (
            <button onClick={() => { signOut(); setMobileMenuOpen(false); }} style={{
              padding: '11px 12px', borderRadius: 10, fontSize: 15,
              color: 'rgba(255,255,255,0.5)', background: 'none',
              border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontWeight: 500,
            }}>
              Sign Out
            </button>
          ) : (
            <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} style={{
              padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 500,
              cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
              color: 'white', marginTop: 4, fontFamily: 'inherit',
            }}>
              Sign In / Create Account
            </button>
          )}
        </div>
      )}
    </header>
  );
}

/* Shared nav pill item */
function NavPillItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 13, color: active ? 'white' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 500,
      padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
      background: active ? 'rgba(226,62,87,0.1)' : 'transparent',
      transition: 'all 0.2s', fontFamily: 'inherit',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(226,62,87,0.05)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent'; } }}
    >
      {label}
    </button>
  );
}

function HeaderBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="hover-glow"
      style={{
        display: 'block', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#f4f0ff',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)',
        boxShadow: 'inset 0 0 12px rgba(191,151,255,0.24)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(207,184,255,0.2)',
        cursor: 'pointer', fontFamily: 'inherit',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.42) 100%), rgba(113,47,255,0.24)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)'; }}>
      {children}
    </button>
  );
}





function Hero({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { user } = useAuth();

  return (
    <section style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', position: 'relative', boxSizing: 'border-box' }}>
      {/* Background radial glow */}
      <div style={{ position: 'absolute', top: -173, left: '50%', transform: 'translateX(-50%)', width: 1440, height: 900, background: 'radial-gradient(40% 60% at 50% 30%, rgba(226,62,87,0.06) 0%, rgba(10,0,15,0) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1248, width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Column: Headline, copy, CTAs */}
          <div style={{ textAlign: 'left' }}>
            {/* Title */}
            <h1 className="animate-reveal delay-75" style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(38px, 6vw, 64px)', lineHeight: '1.05', letterSpacing: '-0.03em', margin: '0 0 20px' }}>
              <span style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.75) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>
                From messy text
              </span>
              <span style={{ background: 'linear-gradient(180deg, #ff8fa3 0%, #E23E57 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>
                to clear next steps.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-reveal delay-150" style={{ fontSize: 17, lineHeight: '28px', color: 'rgba(239,237,253,0.7)', margin: '0 0 36px', maxWidth: 480 }}>
              Paste the text. Skip the suffering. Get the point instantly.
            </p>

            {/* CTA Buttons */}
            <div className="animate-reveal delay-200 hero-buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              <button onClick={() => { captureEvent('cta_clicked', { cta_name: 'Start for free', location: 'Hero', destination: user ? 'tools' : 'signup' }); if (user) onNavigate('tools'); else onNavigate('signup'); }}
                className="hover-glow"
                style={{ padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 500, color: '#f4f0ff', cursor: 'pointer', border: '1px solid rgba(207,184,255,0.25)', background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.14)', boxShadow: 'inset 0 0 12px rgba(191,151,255,0.3)', backdropFilter: 'blur(8px)', fontFamily: 'inherit' }}>
                Start for free
              </button>
              <button onClick={() => { captureEvent('cta_clicked', { cta_name: 'Explore tools', location: 'Hero', destination: 'tools' }); onNavigate('tools'); }}
                className="hover-glow"
                style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)', cursor: 'pointer', fontFamily: 'inherit' }}>
                Explore tools
              </button>
            </div>

            <p className="animate-reveal delay-300" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, fontStyle: 'italic' }}>
              Less blah. More aha.
            </p>
          </div>

          {/* Right Column: Visualizer */}
          <HeroMockup />

        </div>
      </div>
    </section>
  );
}



/* ============================================================
   DEMO SECTION
   ============================================================ */
function DemoSection({ onNavigate, onSignUpClick }: { onNavigate: (p: Page) => void; onSignUpClick: () => void }) {
  const { user } = useAuth();
  return (
    <section id="features" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 20px', background: 'rgba(10,0,15,0.3)', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 760, width: '100%', margin: '0 auto' }}>
        <DemoPanel onSignUpClick={onSignUpClick} />

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
          <button onClick={() => { captureEvent('cta_clicked', { cta_name: 'Try Sumalyze free', location: 'Demo', destination: user ? 'tools' : 'signup' }); if (user) onNavigate('tools'); else onNavigate('signup'); }}
            className="hover-glow"
            style={{
              padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, color: '#f4f0ff',
              border: '1px solid rgba(207,184,255,0.2)',
              background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)',
              boxShadow: 'inset 0 0 12px rgba(191,151,255,0.24)', backdropFilter: 'blur(8px)',
              cursor: 'pointer', fontFamily: 'inherit'
            }}>
            Try Sumalyze free
          </button>
          <button onClick={() => { captureEvent('cta_clicked', { cta_name: 'View all tools', location: 'Demo', destination: 'tools' }); onNavigate('tools'); }}
            className="hover-glow"
            style={{
              padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)',
              cursor: 'pointer', fontFamily: 'inherit'
            }}>
            View all tools
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DEMO PANEL
   ============================================================ */
const GUEST_DAILY_LIMIT = 10;
const MAX_TEXT = 5000;
function _getUsageToday(): number {
  try {
    const key = `sz_usage_${new Date().toDateString()}`;
    return parseInt(localStorage.getItem(key) ?? '0', 10);
  } catch { return 0; }
}
function _incrementUsage() {
  try {
    const key = `sz_usage_${new Date().toDateString()}`;
    localStorage.setItem(key, String(_getUsageToday() + 1));
  } catch {}
}

function DemoPanel({ onSignUpClick }: { onSignUpClick: () => void }) {
  const { user } = useAuth();
  const { plan } = useCurrentPlan();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [tab, setTab] = useState<'paste' | 'upload'>('paste');
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(_getUsageToday);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLimitReached = !user && usageCount >= GUEST_DAILY_LIMIT;

  const analyze = async () => {
    if (!user) {
      onSignUpClick();
      return;
    }
    if (!text.trim()) return;
    if (text.trim().length < 10) {
      setError('Please enter at least 10 characters to analyze.');
      return;
    }
    if (text.trim().length > MAX_TEXT) {
      setError(`Text too long. Maximum is ${MAX_TEXT.toLocaleString()} characters.`);
      return;
    }
    if (isLimitReached) return;

    setLoading(true);
    setResult(null);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 404) {
        // Local dev: API route not running — use client-side mock
        setResult(analyzeText(text));
      } else if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error || 'Analysis failed. Please try again.');
      } else {
        const data = await res.json() as AnalysisResult;
        setResult(data);
      }

      _incrementUsage();
      setUsageCount(_getUsageToday());
    } catch (e) {
      clearTimeout(timeoutId);
      if (e instanceof Error) {
        if (e.name === 'AbortError') {
          setError('Analysis timed out. Please try a shorter text.');
        } else {
          setError(e.message || 'Analysis failed. Please try again.');
        }
      } else {
        setError('Analysis failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleFileUpload = async (file: File) => {
    if (!user) {
      onSignUpClick();
      return;
    }
    const limitMB = getFileUploadLimitMB(plan);
    if (file.size > limitMB * 1024 * 1024) {
      setError(`File is too large. Your plan limit is ${limitMB} MB. Please upgrade to upload larger files.`);
      captureEvent('feature_locked_clicked', {
        feature: 'file_upload',
        required_plan: limitMB === 2 ? 'starter' : limitMB === 10 ? 'pro' : limitMB === 25 ? 'max' : 'team',
        current_plan: plan,
      });
      return;
    }
    setParsing(true);
    setError(null);
    setUploadedFileName(null);

    try {
      const res = await parseFile(file);
      if (res.error) {
        setError(res.error);
        return;
      }

      setText(res.text);
      setUploadedFileName(file.name);
      setTab('paste'); // switch to paste view to show the text
      setResult(null);
    } catch (err: any) {
      setError(err.message || 'Could not read file. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!user) {
      onSignUpClick();
      return;
    }
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const canAnalyze = !user || (text.trim().length >= 10 && text.trim().length <= MAX_TEXT && !loading && !isLimitReached);

  return (
    <div id="demo" style={{ marginTop: 20 }}>
      <SectionTitle>Summarize anything in seconds</SectionTitle>
      <SectionDesc>Experience the live parsing engine. Paste your own chaotic text or upload a document below.</SectionDesc>

      {/* Main Demo Panel */}
      <DemoRevealSection>
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', marginTop: 48 }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
            {(['paste', 'upload'] as const).map(t => (
              <button key={t} onClick={() => { if (!user) { onSignUpClick(); } else { setTab(t); setError(null); } }}
                style={{ padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: tab === t ? '1px solid rgba(226,62,87,0.3)' : '1px solid transparent', background: tab === t ? 'rgba(226,62,87,0.1)' : 'transparent', color: tab === t ? '#ff8fa3' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}>
                {t === 'paste' ? '📋 Paste Text' : '📎 Upload File'}
              </button>
            ))}
            {(text || uploadedFileName) && (
              <button onClick={() => { setText(''); setResult(null); setError(null); setUploadedFileName(null); }} style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Clear</button>
            )}
          </div>

          <div style={{ padding: '20px' }}>
            {tab === 'paste' ? (
              <div style={{ position: 'relative' }}>
                {uploadedFileName && (
                  <div style={{ marginBottom: 10, padding: '6px 12px', borderRadius: 8, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', fontSize: 12, color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: 6 }}>
                    📄 {uploadedFileName} · {text.length.toLocaleString()} characters loaded
                  </div>
                )}
                <textarea value={text} onChange={e => { setText(e.target.value); setError(null); }}
                  placeholder="Paste an email, message, contract snippet, or any text you want to analyze..."
                  style={{ width: '100%', height: 180, background: 'rgba(10,0,15,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 16, fontSize: 14, color: 'rgba(255,255,255,0.8)', resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: '22px', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(226,62,87,0.3)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: text.length > MAX_TEXT ? '#fca5a5' : text.length < 10 && text.length > 0 ? '#fca5a5' : 'rgba(255,255,255,0.2)' }}>
                    {text.length.toLocaleString()} / {MAX_TEXT.toLocaleString()}{text.length > 0 && text.length < 10 ? ' · min 10' : text.length > MAX_TEXT ? ' · too long' : ''}
                  </span>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => {
                  if (!user) {
                    onSignUpClick();
                    return;
                  }
                  if (!parsing) fileInputRef.current?.click();
                }}
                style={{ height: 180, border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: parsing ? 'not-allowed' : 'pointer', background: 'rgba(10,0,15,0.4)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => { if (!parsing) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(226,62,87,0.3)'; }}
                onMouseLeave={e => { if (!parsing) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                {parsing ? (
                  <>
                    <span style={{ fontSize: 24, animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>⏳</span>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Parsing document...</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Extracting text content locally...</p>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 32 }}>📄</span>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Drop document here or click to browse</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>PDF, DOCX, TXT supported · Max {getFileUploadLimitMB(plan)}MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠ {error}
              </div>
            )}

            {isLimitReached && (
              <div style={{ marginTop: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)', fontSize: 13, color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <span>Daily MVP free limit reached ({GUEST_DAILY_LIMIT} analyses). Sign in for unlimited access.</span>
              </div>
            )}
            <button onClick={analyze} disabled={!canAnalyze}
              style={{
                width: '100%', marginTop: 14, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 500,
                cursor: !canAnalyze ? 'not-allowed' : 'pointer', border: 'none',
                background: !canAnalyze ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                color: !canAnalyze ? 'rgba(255,255,255,0.25)' : 'white',
                boxShadow: !canAnalyze ? 'none' : '0 4px 24px rgba(226,62,87,0.35)',
                transition: 'all 0.25s', fontFamily: 'inherit',
                animation: loading ? 'premiumPulse 1.5s ease-in-out infinite' : 'none'
              }}>
              {loading ? '⏳ Analyzing with AI...' : user ? '⚡ Analyze with Sumalyze' : '⚡ Try Sumalyze free'}
            </button>
          </div>

          {/* Results */}
          {result && <ResultGrid result={result} />}
          {result && <FeedbackWidget key={result.brief} />}
          {result && <ResultKoFiCTA />}
        </div>
      </DemoRevealSection>
    </div>
  );
}

function FeedbackWidget() {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  return (
    <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      {voted ? (
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Thanks for your feedback! ♥</span>
      ) : (
        <>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Was this analysis useful?</span>
          {(['up', 'down'] as const).map(v => (
            <button key={v} onClick={() => setVoted(v)}
              style={{ padding: '5px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = v === 'up' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = v === 'up' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              {v === 'up' ? '👍 Yes' : '👎 No'}
            </button>
          ))}
        </>
      )}
    </div>
  );
}

function ResultKoFiCTA() {
  return (
    <div className="animate-reveal" style={{ padding: '0 20px 24px' }}>
      <div style={{
        background: 'linear-gradient(145deg, rgba(226,62,87,0.12) 0%, rgba(136,48,78,0.08) 100%)',
        border: '1px solid rgba(226,62,87,0.25)',
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: 'inset 0 0 12px rgba(226,62,87,0.12)',
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'white', marginBottom: 4 }}>
            ♥ Find this analysis helpful?
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: '18px' }}>
            Sumalyze is an independent project. A small Ko-fi contribution helps keep the servers running.
          </p>
        </div>
        <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer"
          className="hover-glow"
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            color: 'white',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
            boxShadow: '0 4px 14px rgba(226,62,87,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}>
          ☕ Support Us on Ko-fi
        </a>
      </div>
    </div>
  );
}

function ResultGrid({ result }: { result: AnalysisResult }) {
  const cards = [
    { id: 'brief', label: 'Brief', icon: '✦', color: '#E23E57', content: <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: '20px' }}>{result.brief}</p> },
    { id: 'pulse', label: 'Pulse', icon: '◎', color: '#f472b6', content: (
        <div>
          <p style={{ fontSize: 13, color: 'white', fontWeight: 500, marginBottom: 8 }}>{result.pulse.overall}</p>
          {result.pulse.emotions.slice(0, 3).map(em => (
            <div key={em.name} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{em.name}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{em.value}%</span>
              </div>
              <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', borderRadius: 99, background: em.color, width: `${em.value}%`, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )
    },
    { id: 'intent', label: 'Intent', icon: '◈', color: '#818cf8', content: (
        <div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>{result.intent.primary}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {result.intent.secondary.map((s, i) => <span key={i} style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, background: 'rgba(129,140,248,0.15)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.2)' }}>{s}</span>)}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>{result.intent.confidence}% confidence</p>
        </div>
      )
    },
    { id: 'reply', label: 'Reply', icon: '◷', color: '#34d399', content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {result.reply.options.slice(0, 2).map((opt, i) => (
            <div key={i} style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{opt.style}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: '18px' }}>{opt.text}</p>
            </div>
          ))}
        </div>
      )
    },
    { id: 'signals', label: 'Signals', icon: '⚠', color: '#fbbf24', content: (
        <div>
          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600, background: result.signals.level === 'high' ? 'rgba(239,68,68,0.15)' : result.signals.level === 'medium' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)', color: result.signals.level === 'high' ? '#fca5a5' : result.signals.level === 'medium' ? '#fde68a' : '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{result.signals.level} risk</span>
          <div style={{ marginTop: 10 }}>
            {result.signals.risks.length > 0 ? result.signals.risks.map((r, i) => <p key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>▲ {r}</p>) : <p style={{ fontSize: 12, color: '#6ee7b7' }}>✓ No significant risks</p>}
          </div>
        </div>
      )
    },
    { id: 'score', label: 'Score', icon: '◆', color: '#a78bfa', content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {([['Clarity', result.score.clarity], ['Urgency', result.score.urgency], ['Pro.', result.score.professionalism], ['Polite', result.score.politeness], ['Emot.', result.score.emotionalIntensity], ['Risk', result.score.riskLevel]] as [string,number][]).map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: 'white', lineHeight: '1', marginBottom: 3 }}>{v}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{l}</p>
            </div>
          ))}
        </div>
      )
    },
    { id: 'extract', label: 'Extract', icon: '◻', color: '#22d3ee', content: (
        <div>
          {result.extract.keyPoints.length > 0 && <div style={{ marginBottom: 8 }}><p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Key Points</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{result.extract.keyPoints.slice(0, 3).map((p, i) => <span key={i} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: 'rgba(34,211,238,0.1)', color: '#67e8f9' }}>{p}</span>)}</div></div>}
          {result.extract.actionItems.length > 0 && <div><p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Actions</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{result.extract.actionItems.slice(0, 2).map((a, i) => <span key={i} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: 'rgba(251,146,60,0.1)', color: '#fdba74' }}>{a}</span>)}</div></div>}
        </div>
      )
    },
    { id: 'rewrite', label: 'Rewrite', icon: '↺', color: '#fb923c', content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {result.rewrite.options.map((opt, i) => <div key={i} style={{ padding: '7px 12px', borderRadius: 10, background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.15)', fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fb923c', flexShrink: 0 }} />{opt.style}</div>)}
        </div>
      )
    },
  ];

  return (
    <div style={{ padding: '0 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
        <span style={{ fontSize: 15, fontWeight: 500, color: 'white' }}>Analysis Complete</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>— {cards.length} modules ran</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {cards.map((card, i) => (
          <div key={card.id} id={`result-${card.id}`} className="hover-card" style={{
            background: `${card.color}08`, border: `1px solid ${card.color}18`, borderRadius: 16, padding: '16px',
            animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: card.color }}>{card.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{card.label}</span>
            </div>
            {card.content}
          </div>
        ))}
      </div>
    </div>
  );
}



/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ onNavigate, onFeedbackClick }: { onNavigate: (page: Page) => void; onFeedbackClick: () => void }) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img src={sumalyzeLogo} alt="Sumalyze logo" style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />
              <span style={{ fontSize: 16, fontWeight: 500, color: 'white' }}>Sumalyze</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', maxWidth: 220, lineHeight: '20px' }}>
              SaaS clarity workspace & agent platform.
            </p>
          </div>

          {/* Nav columns */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Product</p>
              {(['tools','agent','workflows','usecases','pricing'] as const).map(p => (
                <button key={p} onClick={() => onNavigate(p)} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                  {p === 'usecases' ? 'Use Cases' : p === 'workflows' ? 'Workflows' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Workspace</p>
              <button onClick={() => onNavigate('history')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                History
              </button>
              <button onClick={onFeedbackClick} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Submit Feedback
              </button>
              <button onClick={() => onNavigate('support')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Contact / Support
              </button>
              <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 14, color: '#ff8fa3', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffb3c1'}
                onMouseLeave={e => e.currentTarget.style.color = '#ff8fa3'}>
                ♥ Support on Ko-fi
              </a>
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Legal</p>
              <button onClick={() => onNavigate('privacy')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Privacy Policy
              </button>
              <button onClick={() => onNavigate('terms')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Terms of Service
              </button>
              <button onClick={() => onNavigate('cookies')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Cookie Policy
              </button>
              <button onClick={() => onNavigate('refund')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Refund Policy
              </button>
              <button onClick={() => onNavigate('billing')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Billing Terms
              </button>
              <button onClick={() => onNavigate('data-deletion')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Data Deletion
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} Sumalyze · AI Clarity Workspace</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>Independent AI workspace for clearer thinking.</p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   SHARED COMPONENTS
   ============================================================ */


function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: '1.1', letterSpacing: '-0.03em', textAlign: 'center', margin: '0 0 16px', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }}>
      {children}
    </h2>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 17, color: 'rgba(239,237,253,0.6)', lineHeight: '28px', maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
      {children}
    </p>
  );
}
