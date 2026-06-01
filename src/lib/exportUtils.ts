import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

/**
 * Sanitizes the exported content to remove sensitive information or internal stack traces.
 */
function sanitizeContent(content: string): string {
  if (!content) return '';
  const lines = content.split('\n');
  const cleanLines = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;

    // Remove stack trace lines (e.g. "at ... (...)")
    if (/^\s*at\s+[\w.<>]+\s+\(.*\)$/.test(trimmed) || /^\s*at\s+.*:\d+:\d+$/.test(trimmed)) {
      return false;
    }

    // Remove stack trace location indicators
    if (trimmed.startsWith('at ') && (trimmed.includes('.ts:') || trimmed.includes('.js:') || trimmed.includes('node_modules'))) {
      return false;
    }

    // Remove obvious debug/trace prefixes
    if (/^\[debug\]/i.test(trimmed) || /^\[trace\]/i.test(trimmed)) {
      return false;
    }

    // Remove internal credentials/tokens if they accidentally appear
    const containsSecret =
      /phc_[a-zA-Z0-9]{32,}/i.test(trimmed) || // PostHog keys
      /0x4[a-zA-Z0-9\-_]{20,}/i.test(trimmed) || // Turnstile keys
      /re_[a-zA-Z0-9]{24,}/i.test(trimmed) || // Resend API keys
      /sk-or-v1-[a-zA-Z0-9]{32,}/i.test(trimmed) || // OpenRouter API keys
      /AIzaSy[a-zA-Z0-9\-_]{33}/.test(trimmed) || // Gemini API keys
      /UPSTASH_REDIS_REST/i.test(trimmed) || // Upstash credentials
      /SUPABASE_SERVICE_ROLE_KEY/i.test(trimmed) || // Supabase service role key label
      /SUPABASE_CLIENT_API_KEY/i.test(trimmed);

    if (containsSecret) {
      return false;
    }

    // Targeted check for Supabase service role key JWTs (very long JWTs containing Supabase keywords)
    if (/eyJ[a-zA-Z0-9_\-]+\.eyJ[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+/.test(trimmed)) {
      if (trimmed.includes('supabase') || trimmed.includes('service') || trimmed.includes('role') || trimmed.length > 500) {
        return false;
      }
    }

    return true;
  });

  return cleanLines.join('\n');
}

/**
 * Parses markdown inline formatting (bold/italic) and returns an array of docx TextRun objects.
 */
function parseMarkdownInline(text: string): TextRun[] {
  const runs: TextRun[] = [];
  let remaining = text;

  while (remaining) {
    const nextBold = remaining.indexOf('**');
    const nextItalic = remaining.indexOf('*');

    if (nextBold === -1 && nextItalic === -1) {
      runs.push(new TextRun({ text: remaining }));
      break;
    }

    if (nextBold !== -1 && (nextItalic === -1 || nextBold <= nextItalic)) {
      // Bold matches
      if (nextBold > 0) {
        runs.push(new TextRun({ text: remaining.substring(0, nextBold) }));
      }
      const closeBold = remaining.indexOf('**', nextBold + 2);
      if (closeBold !== -1) {
        runs.push(new TextRun({
          text: remaining.substring(nextBold + 2, closeBold),
          bold: true,
        }));
        remaining = remaining.substring(closeBold + 2);
      } else {
        runs.push(new TextRun({ text: remaining.substring(nextBold) }));
        break;
      }
    } else {
      // Italic matches
      if (nextItalic > 0) {
        runs.push(new TextRun({ text: remaining.substring(0, nextItalic) }));
      }
      const closeItalic = remaining.indexOf('*', nextItalic + 1);
      if (closeItalic !== -1) {
        runs.push(new TextRun({
          text: remaining.substring(nextItalic + 1, closeItalic),
          italics: true,
        }));
        remaining = remaining.substring(closeItalic + 1);
      } else {
        runs.push(new TextRun({ text: remaining.substring(nextItalic) }));
        break;
      }
    }
  }

  return runs;
}

/**
 * Copies text content safely to the clipboard.
 */
export async function copyToClipboard(content: string): Promise<void> {
  if (!content) throw new Error('Nothing to copy.');
  const sanitized = sanitizeContent(content);
  await navigator.clipboard.writeText(sanitized);
}

/**
 * Generates a sanitized, timestamped filename for exports.
 */
export function generateExportFilename(prefix: string): string {
  const cleanPrefix = prefix
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `sumalyze_${cleanPrefix || 'export'}_${year}${month}${day}_${hours}${minutes}`;
}

