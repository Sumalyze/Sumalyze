import { useEffect, useRef, useState } from 'react';

const STORY_SECTION_HEIGHT = '220vh';

interface HexagonStep {
  title: string;
  desc: string;
  accent: string;
  icon: React.ReactNode;
}

export default function WhySumalyzeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const hexagonRefs = useRef<(SVGPolygonElement | null)[]>([]);
  const hexagonClipRef = useRef<SVGPolygonElement>(null);
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const centerRefText = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const checkMotion = () => {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkViewport();
    checkMotion();

    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    if (isMobile || reducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollAnimations();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateScrollAnimations = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      const start = containerTop;
      const end = containerTop + containerHeight - windowHeight;

      const currentScroll = window.scrollY;
      let progress = 0;

      if (currentScroll > start) {
        progress = (currentScroll - start) / (end - start);
      }
      progress = Math.max(0, Math.min(1, progress));

      const dashLength = 1000; // Safe perimeter for r=160 hexagon to ensure complete drawing and hide initial lines

      // 1. Hexagon drawing staggered (from 0.0 to 0.50 progress)
      for (let i = 0; i < 3; i++) {
        const hex = hexagonRefs.current[i];
        if (hex) {
          const startDraw = i * 0.10;
          const drawProgress = Math.max(0, Math.min(1, (progress - startDraw) / 0.30));
          const offset = dashLength - drawProgress * dashLength;
          hex.style.strokeDashoffset = `${offset}`;
        }
      }

      // Draw the duplicate weave hexagon in sync with Hexagon 0
      const hexClip = hexagonClipRef.current;
      if (hexClip) {
        const drawProgress = Math.max(0, Math.min(1, progress / 0.30));
        const offset = dashLength - drawProgress * dashLength;
        hexClip.style.strokeDashoffset = `${offset}`;
      }

      // 2. Texts / Icons fading staggered (from 0.50 to 0.85 progress)
      for (let i = 0; i < 3; i++) {
        const gp = groupRefs.current[i];
        if (gp) {
          const startFade = 0.50 + i * 0.10;
          const opacity = Math.max(0, Math.min(1, (progress - startFade) / 0.15));
          const translateY = 15 - opacity * 15;
          gp.style.opacity = `${opacity}`;
          gp.style.transform = `translateY(${translateY}px)`;
        }
      }

      // 3. Central logo text fade & scale (from 0.80 to 0.95 progress)
      const centerLogo = centerRefText.current;
      if (centerLogo) {
        const startFade = 0.78;
        const opacity = Math.max(0, Math.min(1, (progress - startFade) / 0.17));
        const scale = 0.75 + opacity * 0.25;
        centerLogo.style.opacity = `${opacity}`;
        centerLogo.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollAnimations();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, reducedMotion]);

  const isStatic = isMobile || reducedMotion;

  // 3 steps representing the core pillars of Sumalyze in logo-consistent color accents
  const steps: HexagonStep[] = [
    {
      title: 'Save time',
      desc: 'Understand text faster.',
      accent: '#ff8fa3', // Light pink highlight for icon contrast
      icon: (
        <>
          <path d="M-8,-14 L2,-14 L10,-6 L10,14 L-8,14 Z" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M2,-14 L2,-6 L10,-6" strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="-4" y1="-2" x2="6" y2="-2" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="-4" y1="3" x2="6" y2="3" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="-4" y1="8" x2="2" y2="8" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )
    },
    {
      title: 'Reduce noise',
      desc: 'Get only what matters.',
      accent: '#ff8fa3',
      icon: (
        <path d="M-10,-10 L10,-10 L4,-2 L4,10 L-4,6 L-4,-2 Z" strokeWidth="1.8" strokeLinejoin="round" />
      )
    },
    {
      title: 'Take action',
      desc: 'Get replies & tasks.',
      accent: '#ff8fa3',
      icon: (
        <>
          <rect x="-9" y="-9" width="18" height="18" rx="3" strokeWidth="1.8" />
          <path d="M-4,0 L-1,3 L5,-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )
    }
  ];

  // Centers of the 3 hexagons distributed around centroid (400, 300) with radius R = 160 (interlocking & spacious spacing)
  const centers = [
    { cx: 400, cy: 170 },      // Step 1: Top (d = 130)
    { cx: 512.6, cy: 365 },    // Step 2: Bottom Right (d = 130)
    { cx: 287.4, cy: 365 }     // Step 3: Bottom Left (d = 130)
  ];

  // Spacing for the step content groups so they center beautifully within the visible areas of the hexagons
  const contentCenters = [
    { cx: 400, cy: 150 },      // Step 1: Top (shifted up to clear center label)
    { cx: 527.6, cy: 380 },    // Step 2: Bottom Right (shifted down-right)
    { cx: 272.4, cy: 380 }     // Step 3: Bottom Left (shifted down-left)
  ];

  // Vertices relative offset mapping for a regular pointy-topped hexagon (radius 160)
  const hexagonPoints = (cx: number, cy: number) => {
    return `${cx},${cy - 160} ${cx + 138.6},${cy - 80} ${cx + 138.6},${cy + 80} ${cx},${cy + 160} ${cx - 138.6},${cy + 80} ${cx - 138.6},${cy - 80}`;
  };

  return (
    <div ref={containerRef} style={{ height: isStatic ? 'auto' : STORY_SECTION_HEIGHT, position: 'relative', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      
      {/* Sticky layout container */}
      <div 
        ref={stickyRef}
        style={{ 
          position: isStatic ? 'relative' : 'sticky', 
          top: isStatic ? '0' : '80px', 
          height: isStatic ? 'auto' : '80vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden',
          padding: isStatic ? '60px 20px' : '0 20px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', zIndex: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>
              Why Sumalyze?
            </span>
            <h2 style={{
              fontFamily: "Outfit, Inter, system-ui, sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(28px, 4vw, 44px)',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              maxWidth: 800,
              margin: '0 auto'
            }}>
              Because reading everything is not productivity.
            </h2>
          </div>

          {/* Infographic Wrapper */}
          <div 
            className="venn-wrapper"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: isStatic ? '450px' : '550px',
              position: 'relative'
            }}
          >
            <style>{`
              .venn-container {
                position: relative;
                width: 800px;
                height: 540px;
                transition: transform 0.3s ease;
              }
              .venn-desktop-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
              }
              .venn-mobile-wrapper {
                display: none;
              }
              @media (max-width: 820px) {
                .venn-container {
                  transform: scale(0.8);
                  margin: -40px 0;
                }
              }
              @media (max-width: 650px) {
                .venn-container {
                  transform: scale(0.65);
                  margin: -80px 0;
                }
              }
              @media (max-width: 500px) {
                .venn-container {
                  transform: scale(0.5);
                  margin: -110px 0;
                }
              }
              @media (max-width: 767px) {
                .venn-desktop-wrapper {
                  display: none;
                }
                .venn-mobile-wrapper {
                  display: flex;
                  flex-direction: column;
                  gap: 24px;
                  width: 100%;
                  max-width: 450px;
                  margin: 20px auto 0 auto;
                }
              }
              @keyframes drawCircle {
                to { stroke-dashoffset: 0; }
              }
              @keyframes fadeInUp {
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes popIn {
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              }
              @keyframes pulseHexGlow {
                0%, 100% { filter: drop-shadow(0 0 8px rgba(226, 62, 87, 0.28)); }
                50% { filter: drop-shadow(0 0 20px rgba(226, 62, 87, 0.55)); }
              }
              .hexagon-glow {
                animation: pulseHexGlow 4s ease-in-out infinite;
              }
            `}</style>

            <div className="venn-container">
              
              <div className="venn-desktop-wrapper">
                <svg 
                  viewBox="0 0 800 540"
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%',
                    zIndex: 2
                  }}
                >
                  <defs>
                    {/* Hexagon Gradients matching the design logo gradient (#E23E57 -> #88304E) */}
                    <linearGradient id="grad-hex-logo" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E23E57" />
                      <stop offset="100%" stopColor="#88304E" />
                    </linearGradient>

                    {/* Left half clip-path to weave Hexagon 0 over Hexagon 2 */}
                    <clipPath id="weave-clip-path">
                      <rect x="50" y="10" width="348" height="380" />
                    </clipPath>
                  </defs>

                  {/* Draw Hexagons sequentially */}
                  {/* Hexagon 0 (Top) */}
                  <polygon
                    ref={el => { hexagonRefs.current[0] = el; }}
                    points={hexagonPoints(centers[0].cx, centers[0].cy)}
                    fill="rgba(10, 0, 15, 0.55)"
                    stroke="url(#grad-hex-logo)"
                    strokeWidth="8"
                    className="hexagon-glow"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: isStatic ? '0' : '1000',
                      animation: isStatic ? 'drawCircle 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' : 'none',
                      transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      strokeLinejoin: 'round',
                      strokeLinecap: 'round'
                    }}
                  />

                  {/* Hexagon 1 (Bottom Right) */}
                  <polygon
                    ref={el => { hexagonRefs.current[1] = el; }}
                    points={hexagonPoints(centers[1].cx, centers[1].cy)}
                    fill="rgba(10, 0, 15, 0.55)"
                    stroke="url(#grad-hex-logo)"
                    strokeWidth="8"
                    className="hexagon-glow"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: isStatic ? '0' : '1000',
                      animation: isStatic ? 'drawCircle 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards' : 'none',
                      transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      strokeLinejoin: 'round',
                      strokeLinecap: 'round'
                    }}
                  />

                  {/* Hexagon 2 (Bottom Left) */}
                  <polygon
                    ref={el => { hexagonRefs.current[2] = el; }}
                    points={hexagonPoints(centers[2].cx, centers[2].cy)}
                    fill="rgba(10, 0, 15, 0.55)"
                    stroke="url(#grad-hex-logo)"
                    strokeWidth="8"
                    className="hexagon-glow"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: isStatic ? '0' : '1000',
                      animation: isStatic ? 'drawCircle 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards' : 'none',
                      transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      strokeLinejoin: 'round',
                      strokeLinecap: 'round'
                    }}
                  />

                  {/* Redraw Left Half of Hexagon 0 for under-over Borromean weave */}
                  <polygon
                    ref={hexagonClipRef}
                    points={hexagonPoints(centers[0].cx, centers[0].cy)}
                    clipPath="url(#weave-clip-path)"
                    fill="rgba(10, 0, 15, 0.55)"
                    stroke="url(#grad-hex-logo)"
                    strokeWidth="8"
                    className="hexagon-glow"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: isStatic ? '0' : '1000',
                      animation: isStatic ? 'drawCircle 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' : 'none',
                      transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      strokeLinejoin: 'round',
                      strokeLinecap: 'round',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Decoupled layout translation groups for absolute positioning */}
                  {steps.map((item, idx) => (
                    <g
                      key={idx}
                      transform={`translate(${contentCenters[idx].cx}, ${contentCenters[idx].cy})`}
                    >
                      {/* Nested transition group so translate positioning doesn't get overridden by translateY */}
                      <g
                        ref={el => { groupRefs.current[idx] = el; }}
                        style={{
                          opacity: isStatic ? 1 : 0,
                          transform: isStatic ? 'none' : 'translateY(15px)',
                          animation: isStatic ? 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards' : 'none',
                          transition: 'opacity 0.4s ease, transform 0.4s ease',
                          pointerEvents: 'none'
                        }}
                      >
                        {/* Step Number */}
                        <text
                          y="-60"
                          fontFamily="Outfit, sans-serif"
                          fontSize="13"
                          fontWeight="800"
                          fill="#ff8fa3"
                          opacity="0.6"
                          letterSpacing="0.08em"
                          textAnchor="middle"
                        >
                          {`0${idx + 1}`}
                        </text>

                        {/* SVG Icon */}
                        <g 
                          transform="translate(0, -15) scale(1.4)" 
                          stroke={item.accent} 
                          fill="none" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          style={{ filter: `drop-shadow(0 0 6px ${item.accent}40)` }}
                        >
                          {item.icon}
                        </g>

                        {/* Step Title */}
                        <text
                          y="35"
                          fontFamily="Outfit, sans-serif"
                          fontSize="15"
                          fontWeight="700"
                          fill="white"
                          textAnchor="middle"
                        >
                          {item.title}
                        </text>

                        {/* Step Description */}
                        <text
                          y="56"
                          fontFamily="Inter, system-ui, sans-serif"
                          fontSize="11"
                          fontWeight="500"
                          fill="rgba(255, 255, 255, 0.55)"
                          textAnchor="middle"
                        >
                          {item.desc}
                        </text>
                      </g>
                    </g>
                  ))}
                </svg>

                {/* Absolute Center Label */}
                <div 
                  ref={centerRefText}
                  style={{
                    position: 'absolute',
                    top: '300px',
                    left: '400px',
                    transform: isStatic ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.75)',
                    opacity: isStatic ? 1 : 0,
                    animation: isStatic ? 'popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s forwards' : 'none',
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    background: 'radial-gradient(circle, rgba(10, 0, 15, 1) 0%, rgba(10, 0, 15, 0.95) 30%, rgba(10, 0, 15, 0.8) 50%, rgba(10, 0, 15, 0) 70%)',
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                    padding: '20px'
                  }}
                >
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '13px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.25)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>SUMALYZE</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', textShadow: '0 0 15px rgba(226, 62, 87, 0.4)', lineHeight: 1.1, marginBottom: '2px' }}>CLARITY</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', fontWeight: 600, color: '#ff8fa3', letterSpacing: '0.12em', textTransform: 'uppercase' }}>WORKFLOW</span>
                </div>
              </div>

              {/* Mobile stacked layout */}
              <div className="venn-mobile-wrapper">
                <div style={{
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, rgba(226, 62, 87, 0.15) 0%, rgba(136, 48, 78, 0.05) 100%)',
                  border: '1px solid rgba(226, 62, 87, 0.3)',
                  padding: '16px 28px',
                  borderRadius: '16px',
                  width: '100%',
                  boxSizing: 'border-box',
                  boxShadow: '0 4px 30px rgba(226, 62, 87, 0.05)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>SUMALYZE</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', textShadow: '0 0 15px rgba(226, 62, 87, 0.4)', lineHeight: 1.1, marginBottom: '2px' }}>CLARITY</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', fontWeight: 600, color: '#ff8fa3', letterSpacing: '0.12em', textTransform: 'uppercase' }}>WORKFLOW</div>
                </div>

                {steps.map((item, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(10, 0, 15, 0.55)',
                    border: '1.5px solid rgba(226, 62, 87, 0.35)',
                    borderRadius: '16px',
                    padding: '24px',
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '32px',
                      width: '50px',
                      height: '50px',
                      background: 'rgba(226, 62, 87, 0.15)',
                      filter: 'blur(15px)',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }} />
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '12px', fontWeight: 800, color: '#ff8fa3', opacity: 0.6, letterSpacing: '0.08em', marginBottom: '8px', zIndex: 2 }}>0{idx + 1}</span>
                    <div style={{ color: item.accent, marginBottom: '16px', transform: 'scale(1.3)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="-15 -15 30 30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                        {item.icon}
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'white', marginBottom: '8px', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em', zIndex: 2 }}>{item.title}</h3>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.45', margin: 0, fontFamily: 'Inter, system-ui, sans-serif', zIndex: 2 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
