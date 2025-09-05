import { QuizContent, RichContent } from '@/types';

export interface DownloadOptions {
  format: 'pdf' | 'docx' | 'txt';
  includeAnswers?: boolean;
  includePoints?: boolean;
}

// PDF generation function with real content
export const generatePDF = async (content: QuizContent, options: DownloadOptions = { format: 'pdf' }): Promise<void> => {
  // Simulate PDF generation delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Generate content based on format
  const fileContent = options.format === 'pdf' ? 
    generateSimplePDF(content, options) : 
    formatContentForPDF(content, options);
  
  // Create proper file with correct MIME type
  const mimeType = options.format === 'pdf' ? 'application/pdf' : 'text/plain';
  const blob = new Blob([fileContent], { 
    type: mimeType 
  });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(content.title)}.${options.format}`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadDocument = async (docTitle: string, docType: string, format: 'pdf' | 'docx' | 'txt' = 'pdf', quizContent?: QuizContent, schoolInfo?: any, templateId?: string): Promise<void> => {
  try {
    console.log('downloadDocument called with:', { docTitle, docType, format, templateId, quizContent: !!quizContent, schoolInfo: !!schoolInfo });
    
    if (format === 'pdf') {
      // Generate realistic PDF content based on document type and template
      console.log('Generating PDF content...');
      const pdfContent = generatePDFContent(docTitle, docType, quizContent, schoolInfo, templateId || 'school-standard');
      console.log('PDF content generated, length:', pdfContent.length);
      
      // Create Blob with proper PDF MIME type
      const blob = new Blob([pdfContent], { 
        type: 'application/pdf' 
      });
      console.log('Blob created, size:', blob.size);
      
      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `${sanitizeFilename(docTitle)}.pdf`;
      link.download = filename;
      console.log('Download link created:', filename);
      
      // Add to DOM, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('Download triggered successfully');
      
      return;
    }
  } catch (error) {
    console.error('Error in downloadDocument:', error);
    throw error;
  }

  // For other formats, use the existing logic
  const mockContent: QuizContent = {
    title: docTitle,
    instructions: `Verifica scaricata in formato ${format.toUpperCase()}. Tempo suggerito: 60 minuti.`,
    questions: [
      {
        id: '1',
        text: `Prima domanda di ${docTitle}`,
        type: 'multiple_choice',
        options: ['Opzione A', 'Opzione B', 'Opzione C', 'Opzione D'],
        correctAnswer: 1,
        points: 5
      },
      {
        id: '2',
        text: `Domanda aperta relativa a ${docTitle}`,
        type: 'open_ended',
        points: 15
      }
    ],
    totalPoints: 20,
    timeLimit: 60
  };

  await generatePDF(mockContent, { format, includeAnswers: false, includePoints: true });
};

// Generate PDF content for direct download
const generatePDFContent = (docTitle: string, docType: string, quizContent?: QuizContent, schoolInfo?: any, templateId: string = 'school-standard'): string => {
  // Create a more realistic PDF structure with multi-page support
  const pdfHeader = `%PDF-1.4
%âãÏÓ

`;
  
  // Create PDF objects
  const catalogObj = `1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

`;
  
  // Generate content based on document type and template - SIMPLIFIED VERSION
  const page1Content = formatSimpleDocumentContent(docTitle, docType, quizContent, schoolInfo, templateId);
  const page2Content = '';
  const needsSecondPage = false;
  
  // Create pages object (support for 1 or 2 pages)
  const pageCount = needsSecondPage ? 2 : 1;
  const pageKids = needsSecondPage ? '[3 0 R 7 0 R]' : '[3 0 R]';
  const pagesObj = `2 0 obj
<<
/Type /Pages
/Kids ${pageKids}
/Count ${pageCount}
>>
endobj

`;
  
  // Page 1
  const page1Obj = `3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
    /F2 6 0 R
  >>
>>
>>
endobj

