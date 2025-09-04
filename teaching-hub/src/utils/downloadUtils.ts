import { QuizContent } from '@/types';

export interface DownloadOptions {
  format: 'pdf' | 'docx' | 'txt';
  includeAnswers?: boolean;
  includePoints?: boolean;
}

// PDF generation function with real content
export const generatePDF = async (content: QuizContent, options: DownloadOptions = { format: 'pdf' }): Promise<void> => {
  // Simulate PDF generation delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  const pdfContent = formatContentForPDF(content, options);
  
  // Create a proper text file that can be opened (simulating PDF)
  const mimeType = options.format === 'pdf' ? 'application/pdf' : 'text/plain';
  const blob = new Blob([pdfContent], { 
    type: options.format === 'pdf' ? 'text/plain' : mimeType 
  });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(content.title)}.${options.format === 'pdf' ? 'txt' : options.format}`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadDocument = async (docTitle: string, docType: string, format: 'pdf' | 'docx' | 'txt' = 'pdf'): Promise<void> => {
  // Generate mock quiz content based on document
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

  await generatePDF(mockContent, { format, includeAnswers: true, includePoints: true });
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