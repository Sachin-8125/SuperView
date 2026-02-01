/**
 * Extracts text from resume files: .txt, .pdf, .docx
 */

const readTxtFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file, 'UTF-8');
  });

const readPdfFile = async (file) => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    if (typeof pdfjsLib.GlobalWorkerOptions !== 'undefined') {
      const publicUrl = (typeof process !== 'undefined' && process.env?.PUBLIC_URL) || '';
      pdfjsLib.GlobalWorkerOptions.workerSrc = `${publicUrl}/pdf.worker.min.mjs`;
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const parts = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item) => item.str).join(' ');
      parts.push(text);
    }

    return parts.join('\n\n').trim();
  } catch (err) {
    if (err.message?.includes('Cannot find module')) {
      throw new Error('PDF support requires installing pdfjs-dist. Please use a .txt file or paste your resume.');
    }
    throw err;
  }
};

const readDocxFile = async (file) => {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return (result.value || '').trim();
  } catch (err) {
    if (err.message?.includes('Cannot find module')) {
      throw new Error('DOCX support requires installing mammoth. Please use a .txt file or paste your resume.');
    }
    throw err;
  }
};

const ACCEPT = '.txt,.pdf,.doc,.docx';
const EXT_TO_READER = {
  txt: readTxtFile,
  pdf: readPdfFile,
  doc: readDocxFile,
  docx: readDocxFile
};

/**
 * @param {File} file
 * @returns {Promise<{ text: string } | { error: string }>}
 */
export async function readResumeFile(file) {
  if (!file) return { error: 'No file selected' };

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const reader = EXT_TO_READER[ext];

  if (!reader) {
    return { error: 'Unsupported format. Use PDF, DOCX, or TXT.' };
  }

  try {
    const text = await reader(file);
    if (!text || text.length < 20) {
      return { error: 'Could not extract enough text from the file. Try pasting your resume instead.' };
    }
    return { text };
  } catch (err) {
    console.error('Resume file read error:', err);
    return {
      error: err.message || 'Failed to read file. Try pasting your resume in the box below.'
    };
  }
}

export const RESUME_ACCEPT = ACCEPT;