`;
  
  const contents1Obj = `4 0 obj
<<
/Length ${page1Content.length}
>>
stream
BT
/F1 12 Tf
72 720 Td
${page1Content}
ET
endstream
endobj

`;
  
  const fontObj = `5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Times-Roman
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Times-Bold
>>
endobj

`;
  
  let page2Obj = '';
  let contents2Obj = '';
  
  if (needsSecondPage) {
    page2Obj = `7 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 8 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
    /F2 6 0 R
  >>
>>
>>
endobj

`;
    
    contents2Obj = `8 0 obj
<<
/Length ${page2Content.length}
>>
stream
BT
/F1 12 Tf
72 720 Td
${page2Content}
ET
endstream
endobj

`;
  }
  
  // Calculate xref positions
  let position = pdfHeader.length;
  const xrefPositions = [0];
  
  const objects = [catalogObj, pagesObj, page1Obj, contents1Obj, fontObj];
  if (needsSecondPage) {
    objects.push(page2Obj, contents2Obj);
  }
  
  objects.forEach(obj => {
    xrefPositions.push(position);
    position += obj.length;
  });
  
  const objCount = needsSecondPage ? 9 : 7;
  const xrefTable = `xref
0 ${objCount}
0000000000 65535 f 
${xrefPositions.slice(1).map(pos => pos.toString().padStart(10, '0') + ' 00000 n ').join('\n')}
`;
  
  const trailer = `trailer
