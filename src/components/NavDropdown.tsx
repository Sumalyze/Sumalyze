import { useEffect, useRef } from 'react';
import type { ToolDef } from '../data/tools';

interface NavDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (p: any) => void;
  onNavigateTool: (slug: string) => void;
  currentPage: string;
  tools: ToolDef[];
}

export default function NavDropdown({
  isOpen,
  onClose,
  onNavigate,
  onNavigateTool,
  currentPage,
  tools
}: NavDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="nav-dropdown"
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(10,3,15,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        minWidth: 680,
        boxShadow: '0 32px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(226,62,87,0.03)',
        zIndex: 200,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Left Column: Workspace Core */}
      <div style={{
        width: 250,
        padding: '24px 20px',
        background: 'rgba(255,255,255,0.01)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 11,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          Workspace
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => { onClose(); onNavigate('agent'); }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              borderRadius: 8,
              background: currentPage === 'agent' ? 'rgba(226,62,87,0.08)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            className="dropdown-left-item"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#E23E57', fontSize: 14 }}>✦</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Agent Mode</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, paddingLeft: 18 }}>
              Autonomous multi-step research agent
            </div>
          </button>

          <button
            onClick={() => { onClose(); onNavigate('workflows'); }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              borderRadius: 8,
              background: currentPage === 'workflows' ? 'rgba(226,62,87,0.08)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            className="dropdown-left-item"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#818cf8', fontSize: 14 }}>◈</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Workflows</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, paddingLeft: 18 }}>
              Complex analysis pipelines
            </div>
          </button>

          <button
            onClick={() => { onClose(); onNavigate('usecases'); }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              borderRadius: 8,
              background: currentPage === 'usecases' ? 'rgba(226,62,87,0.08)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            className="dropdown-left-item"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#34d399', fontSize: 14 }}>◎</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Use Cases</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, paddingLeft: 18 }}>
              Industry-specific playbooks
            </div>
          </button>
        </div>
      </div>

      {/* Right Column: AI Tools Grid */}
      <div style={{
        flex: 1,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 11,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          AI Tools
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {tools.slice(0, 6).map(tool => (
            <button key={tool.id}
              onClick={() => { onClose(); onNavigateTool(tool.slug); }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
              className="dropdown-grid-item"
            >
              <div style={{
                width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                background: `${tool.accent}12`, border: `1px solid ${tool.accent}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: tool.accent
              }}>
                {tool.icon}
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'white', margin: 0, lineHeight: '1.2' }}>{tool.name}</p>
                <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', lineHeight: '1.3' }}>{tool.description.split('.')[0]}.</p>
              </div>
            </button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>11+ specialized tools available</span>
          <button onClick={() => { onClose(); onNavigate('tools'); }}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: 'rgba(226,62,87,0.08)',
              border: '1px solid rgba(226,62,87,0.2)',
              color: '#ff8fa3',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            className="dropdown-view-all-btn"
          >
            View all tools →
          </button>
        </div>
      </div>
    </div>
  );
}
