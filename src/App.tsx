import { useState, useEffect, useRef } from 'react';
import { analyzeText } from './utils/mockAnalyzer';
import type { AnalysisResult } from './utils/mockAnalyzer';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AuthModal from './components/AuthModal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ToolsPage from './pages/ToolsPage';
import AgentPage from './pages/AgentPage';
import WorkflowsPage from './pages/WorkflowsPage';
import UseCasesPage from './pages/UseCasesPage';
import sumalyzeLogo from './assets/sumalyzelogo.png';

/* ============================================================
   Sumalyze — AI Clarity Workspace
   ============================================================ */

type Page = 'home' | 'privacy' | 'terms' | 'tools' | 'agent' | 'workflows' | 'usecases';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [authOpen, setAuthOpen] = useState(false);

  // Hash-based routing — supports #privacy, #terms, #tools, #agent, #workflows, #usecases
  useEffect(() => {
    const readHash = () => {
      const h = window.location.hash.replace('#', '');
      const validPages: Page[] = ['privacy', 'terms', 'tools', 'agent', 'workflows', 'usecases'];
      setPage(validPages.includes(h as Page) ? (h as Page) : 'home');
    };
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const navigate = (p: Page) => { window.location.hash = p === 'home' ? '' : p; };

  if (page === 'privacy') return <AuthProvider><PrivacyPolicy onClose={() => navigate('home')} /></AuthProvider>;
  if (page === 'terms')   return <AuthProvider><TermsOfService onClose={() => navigate('home')} /></AuthProvider>;

  return (
    <AuthProvider>
      <div style={{ background: '#0a000f', color: '#fff', minHeight: '100vh', overflowX: 'hidden', fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
        <Header onLoginClick={() => setAuthOpen(true)} onNavigate={navigate} currentPage={page} />

        {page === 'tools' && (
          <div className="page-enter">
            <ToolsPage onSignIn={() => setAuthOpen(true)} />
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
        {page === 'home' && (
          <>
            <Hero onNavigate={navigate} />
            <FromToolToAgentSection onNavigate={navigate} />
            <AudienceSection />
            <DemoSection />
            <InteractiveToneSection />
            <BentoModulesSection />
            <BuiltForSection onNavigate={navigate} />
            <MissionSection />
            <TestimonialsSection />
            <FinalCTA onNavigate={navigate} />
          </>
        )}

        <Footer onNavigate={navigate} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </AuthProvider>
  );
}

/* ============================================================
   HEADER — Clean nav: Home, Tools, Agent, More dropdown
   ============================================================ */
function Header({ onLoginClick, onNavigate, currentPage }: {
  onLoginClick: () => void;
  onNavigate: (p: Page) => void;
  currentPage: Page;
}) {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close More dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!moreOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-more-dropdown]')) setMoreOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  const mainNavLinks: { label: string; page: Page }[] = [
    { label: 'Tools',  page: 'tools' },
    { label: 'Agent',  page: 'agent' },
  ];

  const moreLinks: { label: string; page?: Page; href?: string }[] = [
    { label: 'Workflows',  page: 'workflows' },
    { label: 'Use Cases',  page: 'usecases' },
    { label: 'Support',    href: 'https://ko-fi.com/sumalyze' },
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
          {mainNavLinks.map(l => (
            <NavPillItem key={l.page} label={l.label} active={currentPage === l.page} onClick={() => onNavigate(l.page)} />
          ))}
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
            <button onClick={signOut} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
              fontFamily: 'inherit',
            }}>
              Sign Out
            </button>
          ) : (
            <button onClick={onLoginClick} style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', border: '1px solid rgba(207,184,255,0.2)',
              background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)',
              boxShadow: 'inset 0 0 12px rgba(191,151,255,0.24)',
              color: '#f4f0ff', fontFamily: 'inherit',
            }}>
              Sign In
            </button>
          )}
          <HeaderBtn onClick={() => onNavigate('agent')}>Try Agent ✧</HeaderBtn>
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
          {[{label:'Home',page:'home'},{label:'Tools',page:'tools'},{label:'Agent',page:'agent'},{label:'Workflows',page:'workflows'},{label:'Use Cases',page:'usecases'}].map((l) => (
            <button
              key={l.label}
              onClick={() => { onNavigate(l.page as Page); setMobileMenuOpen(false); }}
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
            <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} style={{
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

/* ============================================================
   HERO — Left-aligned content + Workspace Visualizer
   ============================================================ */
function WorkspaceVisualizer() {
  const [pulseActive, setPulseActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-reveal delay-300" style={{
      position: 'relative',
      maxWidth: 620,
      width: '100%',
      margin: '0 auto',
      background: 'linear-gradient(135deg, rgba(20, 10, 30, 0.4) 0%, rgba(10, 5, 20, 0.6) 100%)',
      border: '1px solid rgba(226, 62, 87, 0.18)',
      borderRadius: 16,
      boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 0 20px rgba(226, 62, 87, 0.08)',
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      {/* Window Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>sumalyze_workspace_v1.2</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Workspace Content Panel */}
      <div style={{ display: 'flex', minHeight: 280, position: 'relative' }} className="workspace-flex-layout">
        <style>{`
          @media(max-width: 540px) {
            .workspace-flex-layout {
              flex-direction: column !important;
            }
            .workspace-left-pane {
              border-right: none !important;
              border-bottom: 1px solid rgba(255,255,255,0.06) !important;
            }
          }
        `}</style>
        
        {/* Left Side: Mock Text Editor */}
        <div className="workspace-left-pane" style={{ flex: 1.2, padding: 18, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 600 }}>Input Document</span>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#E23E57', animation: 'premiumPulse 1.5s infinite' }} />
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', fontFamily: 'monospace' }}>
            <p style={{ margin: '0 0 10px 0', padding: '4px', borderRadius: 4, background: pulseActive === 0 ? 'rgba(226, 62, 87, 0.12)' : 'transparent', transition: 'background 0.5s ease' }}>
              <span style={{ color: pulseActive === 0 ? '#ff8fa3' : 'inherit' }}>I guess if you are too busy to respond, that is fine. I'll just wait here.</span>
            </p>
            <p style={{ margin: '0 0 10px 0', padding: '4px', borderRadius: 4, background: pulseActive === 1 ? 'rgba(129, 140, 248, 0.12)' : 'transparent', transition: 'background 0.5s ease' }}>
              <span style={{ color: pulseActive === 1 ? '#a5b4fc' : 'inherit' }}>We absolutely need the final deliverables by Friday noon without fail.</span>
            </p>
            <p style={{ margin: 0, padding: '4px', borderRadius: 4, background: pulseActive === 2 ? 'rgba(52, 211, 153, 0.12)' : 'transparent', transition: 'background 0.5s ease' }}>
              <span style={{ color: pulseActive === 2 ? '#6ee7b7' : 'inherit' }}>Let's hop on a call to iron out these launch details. Regards, Sarah.</span>
            </p>
            <span className="cursor-blink" />
          </div>
        </div>

        {/* SVG Connector Lines */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} className="workspace-connectors">
          <style>{`
            @media(max-width: 540px) {
              .workspace-connectors {
                display: none !important;
              }
            }
          `}</style>
          <svg style={{ width: '100%', height: '100%' }}>
            {pulseActive === 0 && (
              <path d="M 280,68 L 360,84" stroke="rgba(226, 62, 87, 0.5)" strokeWidth="1" fill="none" className="animate-dash-line" />
            )}
            {pulseActive === 1 && (
              <path d="M 280,128 L 360,136" stroke="rgba(129, 140, 248, 0.5)" strokeWidth="1" fill="none" className="animate-dash-line" />
            )}
            {pulseActive === 2 && (
              <path d="M 280,188 L 360,188" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="1" fill="none" className="animate-dash-line" />
            )}
          </svg>
        </div>

        {/* Right Side: Analysis Engine */}
        <div style={{ flex: 1, padding: 18, background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 600 }}>AI Intelligence</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
            
            {/* Tone Card */}
            <div style={{
              background: 'rgba(226, 62, 87, 0.04)',
              border: '1px solid rgba(226, 62, 87, 0.15)',
              borderRadius: 8, padding: '8px 12px',
              transform: pulseActive === 0 ? 'scale(1.03)' : 'scale(1)',
              opacity: pulseActive === 0 ? 1 : 0.4,
              transition: 'all 0.5s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 10, color: '#ff8fa3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pulse (Tone)</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Detected</span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'white' }}>Passive-Aggressive 🚨</p>
            </div>

            {/* Intent Card */}
            <div style={{
              background: 'rgba(129, 140, 248, 0.04)',
              border: '1px solid rgba(129, 140, 248, 0.15)',
              borderRadius: 8, padding: '8px 12px',
              transform: pulseActive === 1 ? 'scale(1.03)' : 'scale(1)',
              opacity: pulseActive === 1 ? 1 : 0.4,
              transition: 'all 0.5s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Intent</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Decrypted</span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'white' }}>Enforce Friday Deadline ◈</p>
            </div>

            {/* Smart Reply Card */}
            <div style={{
              background: 'rgba(52, 211, 153, 0.04)',
              border: '1px solid rgba(52, 211, 153, 0.15)',
              borderRadius: 8, padding: '8px 12px',
              transform: pulseActive === 2 ? 'scale(1.03)' : 'scale(1)',
              opacity: pulseActive === 2 ? 1 : 0.4,
              transition: 'all 0.5s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 10, color: '#6ee7b7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Smart Reply</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Drafted</span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>"Let's sync up, Sarah. Free at..." ◷</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 2 L10.8 6.2 L15.4 7 L11.6 9.8 L13 14.4 L9 12.2 L5 14.4 L6.4 9.8 L2.6 7 L7.2 6.2 Z" fill="url(#sg)" />
      <defs>
        <linearGradient id="sg" x1="2.6" y1="14.4" x2="15.4" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E23E57" />
          <stop offset="1" stopColor="#ff8fa3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Hero({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const scrollToDemo = () => {
    const el = document.getElementById('demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ paddingTop: 'clamp(100px, 12vw, 160px)', paddingBottom: '80px', position: 'relative' }}>
      {/* Background radial glow */}
      <div style={{ position: 'absolute', top: -173, left: '50%', transform: 'translateX(-50%)', width: 1440, height: 900, background: 'radial-gradient(40% 60% at 50% 30%, rgba(226,62,87,0.06) 0%, rgba(10,0,15,0) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1248, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Column: Headline, copy, CTAs */}
          <div style={{ textAlign: 'left' }}>
            {/* AI Badge */}
            <div className="animate-reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '5px 14px 5px 10px', borderRadius: 32,
              backdropFilter: 'blur(6px)', boxShadow: 'inset 0 -7px 11px rgba(226,62,87,0.12)',
              border: '1px solid rgba(226,62,87,0.25)', background: 'rgba(226,62,87,0.06)' }}>
              <SparkleIcon />
              <span style={{ background: 'linear-gradient(90deg, #ff8fa3 0%, #E23E57 50%, #ff8fa3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em' }}>
                AI CLARITY WORKSPACE ✧
              </span>
            </div>

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
              Paste any text. Get the point, the tone, the signals, and the next move. Built for students, creators, founders, and teams drowning in text.
            </p>

            {/* CTA Buttons */}
            <div className="animate-reveal delay-200 hero-buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              <button onClick={() => onNavigate('agent')}
                className="hover-glow"
                style={{ padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 500, color: '#f4f0ff', cursor: 'pointer', border: '1px solid rgba(207,184,255,0.25)', background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.14)', boxShadow: 'inset 0 0 12px rgba(191,151,255,0.3)', backdropFilter: 'blur(8px)', fontFamily: 'inherit' }}>
                Try Agent Mode ✧
              </button>
              <button onClick={scrollToDemo}
                className="hover-glow"
                style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)', cursor: 'pointer', fontFamily: 'inherit' }}>
                Try Demo
              </button>
            </div>

            <p className="animate-reveal delay-300" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span>✓ 100% MVP Free</span>
              <span>•</span>
              <span>✓ No Sign-up Required</span>
              <span>•</span>
              <span>✓ Private & Secure</span>
            </p>
          </div>

          {/* Right Column: Visualizer */}
          <WorkspaceVisualizer />

        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FROM TOOL TO AGENT — 3-card section
   ============================================================ */
function FromToolToAgentSection({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const cards = [
    {
      icon: '◎',
      label: 'Understand',
      title: 'What does it actually say?',
      desc: 'Summaries, tone detection, and intent analysis. Strip the noise and find the real message.',
      color: '#818cf8',
      tools: ['Summarizer', 'Tone Analyzer', 'Intent Detector'],
    },
    {
      icon: '⚠',
      label: 'Detect',
      title: 'What are the risks?',
      desc: 'Risk flags, red flags, manipulation patterns, urgency signals, and contract gotchas.',
      color: '#fbbf24',
      tools: ['Signals Detector', 'Contract Explainer'],
    },
    {
      icon: '◷',
      label: 'Act',
      title: 'What should I do next?',
      desc: 'Ready-to-send replies, action steps, rewrites, and briefings — customized to your situation.',
      color: '#34d399',
      tools: ['Reply Helper', 'Bullet Brief', 'Email Simplifier'],
    },
  ];

  return (
    <section style={{ padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>From Tool to Agent</SectionBadge>
        <SectionTitle>One platform. Three modes of clarity.</SectionTitle>
        <SectionDesc>Use a single tool when you know what you need. Run the Agent when you want everything at once.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 48 }}>
          {cards.map((card) => (
            <div key={card.label} className="hover-card" style={{
              background: 'rgba(255,255,255,0.013)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: '28px',
              display: 'flex', flexDirection: 'column', gap: 16,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${card.color}15`, border: `1px solid ${card.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{card.icon}</div>
                <span style={{ fontSize: 10, fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', letterSpacing: '-0.01em' }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: '20px' }}>{card.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {card.tools.map(t => (
                  <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${card.color}10`, color: card.color, border: `1px solid ${card.color}20` }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('tools')} style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
            Browse All Tools →
          </button>
          <button onClick={() => onNavigate('agent')} style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500, border: 'none', background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(226,62,87,0.3)' }}>
            Try Agent Mode ✧
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   AUDIENCE SECTION — For students, creators, founders, etc.
   ============================================================ */
function AudienceSection() {
  const [activeTab, setActiveTab] = useState<'students' | 'creators' | 'founders' | 'tldr'>('students');

  const audiences = {
    students: {
      title: "Tackle reading workloads in seconds",
      icon: "🎓",
      problem: "Assigned a 30-page research paper or study guide for tomorrow morning?",
      solution: "Sumalyze reads the paper instantly. It extracts core hypotheses, compiles action items, and generates a structured summary without losing critical context.",
      metric: "Save ~2 hours per paper"
    },
    creators: {
      title: "De-risk inbox feedback & sponsor requests",
      icon: "✍️",
      problem: "Unsure how to reply to a passive-aggressive email from a sponsor or manager?",
      solution: "Decode the real emotional subtext (Pulse) and review instant AI reply options. Respond with absolute clarity while protecting your business deals.",
      metric: "100% professional tone"
    },
    founders: {
      title: "Read between the lines of contracts & deals",
      icon: "💼",
      problem: "Negotiating with investors, vendors, or competitors with dense documents?",
      solution: "Spot hidden leverage, emotional cues, high-urgency timelines, and red flag signals before signing. Know what they are really asking.",
      metric: "Flag risks in <2 seconds"
    },
    tldr: {
      title: "Fast triaging for busy people",
      icon: "⚡",
      problem: "Flooded with newsletters, long articles, and social threads you don't have time for?",
      solution: "Paste text chaos and receive a beautifully distilled, one-sentence briefing. Absorb information at 10x speed with zero fluff.",
      metric: "90% reading time reduction"
    }
  };

  return (
    <section style={{ padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>Who It's For</SectionBadge>
        <SectionTitle>Built for people who hate long text</SectionTitle>
        <SectionDesc>Tailored intelligence modules customized for whatever you read and write daily.</SectionDesc>

        {/* Tab Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '40px 0 24px', flexWrap: 'wrap' }}>
          {(Object.keys(audiences) as Array<keyof typeof audiences>).map(key => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500,
              border: activeTab === key ? '1px solid rgba(226,62,87,0.3)' : '1px solid rgba(255,255,255,0.06)',
              background: activeTab === key ? 'rgba(226,62,87,0.1)' : 'rgba(255,255,255,0.02)',
              color: activeTab === key ? '#ff8fa3' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              <span>{audiences[key].icon}</span>
              <span>{key.charAt(0).toUpperCase() + key.slice(1).replace('tldr', 'TL;DR')}</span>
            </button>
          ))}
        </div>

        {/* Tab Panel */}
        <div className="hover-card audience-tab-panel" style={{
          maxWidth: 800, margin: '0 auto',
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, padding: '36px',
          display: 'flex', flexDirection: 'column', gap: 24,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(226, 62, 87, 0.2), transparent)' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#E23E57', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Use Case Study</span>
              <h3 style={{ fontSize: 24, fontWeight: 500, color: 'white', marginTop: 6 }}>{audiences[activeTab].title}</h3>
            </div>
            <div style={{ background: 'rgba(226,62,87,0.08)', border: '1px solid rgba(226,62,87,0.15)', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#ff8fa3', fontWeight: 500 }}>
              {audiences[activeTab].metric}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 8 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>The Problem</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>"{audiences[activeTab].problem}"</p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>The Workspace Solution</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>{audiences[activeTab].solution}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DEMO SECTION
   ============================================================ */
function DemoSection() {
  return (
    <section id="features" style={{ padding: '80px 20px', background: 'rgba(10,0,15,0.3)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <DemoPanel />
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

function DemoPanel() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [tab, setTab] = useState<'paste' | 'upload'>('paste');
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(_getUsageToday);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLimitReached = !user && usageCount >= GUEST_DAILY_LIMIT;

  const analyze = async () => {
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


  const handleFileUpload = (file: File) => {
    const supportedTypes = ['text/plain'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!supportedTypes.includes(file.type) && ext !== 'txt') {
      setError(`Unsupported file type: .${ext}. Please upload a .txt file. PDF and DOCX support coming soon.`);
      return;
    }
    if (file.size > 500_000) {
      setError('File too large. Maximum size is 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      setUploadedFileName(file.name);
      setTab('paste'); // switch to paste view to show the text
      setResult(null);
      setError(null);
    };
    reader.onerror = () => setError('Could not read file. Please try again.');
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const samples = [
    { label: 'Passive-aggressive', text: "I guess if you're too busy to respond to emails, that's fine. I'll just keep waiting." },
    { label: 'Urgent escalation', text: "This is critical — if we don't resolve this today the client will cancel the contract." },
    { label: 'Scam attempt', text: "Congratulations! You've been selected for a $5,000 grant. Send your bank details and $150 processing fee immediately." },
  ];

  const canAnalyze = text.trim().length >= 10 && text.trim().length <= MAX_TEXT && !loading && !isLimitReached;

  return (
    <div id="demo" style={{ marginTop: 20 }}>
      <SectionBadge>Live Workspace</SectionBadge>
      <SectionTitle>Summarize anything in seconds</SectionTitle>
      <SectionDesc>Experience the live parsing engine. Load a document preset or paste your own chaotic text below.</SectionDesc>

      {/* Grid containing Presets Sidebar and Main Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 24, marginTop: 48, alignItems: 'start' }} className="demo-grid-layout">
        <style>{`
          @media(max-width: 768px) {
            .demo-grid-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        
        {/* Left Side: Preset Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Document Inbox</p>
          {samples.map(s => {
            const isSelected = text === s.text;
            return (
              <button key={s.label} onClick={() => { setText(s.text); setTab('paste'); setResult(null); setError(null); setUploadedFileName(null); }}
                style={{
                  textAlign: 'left', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                  color: isSelected ? '#ff8fa3' : 'rgba(255,255,255,0.6)',
                  background: isSelected ? 'rgba(226,62,87,0.08)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid rgba(226,62,87,0.25)' : '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', gap: 2
                }}
                onMouseEnter={e => { if(!isSelected) { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                onMouseLeave={e => { if(!isSelected) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; } }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>📄 {s.label}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: 180 }}>{s.text}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: The Main Demo Panel */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
            {(['paste', 'upload'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(null); }}
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
                onClick={() => fileInputRef.current?.click()}
                style={{ height: 180, border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', background: 'rgba(10,0,15,0.4)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(226,62,87,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <span style={{ fontSize: 32 }}>📄</span>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Drop .txt file here or click to browse</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>TXT supported · PDF & DOCX coming soon</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,text/plain"
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
              {loading ? '⏳ Analyzing with AI...' : '⚡ Analyze with Sumalyze'}
            </button>
          </div>

          {/* Results */}
          {result && <ResultGrid result={result} />}
          {result && <FeedbackWidget key={result.brief} />}
          {result && <ResultKoFiCTA />}
        </div>
      </div>
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
            Sumalyze is completely MVP free and run by a nonprofit. A small Ko-fi donation helps keep the servers running.
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
   INTERACTIVE TONE SECTION — "Understand tone before you reply"
   ============================================================ */
function InteractiveToneSection() {
  const toneDemos = [
    {
      label: "The Vague Request",
      original: "Hey, we need that thing we talked about done soon. Let me know when it's ready.",
      analysis: "High uncertainty (70% vagueness). Key context (what 'thing' is, when 'soon' is) is completely missing.",
      intent: "They want progress but haven't specified the scope, placing the burden of clarification on you.",
      reply: "Hi there! Just to confirm, are we referring to the homepage redesign draft? If so, I can have that ready by Friday 2 PM. Let me know if you need it sooner!"
    },
    {
      label: "Passive-Aggressive Email",
      original: "Per my previous email, the deadline was yesterday. I suppose you were occupied with other things.",
      analysis: "Defensive tone (80% passive-aggressive). High emotional intensity.",
      intent: "Blame attribution. Establishing a leverage position due to a missed deadline.",
      reply: "Hi! Apologies for the delay on this. I'm finalizing it now and will have it in your inbox by 3 PM today. Thank you for your patience."
    },
    {
      label: "Urgent Escalation",
      original: "WE HAVE A CRISIS. The server is throwing 500 errors and users can't log in. FIX THIS NOW.",
      analysis: "High panic (95% urgency). Polite levels are near 0%. Needs immediate triage.",
      intent: "Emergency support demand. Critical blocker preventing core business operations.",
      reply: "Hi team, I am investigating this immediately. I've located the server error and am deploying a hotfix now. Expected status resolution: 15 minutes."
    }
  ];

  const [activeToneIdx, setActiveToneIdx] = useState(0);
  const activeTone = toneDemos[activeToneIdx];

  return (
    <section id="tone-presets" style={{ padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>Tone Intelligence</SectionBadge>
        <SectionTitle>Understand tone before you reply</SectionTitle>
        <SectionDesc>AI reads the hidden subtext of chaotic messages and helps you draft de-escalating, professional replies instantly.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginTop: 48 }} className="tone-grid-layout">
          <style>{`
            @media(max-width: 768px) {
              .tone-grid-layout {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
          
          {/* Tone Selector buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {toneDemos.map((td, idx) => (
              <button key={td.label} onClick={() => setActiveToneIdx(idx)}
                style={{
                  textAlign: 'left', padding: '16px', borderRadius: 12,
                  background: activeToneIdx === idx ? 'rgba(226,62,87,0.08)' : 'rgba(255,255,255,0.02)',
                  border: activeToneIdx === idx ? '1px solid rgba(226,62,87,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  color: activeToneIdx === idx ? 'white' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', gap: 4
                }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{td.label}</span>
                <span style={{ fontSize: 11, color: activeToneIdx === idx ? '#ff8fa3' : 'rgba(255,255,255,0.3)' }}>Click to analyze subtext</span>
              </button>
            ))}
          </div>

          {/* Tone Display Board */}
          <div className="hover-card" style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, padding: '28px',
            display: 'flex', flexDirection: 'column', gap: 20,
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(226, 62, 87, 0.2), transparent)' }} />
            
            {/* The Original Text Block */}
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Chaotic Message Received</span>
              <div style={{ marginTop: 8, padding: '14px 18px', borderRadius: 12, background: 'rgba(10,0,15,0.4)', border: '1px solid rgba(255,255,255,0.05)', fontSize: 14, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: '1.6' }}>
                "{activeTone.original}"
              </div>
            </div>

            {/* Split Decoded Result */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="tone-inner-grid">
              <style>{`
                @media(max-width: 540px) {
                  .tone-inner-grid {
                    grid-template-columns: 1fr !important;
                  }
                }
              `}</style>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>◎ Pulse Tone Analysis</span>
                <p style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>{activeTone.analysis}</p>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>◈ Decrypted Intent</span>
                <p style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>{activeTone.intent}</p>
              </div>
            </div>

            {/* Recommended Reply Draft */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>◷ Suggested Reply Draft</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.15)', padding: '12px 16px', borderRadius: 10 }}>
                {activeTone.reply}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   BENTO GRID CORE MODULES — Ten tools. One platform.
   ============================================================ */
function BentoModulesSection() {
  return (
    <section id="modules" style={{ padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>All Modules</SectionBadge>
        <SectionTitle>Ten tools. One workspace.</SectionTitle>
        <SectionDesc>We run ten specialized analysis models simultaneously to inspect your text from every angle.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16, marginTop: 48 }} className="bento-container">
          <style>{`
            @media(max-width: 1024px) {
              .bento-container {
                grid-template-columns: repeat(6, 1fr) !important;
              }
              .bento-col-8, .bento-col-4, .bento-col-6, .bento-col-3 {
                grid-column: span 6 !important;
              }
            }
            @media(max-width: 640px) {
              .bento-container {
                grid-template-columns: 1fr !important;
              }
              .bento-col-8, .bento-col-4, .bento-col-6, .bento-col-3 {
                grid-column: span 1 !important;
              }
            }
          `}</style>

          {/* 1. BRIEF MODULE (Col span 8) */}
          <div className="bento-card bento-col-8" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#E23E57' }}>✦</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#E23E57', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Brief</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 8 }}>Summarize anything in seconds</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', maxWidth: 450 }}>
                Condense long, verbose documents into essential takeaways. Save hours of reading without losing critical insights.
              </p>
            </div>
            
            {/* Visual simulation */}
            <div style={{ display: 'flex', gap: 16, marginTop: 20, alignItems: 'center', background: 'rgba(10,0,15,0.4)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna...
              </div>
              <span style={{ color: '#E23E57', fontSize: 14 }}>➔</span>
              <div style={{ flex: 1, fontSize: 11, color: '#ff8fa3', fontWeight: 500 }}>
                ✓ Distilled to one actionable, core conclusion.
              </div>
            </div>
          </div>

          {/* 2. PULSE MODULE (Col span 4) */}
          <div className="bento-card bento-col-4" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#f472b6' }}>◎</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pulse</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 8 }}>Tone & Emotion</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>
                Uncover emotional signals such as hostility, frustration, or fear.
              </p>
            </div>

            {/* Visual simulation: Mini bar chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
              {[
                { name: 'Urgency', val: 85, col: '#f472b6' },
                { name: 'Politeness', val: 30, col: '#818cf8' }
              ].map(em => (
                <div key={em.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{em.name}</span>
                    <span style={{ color: em.col }}>{em.val}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{ height: '100%', background: em.col, width: `${em.val}%`, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. SIGNALS MODULE (Col span 4) */}
          <div className="bento-card bento-col-4" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#fbbf24' }}>⚠</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Signals</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 8 }}>Risk & Red Flags</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>
                Instantly flag scam attempts, manipulation, or hidden threats.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '6px 10px', borderRadius: 8, marginTop: 14 }}>
              <span style={{ fontSize: 12 }}>🚨</span>
              <span style={{ fontSize: 11, color: '#fde68a', fontWeight: 500 }}>Suspicious Urgency Detected</span>
            </div>
          </div>

          {/* 4. REPLY MODULE (Col span 8) */}
          <div className="bento-card bento-col-8" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#34d399' }}>◷</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reply</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 8 }}>Smart Draft suggestions</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', maxWidth: 450 }}>
                Get custom response recommendations optimized for tone (e.g. empathetic, firm, cooperative) to resolve conflicts and move projects forward.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }} className="bento-replies-flex">
              <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ display: 'block', fontSize: 9, fontWeight: 600, color: '#6ee7b7', marginBottom: 3 }}>FIRM REPLY</span>
                "We require deadline adherence or project cancellation..."
              </div>
              <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ display: 'block', fontSize: 9, fontWeight: 600, color: '#a5b4fc', marginBottom: 3 }}>COOPERATIVE REPLY</span>
                "Let's sync up immediately to resolve blocker issues..."
              </div>
            </div>
          </div>

          {/* 5. SCORE (Col span 3) */}
          <div className="bento-card bento-col-3" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#a78bfa' }}>◆</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'white', marginBottom: 6 }}>Metrics Score</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                Grade clarity, politeness, and professional levels.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>9.2</span>
                <span style={{ display: 'block', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Clarity</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>1.5</span>
                <span style={{ display: 'block', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Risk</span>
              </div>
            </div>
          </div>

          {/* 6. INTENT (Col span 3) */}
          <div className="bento-card bento-col-3" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#818cf8' }}>◈</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Intent</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'white', marginBottom: 6 }}>Hidden Meaning</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                Find the underlying message beneath the fluff.
              </p>
            </div>
            <div style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', padding: '4px 8px', borderRadius: 6, fontSize: 11, color: '#a5b4fc', textAlign: 'center', marginTop: 14 }}>
              Intent: Negotiate Price ◈
            </div>
          </div>

          {/* 7. EXTRACT (Col span 3) */}
          <div className="bento-card bento-col-3" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#22d3ee' }}>◻</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Extract</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'white', marginBottom: 6 }}>Tasks & Dates</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                Pull action items and deadlines out automatically.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14 }}>
              <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(34,211,238,0.1)', color: '#67e8f9', borderRadius: 4 }}>✓ Review Draft</span>
              <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(251,146,60,0.1)', color: '#fdba74', borderRadius: 4 }}>📅 Friday 2pm</span>
            </div>
          </div>

          {/* 8. REWRITE (Col span 3) */}
          <div className="bento-card bento-col-3" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#fb923c' }}>↺</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rewrite</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'white', marginBottom: 6 }}>Style Redraft</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                Transform your draft into custom professional styles.
              </p>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 14, fontStyle: 'italic' }}>
              Casual ➔ Professional
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ============================================================
   BUILT FOR SECTION — B2C + B2B split
   ============================================================ */
function BuiltForSection({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <section style={{ padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>Built for people and teams</SectionBadge>
        <SectionTitle>Whoever you are, we read the room.</SectionTitle>
        <SectionDesc>Sumalyze works for individuals who handle messy communication and teams that process it at scale.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 48 }}>
          {/* For individuals */}
          <div style={{ background: 'rgba(255,255,255,0.013)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>For Individuals</span>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.02em' }}>Stop drowning in text.</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: '20px' }}>One person, one inbox, unlimited complexity. Sumalyze handles the reading so you can focus on the thinking.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '🎓', label: 'Students', desc: 'Summarize papers, extract key arguments, study faster' },
                { icon: '✍️', label: 'Creators', desc: 'Turn rough notes into polished posts and captions' },
                { icon: '💼', label: 'Freelancers', desc: 'Understand client messages, draft better replies' },
                { icon: '🔍', label: 'Job Seekers', desc: 'Decode job offers and recruiter messages' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'white', margin: 0 }}>{row.label}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', lineHeight: '16px' }}>{row.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('usecases')} style={{ padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: '1px solid rgba(129,140,248,0.3)', background: 'rgba(129,140,248,0.08)', color: '#a5b4fc', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(129,140,248,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(129,140,248,0.08)'}>
              See Individual Use Cases →
            </button>
          </div>

          {/* For teams */}
          <div style={{ background: 'rgba(255,255,255,0.013)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>For Teams</span>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.02em' }}>Process communication at scale.</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: '20px' }}>Multiple inboxes, high volume, high stakes. Sumalyze helps teams move faster without missing signals.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '🎧', label: 'Support Teams',        desc: 'Summarize complaints, draft empathetic replies fast' },
                { icon: '📈', label: 'Sales Teams',          desc: 'Extract buying signals and objections from prospects' },
                { icon: '👤', label: 'HR & Recruiting',      desc: 'Summarize candidate notes into structured briefs' },
                { icon: '🏢', label: 'Agencies & Operators', desc: 'Process client feedback without losing the thread' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'white', margin: 0 }}>{row.label}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', lineHeight: '16px' }}>{row.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { onNavigate('usecases'); }} style={{ padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.08)', color: '#34d399', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(52,211,153,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(52,211,153,0.08)'}>
              See Team Use Cases →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MISSION SECTION — MVP Free first, supported by donations
   ============================================================ */
function MissionSection() {
  return (
    <section id="mission" style={{ padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(226,62,87,0.01)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>Our Philosophy</SectionBadge>
        <SectionTitle>MVP Free first, supported by donations</SectionTitle>
        <SectionDesc>We believe advanced text comprehension tools should be private and open. Sumalyze is a nonprofit project.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, marginTop: 48, alignItems: 'center' }} className="mission-grid-layout">
          <style>{`
            @media(max-width: 768px) {
              .mission-grid-layout {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
          
          {/* Left Column: Philosophical overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ fontSize: 24, fontWeight: 500, color: 'white' }}>No paywalls. No subscription trap.</h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
              Most AI productivity tools want a monthly subscription before you can even paste your first document. We built Sumalyze on a different philosophy: it should be accessible to anyone.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
              We do not run advertisements, we do not track your search history, and we do not sell your document data. We are kept online purely through small, voluntary contributions from readers who find our workspace useful.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
              {['No credit card required', 'No tracking pixels', 'Nonprofit status'].map(val => (
                <span key={val} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#34d399' }}>✓</span> {val}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Ledger Transparency Card */}
          <div className="hover-card" style={{
            background: 'linear-gradient(145deg, rgba(226,62,87,0.1) 0%, rgba(10,0,15,0.4) 100%)',
            border: '1px solid rgba(226,62,87,0.22)',
            borderRadius: 20, padding: 28,
            boxShadow: '0 16px 40px rgba(0,0,0,0.4)'
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ff8fa3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Project Ledgers</span>
            <h4 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginTop: 4, marginBottom: 16 }}>Hosting Cost Coverage</h4>
            
            {/* Cost Ledger Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16, marginBottom: 16 }}>
              {[
                { item: 'AI API Processing', cost: '$0.001 / query' },
                { item: 'Server Hosting & Database', cost: '$45 / month' },
                { item: 'SSL & Domain Maintenance', cost: '$12 / year' }
              ].map(row => (
                <div key={row.item} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{row.item}</span>
                  <span style={{ color: 'white', fontFamily: 'monospace' }}>{row.cost}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Average Coffee Support</p>
                <p style={{ fontSize: 20, fontWeight: 600, color: 'white' }}>$3.00 / donor</p>
              </div>
              <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer"
                className="hover-glow"
                style={{
                  padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, color: 'white', textDecoration: 'none',
                  background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                  boxShadow: '0 4px 14px rgba(226,62,87,0.3)', display: 'inline-flex', alignItems: 'center', gap: 6
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

/* ============================================================
   TESTIMONIALS
   ============================================================ */
const TESTIMONIALS = [
  { quote: "Sumalyze flagged a manipulation attempt in a client email I was about to ignore. The Signals module saved the entire project.", name: "Marketing Lead", role: "Agency", initials: "ML" },
  { quote: "I use it every morning to triage my inbox. The Brief + Pulse combo alone saves me 30 minutes a day.", name: "Freelancer", role: "Independent", initials: "FR" },
  { quote: "The fact that it's completely MVP free blew my mind. The reply suggestions are genuinely good — like having an editor on call.", name: "Support Manager", role: "SaaS", initials: "SM" },
  { quote: "I used the Intent module to prep for a negotiation. Spotted the leverage the other party was hiding in plain sight.", name: "Founder", role: "Startup", initials: "FO" },
  { quote: "Clean + Rewrite turned my rushed draft into something I was actually proud to send. Took 10 seconds.", name: "Content Writer", role: "Media", initials: "CW" },
  { quote: "As someone who struggles with reading tone in texts, Pulse has genuinely changed how I communicate.", name: "Remote Worker", role: "Tech", initials: "RW" },
];

function TestimonialsSection() {
  return (
    <section style={{ padding: '0 20px 120px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>Beta Feedback</SectionBadge>
        <SectionTitle>What people say</SectionTitle>
        <SectionDesc>Impressions from early beta users and testers during our closed preview.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 52 }} className="testimonials-masonry">
          <style>{`
            @media(min-width: 900px) {
              .testimonials-masonry {
                grid-template-columns: repeat(3, 1fr) !important;
              }
              .testimonials-masonry > div:nth-child(3n+2) {
                transform: translateY(16px);
              }
            }
          `}</style>
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} id={`testimonial-${idx}`} className="hover-card" style={{ background: 'rgba(255,255,255,0.012)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: '24px', flex: 1, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(226,62,87,0.15)', border: '1px solid rgba(226,62,87,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#ff8fa3', flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA
   ============================================================ */
function FinalCTA({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <section style={{ padding: '0 20px 120px', textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(226,62,87,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
        <SectionBadge>Get Started</SectionBadge>
        <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: '1.1', letterSpacing: '-0.03em', margin: '0 0 20px' }}>
          <span style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>
            Start understanding
          </span>
          <span style={{ background: 'linear-gradient(180deg, #ff8fa3 0%, #E23E57 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>
            every message.
          </span>
        </h2>
        <p style={{ fontSize: 18, color: 'rgba(239,237,253,0.65)', lineHeight: '28px', marginBottom: 40 }}>
          MVP Free. No account required. Just paste and analyze.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('agent')} style={{ padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, color: '#f4f0ff', border: '1px solid rgba(207,184,255,0.2)', background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)', boxShadow: 'inset 0 0 12px rgba(191,151,255,0.24)', backdropFilter: 'blur(8px)', cursor: 'pointer', fontFamily: 'inherit' }}>
            Try Agent Mode ✧
          </button>
          <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer" style={{ padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
            ♥ Support on Ko-fi
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
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
              MVP Free nonprofit AI communication intelligence platform.
            </p>
          </div>

          {/* Nav columns */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Product</p>
              {(['tools','agent','workflows','usecases'] as const).map(p => (
                <button key={p} onClick={() => onNavigate(p)} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s', textTransform: 'capitalize' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                  {p === 'usecases' ? 'Use Cases' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <FooterCol label="Mission" links={[
              { l: 'Our Philosophy', h: '#mission' },
              { l: 'Support on Ko-fi', h: 'https://ko-fi.com/sumalyze' },
              { l: 'Contact', h: 'mailto:hello@sumalyze.space' },
            ]} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Legal</p>
              <button onClick={() => onNavigate('privacy')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Privacy Policy
              </button>
              <button onClick={() => onNavigate('terms')} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} Sumalyze · Nonprofit AI communication platform</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>Made with ♥ for clearer communication</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ label, links }: { label: string; links: { l: string; h: string }[] }) {
  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{label}</p>
      {links.map(link => (
        <a key={link.l} href={link.h}
          target={link.h.startsWith('http') ? '_blank' : undefined}
          rel={link.h.startsWith('http') ? 'noopener noreferrer' : undefined}
          style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
          {link.l}
        </a>
      ))}
    </div>
  );
}

/* ============================================================
   SHARED COMPONENTS
   ============================================================ */
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', margin: '0 auto 16px',
      padding: '6px 14px', borderRadius: 32,
      backdropFilter: 'blur(6px)', boxShadow: 'inset 0 -7px 11px rgba(226,62,87,0.08)',
      background: 'rgba(226,62,87,0.06)', border: '1px solid rgba(226,62,87,0.2)',
    }}>
      <span style={{ fontSize: 13, fontWeight: 500, background: 'linear-gradient(90deg, #ff8fa3 0%, #E23E57 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{children}</span>
    </div>
  );
}

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
