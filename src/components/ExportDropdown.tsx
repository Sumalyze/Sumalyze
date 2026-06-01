// TODO: Integrate Paddle Plan/Usage Gating here when premium tiers launch.
// For example, restrict PDF/DOCX downloads or high-volume exports to 'pro' plan users:
// if (format === 'pdf' || format === 'docx') {
//   if (userPlan !== 'pro') {
//     toast.error("PDF/DOCX exports are only available on the Pro plan. Please upgrade.");
//     return;
//   }
// }

import { useState, useRef, useEffect } from 'react';
import { Download, Copy, FileText, ChevronDown } from 'lucide-react';
import { useToast } from './Toast';
import { useAuth } from '../hooks/useAuth';
import { captureEvent } from '../lib/analytics';
import { useCurrentPlan } from '../hooks/useCurrentPlan';
import { dispatchAppNavigate } from '../utils/navigation';
import {
  copyToClipboard,
  generateExportFilename,
  exportTxt,
  exportMarkdown,
  exportPdf,
  exportDocx,
} from '../lib/exportUtils';

interface ExportDropdownProps {
  content: string;
  toolName: string;
}

export default function ExportDropdown({ content, toolName }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { user } = useAuth();
  
  const isLoggedIn = !!user;
  const { plan } = useCurrentPlan();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = async (format: 'clipboard' | 'txt' | 'markdown' | 'pdf' | 'docx') => {
    setIsOpen(false);
    
    if (!content) {
      toast.error('Nothing to export yet.');
      return;
    }

    const locked = isFormatLocked(format, plan);
    if (locked) {
      const requiredPlan = format === 'pdf' ? 'starter' : 'pro';
      toast.info(`This format is available on ${format === 'pdf' ? 'Starter/Pro/Max' : 'Pro/Max'}. Upgrade when you need heavier usage.`);
      captureEvent('feature_locked_clicked', {
        feature: `export_${format}`,
        required_plan: requiredPlan,
        current_plan: plan,
      });
      dispatchAppNavigate('pricing');
      return;
    }

    try {
      const filename = generateExportFilename(toolName);
      
      switch (format) {
        case 'clipboard':
          await copyToClipboard(content);
          toast.success('Clarity report copied to clipboard!');
          break;
        case 'txt':
          exportTxt(content, filename);
          toast.success('TXT file downloaded successfully!');
          break;
        case 'markdown':
          exportMarkdown(content, filename);
          toast.success('Markdown file downloaded successfully!');
          break;
        case 'pdf':
          exportPdf(content, filename);
          toast.success('PDF report downloaded successfully!');
          break;
        case 'docx':
          exportDocx(content, filename);
          toast.success('Word document downloaded successfully!');
          break;
      }

      // Track the export event in PostHog securely (never send raw text content)
      captureEvent('export_clicked', {
        format,
        tool_name: toolName,
        is_logged_in: isLoggedIn,
        plan: plan,
      });

    } catch (err: any) {
      console.error(`[Export] ${format} failed:`, err);
      if (format === 'clipboard') {
        toast.error('Copy failed. Please try again.');
      } else {
        toast.error('Export failed. Please try again.');
      }
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!content}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          color: content ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
          cursor: content ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          if (content) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (content) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }
        }}
      >
        <Download size={13} />
        Export
        <ChevronDown size={12} style={{ opacity: 0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: 6,
          width: 170,
          background: 'rgba(18, 8, 26, 0.96)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 10,
          padding: '6px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          animation: 'dropdownFadeUp 0.15s ease-out both',
        }}>
          {/* Dropdown Items */}
           <button
            onClick={() => handleAction('clipboard')}
            style={getDropdownItemStyle('clipboard', plan)}
            onMouseEnter={e => handleItemMouseEnter(e, 'clipboard', plan)}
            onMouseLeave={e => handleItemMouseLeave(e, 'clipboard', plan)}
          >
            <Copy size={12} style={{ opacity: 0.7 }} />
            Copy to Clipboard
          </button>
          
          <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '4px 0' }} />

          <button
            onClick={() => handleAction('txt')}
            style={getDropdownItemStyle('txt', plan)}
            onMouseEnter={e => handleItemMouseEnter(e, 'txt', plan)}
            onMouseLeave={e => handleItemMouseLeave(e, 'txt', plan)}
          >
            <FileText size={12} style={{ opacity: 0.7 }} />
            Plain Text (.txt)
          </button>

          <button
            onClick={() => handleAction('markdown')}
            style={getDropdownItemStyle('markdown', plan)}
            onMouseEnter={e => handleItemMouseEnter(e, 'markdown', plan)}
            onMouseLeave={e => handleItemMouseLeave(e, 'markdown', plan)}
          >
            <FileText size={12} style={{ opacity: 0.7 }} />
            Markdown (.md)
          </button>

          <button
            onClick={() => handleAction('pdf')}
            style={getDropdownItemStyle('pdf', plan)}
            onMouseEnter={e => handleItemMouseEnter(e, 'pdf', plan)}
            onMouseLeave={e => handleItemMouseLeave(e, 'pdf', plan)}
          >
            <FileText size={12} style={{ opacity: isFormatLocked('pdf', plan) ? 0.4 : 0.7 }} />
            PDF Document (.pdf) {isFormatLocked('pdf', plan) && '🔒'}
          </button>

          <button
            onClick={() => handleAction('docx')}
            style={getDropdownItemStyle('docx', plan)}
            onMouseEnter={e => handleItemMouseEnter(e, 'docx', plan)}
            onMouseLeave={e => handleItemMouseLeave(e, 'docx', plan)}
          >
            <FileText size={12} style={{ opacity: isFormatLocked('docx', plan) ? 0.4 : 0.7 }} />
            Word Document (.docx) {isFormatLocked('docx', plan) && '🔒'}
          </button>
        </div>
      )}

      {/* Embedded CSS for animations */}
      <style>{`
        @keyframes dropdownFadeUp {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

const isFormatLocked = (format: string, plan: string): boolean => {
  const p = plan.toLowerCase();
  if (format === 'pdf') {
    return p === 'free';
  }
  if (format === 'docx') {
    return p === 'free' || p === 'starter';
  }
  return false;
};

const getDropdownItemStyle = (format: string, plan: string): React.CSSProperties => {
  const locked = isFormatLocked(format, plan);
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '8px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 400,
    color: locked ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.65)',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    outline: 'none',
    opacity: locked ? 0.6 : 1,
  };
};

function handleItemMouseEnter(e: React.MouseEvent<HTMLButtonElement>, format: string, plan: string) {
  const locked = isFormatLocked(format, plan);
  if (locked) {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
  } else {
    e.currentTarget.style.background = 'rgba(226, 62, 87, 0.08)';
    e.currentTarget.style.color = '#ff8fa3';
  }
}

function handleItemMouseLeave(e: React.MouseEvent<HTMLButtonElement>, format: string, plan: string) {
  const locked = isFormatLocked(format, plan);
  e.currentTarget.style.background = 'transparent';
  e.currentTarget.style.color = locked ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.65)';
}
