import sumalyzeLogo from '../assets/sumalyzelogo.png';

interface PageCurtainTransitionProps {
  transitionState: 'idle' | 'covering' | 'revealing';
}

export default function PageCurtainTransition({ transitionState }: PageCurtainTransitionProps) {
  if (transitionState === 'idle') return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #100216 0%, #050007 100%)',
        zIndex: 9999,
        pointerEvents: 'all',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={transitionState === 'covering' ? 'curtain-in' : 'curtain-out'}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
        className="curtain-content"
      >
        <img 
          src={sumalyzeLogo} 
          alt="Sumalyze" 
          style={{ 
            width: 48, 
            height: 48, 
            objectFit: 'contain',
          }} 
          className="curtain-logo"
        />
        <span style={{ 
          fontFamily: 'Outfit, sans-serif', 
          fontSize: 18, 
          fontWeight: 600, 
          letterSpacing: '0.1em', 
          color: 'white',
        }}>
          SUMALYZE
        </span>
      </div>
    </div>
  );
}