/**
 * Exports text content to a plain `.txt` file.
 */
export function exportTxt(content: string, filename: string): void {
  if (!content) throw new Error('Nothing to export.');
  
  const sanitized = sanitizeContent(content);
  // Convert Markdown headings/bold to clean text for txt
  const cleanContent = sanitized
    .replace(/^#{1,6}\s+/gm, '') // Remove Markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold markdown
    
  const blob = new Blob([cleanContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports text content to a Markdown `.md` file.
 */
export function exportMarkdown(content: string, filename: string): void {
  if (!content) throw new Error('Nothing to export.');
  
  const sanitized = sanitizeContent(content);
  const blob = new Blob([sanitized], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports text content to a PDF document using jsPDF.
 * Parses headers, lists, and inline bold elements to render a clean, structured PDF.
 */
export function exportPdf(content: string, filename: string): void {
  if (!content) throw new Error('Nothing to export.');

  try {
    const sanitized = sanitizeContent(content);
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const maxLineWidth = pageWidth - 2 * margin;
    
    let y = 20;
    const lines = sanitized.split('\n');
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    
    const checkPageOverflow = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = 20;
      }
    };
    
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        y += 4; // empty line spacing
        continue;
      }
      
      // Check heading format (e.g. # Header or ## Header or ### Header)
      if (line.startsWith('#')) {
        const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2];
          
          const fontSize = level === 1 ? 16 : level === 2 ? 14 : 12;
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(fontSize);
          
          const wrapped = doc.splitTextToSize(text, maxLineWidth);
          checkPageOverflow(wrapped.length * (fontSize * 0.5) + 6);
          
          for (const item of wrapped) {
            doc.text(item, margin, y);
            y += (fontSize * 0.5) + 2;
          }
          y += 3; // bottom margin for headers
          
          // Reset default font
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(10);
          continue;
        }
      }
      
      // Check list bullet item
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const text = line.substring(1).trim();
        const bulletChar = '•';
        
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        
        // Render bullet point
        checkPageOverflow(6);
        doc.text(bulletChar, margin, y);
        
        const wrapped = doc.splitTextToSize(text, maxLineWidth - 6);
        for (let i = 0; i < wrapped.length; i++) {
          checkPageOverflow(5);
          doc.text(wrapped[i], margin + 6, y);
          y += 5;
        }
        y += 1;
        continue;
      }
      
      // Inline bold scanning (e.g., **Bold Label:** Normal Text)
      const boldMatch = line.match(/^\*\*(.*?)\*\*:(.*)$/) || line.match(/^\*\*(.*?)\*\*(.*)$/);
      if (boldMatch) {
        const boldText = boldMatch[1];
        const normalText = boldMatch[2];
        const hasColon = line.includes('**:');
        
        checkPageOverflow(10);
        
        // Print bold part
        doc.setFont('Helvetica', 'bold');
        doc.text(boldText + (hasColon ? ':' : ''), margin, y);
        const boldWidth = doc.getTextWidth(boldText + (hasColon ? ':' : ' '));
        
        // Print normal part next to it (with wrap support if it goes to new line)
        doc.setFont('Helvetica', 'normal');
        const remainingWidth = maxLineWidth - boldWidth;
        const wrapped = doc.splitTextToSize(normalText.trim(), maxLineWidth);
        
        if (wrapped.length > 0) {
          const firstLine = wrapped[0];
          const firstLineWidth = doc.getTextWidth(firstLine);
          
          if (firstLineWidth < remainingWidth) {
            doc.text(firstLine, margin + boldWidth + 1, y);
            y += 5;
            
            for (let i = 1; i < wrapped.length; i++) {
              checkPageOverflow(5);
              doc.text(wrapped[i], margin, y);
              y += 5;
            }
          } else {
            y += 5;
            for (let i = 0; i < wrapped.length; i++) {
              checkPageOverflow(5);
              doc.text(wrapped[i], margin, y);
              y += 5;
            }
          }
        }
        y += 2;
        continue;
      }
      
      // Standard regular line
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      const wrapped = doc.splitTextToSize(line, maxLineWidth);
      for (const item of wrapped) {
        checkPageOverflow(5);
        doc.text(item, margin, y);
        y += 5;
      }
      y += 2;
    }
    
    doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } catch (err) {
    console.error('[Export] PDF generation failed:', err);
    throw new Error('PDF generation failed.');
  }
}

