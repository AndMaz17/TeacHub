'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Printer, Download, Eye } from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import { QuizContent } from '@/types';
import { downloadDocument } from '@/utils/downloadUtils';
import { toast } from 'sonner';

interface DocumentPrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    title: string;
    description: string;
    subject: string;
    type: string;
    difficulty: string;
    createdAt: Date;
  };
}

export function DocumentPrintPreview({ isOpen, onClose, document }: DocumentPrintPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [quizContent, setQuizContent] = useState<QuizContent | null>(null);
  const { addActivity } = useActivityStore();

  useEffect(() => {
    if (isOpen) {
      generatePrintPreview();
    }
  }, [isOpen]);

  const generatePrintPreview = async () => {
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate realistic quiz content based on document
    const content = generateQuizContent(document);
    setQuizContent(content);
    setIsLoading(false);
  };

  const generateQuizContent = (doc: typeof document): QuizContent => {
    const baseContent = {
      title: doc.title,
      instructions: `Leggi attentamente ogni domanda e scegli la risposta corretta. Tempo a disposizione: 60 minuti. Buon lavoro!`,
      timeLimit: 60,
      totalPoints: 25
    };

    if (doc.subject === 'Matematica') {
      return {
        ...baseContent,
        questions: [
          {
            id: '1',
            text: 'Risolvi la seguente equazione di secondo grado: x² - 5x + 6 = 0',
            type: 'multiple_choice',
            options: ['x = 2 e x = 3', 'x = 1 e x = 6', 'x = -2 e x = -3', 'x = 0 e x = 5'],
            correctAnswer: 0,
            points: 5
          },
          {
            id: '2',
            text: 'Calcola il valore dell\'espressione: (3x + 2)² quando x = 1',
            type: 'multiple_choice',
            options: ['25', '11', '17', '9'],
            correctAnswer: 0,
            points: 4
          },
          {
            id: '3',
            text: 'Dimostra che la funzione f(x) = x² - 4x + 3 ha due zeri reali e calcolali.',
            type: 'open_ended',
            points: 8
          },
          {
            id: '4',
            text: 'Il discriminante di un\'equazione ax² + bx + c = 0 è:',
            type: 'multiple_choice',
            options: ['b² - 4ac', 'b² + 4ac', '4ac - b²', 'ab - 4c'],
            correctAnswer: 0,
            points: 3
          },
          {
            id: '5',
            text: 'Determina l\'insieme di definizione della funzione f(x) = √(x - 2) e traccia un grafico approssimativo.',
            type: 'open_ended',
            points: 5
          }
        ]
      };
    } else if (doc.subject === 'Letteratura Italiana' || doc.subject === 'Italiano') {
      return {
        ...baseContent,
        questions: [
          {
            id: '1',
            text: 'Chi è l\'autore della Divina Commedia?',
            type: 'multiple_choice',
            options: ['Dante Alighieri', 'Francesco Petrarca', 'Giovanni Boccaccio', 'Ludovico Ariosto'],
            correctAnswer: 0,
            points: 2
          },
          {
            id: '2',
            text: 'In quale anno inizia il viaggio di Dante descritto nella Divina Commedia?',
            type: 'multiple_choice',
            options: ['1300', '1321', '1265', '1290'],
            correctAnswer: 0,
            points: 3
          },
          {
            id: '3',
            text: 'Analizza il significato allegorico della "selva oscura" nel primo canto dell\'Inferno, facendo riferimento al contesto biografico di Dante.',
            type: 'open_ended',
            points: 10
          },
          {
            id: '4',
            text: 'Le tre fiere che ostacolano Dante simboleggiano:',
            type: 'multiple_choice',
            options: [
              'I peccati di incontinenza, violenza e frode',
              'I tre regni dell\'oltretomba', 
              'Le tre guide del viaggio',
              'Gli ostacoli politici dell\'epoca'
            ],
            correctAnswer: 0,
            points: 4
          },
          {
            id: '5',
            text: 'Commenta il ruolo di Virgilio come guida di Dante, spiegando perché Dante sceglie proprio lui.',
            type: 'open_ended',
            points: 6
          }
        ]
      };
    } else if (doc.subject === 'Storia') {
      return {
        ...baseContent,
        questions: [
          {
            id: '1',
            text: 'In che anno iniziò la Rivoluzione Francese?',
            type: 'multiple_choice',
            options: ['1789', '1788', '1790', '1791'],
            correctAnswer: 0,
            points: 2
          },
          {
            id: '2',
            text: 'La presa della Bastiglia avvenne il:',
            type: 'multiple_choice',
            options: ['14 luglio 1789', '14 luglio 1790', '15 luglio 1789', '13 luglio 1789'],
            correctAnswer: 0,
            points: 3
          },
          {
            id: '3',
            text: 'Analizza le principali cause economiche, sociali e politiche che portarono alla Rivoluzione Francese.',
            type: 'open_ended',
            points: 12
          },
          {
            id: '4',
            text: 'Chi fu il primo re ghigliottinato durante la Rivoluzione?',
            type: 'multiple_choice',
            options: ['Luigi XVI', 'Luigi XIV', 'Luigi XVIII', 'Carlo X'],
            correctAnswer: 0,
            points: 3
          },
          {
            id: '5',
            text: 'Descrivi l\'importanza della Dichiarazione dei Diritti dell\'Uomo e del Cittadino nel contesto rivoluzionario.',
            type: 'open_ended',
            points: 5
          }
        ]
      };
    }

    // Default generic content
    return {
      ...baseContent,
      questions: [
        {
          id: '1',
          text: `Domanda di base su ${doc.subject}`,
          type: 'multiple_choice',
          options: ['Opzione A', 'Opzione B', 'Opzione C', 'Opzione D'],
          correctAnswer: 0,
          points: 5
        },
        {
          id: '2',
          text: `Domanda aperta riguardante ${doc.subject}`,
          type: 'open_ended',
          points: 10
        },
        {
          id: '3',
          text: `Seconda domanda di approfondimento su ${doc.subject}`,
          type: 'multiple_choice',
          options: ['Prima scelta', 'Seconda scelta', 'Terza scelta', 'Quarta scelta'],
          correctAnswer: 1,
          points: 5
        },
        {
          id: '4',
          text: `Esercizio pratico di ${doc.subject}`,
          type: 'open_ended',
          points: 5
        }
      ]
    };
  };

  const handlePrint = () => {
    window.print();
    
    addActivity({
      type: 'save',
      title: 'Documento stampato',
      description: `Hai inviato in stampa "${document.title}"`,
      icon: 'save'
    });
    
    toast.success(`"${document.title}" inviato alla stampa`);
  };

  const handleDownload = async () => {
    if (!quizContent) return;
    
    toast.loading(`Preparazione download "${document.title}"...`);
    try {
      await downloadDocument(document.title, document.type, 'pdf');
      
      addActivity({
        type: 'download',
        title: 'Documento scaricato',
        description: `Hai scaricato "${document.title}" (versione stampa)`,
        icon: 'download'
      });
      
      toast.success(`"${document.title}" scaricato con successo!`);
    } catch (error) {
      toast.error('Errore durante il download');
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Preparazione Preview Stampa...
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <h3 className="text-lg font-semibold">Generazione anteprima stampa...</h3>
            <p className="text-gray-600 text-center">
              Stiamo formattando "{document.title}" per la stampa
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Anteprima di Stampa: {document.title}
          </DialogTitle>
          <DialogDescription>
            Preview del documento formattato per la stampa scolastica
          </DialogDescription>
        </DialogHeader>

        {quizContent && (
          <div className="space-y-6">
            {/* Print Actions */}
            <div className="flex gap-3 print:hidden">
              <Button onClick={handlePrint} className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Stampa
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Scarica PDF
              </Button>
            </div>

            <Separator className="print:hidden" />

            {/* Formatted Document */}
            <div className="bg-white p-8 border rounded-lg print:border-0 print:p-0 font-serif">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="border-b-2 border-double border-gray-800 pb-4 mb-4">
                  <h1 className="text-lg font-bold">ISTITUTO COMPRENSIVO "ALESSANDRO MANZONI"</h1>
                  <p className="text-sm">Via dei Promessi Sposi, 25 - 20100 Milano (MI)</p>
                </div>
                
                <h2 className="text-xl font-bold uppercase mb-4">
                  VERIFICA DI {document.subject.toUpperCase()}
                </h2>
                
                <div className="flex justify-between items-center text-sm mb-6">
                  <div>Classe: 3^A</div>
                  <div>Data: {new Date().toLocaleDateString('it-IT')}</div>
                </div>
                
                <div className="flex justify-between mb-6">
                  <div className="flex-1">
                    <span className="text-sm">Nome: </span>
                    <span className="inline-block border-b border-gray-400 w-40 ml-2"></span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm">Cognome: </span>
                    <span className="inline-block border-b border-gray-400 w-40 ml-2"></span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-8 p-4 bg-gray-50 rounded border print:bg-transparent print:border-gray-400">
                <h3 className="font-bold mb-2">ISTRUZIONI PER LO SVOLGIMENTO:</h3>
                <p className="text-sm">{quizContent.instructions}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Tempo a disposizione: {quizContent.timeLimit} minuti</span>
                  <span>Punteggio totale: {quizContent.totalPoints} punti</span>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {quizContent.questions.map((question, index) => (
                  <div key={question.id} className="break-inside-avoid">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-base">
                        DOMANDA {index + 1}
                      </h4>
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                        {question.points} punti
                      </span>
                    </div>
                    
                    <p className="mb-4 text-sm leading-relaxed">{question.text}</p>
                    
                    {question.type === 'multiple_choice' && question.options ? (
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-start gap-2">
                            <span className="font-medium min-w-[20px]">
                              {String.fromCharCode(65 + optIndex)})
                            </span>
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                        <div className="mt-4">
                          <span className="text-sm font-medium">Risposta: </span>
                          <span className="inline-block border-b border-gray-400 w-8 ml-2"></span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map(line => (
                          <div key={line} className="border-b border-gray-400 h-6"></div>
                        ))}
                      </div>
                    )}
                    
                    {index < quizContent.questions.length - 1 && (
                      <hr className="my-6 border-gray-300" />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t-2 border-double border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm font-medium">PUNTEGGIO OTTENUTO: </span>
                    <span className="inline-block border-b border-gray-400 w-12 mx-2"></span>
                    <span className="text-sm">/ {quizContent.totalPoints} punti</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">VOTO: </span>
                    <span className="inline-block border-b border-gray-400 w-12 ml-2"></span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <div>
                    <span className="text-sm">Docente: </span>
                    <span className="inline-block border-b border-gray-400 w-40 ml-2"></span>
                  </div>
                  <div>
                    <span className="text-sm">Firma: </span>
                    <span className="inline-block border-b border-gray-400 w-32 ml-2"></span>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <div className="text-center mt-8 text-xs text-gray-500">
                Documento generato con Teaching Hub - www.teachinghub.it
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}