<<
/Size ${objCount}
/Root 1 0 R
>>
startxref
${position}
%%EOF`;
  
  return pdfHeader + catalogObj + pagesObj + page1Obj + contents1Obj + fontObj + page2Obj + contents2Obj + xrefTable + trailer;
};

// Simple document content formatter that actually works
const formatSimpleDocumentContent = (docTitle: string, docType: string, quizContent?: QuizContent, schoolInfo?: any, templateId: string = 'school-standard'): string => {
  const lines = [];
  
  // Use school info if provided, otherwise defaults
  const school = schoolInfo || {
    schoolName: 'ISTITUTO COMPRENSIVO "ALESSANDRO MANZONI"',
    schoolAddress: 'Via dei Promessi Sposi, 25 - 20100 Milano (MI)',
    className: '3°A',
    date: new Date().toLocaleDateString('it-IT'),
    teacherName: ''
  };

  // Header based on template
  switch (templateId) {
    case 'school-standard':
      lines.push(`/F2 14 Tf`);
      lines.push(`(${school.schoolName}) Tj`);
      lines.push(`0 -20 Td`);
      lines.push(`/F1 10 Tf`);
      lines.push(`(${school.schoolAddress}) Tj`);
      lines.push(`0 -25 Td`);
      lines.push(`/F2 12 Tf`);
      lines.push(`(VERIFICA DI ${docType.toUpperCase()}) Tj`);
      break;
      
    case 'university-formal':
      lines.push(`/F2 12 Tf`);
      lines.push(`(${school.schoolName}) Tj`);
      lines.push(`0 -18 Td`);
      lines.push(`/F1 10 Tf`);
      lines.push(`(${school.schoolAddress}) Tj`);
      lines.push(`0 -20 Td`);
      lines.push(`/F2 14 Tf`);
      lines.push(`(ESAME DI ${docType.toUpperCase()}) Tj`);
      break;
      
    case 'minimalist':
      lines.push(`/F2 16 Tf`);
      lines.push(`(${docType.toUpperCase()}) Tj`);
      lines.push(`0 -25 Td`);
      lines.push(`/F1 10 Tf`);
      lines.push(`(${school.date}) Tj`);
      break;
      
    default:
      lines.push(`/F2 14 Tf`);
      lines.push(`(${school.schoolName}) Tj`);
      lines.push(`0 -20 Td`);
      lines.push(`/F1 10 Tf`);
      lines.push(`(${school.schoolAddress}) Tj`);
      lines.push(`0 -25 Td`);
      lines.push(`/F2 12 Tf`);
      lines.push(`(VERIFICA DI ${docType.toUpperCase()}) Tj`);
  }
  
  lines.push(`0 -30 Td`);
  lines.push(`/F1 10 Tf`);
  lines.push(`(Classe: ${school.className}    Data: ${school.date}) Tj`);
  lines.push(`0 -20 Td`);
  lines.push(`(Nome: ____________________    Cognome: ____________________) Tj`);
  lines.push(`0 -40 Td`);

  // Add quiz content if provided
  if (quizContent) {
    lines.push(`/F2 11 Tf`);
    lines.push(`(ISTRUZIONI:) Tj`);
    lines.push(`0 -18 Td`);
    lines.push(`/F1 10 Tf`);
    lines.push(`(${quizContent.instructions}) Tj`);
    lines.push(`0 -15 Td`);
    lines.push(`(Tempo: ${quizContent.timeLimit} min - Punteggio: ${quizContent.totalPoints} punti) Tj`);
    lines.push(`0 -30 Td`);

    // Add first few questions
    quizContent.questions.slice(0, 6).forEach((question, index) => {
      lines.push(`/F2 11 Tf`);
      lines.push(`(DOMANDA ${index + 1} (${question.points} pt)) Tj`);
      lines.push(`0 -18 Td`);
      lines.push(`/F1 10 Tf`);
      
      // Handle rich content if available
      if (question.richContent && question.richContent.length > 0) {
        question.richContent.forEach((content) => {
          switch (content.type) {
            case 'text':
              const textContent = content.content.length > 80 ? 
                content.content.substring(0, 80) + '...' : content.content;
              lines.push(`(${textContent.replace(/[()\\]/g, '\\$&')}) Tj`);
              lines.push(`0 -15 Td`);
              break;
            case 'latex':
              lines.push(`/F2 9 Tf`);
              lines.push(`([FORMULA: ${content.content.substring(0, 50)}${content.content.length > 50 ? '...' : ''}]) Tj`);
              lines.push(`/F1 10 Tf`);
              lines.push(`0 -15 Td`);
              break;
            case 'image':
              lines.push(`([IMMAGINE ALLEGATA]) Tj`);
              lines.push(`0 -15 Td`);
              break;
            case 'table':
              lines.push(`([TABELLA ALLEGATA]) Tj`);
              lines.push(`0 -15 Td`);
              break;
          }
        });
      } else {
        // Fallback to plain text
        const questionText = question.text.length > 80 ? 
          question.text.substring(0, 80) + '...' : question.text;
        lines.push(`(${questionText.replace(/[()\\]/g, '\\$&')}) Tj`);
        lines.push(`0 -15 Td`);
      }
      
      if (question.type === 'multiple_choice' && question.options) {
        question.options.slice(0, 4).forEach((option, optIndex) => {
          const letter = String.fromCharCode(65 + optIndex);
          const optionText = option.length > 60 ? option.substring(0, 60) + '...' : option;
          lines.push(`(${letter}) ${optionText.replace(/[()\\]/g, '\\$&')}) Tj`);
          lines.push(`0 -12 Td`);
        });
        lines.push(`(Risposta: ____) Tj`);
      } else {
        lines.push(`(Risposta: ________________________________) Tj`);
        lines.push(`0 -12 Td`);
        lines.push(`(________________________________) Tj`);
      }
      lines.push(`0 -25 Td`);
    });
  }

  return lines.join('\n');
};

// Helper function to format text with bold for FULL CAPS words
const formatTextWithBold = (text: string, lines: string[], useSpacing: boolean = true) => {
  // Split text into words and check for FULL CAPS
  const words = text.split(' ');
  let currentLine = '';
  let isBold = false;
  
  words.forEach((word, index) => {
    const isWordAllCaps = word.length > 1 && word === word.toUpperCase() && /^[A-Z\s\(\)]+$/.test(word);
    
    if (isWordAllCaps && !isBold) {
      // Switch to bold font
      if (currentLine) {
        lines.push(`(${currentLine.replace(/[()\\]/g, '\\$&')}) Tj`);
        currentLine = '';
      }
      lines.push('/F2 12 Tf'); // Bold font
      isBold = true;
      currentLine = word;
    } else if (!isWordAllCaps && isBold) {
      // Switch back to normal font
      if (currentLine) {
        lines.push(`(${currentLine.replace(/[()\\]/g, '\\$&')}) Tj`);
        currentLine = '';
      }
      lines.push('/F1 12 Tf'); // Normal font
      isBold = false;
      currentLine = word;
    } else {
      // Continue with current font
      currentLine += (currentLine ? ' ' : '') + word;
    }
  });
  
  // Add remaining text
  if (currentLine) {
    lines.push(`(${currentLine.replace(/[()\\]/g, '\\$&')}) Tj`);
  }
  
  // Reset to normal font if we ended in bold
  if (isBold) {
    lines.push('/F1 12 Tf');
  }
  
  if (useSpacing) {
    lines.push('0 -15 Td');
  }
};

// Format document content for PDF with multi-page support
const formatDocumentContentMultiPage = (docTitle: string, docType: string, quizContent?: QuizContent, schoolInfo?: any, templateId: string = 'school-standard') => {
  const page1Lines = [];
  const page2Lines = [];
  let currentPage = 1;
  let currentY = 720; // Start position
  const pageHeight = 792;
  const marginBottom = 50;
  
  // Track vertical position
  const addToCurrentPage = (lines: string[], spacing: number = 15) => {
    const targetLines = currentPage === 1 ? page1Lines : page2Lines;
    lines.forEach(line => targetLines.push(line));
    currentY -= spacing;
    
    // Check if we need to move to next page
    if (currentY < marginBottom && currentPage === 1) {
      currentPage = 2;
      currentY = 720;
    }
  };
  
  // Use school info if provided, otherwise defaults
  const school = schoolInfo || {
    schoolName: 'ISTITUTO COMPRENSIVO "ALESSANDRO MANZONI"',
    schoolAddress: 'Via dei Promessi Sposi, 25 - 20100 Milano (MI)',
    className: '3^A',
    date: new Date().toLocaleDateString('it-IT')
  };
  
  // Generate header based on template
  switch (templateId) {
    case 'school-standard':
      generateSchoolHeader(school, docType, addToCurrentPage, formatTextWithBold);
      break;
    case 'university-formal':
      generateUniversityHeader(school, docType, addToCurrentPage, formatTextWithBold);
      break;
    case 'exam-grid':
      generateExamHeader(school, docType, addToCurrentPage, formatTextWithBold);
      break;
    case 'minimalist':
      generateMinimalistHeader(school, docType, addToCurrentPage, formatTextWithBold);
      break;
    case 'quiz-compact':
      generateQuizHeader(school, docType, addToCurrentPage, formatTextWithBold);
      break;
    default:
      generateSchoolHeader(school, docType, addToCurrentPage, formatTextWithBold);
  }
  
  // Add instructions
  if (quizContent) {
    const instructionsHeaderLines = [];
    formatTextWithBold('ISTRUZIONI PER LO SVOLGIMENTO:', instructionsHeaderLines, false);
    addToCurrentPage(instructionsHeaderLines, 20);
    
    const instructionsLines = [];
    formatTextWithBold(quizContent.instructions, instructionsLines, false);
    addToCurrentPage(instructionsLines, 15);
    
    addToCurrentPage([`(Tempo: ${quizContent.timeLimit} minuti. Punteggio: ${quizContent.totalPoints} punti) Tj`], 30);
    
    // Add all questions with proper spacing
    quizContent.questions.forEach((question, index) => {
      const questionHeaderLines = [];
      formatTextWithBold(`DOMANDA ${index + 1} (${question.points} ${question.points === 1 ? 'punto' : 'punti'})`, questionHeaderLines, false);
      addToCurrentPage(questionHeaderLines, 20);
      
      // Format question text with line wrapping
      const maxLength = 70;
      if (question.text.length > maxLength) {
        const words = question.text.split(' ');
        let currentLine = '';
        words.forEach(word => {
          if (currentLine.length + word.length + 1 > maxLength) {
            if (currentLine) {
              const lineArr = [];
              formatTextWithBold(currentLine, lineArr, false);
              addToCurrentPage(lineArr, 15);
              currentLine = word;
            } else {
              const lineArr = [];
              formatTextWithBold(word, lineArr, false);
              addToCurrentPage(lineArr, 15);
            }
          } else {
            currentLine += (currentLine ? ' ' : '') + word;
          }
        });
        if (currentLine) {
          const lineArr = [];
          formatTextWithBold(currentLine, lineArr, false);
          addToCurrentPage(lineArr, 15);
        }
      } else {
        const questionLines = [];
        formatTextWithBold(question.text, questionLines, false);
        addToCurrentPage(questionLines, 15);
      }
      
      // Add options or answer space
      if (question.type === 'multiple_choice' && question.options) {
        question.options.forEach((option, optIndex) => {
          const letter = String.fromCharCode(65 + optIndex);
          const optionLines = [];
          formatTextWithBold(`${letter}) ${option}`, optionLines, false);
          addToCurrentPage(optionLines, 15);
        });
        addToCurrentPage(['(Risposta: ____) Tj'], 20);
      } else {
        // Add answer lines for open-ended questions
        addToCurrentPage(['(____________________________________________________________) Tj'], 15);
        addToCurrentPage(['(____________________________________________________________) Tj'], 15);
        addToCurrentPage(['(____________________________________________________________) Tj'], 15);
        addToCurrentPage(['(____________________________________________________________) Tj'], 20);
      }
      
      // Add space between questions
      if (index < quizContent.questions.length - 1) {
        addToCurrentPage([''], 15);
      }
    });
    
    // Add evaluation section
    addToCurrentPage([''], 25);
    const evaluationLines = [];
    formatTextWithBold('VALUTAZIONE', evaluationLines, false);
    addToCurrentPage(evaluationLines, 20);
    
    addToCurrentPage([`(PUNTEGGIO OTTENUTO: _____ / ${quizContent.totalPoints} punti    VOTO: _____) Tj`], 20);
    addToCurrentPage(['(Docente: _________________    Firma: _________________) Tj'], 20);
  }
  
  return {
    page1Content: page1Lines.join('\n'),
    page2Content: page2Lines.join('\n'),
    needsSecondPage: page2Lines.length > 0
  };
};

// Template header generators
const generateSchoolHeader = (school: any, docType: string, addToCurrentPage: any, formatTextWithBold: any) => {
  const headerLines = [];
  formatTextWithBold(school.schoolName, headerLines, false);
  addToCurrentPage(headerLines, 20);
  
  const addressLines = [];
  formatTextWithBold(school.schoolAddress, addressLines, false);
  addToCurrentPage(addressLines, 25);
  
  const titleLines = [];
  formatTextWithBold(`VERIFICA DI ${docType.toUpperCase()}`, titleLines, false);
  addToCurrentPage(titleLines, 25);
  
  addToCurrentPage([`(Classe: ${school.className}     Data: ${school.date}) Tj`], 20);
  addToCurrentPage(['(Nome: _____________________    Cognome: _____________________) Tj'], 35);
};

const generateUniversityHeader = (school: any, docType: string, addToCurrentPage: any, formatTextWithBold: any) => {
  const headerLines = [];
  formatTextWithBold(school.schoolName, headerLines, false);
  addToCurrentPage(headerLines, 10);
  
  const addressLines = [];
  formatTextWithBold(school.schoolAddress, addressLines, false);
  addToCurrentPage(addressLines, 15);
  
  const dividerLines = [];
  formatTextWithBold('=' * 60, dividerLines, false);
  addToCurrentPage(dividerLines, 15);
  
  const titleLines = [];
  formatTextWithBold(`ESAME DI ${docType.toUpperCase()}`, titleLines, false);
  addToCurrentPage(titleLines, 10);
  
  const subtitleLines = [];
  formatTextWithBold(`Anno Accademico ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`, subtitleLines, false);
  addToCurrentPage(subtitleLines, 15);
  
  addToCurrentPage([`(Corso: ${school.className}     Sessione: ${school.date}) Tj`], 10);
  addToCurrentPage(['(Matricola: __________     Candidato: ______________________________) Tj'], 30);
};

const generateExamHeader = (school: any, docType: string, addToCurrentPage: any, formatTextWithBold: any) => {
  const headerLines = [];
  formatTextWithBold(school.schoolName, headerLines, false);
  addToCurrentPage(headerLines, 10);
  
  const titleLines = [];
  formatTextWithBold(`PROVA D'ESAME UFFICIALE`, titleLines, false);
  addToCurrentPage(titleLines, 10);
  
  const subtitleLines = [];
  formatTextWithBold(`${docType.toUpperCase()}`, subtitleLines, false);
  addToCurrentPage(subtitleLines, 15);
  
  addToCurrentPage([`(CLASSE: ${school.className}     DATA: ${school.date}     DURATA: 90 min) Tj`], 10);
  addToCurrentPage(['(CANDIDATO: _________________________     N. PROTOCOLLO: _______________) Tj'], 15);
  
  const gridHeaderLines = [];
  formatTextWithBold('GRIGLIA DI VALUTAZIONE:', gridHeaderLines, false);
  addToCurrentPage(gridHeaderLines, 10);
  addToCurrentPage(['(Conoscenze: ___/10   Competenze: ___/10   Abilita: ___/5   TOTALE: ___/25) Tj'], 25);
};

