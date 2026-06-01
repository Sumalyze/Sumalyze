import { useEffect, useRef, useState } from 'react';

export default function DemoRevealSection({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
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
          updateClipPath();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateClipPath = () => {
      const container = containerRef.current;
      const line = lineRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when top is at 85% of viewport height
      // Fully revealed when top is at 55% of viewport height
      const startReveal = windowHeight * 0.85;
      const endReveal = windowHeight * 0.55;

      let progress = 0;
      if (rect.top < startReveal) {
        progress = (startReveal - rect.top) / (startReveal - endReveal);
      }
      progress = Math.max(0, Math.min(1, progress));

      // Calculate clip path percentage (0% to 100%)
      const clipPercent = progress * 100;

      // Apply directly to DOM for 60fps performance
      container.style.clipPath = `polygon(0 0, ${clipPercent}% 0, ${clipPercent}% 100%, 0 100%)`;

      if (line) {
        line.style.left = `${clipPercent}%`;
        // Hide scanner line when fully closed or fully open
        if (clipPercent <= 0.5 || clipPercent >= 99.5) {
          line.style.opacity = '0';
        } else {
          line.style.opacity = '1';
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateClipPath();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, reducedMotion]);

  if (isMobile || reducedMotion) {
    return <div style={{ position: 'relative', width: '100%' }}>{children}</div>;
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Clipped Content Layer */}
      <div
        ref={containerRef}
        style={{
          transition: 'clip-path 0.1s ease-out',
          clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)',
          willChange: 'clip-path',
          width: '100%',
        }}
      >
        {children}
      </div>

      {/* Scanner Edge Line Overlay */}
      <div
        ref={lineRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '0%',
          width: '2px',
          background: 'linear-gradient(180deg, rgba(255,143,163,0.1) 0%, #ff8fa3 50%, rgba(255,143,163,0.1) 100%)',
          boxShadow: '0 0 10px #ff8fa3, 0 0 20px #ff8fa3',
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'left, opacity',
          transition: 'left 0.1s ease-out, opacity 0.2s ease',
          zIndex: 5,
        }}
      />
    </div>
  );
}
