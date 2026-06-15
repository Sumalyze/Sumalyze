import { useState, useEffect } from 'react';

interface TypedLogoProps {
  logoUrl: string;
  onClick: (e: React.MouseEvent) => void;
}

export default function TypedLogo({ logoUrl, onClick }: TypedLogoProps) {
  const text = "Sumalyze";
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href="/"
      onClick={onClick}
      className="restore-fonts"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        textDecoration: 'none',
        color: 'white',
        zIndex: 2,
        cursor: 'pointer',
      }}
    >
      <img src={logoUrl} alt="Sumalyze logo" style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />
      <span style={{ 
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif', 
        fontSize: 16, 
        fontWeight: 500, 
        letterSpacing: '-0.01em', 
        display: 'flex', 
        alignItems: 'center',
        minHeight: '24px',
      }}>
        {displayedText}
        {displayedText.length < text.length && (
          <span className="logo-cursor" style={{ color: '#E23E57', fontWeight: 400 }}>|</span>
        )}
      </span>
    </a>
  );
}
