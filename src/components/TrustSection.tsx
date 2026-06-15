import { Shield, EyeOff, Server, Database } from 'lucide-react';

export default function TrustSection() {
  return (
    <section 
      style={{ 
        padding: '100px 20px', 
        background: 'rgba(10,0,15,0.25)', 
        borderTop: '1px solid rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden'
      }}
    >
      {/* Background glow shadow */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1000px', height: '400px', background: 'radial-gradient(50% 50% at 50% 50%, rgba(129, 140, 248, 0.04) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* The Privacy Card */}
        <div className="restore-fonts" style={{
          width: '100%',
          background: 'radial-gradient(100% 100% at 50% 0%, rgba(129, 140, 248, 0.05) 0%, rgba(10, 0, 15, 0.4) 100%)',
          border: '1px solid rgba(129, 140, 248, 0.16)',
          borderRadius: 8,
          padding: '50px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 30px rgba(129, 140, 248, 0.03), 0 20px 50px rgba(0,0,0,0.5)',
          boxSizing: 'border-box'
        }}>
          {/* Subtle top border glow */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(165, 180, 252, 0.4), transparent)' }} />
          
          <div style={{
            fontSize: 'clamp(20px, 3vw, 24px)',
            color: '#a5b4fc',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 600,
            fontFamily: 'Outfit, Inter, sans-serif',
            textShadow: '0 0 15px rgba(165, 180, 252, 0.25)'
          }}>
            <span>🛡️</span> Your text stays your text.
          </div>
          
          <p style={{
            fontSize: '15px',
            color: 'rgba(239, 237, 253, 0.75)',
            lineHeight: '25px',
            margin: 0,
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            No public sharing. No unnecessary noise. Built for private work, notes, emails, and documents.
          </p>

          {/* Logical Security Highlights */}
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '16px'
          }}>
            
            {/* Point 1: Zero Data Retention */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(129, 140, 248, 0.08)', border: '1px solid rgba(129, 140, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Server size={18} color="#a5b4fc" style={{ filter: 'drop-shadow(0 0 8px rgba(165, 180, 252, 0.5))' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 3px 0', fontFamily: 'Outfit, Inter, sans-serif' }}>Zero Data Retention</h4>
                <p style={{ fontSize: '13px', color: 'rgba(239, 237, 253, 0.45)', lineHeight: '1.4', margin: 0, fontFamily: 'Inter, sans-serif' }}>We process your inputs in volatile memory and wipe them instantly when the analysis finishes.</p>
              </div>
            </div>

            {/* Point 2: No AI Model Training */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(129, 140, 248, 0.08)', border: '1px solid rgba(129, 140, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} color="#a5b4fc" style={{ filter: 'drop-shadow(0 0 8px rgba(165, 180, 252, 0.5))' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 3px 0', fontFamily: 'Outfit, Inter, sans-serif' }}>No AI Model Training</h4>
                <p style={{ fontSize: '13px', color: 'rgba(239, 237, 253, 0.45)', lineHeight: '1.4', margin: 0, fontFamily: 'Inter, sans-serif' }}>Your uploaded files, emails, or drafts are never used to train ChatGPT, Claude, or any third-party AI model.</p>
              </div>
            </div>

            {/* Point 3: End-to-End SSL/TLS */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(129, 140, 248, 0.08)', border: '1px solid rgba(129, 140, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={18} color="#a5b4fc" style={{ filter: 'drop-shadow(0 0 8px rgba(165, 180, 252, 0.5))' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 3px 0', fontFamily: 'Outfit, Inter, sans-serif' }}>TLS 1.3 Transport Security</h4>
                <p style={{ fontSize: '13px', color: 'rgba(239, 237, 253, 0.45)', lineHeight: '1.4', margin: 0, fontFamily: 'Inter, sans-serif' }}>Your texts are encrypted in transit using industry-standard TLS 1.3 encryption protocols, blocking any eavesdropping.</p>
              </div>
            </div>

            {/* Point 4: Local History Sandbox */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(129, 140, 248, 0.08)', border: '1px solid rgba(129, 140, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EyeOff size={18} color="#a5b4fc" style={{ filter: 'drop-shadow(0 0 8px rgba(165, 180, 252, 0.5))' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 3px 0', fontFamily: 'Outfit, Inter, sans-serif' }}>Local-First Privacy</h4>
                <p style={{ fontSize: '13px', color: 'rgba(239, 237, 253, 0.45)', lineHeight: '1.4', margin: 0, fontFamily: 'Inter, sans-serif' }}>Your analytical history sits safely in your local browser sandbox (IndexedDB) and is never synced to the cloud.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
