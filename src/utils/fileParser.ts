// src/utils/fileParser.ts
import { getFileUploadLimitMB } from '../lib/plans';

/**
 * Dynamic loaders for PDF and DOCX parsers from CDNJS to keep the Vite bundle size minimal.
 */

const loadPdfJs = async (): Promise<any> => {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      resolve(pdfjsLib);
    };
    script.onerror = () => reject(new Error('Document parser failed to load. Please paste the text manually.'));
    document.head.appendChild(script);
  });
};

const loadMammoth = async (): Promise<any> => {
  if ((window as any).mammoth) return (window as any).mammoth;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    script.onload = () => resolve((window as any).mammoth);
    script.onerror = () => reject(new Error('Document parser failed to load. Please paste the text manually.'));
    document.head.appendChild(script);
  });
};

export interface FileParseResult {
  text: string;
  error?: string;
}

export async function parseFile(file: File, maxBytes?: number): Promise<FileParseResult> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  // Enforce the plan-based or fallback file size limit
  const finalMaxBytes = maxBytes && maxBytes > 0
    ? maxBytes
    : getFileUploadLimitMB('free') * 1024 * 1024;

  if (file.size > finalMaxBytes) {
    const maxMB = Math.round(finalMaxBytes / (1024 * 1024));
    return { text: '', error: `File too large. Maximum size is ${maxMB}MB.` };
  }

  try {
    if (ext === 'txt') {
      const text = await file.text();
      if (!text.trim()) {
        return { text: '', error: 'The uploaded TXT file is empty.' };
      }
      return { text };
    }

    if (ext === 'pdf') {
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => {
          // pdf.js text items have a str property
          return item.str || '';
        });
        text += strings.join(' ') + '\n';
      }

      if (!text.trim()) {
        return { text: '', error: 'Could not extract text from the PDF file (it might be scanned or empty).' };
      }
      return { text: text.trim() };
    }

    if (ext === 'docx') {
      const mammoth = await loadMammoth();
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value || '';
      
      if (!text.trim()) {
        return { text: '', error: 'Could not extract text from the DOCX file.' };
      }
      return { text: text.trim() };
    }

    return { text: '', error: `Unsupported file type: .${ext}. Please upload a .txt, .pdf, or .docx file.` };
  } catch (err: any) {
    console.error('[FileParser] Failed to parse file:', err);
    return { 
      text: '', 
      error: err.message?.includes('failed to load') 
        ? 'Document parser failed to load. Please paste the text manually.' 
        : (err.message || 'Failed extraction. Please ensure the document is not corrupt.')
    };
  }
}
