'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Wand2, Download, Save, Eye } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { QuizContent, Difficulty } from '@/types';
import { toast } from 'sonner';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'literature' | 'stem' | 'quick';
  presetSubject?: string;
}

const subjectSuggestions = [
  'Matematica',
  'Matematica Applicata',
  'Matematica Avanzata',
  'Italiano',
  'Letteratura Italiana',
  'Letteratura Inglese',
  'Storia',
  'Storia dell\'Arte',
  'Storia Antica',
  'Storia Moderna',
  'Geografia',
  'Scienze',
  'Scienze Naturali',
  'Biologia',
  'Chimica',
  'Fisica',
  'Inglese',
  'Francese',
  'Spagnolo',
  'Tedesco',
  'Filosofia',
  'Latino',
  'Greco',
  'Arte',
  'Musica',
  'Educazione Fisica',
  'Tecnologia',
  'Informatica',
  'Economia',
  'Diritto'
];

export function QuizModal({ isOpen, onClose, type, presetSubject }: QuizModalProps) {
  const [formData, setFormData] = useState({
    subject: presetSubject || '',
    topic: '',
    grade: '',
    difficulty: 'MEDIUM' as Difficulty,
    questionCount: 10,
    timeLimit: 60,
    instructions: ''
  });

  const [generatedQuiz, setGeneratedQuiz] = useState<QuizContent | null>(null);
  const [step, setStep] = useState<'form' | 'generating' | 'preview'>('form');
  
  const { generateQuiz, isGenerating } = useAI();

  const getModalTitle = () => {
    switch (type) {
      case 'literature':
        return 'Genera Verifica Letteraria';
      case 'stem':
        return 'Genera Esercizi STEM';
      case 'quick':
        return 'Genera Quiz Veloce';
      default:
        return 'Genera Contenuto';
    }
  };

  const getModalDescription = () => {
    switch (type) {
      case 'literature':
        return 'Crea verifiche per materie letterarie con domande aperte e analisi testuali';
      case 'stem':
        return 'Genera esercizi parametrizzati per matematica, fisica e scienze';
      case 'quick':
        return 'Crea quiz rapidi a risposta multipla per qualsiasi materia';
      default:
        return 'Personalizza i parametri per la generazione AI';
    }
  };

  const handleGenerate = async () => {
    if (!formData.subject || !formData.topic) {
      toast.error('Compila almeno Materia e Argomento');
      return;
    }

    setStep('generating');
    
    try {
      const result = await generateQuiz({
        subject: formData.subject,
        topic: formData.topic,
        difficulty: formData.difficulty,
        questionCount: formData.questionCount,
        type: type,
        instructions: formData.instructions
      });

      if (result.success && result.data) {
        setGeneratedQuiz(result.data);
        setStep('preview');
        toast.success('Verifica generata con successo!');
      } else {
        toast.error(result.error || 'Errore nella generazione');
        setStep('form');
      }
    } catch (error) {
      toast.error('Errore imprevisto durante la generazione');
      setStep('form');
    }
  };

  const handleSave = () => {
    if (generatedQuiz) {
      toast.success(`"${generatedQuiz.title}" salvata nei tuoi documenti`);
      onClose();
      setStep('form');
      setGeneratedQuiz(null);
    }
  };

  const handleDownload = () => {
    if (generatedQuiz) {
      toast.success(`Download di "${generatedQuiz.title}" avviato`);
    }
  };

  const handleClose = () => {
    onClose();
    setStep('form');
    setGeneratedQuiz(null);
  };

  const renderForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Materia *</Label>
          <Autocomplete
            value={formData.subject}
            onValueChange={(value) => setFormData({ ...formData, subject: value })}
            suggestions={subjectSuggestions}
            placeholder="Scrivi per cercare... (es. Mat, Storia, Ita...)"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="topic">Argomento *</Label>
          <Input
            id="topic"
            placeholder="Es. Dante Inferno, Equazioni di 2° grado..."
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficoltà</Label>
          <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value as Difficulty })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Facile</SelectItem>
              <SelectItem value="MEDIUM">Medio</SelectItem>
              <SelectItem value="HARD">Difficile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="questions">N. Domande</Label>
          <Input
            id="questions"
            type="number"
            min="1"
            max="50"
            value={formData.questionCount}
            onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) || 10 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Tempo (min)</Label>
          <Input
            id="time"
            type="number"
            min="10"
            max="180"
            value={formData.timeLimit}
            onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 60 })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="grade">Classe/Livello (opzionale)</Label>
        <Input
          id="grade"
          placeholder="Es. 3° Superiore, Università..."
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Istruzioni Aggiuntive (opzionale)</Label>
        <Textarea
          id="instructions"
          placeholder="Aggiungi istruzioni specifiche per l'AI..."
          rows={3}
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleClose} variant="outline" className="flex-1">
          Annulla
        </Button>
        <Button onClick={handleGenerate} className="flex-1">
          <Wand2 className="mr-2 h-4 w-4" />
          Genera con AI
        </Button>
      </div>
    </div>
  );

  const renderGenerating = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <h3 className="text-lg font-semibold">Generazione in corso...</h3>
      <p className="text-gray-600 text-center">
        L&apos;AI sta creando la tua verifica personalizzata per {formData.subject}
      </p>
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
    </div>
  );

  const renderPreview = () => (
    generatedQuiz && (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{generatedQuiz.title}</CardTitle>
            <CardDescription>
              {generatedQuiz.instructions}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">
                {generatedQuiz.questions.length} domande
              </Badge>
              <Badge variant="secondary">
                {generatedQuiz.totalPoints} punti totali
              </Badge>
              {generatedQuiz.timeLimit && (
                <Badge variant="secondary">
                  {generatedQuiz.timeLimit} minuti
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {generatedQuiz.questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">Domanda {index + 1}</h4>
                  <Badge variant="outline">{question.points} pt</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{question.text}</p>
                
                {question.type === 'multiple_choice' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className={`p-2 rounded text-xs ${
                        optIndex === question.correctAnswer 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-50'
                      }`}>
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {optIndex === question.correctAnswer && ' ✓'}
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'open_ended' && (
                  <div className="bg-blue-50 p-3 rounded text-xs text-blue-700">
                    Domanda aperta - Risposta libera
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <div className="flex gap-3">
          <Button onClick={() => setStep('form')} variant="outline">
            Modifica
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Scarica PDF
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Salva Documento
          </Button>
        </div>
      </div>
    )
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>
            {getModalDescription()}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && renderForm()}
        {step === 'generating' && renderGenerating()}
        {step === 'preview' && renderPreview()}
      </DialogContent>
    </Dialog>
  );
}