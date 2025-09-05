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
import { downloadDocument, generatePDF } from '@/utils/downloadUtils';
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
    try {
      toast.loading(`Preparazione download "${document.title}"...`);
      
      const currentQuizContent = editedQuizContent || quizContent;
      if (!currentQuizContent) {
        toast.error('Contenuto non disponibile');
        return;
      }

      // Create a formatted document using the utility
      const documentData = {
        title: `${editedDocument.subject} - ${editedDocument.title}`,
        instructions: currentQuizContent.instructions,
        questions: currentQuizContent.questions,
        totalPoints: currentQuizContent.totalPoints,
        timeLimit: currentQuizContent.timeLimit,
        schoolInfo: editedSchoolInfo
      };

      // Generate and download PDF using utility function
      await downloadDocument(
        documentData.title, 
        editedDocument.subject,
        'pdf',
        currentQuizContent,
        editedSchoolInfo
      );
      
      addActivity({
        type: 'download',
        title: 'Documento scaricato',
        description: `Hai scaricato "${document.title}"`,
        icon: 'download'
      });
      
      toast.success(`"${document.title}" scaricato con successo!`);
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Errore durante il download del documento.');
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
            <div data-document-content className="bg-white shadow-xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden font-sans print:font-serif">
              {/* Professional Header */}
              <div className="bg-white border-b-2 border-slate-800 p-6 print:border-b-2 print:border-gray-800">
                <div className="text-center">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editedSchoolInfo.schoolName}
                        onChange={(e) => setEditedSchoolInfo({...editedSchoolInfo, schoolName: e.target.value})}
                        className="text-center font-bold text-lg text-gray-900 border-2 border-slate-200 focus:border-slate-400"
                      />
                      <Input
                        value={editedSchoolInfo.schoolAddress}
                        onChange={(e) => setEditedSchoolInfo({...editedSchoolInfo, schoolAddress: e.target.value})}
                        className="text-center text-sm text-gray-700 border-2 border-slate-200 focus:border-slate-400"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold mb-2 text-gray-900 print:text-lg print:text-black">{editedSchoolInfo.schoolName}</h1>
                      <p className="text-gray-600 print:text-sm print:text-gray-600">{editedSchoolInfo.schoolAddress}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="p-8">
                {/* Subject Title */}
                <div className="text-center mb-8">
                  {isEditing ? (
                    <div className="mb-4">
                      <Label htmlFor="header-subject" className="text-sm text-gray-600">Materia per intestazione</Label>
                      <Input
                        id="header-subject"
                        value={editedDocument.subject}
                        onChange={(e) => setEditedDocument({...editedDocument, subject: e.target.value})}
                        className="text-center font-bold text-2xl uppercase mt-2 border-2 border-slate-200 focus:border-slate-400"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <h2 className="text-3xl font-bold text-slate-800 mb-4 print:text-xl print:uppercase">
                        VERIFICA DI {document.subject.toUpperCase()}
                      </h2>
                      <div className="w-24 h-0.5 bg-slate-800 mx-auto print:hidden"></div>
                    </div>
                  )}
                </div>
                
                {/* Student Info Card */}
                <div className="bg-slate-50 print:bg-white border border-slate-200 print:border-gray-300 p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600">Classe:</span>
                        {isEditing ? (
                          <Input
                            value={editedSchoolInfo.className}
                            onChange={(e) => setEditedSchoolInfo({...editedSchoolInfo, className: e.target.value})}
                            className="w-24 h-8 text-sm text-center border-slate-200 focus:border-slate-400"
                          />
                        ) : (
                          <span className="font-bold text-slate-700 print:text-black">{editedSchoolInfo.className}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600">Data:</span>
                        {isEditing ? (
                          <Input
                            value={editedSchoolInfo.date}
                            onChange={(e) => setEditedSchoolInfo({...editedSchoolInfo, date: e.target.value})}
                            className="w-28 h-8 text-sm text-center border-slate-200 focus:border-slate-400"
                          />
                        ) : (
                          <span className="font-bold text-slate-700 print:text-black">{editedSchoolInfo.date}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-600 mr-3">Nome:</span>
                        <div className="flex-1 border-b-2 border-slate-300 pb-1"></div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-600 mr-3">Cognome:</span>
                        <div className="flex-1 border-b-2 border-slate-300 pb-1"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions Card */}
                <div className="bg-slate-100 print:bg-gray-50 border border-slate-300 print:border-gray-400 p-6 mb-8">
                  <h3 className="font-bold text-slate-800 print:text-gray-800 mb-3 text-center">ISTRUZIONI PER LO SVOLGIMENTO</h3>
                  <div className="border-t border-slate-300 pt-4">
                    <p className="text-slate-700 print:text-gray-700 text-sm mb-4 text-center">{quizContent.instructions}</p>
                    <div className="flex justify-center gap-8 text-sm">
                      <div className="text-center">
                        <span className="font-semibold text-slate-700 print:text-gray-700">⏱ Tempo:</span>
                        <div className="font-bold text-slate-800 print:text-gray-800">{quizContent.timeLimit} minuti</div>
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-slate-700 print:text-gray-700">🎯 Punteggio:</span>
                        <div className="font-bold text-slate-800 print:text-gray-800">{quizContent.totalPoints} punti</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-8">
                  {(isEditing ? editedQuizContent : quizContent)?.questions.map((question, index) => (
                    <div key={question.id} className="break-inside-avoid">
                      {/* Question Card */}
                      <div className="bg-white print:bg-transparent border border-slate-200 print:border-gray-300 p-6 print:p-4">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 print:bg-gray-600 flex items-center justify-center">
                              <span className="text-white font-bold text-lg print:text-sm">{index + 1}</span>
                            </div>
                            <h4 className="font-bold text-lg text-slate-800 print:text-base">
                              DOMANDA {index + 1}
                            </h4>
                          </div>
                          <span className="bg-slate-200 print:bg-gray-200 text-slate-800 print:text-black px-3 py-1 text-sm font-semibold">
                            {question.points} {question.points === 1 ? 'punto' : 'punti'}
                          </span>
                        </div>
                        
                        {/* Question Text */}
                        <div className="mb-6">
                          {isEditing ? (
                            <Textarea
                              value={question.text}
                              onChange={(e) => updateQuestionText(question.id, e.target.value)}
                              className="mb-4 text-sm leading-relaxed min-h-[80px] border-2 border-slate-300 focus:border-slate-500"
                            />
                          ) : (
                            <div className="bg-slate-50 print:bg-transparent p-4 border-l-4 border-slate-400 print:border-gray-400">
                              <p className="text-slate-800 leading-relaxed">{question.text}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Answer Section */}
                        <div className="mt-6">
                          {question.type === 'multiple_choice' && question.options ? (
                            <div className="space-y-3">
                              <h5 className="font-semibold text-slate-700 mb-4 print:mb-2">Opzioni di risposta:</h5>
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-3 p-3 bg-slate-50 print:bg-transparent border border-slate-200 print:border-gray-200 mb-2">
                                  <div className="w-8 h-8 bg-slate-700 print:bg-gray-400 text-white flex items-center justify-center font-bold">
                                    {String.fromCharCode(65 + optIndex)}
                                  </div>
                                  {isEditing ? (
                                    <Input
                                      value={option}
                                      onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                                      className="text-sm flex-1 border-slate-200 focus:border-slate-400"
                                    />
                                  ) : (
                                    <span className="text-slate-800 flex-1">{option}</span>
                                  )}
                                </div>
                              ))}
                              <div className="mt-6 p-4 bg-slate-50 print:bg-transparent border border-slate-300 print:border-gray-300">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-slate-800 print:text-gray-800">✏️ Risposta:</span>
                                  <div className="border-b-2 border-slate-400 print:border-gray-400 w-16 h-8"></div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <h5 className="font-semibold text-slate-700 mb-4">Spazio per la risposta:</h5>
                              {[1, 2, 3, 4, 5].map(line => (
                                <div key={line} className="border-b-2 border-slate-300 h-8 print:border-gray-400"></div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer - Results Section */}
                <div className="mt-12 bg-slate-50 print:bg-transparent p-6 print:p-4 border-t-4 border-slate-800 print:border-gray-800">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 print:mb-4 text-center">VALUTAZIONE</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Score Section */}
                    <div className="bg-white print:bg-transparent p-4 border border-slate-300 print:border-gray-400">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-600 mb-3">PUNTEGGIO OTTENUTO</p>
                        <div className="flex items-center justify-center gap-3">
                          <div className="border-b-2 border-slate-400 print:border-gray-400 w-16 h-10 bg-slate-50 print:bg-transparent"></div>
                          <span className="text-lg font-bold text-slate-700">/ {quizContent.totalPoints}</span>
                          <span className="text-sm text-slate-500">punti</span>
                        </div>
                      </div>
                    </div>

                    {/* Grade Section */}
                    <div className="bg-white print:bg-transparent p-4 border border-slate-300 print:border-gray-400">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-600 mb-3">VOTO FINALE</p>
                        <div className="border-b-2 border-slate-400 print:border-gray-400 w-20 h-10 bg-slate-50 print:bg-transparent mx-auto"></div>
                      </div>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-300 print:border-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-600 min-w-[80px]">Docente:</span>
                      <div className="flex-1 border-b-2 border-slate-400 print:border-gray-400 h-8 bg-slate-50 print:bg-transparent"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-600 min-w-[60px]">Firma:</span>
                      <div className="flex-1 border-b-2 border-slate-400 print:border-gray-400 h-8 bg-slate-50 print:bg-transparent"></div>
                    </div>
                  </div>
                </div>
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