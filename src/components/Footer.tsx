export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative pt-16 pb-10 overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(226,62,87,0.3), transparent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">

        {/* Main row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', boxShadow: '0 4px 12px rgba(226,62,87,0.3)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 5h12M3 9h8M3 13h10" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
                  <circle cx="14" cy="13" r="2.5" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              <span className="font-display font-semibold text-[17px] text-white tracking-tight">Sumalyze</span>
            </div>
            <p className="text-muted text-sm max-w-xs leading-relaxed">
              Free nonprofit AI communication intelligence. No paywalls, no subscriptions.
            </p>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-3">Product</p>
              <div className="space-y-2">
                <a href="#features" className="nav-link block text-sm">Features</a>
                <a href="#demo" className="nav-link block text-sm">Demo</a>
                <a href="#use-cases" className="nav-link block text-sm">Use Cases</a>
              </div>
            </div>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-3">Mission</p>
              <div className="space-y-2">
                <a href="#nonprofit" className="nav-link block text-sm">Nonprofit</a>
                <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer" className="nav-link block text-sm">Ko-fi</a>
                <a href="mailto:hello@sumalyze.com" className="nav-link block text-sm">Contact</a>
              </div>
            </div>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-3">Legal</p>
              <div className="space-y-2">
                <a href="#" className="nav-link block text-sm">Privacy</a>
                <a href="#" className="nav-link block text-sm">Terms</a>
              </div>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
          <p className="text-muted text-xs">
            © {year} Sumalyze · Nonprofit AI communication platform
          </p>
          <div className="flex items-center gap-2 text-muted text-xs">
            <span>Made with</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="#E23E57">
              <path d="M6 10.5l-.7-.64C2.4 7.18 0 5.2 0 2.75 0 1.23 1.12 0 2.5 0c.87 0 1.71.44 2.25 1.09A2.88 2.88 0 016.75 0C8.08 0 9.2 1.23 9.2 2.75c0 2.45-2.4 4.43-5.5 7.11L6 10.5z" />
            </svg>
            <span>for clearer communication</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
