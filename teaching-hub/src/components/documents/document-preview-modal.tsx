'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Eye, Download, Share, Star, Printer } from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import { downloadDocument } from '@/utils/downloadUtils';
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
  const [preview, setPreview] = useState<DocumentPreview | null>(null);
  const { addActivity } = useActivityStore();

  useEffect(() => {
    if (isOpen) {
      generatePreview();
    }
  }, [isOpen]);

  const generatePreview = async () => {
    setIsLoading(true);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    // Generate mock preview based on document type and subject
    const mockPreview: DocumentPreview = {
      summary: generateSummary(document),
      keyPoints: generateKeyPoints(document),
      questionCount: document.type === 'QUIZ' || document.type === 'TEST' ? Math.floor(Math.random() * 15) + 5 : undefined,
      estimatedTime: Math.floor(Math.random() * 45) + 15,
      content: generateContentSections(document)
    };

    setPreview(mockPreview);
    setIsLoading(false);
  };

  const generateSummary = (doc: typeof document): string => {
    const summaries = {
      'QUIZ': `Quiz interattivo di ${doc.subject} su "${doc.title.split(' - ')[1] || 'argomento principale'}". Valuta la comprensione degli studenti attraverso domande mirate e approfondimenti tematici.`,
      'TEST': `Verifica strutturata per ${doc.subject} che copre gli aspetti fondamentali di "${doc.title.split(' - ')[1] || 'argomento principale'}". Include esercizi pratici e domande teoriche.`,
      'HOMEWORK': `Compito domestico di ${doc.subject} progettato per consolidare l'apprendimento su "${doc.title.split(' - ')[1] || 'argomento principale'}". Favorisce lo studio autonomo.`,
      'LESSON_PLAN': `Piano didattico completo per ${doc.subject} su "${doc.title.split(' - ')[1] || 'argomento principale'}". Include obiettivi, metodologie e tempistiche.`,
      'MATERIAL': `Materiale didattico di supporto per ${doc.subject} riguardante "${doc.title.split(' - ')[1] || 'argomento principale'}". Utile per approfondimenti e studio.`
    };
    return summaries[doc.type as keyof typeof summaries] || summaries['MATERIAL'];
  };

  const generateKeyPoints = (doc: typeof document): string[] => {
    const basePoints = [
      `Materia: ${doc.subject}`,
      `Livello: ${doc.difficulty === 'EASY' ? 'Base' : doc.difficulty === 'MEDIUM' ? 'Intermedio' : 'Avanzato'}`,
      `Tipologia: ${getTypeLabel(doc.type)}`
    ];

    const subjectPoints = {
      'Matematica': ['Formule e teoremi', 'Esercizi pratici', 'Problem solving'],
      'Letteratura Italiana': ['Analisi testuale', 'Contesto storico', 'Figure retoriche'],
      'Storia': ['Cronologia eventi', 'Cause e conseguenze', 'Fonti storiche'],
      'Scienze': ['Metodologia scientifica', 'Esperimenti', 'Teoria e pratica']
    };

    const specificPoints = subjectPoints[doc.subject as keyof typeof subjectPoints] || 
      ['Concetti fondamentali', 'Approfondimenti', 'Verifica apprendimento'];

    return [...basePoints, ...specificPoints];
  };

  const generateContentSections = (doc: typeof document): Array<{section: string, preview: string}> => {
    if (doc.type === 'QUIZ' || doc.type === 'TEST') {
      return [
        {
          section: 'Domande a risposta multipla',
          preview: 'Serie di quesiti con 4 opzioni di risposta per verificare la conoscenza di base...'
        },
        {
          section: 'Domande aperte',
          preview: 'Quesiti che richiedono elaborazione e argomentazione personale dello studente...'
        },
        {
          section: 'Esercizi pratici',
          preview: 'Applicazione pratica dei concetti teorici attraverso esempi concreti...'
        }
      ];
    }
    
    return [
      {
        section: 'Introduzione',
        preview: `Presentazione dell'argomento principale e degli obiettivi di apprendimento...`
      },
      {
        section: 'Sviluppo teorico',
        preview: 'Spiegazione dettagliata dei concetti fondamentali con esempi e approfondimenti...'
      },
      {
        section: 'Conclusioni',
        preview: 'Riepilogo dei punti salienti e collegamenti con altre tematiche...'
      }
    ];
  };

  const getTypeLabel = (type: string): string => {
    const labels = {
      'QUIZ': 'Quiz',
      'TEST': 'Verifica',
      'HOMEWORK': 'Compito',
      'LESSON_PLAN': 'Piano Lezione',
      'MATERIAL': 'Materiale'
    };
    return labels[type as keyof typeof labels] || type;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview: {document.title}
          </DialogTitle>
          <DialogDescription>
            Anteprima dettagliata del documento con sintesi automatica
          </DialogDescription>
        </DialogHeader>

        {preview && (
          <div className="space-y-6">
            {/* Document Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{document.title}</CardTitle>
                    <CardDescription className="mt-2">{document.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary">{document.subject}</Badge>
                      <Badge variant="secondary" className={
                        document.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                        document.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {document.difficulty}
                      </Badge>
                      <Badge variant="outline">{getTypeLabel(document.type)}</Badge>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    {preview.questionCount && (
                      <div className="text-sm text-gray-600">
                        {preview.questionCount} domande
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      ~{preview.estimatedTime} min
                    </div>
                    <div className="text-xs text-gray-500">
                      {document.createdAt.toLocaleDateString('it-IT')}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Sintesi Automatica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{preview.summary}</p>
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card>
              <CardHeader>
                <CardTitle>Punti Chiave</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {preview.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Content Sections */}
            <Card>
              <CardHeader>
                <CardTitle>Struttura Contenuti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {preview.content.map((section, index) => (
                    <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900">{section.section}</h4>
                      <p className="text-gray-600 text-sm mt-1">{section.preview}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleStar} variant="outline" className="flex-1">
                <Star className="mr-2 h-4 w-4" />
                Aggiungi ai Preferiti
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1">
                <Share className="mr-2 h-4 w-4" />
                Condividi
              </Button>
              {onOpenPrintPreview && (
                <Button onClick={onOpenPrintPreview} variant="outline" className="flex-1">
                  <Printer className="mr-2 h-4 w-4" />
                  Preview Stampa
                </Button>
              )}
              <Button onClick={handleDownload} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Scarica PDF
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}