import { useState, useEffect } from 'react';

interface HeaderProps {
  onTryDemo?: () => void;
}

export default function Header({ onTryDemo }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/5 py-3'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group" aria-label="Sumalyze home">
            {/* Logomark */}
            <div className="relative w-8 h-8 shrink-0">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', boxShadow: '0 4px 12px rgba(226,62,87,0.35)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 5h12M3 9h8M3 13h10" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
                  <circle cx="14" cy="13" r="2.5" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
            </div>
            <span className="font-display font-semibold text-[17px] tracking-tight text-white">
              Sumalyze
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            <a href="#features" className="nav-link px-4 py-2 rounded-xl hover:bg-white/5 transition-all">Features</a>
            <a href="#demo" className="nav-link px-4 py-2 rounded-xl hover:bg-white/5 transition-all">Demo</a>
            <a href="#use-cases" className="nav-link px-4 py-2 rounded-xl hover:bg-white/5 transition-all">Use Cases</a>
            <a href="#nonprofit" className="nav-link px-4 py-2 rounded-xl hover:bg-white/5 transition-all">Mission</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://ko-fi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost px-4 py-2.5 rounded-xl text-sm"
            >
              ♥ Support Us
            </a>
            <button
              id="header-try-demo"
              onClick={onTryDemo}
              className="btn-primary px-5 py-2.5 rounded-xl text-sm"
            >
              Try Demo
            </button>
          </div>

          {/* Mobile CTA */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-try-demo"
              onClick={onTryDemo}
              className="btn-primary px-4 py-2 rounded-xl text-sm"
            >
              Try Demo
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
