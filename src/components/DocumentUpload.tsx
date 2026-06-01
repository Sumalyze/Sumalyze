// src/components/DocumentUpload.tsx
import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, X } from 'lucide-react';
import { parseFile } from '../utils/fileParser';
import { useCurrentPlan } from '../hooks/useCurrentPlan';
import { getFileUploadLimitMB } from '../lib/plans';
import { captureEvent } from '../lib/analytics';

interface DocumentUploadProps {
  onTextExtracted: (text: string, fileName: string, file?: File) => void;
  onError: (error: string | null) => void;
  accentColor?: string;
}

export default function DocumentUpload({
  onTextExtracted,
  onError,
  accentColor = '#E23E57',
}: DocumentUploadProps) {
  const { plan } = useCurrentPlan();
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedFile, setParsedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    onError(null);
    setParsedFile(null);

    const limitMB = getFileUploadLimitMB(plan);
    if (file.size > limitMB * 1024 * 1024) {
      onError(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Your plan limit is ${limitMB} MB. Please upgrade to upload larger files.`);
      captureEvent('feature_locked_clicked', {
        feature: 'file_upload',
        required_plan: limitMB === 2 ? 'starter' : limitMB === 10 ? 'pro' : limitMB === 25 ? 'max' : 'team',
        current_plan: plan,
      });
      return;
    }

    setParsing(true);
    try {
      const res = await parseFile(file);
      if (res.error) {
        onError(res.error);
      } else {
        setParsedFile(file.name);
        onTextExtracted(res.text, file.name, file);
      }
    } catch (err: any) {
      onError(err.message || 'Failed to extract text from document.');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const clearFile = () => {
    setParsedFile(null);
    onTextExtracted('', '');
    onError(null);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => {
        if (!parsing && !parsedFile) fileInputRef.current?.click();
      }}
      style={{
        height: 140,
        border: isDragging
          ? `2px dashed ${accentColor}`
          : '2px dashed rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: parsing ? 'not-allowed' : parsedFile ? 'default' : 'pointer',
        background: isDragging ? `${accentColor}06` : 'rgba(10, 0, 15, 0.4)',
        transition: 'all 0.2s',
        position: 'relative',
        padding: '16px 20px',
        boxSizing: 'border-box',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileChange(f);
        }}
      />

      {parsing ? (
        <>
          <Loader2 className="animate-spin" size={24} style={{ color: accentColor }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Parsing document...</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Extracting text contents locally...</p>
        </>
      ) : parsedFile ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: accentColor }}>
            <FileText size={20} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'white', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {parsedFile}
            </span>
          </div>
          <p style={{ fontSize: 11, color: '#34d399', margin: 0, fontWeight: 500 }}>✓ Extracted text ready</p>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <>
          <Upload size={22} style={{ color: accentColor, opacity: 0.8 }} />
          <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', margin: 0, textAlign: 'center' }}>
            Drop file here or <span style={{ color: accentColor, fontWeight: 500 }}>browse</span>
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.3)', margin: 0, textAlign: 'center' }}>
            Supports PDF, DOCX, TXT · Max {getFileUploadLimitMB(plan)}MB
          </p>
        </>
      )}
    </div>
  );
}