/**
 * Exports text content to a real valid Word `.docx` document using the docx package.
 * Parses headings, list bullets, and inline bold runs to structure the document correctly.
 */
export function exportDocx(content: string, filename: string): void {
  if (!content) throw new Error('Nothing to export.');

  try {
    const sanitized = sanitizeContent(content);
    const lines = sanitized.split('\n');
    const docChildren: any[] = [];
    
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        // Add empty paragraph for spacing
        docChildren.push(new Paragraph({
          children: [new TextRun('')],
          spacing: { after: 120 }, // 6pt spacing
        }));
        continue;
      }
      
      // Check divider
      if (line === '---') {
        docChildren.push(new Paragraph({
          children: [
            new TextRun({
              text: '____________________________________________________',
              color: 'CCCCCC',
            }),
          ],
          spacing: { before: 120, after: 120 },
        }));
        continue;
      }

      // Check headings
      if (line.startsWith('#')) {
        const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2];
          
          let headingType: any = HeadingLevel.HEADING_3;
          if (level === 1) headingType = HeadingLevel.HEADING_1;
          else if (level === 2) headingType = HeadingLevel.HEADING_2;
          
          docChildren.push(new Paragraph({
            heading: headingType,
            children: parseMarkdownInline(text),
            spacing: { before: 240, after: 120 },
          }));
          continue;
        }
      }
      
      // Check bullet list item
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const text = line.substring(1).trim();
        
        docChildren.push(new Paragraph({
          children: parseMarkdownInline(text),
          bullet: { level: 0 },
          spacing: { after: 60 },
        }));
        continue;
      }
      
      // Default standard paragraph
      docChildren.push(new Paragraph({
        children: parseMarkdownInline(line),
        spacing: { after: 120 },
      }));
    }
    
    // Add "Generated with Sumalyze" footer paragraph if not already in content
    const hasFooter = sanitized.toLowerCase().includes('generated with sumalyze');
    if (!hasFooter) {
      docChildren.push(new Paragraph({
        children: [new TextRun('')],
        spacing: { before: 240 },
      }));
      docChildren.push(new Paragraph({
        children: [
          new TextRun({
            text: 'Generated with Sumalyze',
            italics: true,
            size: 18, // 9pt
            color: '666666',
          }),
        ],
        spacing: { before: 120 },
      }));
    }
    
    // Create Document
    const doc = new Document({
      sections: [{
        properties: {},
        children: docChildren,
      }],
    });
    
    // Generate blob and download
    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }).catch((err) => {
      console.error('[Export] Packer conversion to blob failed:', err);
    });
    
  } catch (err) {
    console.error('[Export] DOCX generation failed:', err);
    throw new Error('DOCX generation failed.');
  }
}

/**
 * Compiles the full multi-step Agent analysis results into a structured markdown report.
 */
export function compileAgentReport(result: {
  summary: string;
  tone: {
    overall: string;
    emotions: { name: string; value: number; color: string }[];
  };
  intent: string;
  keySignals: string[];
  riskFlags: string[];
  actionSteps: string[];
  replyDraft: string;
  clarityScore: number;
  whatToCheckBeforeReplying: string[];
  goal: string;
}): string {
  const emotionsList = result.tone.emotions
    .map(e => `• ${e.name.charAt(0).toUpperCase() + e.name.slice(1)}: ${e.value}%`)
    .join('\n');

  const keySignalsList = result.keySignals.map(s => `• ${s}`).join('\n');
  const riskFlagsList = result.riskFlags.length > 0
    ? result.riskFlags.map(r => `• ${r}`).join('\n')
    : '• No significant risk flags detected';

  const actionStepsList = result.actionSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n');
  const whatToCheckList = result.whatToCheckBeforeReplying.map(item => `• ${item}`).join('\n');

  const now = new Date().toLocaleString();

  return `# Sumalyze Agent Analysis Report
*Generated on ${now}*

## Summary
${result.summary}

## Clarity Score
Score: ${result.clarityScore} / 100

## Tone & Emotions
Overall Tone: ${result.tone.overall}

**Emotions Detected:**
${emotionsList}

## Message Intent
${result.intent}

## Key Signals
${keySignalsList}

## Risk Flags
${riskFlagsList}

## Suggested Action Steps
${actionStepsList}

## Reply Draft
"${result.replyDraft}"

## What to Check Before Replying
${whatToCheckList}

---
*Generated with Sumalyze — AI Clarity Workspace*`;
}
