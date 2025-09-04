'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Eye, Edit, Wand2, Copy, Printer } from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import { QuizContent } from '@/types';
import { toast } from 'sonner';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrintPreview?: () => void;
  templateName: string;
  templateSubject: string;
  templateDescription: string;
  usageCount: number;
}

export function TemplatePreviewModal({ 
  isOpen, 
  onClose,
  onOpenPrintPreview,
  templateName, 
  templateSubject, 
  templateDescription, 
  usageCount 
}: TemplatePreviewModalProps) {
  const [step, setStep] = useState<'loading' | 'preview' | 'edit'>('loading');
  const [templateContent, setTemplateContent] = useState<QuizContent | null>(null);
  const [editedContent, setEditedContent] = useState<QuizContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { generateQuizFromTemplate, addActivity } = useActivityStore();

  const handleOpen = async () => {
    if (isOpen && step === 'loading') {
      try {
        const content = await generateQuizFromTemplate(templateName, templateSubject);
        setTemplateContent(content);
        setEditedContent(content);
        setStep('preview');
      } catch (error) {
        toast.error('Errore nel caricamento del template');
        onClose();
      }
    }
  };

  useState(() => {
    handleOpen();
  });

  const handleEdit = () => {
    setStep('edit');
  };

  const handleSaveEdits = () => {
    if (editedContent) {
      setTemplateContent(editedContent);
      setStep('preview');
      toast.success('Modifiche salvate al template');
      
      addActivity({
        type: 'save',
        title: 'Template modificato',
        description: `Hai modificato il template "${templateName}"`,
        icon: 'save'
      });
    }
  };

  const handleGenerateFromTemplate = async () => {
    if (!editedContent) return;

    setIsGenerating(true);
    
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Nuova verifica generata dal template "${templateName}"`);
    
    addActivity({
      type: 'generate',
      title: 'Verifica generata da template',
      description: `Hai creato una verifica usando "${templateName}"`,
      icon: 'wand'
    });

    setIsGenerating(false);
    onClose();
  };

  const handleCopyTemplate = () => {
    toast.success(`Template "${templateName}" copiato nei tuoi template personali`);
    
    addActivity({
      type: 'save',
      title: 'Template copiato',
      description: `Hai copiato il template "${templateName}" nella tua libreria`,
      icon: 'save'
    });
  };

  const handleClose = () => {
    onClose();
    setStep('loading');
    setTemplateContent(null);
    setEditedContent(null);
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <h3 className="text-lg font-semibold">Caricamento Template...</h3>
      <p className="text-gray-600 text-center">
        Stiamo preparando il preview di "{templateName}"
      </p>
    </div>
  );

  const renderPreview = () => (
    templateContent && (
      <div className="space-y-6">
        {/* Template Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {templateName}
                  <Badge variant="secondary">{templateSubject}</Badge>
                </CardTitle>
                <CardDescription className="mt-2">
                  {templateDescription}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{usageCount} utilizzi</p>
                <Badge variant="outline" className="mt-1">Community Template</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{templateContent.title}</CardTitle>
            <CardDescription>
              {templateContent.instructions}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">
                {templateContent.questions.length} domande
              </Badge>
              <Badge variant="secondary">
                {templateContent.totalPoints} punti
              </Badge>
              {templateContent.timeLimit && (
                <Badge variant="secondary">
                  {templateContent.timeLimit} min
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions Preview */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {templateContent.questions.slice(0, 3).map((question, index) => (
            <Card key={question.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Domanda {index + 1}</h4>
                  <Badge variant="outline" className="text-xs">{question.points} pt</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{question.text}</p>
                
                {question.type === 'multiple_choice' && question.options && (
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="p-1 bg-gray-50 rounded">
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {templateContent.questions.length > 3 && (
            <div className="text-center py-2">
              <Badge variant="outline">
                +{templateContent.questions.length - 3} altre domande
              </Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleEdit} variant="outline" className="flex-1">
            <Edit className="mr-2 h-4 w-4" />
            Modifica Template
          </Button>
          <Button onClick={handleCopyTemplate} variant="outline" className="flex-1">
            <Copy className="mr-2 h-4 w-4" />
            Copia nei Miei Template
          </Button>
          {onOpenPrintPreview && (
            <Button onClick={onOpenPrintPreview} variant="outline" className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Preview Stampa
            </Button>
          )}
          <Button 
            onClick={handleGenerateFromTemplate} 
            className="flex-1"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? 'Generando...' : 'Genera Verifica'}
          </Button>
        </div>
      </div>
    )
  );

  const renderEdit = () => (
    editedContent && (
      <div className="space-y-6">
        {/* Edit Header */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Modifica Template: {templateName}
            </CardTitle>
            <CardDescription>
              Personalizza il template prima di generare la tua verifica
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Edit Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Titolo Verifica</Label>
            <Input 
              id="edit-title"
              value={editedContent.title}
              onChange={(e) => setEditedContent({
                ...editedContent,
                title: e.target.value
              })}
            />
          </div>

          <div>
            <Label htmlFor="edit-instructions">Istruzioni</Label>
            <Textarea 
              id="edit-instructions"
              value={editedContent.instructions || ''}
              onChange={(e) => setEditedContent({
                ...editedContent,
                instructions: e.target.value
              })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-time">Tempo (minuti)</Label>
              <Input 
                id="edit-time"
                type="number"
                value={editedContent.timeLimit || 60}
                onChange={(e) => setEditedContent({
                  ...editedContent,
                  timeLimit: parseInt(e.target.value) || 60
                })}
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <Badge variant="secondary">{editedContent.questions.length} domande</Badge>
                <span className="ml-2">{editedContent.totalPoints} punti totali</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Edited Questions */}
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {editedContent.questions.slice(0, 2).map((question, index) => (
            <Card key={question.id} className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">Domanda {index + 1}</span>
                  <Badge variant="outline" className="text-xs">{question.points} pt</Badge>
                </div>
                <p className="text-sm text-gray-700">{question.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Edit Actions */}
        <div className="flex gap-3">
          <Button onClick={() => setStep('preview')} variant="outline">
            Annulla Modifiche
          </Button>
          <Button onClick={handleSaveEdits} className="flex-1">
            Salva Modifiche
          </Button>
        </div>
      </div>
    )
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {step === 'edit' ? 'Modifica Template' : 'Preview Template'}
          </DialogTitle>
          <DialogDescription>
            {step === 'loading' && 'Caricamento del template in corso...'}
            {step === 'preview' && 'Anteprima del template dalla community'}
            {step === 'edit' && 'Personalizza il template per le tue esigenze'}
          </DialogDescription>
        </DialogHeader>

        {step === 'loading' && renderLoading()}
        {step === 'preview' && renderPreview()}
        {step === 'edit' && renderEdit()}
      </DialogContent>
    </Dialog>
  );
}