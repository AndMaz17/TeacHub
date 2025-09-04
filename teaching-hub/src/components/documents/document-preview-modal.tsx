'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Eye, Download, Share, Star, Printer, Edit, Save } from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import { useDocumentsStore } from '@/store/useDocumentsStore';
import { DocumentType } from '@/types';
import { downloadDocument } from '@/utils/downloadUtils';
import { QuizContent } from '@/types';
import { toast } from 'sonner';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrintPreview?: () => void;
  document: {
    id: string;
    title: string;
    description: string;
    subject: string;
    type: string;
    difficulty: string;
    createdAt: Date;
    tags?: string[];
  };
}

interface DocumentPreview {
  summary: string;
  keyPoints: string[];
  questionCount?: number;
  estimatedTime: number;
  content: Array<{
    section: string;
    preview: string;
  }>;
}

export function DocumentPreviewModal({ isOpen, onClose, onOpenPrintPreview, document }: DocumentPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [quizContent, setQuizContent] = useState<QuizContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState(document);
  const [editedQuizContent, setEditedQuizContent] = useState<QuizContent | null>(null);
  const [editedSchoolInfo, setEditedSchoolInfo] = useState({
    schoolName: "ISTITUTO COMPRENSIVO \"ALESSANDRO MANZONI\"",
    schoolAddress: "Via dei Promessi Sposi, 25 - 20100 Milano (MI)",
    className: "3^A",
    date: new Date().toLocaleDateString('it-IT')
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newDocumentData, setNewDocumentData] = useState({
    title: '',
    tags: [] as string[],
    currentTag: ''
  });
  const { addActivity } = useActivityStore();
  const { addDocument } = useDocumentsStore();

  useEffect(() => {
    if (isOpen) {
      generatePreview();
      setIsEditing(false);
      
      // Inizializza i dati della scuola dal documento se presenti
      if (document.schoolInfo) {
        setEditedSchoolInfo(document.schoolInfo);
      } else {
        // Usa i valori di default
        setEditedSchoolInfo({
          schoolName: "ISTITUTO COMPRENSIVO \"ALESSANDRO MANZONI\"",
          schoolAddress: "Via dei Promessi Sposi, 25 - 20100 Milano (MI)",
          className: "3^A",
          date: new Date().toLocaleDateString('it-IT')
        });
      }
    }
  }, [isOpen, document]);

  useEffect(() => {
    setEditedDocument(document);
  }, [document]);

  const generatePreview = async () => {
    setIsLoading(true);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

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

  const handleDownload = async () => {
    toast.loading(`Preparazione download "${document.title}"...`);
    try {
      await downloadDocument(document.title, document.type, 'pdf');
      
      addActivity({
        type: 'download',
        title: 'Documento scaricato',
        description: `Hai scaricato "${document.title}"`,
        icon: 'download'
      });
      
      toast.success(`"${document.title}" scaricato con successo!`);
    } catch (error) {
      toast.error('Errore durante il download');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/documents/${document.id}`);
    
    addActivity({
      type: 'share',
      title: 'Documento condiviso',
      description: `Hai condiviso "${document.title}"`,
      icon: 'share'
    });
    
    toast.success(`Link di "${document.title}" copiato negli appunti`);
  };

  const handleStar = () => {
    addActivity({
      type: 'save',
      title: 'Documento preferito',
      description: `Hai aggiunto "${document.title}" ai preferiti`,
      icon: 'save'
    });
    
    toast.success(`"${document.title}" aggiunto ai preferiti`);
  };

  const handleEdit = () => {
    setEditedQuizContent(quizContent);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedDocument(document);
    setEditedQuizContent(quizContent);
    setIsEditing(false);
  };

  const handleSaveAsNew = () => {
    setNewDocumentData({
      title: `${editedDocument.title} - Copia`,
      tags: [],
      currentTag: ''
    });
    setShowSaveModal(true);
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

  const updateQuestionText = (questionId: string, newText: string) => {
    if (!editedQuizContent) return;
    const updatedQuestions = editedQuizContent.questions.map(q => 
      q.id === questionId ? { ...q, text: newText } : q
    );
    setEditedQuizContent({ ...editedQuizContent, questions: updatedQuestions });
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, newOption: string) => {
    if (!editedQuizContent) return;
    const updatedQuestions = editedQuizContent.questions.map(q => 
      q.id === questionId && q.options ? { 
        ...q, 
        options: q.options.map((opt, idx) => idx === optionIndex ? newOption : opt)
      } : q
    );
    setEditedQuizContent({ ...editedQuizContent, questions: updatedQuestions });
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Caricamento Preview...
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <h3 className="text-lg font-semibold">Generazione anteprima...</h3>
            <p className="text-gray-600 text-center">
              Stiamo analizzando "{document.title}" per generare una sintesi completa
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const addTagToNewDocument = () => {
    if (newDocumentData.currentTag.trim()) {
      setNewDocumentData({
        ...newDocumentData,
        tags: [...newDocumentData.tags, newDocumentData.currentTag.trim()],
        currentTag: ''
      });
    }
  };

  const removeTagFromNewDocument = (tagToRemove: string) => {
    setNewDocumentData({
      ...newDocumentData,
      tags: newDocumentData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const confirmSaveAsNew = () => {
    if (!newDocumentData.title.trim()) {
      toast.error('Inserisci un titolo per il documento');
      return;
    }

    // Inferisce il grade dalla className modificata
    const inferGradeFromClassName = (className: string): string => {
      const match = className.match(/(\d+)/);
      if (match) {
        const classNumber = parseInt(match[1]);
        return `${classNumber}° Superiore`;
      }
      return editedDocument.grade || '3° Superiore';
    };

    // Creo il nuovo documento basato su quello editato
    const newDocument = {
      title: newDocumentData.title,
      content: editedQuizContent || quizContent || { questions: [] },
      type: document.type as DocumentType,
      subject: editedDocument.subject,
      grade: inferGradeFromClassName(editedSchoolInfo.className),
      difficulty: document.difficulty,
      tags: newDocumentData.tags.length > 0 ? newDocumentData.tags : document.tags || [],
      isPublic: false,
      schoolInfo: {
        schoolName: editedSchoolInfo.schoolName,
        schoolAddress: editedSchoolInfo.schoolAddress,
        className: editedSchoolInfo.className,
        date: editedSchoolInfo.date
      }
    };

    addDocument(newDocument);
    
    addActivity({
      type: 'save',
      title: 'Nuovo documento creato',
      description: `Hai creato "${newDocumentData.title}" da una modifica`,
      icon: 'save'
    });
    
    toast.success(`Documento "${newDocumentData.title}" salvato con successo!`);
    setShowSaveModal(false);
    setIsEditing(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview: {document.title}
            </DialogTitle>
            <DialogDescription>
              Anteprima del documento formattato per la stampa
            </DialogDescription>
          
          {/* Actions moved to top */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                  Annulla Modifiche
                </Button>
                <Button onClick={handleSaveAsNew} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Salva come Nuovo
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleEdit} variant="outline" className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifica
                </Button>
                <Button onClick={handleStar} variant="outline" className="flex-1">
                  <Star className="mr-2 h-4 w-4" />
                  Preferiti
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share className="mr-2 h-4 w-4" />
                  Condividi
                </Button>
                <Button onClick={handlePrint} variant="outline" className="flex-1">
                  <Printer className="mr-2 h-4 w-4" />
                  Stampa
                </Button>
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Scarica PDF
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        {quizContent && (
          <div className="space-y-6">
            {/* Formatted Document */}
            <div className="bg-white p-8 border rounded-lg print:border-0 print:p-0 font-serif">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="border-b-2 border-double border-gray-800 pb-4 mb-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editedSchoolInfo.schoolName}
                        onChange={(e) => setEditedSchoolInfo({...editedSchoolInfo, schoolName: e.target.value})}
                        className="text-center font-bold text-lg"
                      />
                      <Input
                        value={editedSchoolInfo.schoolAddress}
                        onChange={(e) => setEditedSchoolInfo({...editedSchoolInfo, schoolAddress: e.target.value})}
                        className="text-center text-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-lg font-bold">{editedSchoolInfo.schoolName}</h1>
                      <p className="text-sm">{editedSchoolInfo.schoolAddress}</p>
                    </>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="mb-4">
                    <Label htmlFor="header-subject" className="text-sm">Materia per intestazione</Label>
                    <Input
                      id="header-subject"
                      value={editedDocument.subject}
                      onChange={(e) => setEditedDocument({...editedDocument, subject: e.target.value})}
                      className="text-center font-bold text-xl uppercase mt-2"
                    />
                  </div>
                ) : (
                  <h2 className="text-xl font-bold uppercase mb-4">
                    VERIFICA DI {document.subject.toUpperCase()}
                  </h2>
                )}
                
                <div className="flex justify-between items-center text-sm mb-6">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span>Classe:</span>
                        <Input
                          value={editedSchoolInfo.className}
                          onChange={(e) => setEditedSchoolInfo({...editedSchoolInfo, className: e.target.value})}
                          className="w-20 h-6 text-sm text-center"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Data:</span>
                        <Input
                          value={editedSchoolInfo.date}
                          onChange={(e) => setEditedSchoolInfo({...editedSchoolInfo, date: e.target.value})}
                          className="w-24 h-6 text-sm text-center"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>Classe: {editedSchoolInfo.className}</div>
                      <div>Data: {editedSchoolInfo.date}</div>
                    </>
                  )}
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
                {(isEditing ? editedQuizContent : quizContent)?.questions.map((question, index) => (
                  <div key={question.id} className="break-inside-avoid">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-base">
                        DOMANDA {index + 1}
                      </h4>
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                        {question.points} punti
                      </span>
                    </div>
                    
                    {isEditing ? (
                      <Textarea
                        value={question.text}
                        onChange={(e) => updateQuestionText(question.id, e.target.value)}
                        className="mb-4 text-sm leading-relaxed min-h-[60px]"
                      />
                    ) : (
                      <p className="mb-4 text-sm leading-relaxed">{question.text}</p>
                    )}
                    
                    {question.type === 'multiple_choice' && question.options ? (
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-start gap-2">
                            <span className="font-medium min-w-[20px]">
                              {String.fromCharCode(65 + optIndex)})
                            </span>
                            {isEditing ? (
                              <Input
                                value={option}
                                onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                                className="text-sm flex-1"
                              />
                            ) : (
                              <span className="text-sm">{option}</span>
                            )}
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
                    
                    {index < (isEditing ? editedQuizContent : quizContent)!.questions.length - 1 && (
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

    {/* Save As New Modal */}
    <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Salva come nuovo documento</DialogTitle>
          <DialogDescription>
            Inserisci il nome e i tag per il nuovo documento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-title">Nome documento</Label>
            <Input
              id="new-title"
              value={newDocumentData.title}
              onChange={(e) => setNewDocumentData({...newDocumentData, title: e.target.value})}
              placeholder="Inserisci il nome del documento..."
            />
          </div>
          
          <div>
            <Label>Tag associati</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newDocumentData.currentTag}
                onChange={(e) => setNewDocumentData({...newDocumentData, currentTag: e.target.value})}
                placeholder="Aggiungi tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTagToNewDocument();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addTagToNewDocument}
                disabled={!newDocumentData.currentTag.trim()}
              >
                Aggiungi
              </Button>
            </div>
            
            {newDocumentData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {newDocumentData.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeTagFromNewDocument(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowSaveModal(false)}>
            Annulla
          </Button>
          <Button onClick={confirmSaveAsNew}>
            Salva documento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}