import React from 'react';

interface LiquidNavIndicatorProps {
  style: React.CSSProperties;
}

export default function LiquidNavIndicator({ style }: LiquidNavIndicatorProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      style={{
        position: 'absolute',
        transition: prefersReducedMotion ? 'none' : 'all 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
        background: 'rgba(226, 62, 87, 0.12)',
        border: '1px solid rgba(226, 62, 87, 0.25)',
        boxShadow: '0 0 12px rgba(226, 62, 87, 0.1)',
        borderRadius: 6,
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  );
}