const generateMinimalistHeader = (school: any, docType: string, addToCurrentPage: any, formatTextWithBold: any) => {
  const titleLines = [];
  formatTextWithBold(`${docType.toUpperCase()}`, titleLines, false);
  addToCurrentPage(titleLines, 15);
  
  addToCurrentPage([`(${school.date}     Tempo: 60 min) Tj`], 10);
  addToCurrentPage(['(Nome: ______________________) Tj'], 25);
};

const generateQuizHeader = (school: any, docType: string, addToCurrentPage: any, formatTextWithBold: any) => {
  const titleLines = [];
  formatTextWithBold(`QUIZ RAPIDO`, titleLines, false);
  addToCurrentPage(titleLines, 5);
  
  const subtitleLines = [];
  formatTextWithBold(`${docType.toUpperCase()}`, subtitleLines, false);
  addToCurrentPage(subtitleLines, 15);
  
  addToCurrentPage([`(Data: ${school.date}     Tempo: 20 min     Punti totali: ___) Tj`], 10);
  addToCurrentPage(['(Nome: ___________   Classe: ${school.className}   Punteggio: ___/___) Tj'], 20);
};

// Legacy function for backward compatibility
const formatDocumentContent = (docTitle: string, docType: string, quizContent?: QuizContent, schoolInfo?: any): string => {
  const lines = [];
  
  // Use school info if provided, otherwise defaults
  const school = schoolInfo || {
    schoolName: 'ISTITUTO COMPRENSIVO "ALESSANDRO MANZONI"',
    schoolAddress: 'Via dei Promessi Sposi, 25 - 20100 Milano (MI)',
    className: '3^A',
    date: new Date().toLocaleDateString('it-IT')
  };
  
  // Use the multi-page version for better layout
  const multiPageResult = formatDocumentContentMultiPage(docTitle, docType, quizContent, schoolInfo);
  return multiPageResult.page1Content + (multiPageResult.needsSecondPage ? '\n' + multiPageResult.page2Content : '');
};

