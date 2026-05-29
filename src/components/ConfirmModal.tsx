// src/components/ConfirmModal.tsx

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          animation: 'backdropFadeIn 0.2s ease both',
        }}
      />

      {/* Modal Dialog */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: 'calc(100% - 32px)',
          maxWidth: 400,
          background: 'rgba(14, 4, 22, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: '24px 28px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.8), inset 0 0 16px rgba(255, 255, 255, 0.01)',
          animation: 'modalFadeInCenter 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
          boxSizing: 'border-box',
        }}
      >
        {/* Top gradient border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: isDestructive
              ? 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(226, 62, 87, 0.5), transparent)',
          }}
        />

        {/* Content */}
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'white',
            marginBottom: 12,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.5)',
            lineHeight: '22px',
            marginBottom: 24,
          }}
        >
          {message}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '9px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              background: isDestructive
                ? 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)'
                : 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
              color: 'white',
              boxShadow: isDestructive
                ? '0 4px 16px rgba(239, 68, 68, 0.25)'
                : '0 4px 16px rgba(226, 62, 87, 0.25)',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