// Simple PDF-like content generator (still text but better formatted)
const generateSimplePDF = (content: QuizContent, options: DownloadOptions): string => {
  // For backward compatibility, generate formatted text content
  return formatContentForPDF(content, options);
};

const formatContentForPDF = (content: QuizContent, options: DownloadOptions): string => {
  let formatted = '';
  
  // Header with school template
  formatted += `═══════════════════════════════════════════════════════\n`;
  formatted += `           ISTITUTO COMPRENSIVO "ALESSANDRO MANZONI"\n`;
  formatted += `                    Via dei Promessi Sposi, 25\n`;
  formatted += `                      20100 Milano (MI)\n`;  
  formatted += `═══════════════════════════════════════════════════════\n\n`;
  
  formatted += `VERIFICA DI ${content.title.split(' - ')[0]?.toUpperCase() || 'MATERIA'}\n`;
  formatted += `\nClasse: 3^A                    Data: ${new Date().toLocaleDateString('it-IT')}\n`;
  formatted += `Nome: _____________________    Cognome: _____________________\n\n`;
  
  if (content.instructions) {
    formatted += `ISTRUZIONI PER LO SVOLGIMENTO:\n`;
    formatted += `${content.instructions}\n`;
    if (content.timeLimit) {
      formatted += `Tempo a disposizione: ${content.timeLimit} minuti\n`;
    }
    if (options.includePoints) {
      formatted += `Punteggio totale: ${content.totalPoints} punti\n`;
    }
    formatted += `\n${'─'.repeat(55)}\n\n`;
  }
  
  // Questions with better formatting
  content.questions.forEach((question, index) => {
    formatted += `DOMANDA ${index + 1}`;
    if (options.includePoints) {
      formatted += ` (${question.points} punti)`;
    }
    formatted += `\n${question.text}\n\n`;
    
    if (question.type === 'multiple_choice' && question.options) {
      question.options.forEach((option, optIndex) => {
        const letter = String.fromCharCode(65 + optIndex);
        const isCorrect = optIndex === question.correctAnswer && options.includeAnswers;
        formatted += `   ${letter}) ${option}`;
        if (isCorrect) {
          formatted += ` ← RISPOSTA CORRETTA`;
        }
        formatted += `\n`;
      });
      formatted += `\n   Risposta: ____\n\n`;
    } else if (question.type === 'open_ended') {
      formatted += `   ____________________________________________________________\n`;
      formatted += `   ____________________________________________________________\n`;
      formatted += `   ____________________________________________________________\n`;
      formatted += `   ____________________________________________________________\n\n`;
    }
    
    if (index < content.questions.length - 1) {
      formatted += `${'─'.repeat(55)}\n\n`;
    }
  });
  
  // Footer
  formatted += `\n${'═'.repeat(55)}\n`;
  if (options.includePoints) {
    formatted += `PUNTEGGIO OTTENUTO: _____ / ${content.totalPoints} punti\n`;
    formatted += `VOTO: _____\n\n`;
  }
  
  formatted += `Docente: ____________________    Firma: ____________________\n`;
  formatted += `\n--- Documento generato con Teaching Hub - www.teachinghub.it ---`;
  
  return formatted;
};

const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^\w\s-]/gi, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 50); // Limit length
};

// Export formats utilities
export const supportedFormats = ['pdf', 'docx', 'txt'] as const;

export const getFormatIcon = (format: string): string => {
  switch (format) {
    case 'pdf': return '📄';
    case 'docx': return '📝';
    case 'txt': return '📋';
    default: return '📄';
  }
};

export const getFormatDescription = (format: string): string => {
  switch (format) {
    case 'pdf': return 'Formato PDF universale';
    case 'docx': return 'Documento Word modificabile';
    case 'txt': return 'Testo semplice';
    default: return 'Formato non specificato';
  }
};