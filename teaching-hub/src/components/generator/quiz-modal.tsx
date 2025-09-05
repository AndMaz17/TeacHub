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
import { Loader2, Wand2, Download, Save, Eye, FileText, Calculator, Edit3 } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { QuizContent, Difficulty } from '@/types';
import { toast } from 'sonner';
import { TemplateSelectorModal } from './template-selector-modal';
import { downloadDocument } from '@/utils/downloadUtils';
import { useDocumentsStore } from '@/store/useDocumentsStore';
import { DocumentType, Question } from '@/types';
import { AdvancedEditorModal } from './advanced-editor-modal';

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
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuiz, setEditedQuiz] = useState<QuizContent | null>(null);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [currentEditingQuestion, setCurrentEditingQuestion] = useState<Question | null>(null);
  
  const { generateQuiz, isGenerating } = useAI();
  const { addDocument } = useDocumentsStore();

  const renderLatex = (latex: string) => {
    // Rendering che emula lo stile KaTeX con stili inline (stesso del advanced editor)
    if (!latex.trim()) return '';
    
    // Converti simboli comuni mantenendo lo stile matematico
    let rendered = latex
      // Frazioni
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 0.1em;"><span style="display: block; font-size: 0.8em; border-bottom: 1px solid; padding-bottom: 0.1em;">$1</span><span style="display: block; font-size: 0.8em; padding-top: 0.1em;">$2</span></span>')
      // Potenze e pedici
      .replace(/\^{([^}]+)}/g, '<sup style="font-size: 0.75em;">$1</sup>')
      .replace(/_{([^}]+)}/g, '<sub style="font-size: 0.75em;">$1</sub>')
      // Radici
      .replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, '<span style="position: relative;"><sup style="font-size: 0.6em; position: absolute; top: -0.5em; left: -0.3em;">$1</sup>√<span style="border-top: 1px solid; padding-top: 0.1em;">$2</span></span>')
      .replace(/\\sqrt\{([^}]+)\}/g, '√<span style="border-top: 1px solid; padding-top: 0.1em;">$1</span>')
      // Valore assoluto
      .replace(/\|([^|]+)\|/g, '|$1|')
      // Funzioni trigonometriche
      .replace(/\\sin/g, 'sin')
      .replace(/\\cos/g, 'cos')
      .replace(/\\tan/g, 'tan')
      .replace(/\\arcsin/g, 'arcsin')
      .replace(/\\arccos/g, 'arccos')
      .replace(/\\arctan/g, 'arctan')
      .replace(/\\sinh/g, 'sinh')
      .replace(/\\cosh/g, 'cosh')
      // Logaritmi
      .replace(/\\log/g, 'log')
      .replace(/\\ln/g, 'ln')
      // Simboli di calcolo
      .replace(/\\sum/g, '<span style="font-size: 1.4em;">∑</span>')
      .replace(/\\prod/g, '<span style="font-size: 1.4em;">∏</span>')
      .replace(/\\int/g, '<span style="font-size: 1.4em;">∫</span>')
      .replace(/\\oint/g, '<span style="font-size: 1.4em;">∮</span>')
      .replace(/\\iint/g, '<span style="font-size: 1.4em;">∬</span>')
      .replace(/\\iiint/g, '<span style="font-size: 1.4em;">∭</span>')
      .replace(/\\lim/g, 'lim')
      .replace(/\\to/g, '→')
      .replace(/\\nabla/g, '∇')
      .replace(/\\partial/g, '∂')
      .replace(/\\Delta/g, 'Δ')
      // Confronti
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\ll/g, '≪')
      .replace(/\\gg/g, '≫')
      .replace(/\\approx/g, '≈')
      .replace(/\\equiv/g, '≡')
      .replace(/\\sim/g, '∼')
      .replace(/\\propto/g, '∝')
      // Operazioni
      .replace(/\\pm/g, '±')
      .replace(/\\mp/g, '∓')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\cdot/g, '⋅')
      .replace(/\\%/g, '%')
      // Lettere greche minuscole
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\zeta/g, 'ζ')
      .replace(/\\eta/g, 'η')
      .replace(/\\theta/g, 'θ')
      .replace(/\\iota/g, 'ι')
      .replace(/\\kappa/g, 'κ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\nu/g, 'ν')
      .replace(/\\xi/g, 'ξ')
      .replace(/\\pi/g, 'π')
      .replace(/\\rho/g, 'ρ')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\tau/g, 'τ')
      .replace(/\\phi/g, 'φ')
      .replace(/\\chi/g, 'χ')
      .replace(/\\psi/g, 'ψ')
      .replace(/\\omega/g, 'ω')
      // Simboli speciali
      .replace(/\\infty/g, '∞')
      .replace(/\\emptyset/g, '∅')
      .replace(/\\in/g, '∈')
      .replace(/\\notin/g, '∉')
      .replace(/\\subset/g, '⊂')
      .replace(/\\supset/g, '⊃')
      .replace(/\\cup/g, '∪')
      .replace(/\\cap/g, '∩')
      .replace(/\\forall/g, '∀')
      .replace(/\\exists/g, '∃')
      .replace(/\\nexists/g, '∄')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\leftarrow/g, '←')
      .replace(/\\leftrightarrow/g, '↔')
      .replace(/\\Rightarrow/g, '⇒')
      .replace(/\\Leftrightarrow/g, '⇔');
    
    return `<span style="font-family: 'Times New Roman', serif; font-size: 1.1em; color: #374151;">${rendered}</span>`;
  };

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
        setEditedQuiz(result.data);
        setStep('preview');
        setIsEditing(false);
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
      setShowTemplateSelector(true);
    }
  };

  const handleModify = () => {
    if (generatedQuiz) {
      setIsEditing(true);
      setEditedQuiz({ ...generatedQuiz });
    }
  };
  
  const handleSaveEdits = () => {
    if (editedQuiz) {
      setGeneratedQuiz(editedQuiz);
      setIsEditing(false);
      toast.success('Modifiche salvate con successo!');
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedQuiz(generatedQuiz);
  };
  
  const updateQuestionText = (questionId: string, newText: string) => {
    if (!editedQuiz) return;
    const updatedQuestions = editedQuiz.questions.map(q => 
      q.id === questionId ? { ...q, text: newText } : q
    );
    setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
  };
  
  const updateQuestionPoints = (questionId: string, newPoints: number) => {
    if (!editedQuiz) return;
    const updatedQuestions = editedQuiz.questions.map(q => 
      q.id === questionId ? { ...q, points: newPoints } : q
    );
    const totalPoints = updatedQuestions.reduce((sum, q) => sum + q.points, 0);
    setEditedQuiz({ ...editedQuiz, questions: updatedQuestions, totalPoints });
  };
  
  const updateQuestionOption = (questionId: string, optionIndex: number, newOption: string) => {
    if (!editedQuiz) return;
    const updatedQuestions = editedQuiz.questions.map(q => 
      q.id === questionId && q.options ? { 
        ...q, 
        options: q.options.map((opt, idx) => idx === optionIndex ? newOption : opt)
      } : q
    );
    setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
  };

  const handleAdvancedEdit = (question: Question) => {
    setCurrentEditingQuestion(question);
    setShowAdvancedEditor(true);
  };

  const handleAdvancedSave = (updatedQuestion: Question) => {
    if (!editedQuiz) return;
    
    const updatedQuestions = editedQuiz.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
    setShowAdvancedEditor(false);
    setCurrentEditingQuestion(null);
  };

  const handleTemplateDownload = async (templateId: string, customData?: any) => {
    if (!generatedQuiz) return;
    
    try {
      // Prepare school info from custom data
      const schoolInfo = {
        schoolName: customData?.schoolName || 'ISTITUTO COMPRENSIVO "ALESSANDRO MANZONI"',
        schoolAddress: customData?.schoolAddress || 'Via dei Promessi Sposi, 25 - 20100 Milano (MI)',
        className: customData?.className || '3°A',
        date: new Date().toLocaleDateString('it-IT'),
        teacherName: customData?.teacherName || ''
      };

      // Download with selected template
      await downloadDocument(
        generatedQuiz.title,
        formData.subject,
        'pdf',
        generatedQuiz,
        schoolInfo,
        templateId
      );
      
      toast.success(`"${generatedQuiz.title}" salvato con successo!`);
      setShowTemplateSelector(false);
      
      // Close modal and reset
      onClose();
      setStep('form');
      setGeneratedQuiz(null);
    } catch (error) {
      console.error('PDF Download error:', error);
      toast.error('Errore durante la generazione del PDF: ' + (error as Error).message);
    }
  };

  const handleTemplateSave = async (templateId: string, customData?: any) => {
    if (!generatedQuiz) return;
    
    try {
      // Map quiz type to DocumentType
      let docType = DocumentType.QUIZ;
      if (type === 'stem') {
        docType = DocumentType.TEST;
      } else if (type === 'literature') {
        docType = DocumentType.QUIZ;
      }

      // Prepare document data for Zustand store
      const documentData = {
        title: generatedQuiz.title,
        content: {
          ...generatedQuiz,
          schoolInfo: customData ? {
            schoolName: customData.schoolName || 'ISTITUTO COMPRENSIVO "ALESSANDRO MANZONI"',
            schoolAddress: customData.schoolAddress || 'Via dei Promessi Sposi, 25 - 20100 Milano (MI)',
            className: customData.className || '3°A',
            teacherName: customData.teacherName || ''
          } : undefined,
          templateId: templateId
        },
        type: docType,
        subject: formData.subject,
        grade: formData.grade || '',
        difficulty: formData.difficulty,
        tags: [formData.subject.toLowerCase(), formData.topic.toLowerCase()].filter(Boolean),
        isPublic: false
      };

      // Add document to Zustand store
      addDocument(documentData);
      
      toast.success(`"${generatedQuiz.title}" salvato nella sezione Documenti!`);
      setShowTemplateSelector(false);
      
      // Close modal and reset
      onClose();
      setStep('form');
      setGeneratedQuiz(null);
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Errore durante il salvataggio del documento');
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

  const renderPreview = () => {
    const currentQuiz = isEditing ? editedQuiz : generatedQuiz;
    
    return currentQuiz && (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQuiz.title}</CardTitle>
            <CardDescription>
              {currentQuiz.instructions}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">
                {currentQuiz.questions.length} domande
              </Badge>
              <Badge variant="secondary">
                {currentQuiz.totalPoints} punti totali
              </Badge>
              {currentQuiz.timeLimit && (
                <Badge variant="secondary">
                  {currentQuiz.timeLimit} minuti
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {currentQuiz.questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">Domanda {index + 1}</h4>
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAdvancedEdit(question)}
                          className="h-8 px-2"
                          title="Editor Avanzato - Formule, Grafici, Immagini"
                        >
                          <Calculator className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={question.points}
                          onChange={(e) => updateQuestionPoints(question.id, parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-center"
                        />
                        <span className="text-sm text-gray-600">pt</span>
                      </>
                    )}
                    {!isEditing && <Badge variant="outline">{question.points} pt</Badge>}
                  </div>
                </div>
                
                {isEditing ? (
                  <Textarea
                    value={question.text}
                    onChange={(e) => updateQuestionText(question.id, e.target.value)}
                    className="mb-3 min-h-[80px]"
                    placeholder="Testo della domanda..."
                  />
                ) : (
                  <div className="text-sm text-gray-700 mb-3">
                    {question.richContent && question.richContent.length > 0 ? (
                      <div className="space-y-2">
                        {question.richContent.map((content, idx) => (
                          <div key={content.id}>
                            {content.type === 'text' && <p>{content.content}</p>}
                            {content.type === 'latex' && (
                              <div className="bg-gray-50 p-4 rounded border text-center">
                                <div 
                                  dangerouslySetInnerHTML={{ 
                                    __html: renderLatex(content.content)
                                  }}
                                />
                              </div>
                            )}
                            {content.type === 'image' && (
                              <img 
                                src={content.content} 
                                alt="Contenuto domanda" 
                                className="max-w-full h-auto max-h-32 object-contain border rounded"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>{question.text}</p>
                    )}
                  </div>
                )}
                
                {question.type === 'multiple_choice' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className={`p-2 rounded text-xs ${
                        optIndex === question.correctAnswer 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-50'
                      }`}>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{String.fromCharCode(65 + optIndex)}.</span>
                            <Input
                              value={option}
                              onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                              className="flex-1 h-8 text-xs"
                            />
                            {optIndex === question.correctAnswer && <span className="text-green-600">✓</span>}
                          </div>
                        ) : (
                          <>
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {optIndex === question.correctAnswer && ' ✓'}
                          </>
                        )}
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
          {isEditing ? (
            <>
              <Button onClick={handleCancelEdit} variant="outline">
                Annulla
              </Button>
              <Button onClick={handleSaveEdits} variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Salva
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleModify} variant="outline">
                Modifica
              </Button>
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Salva Documento
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
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

    {/* Template Selector Modal */}
    <TemplateSelectorModal
      isOpen={showTemplateSelector}
      onClose={() => setShowTemplateSelector(false)}
      onDownload={handleTemplateDownload}
      onSave={handleTemplateSave}
      quizContent={generatedQuiz}
    />

    {/* Advanced Editor Modal */}
    {currentEditingQuestion && (
      <AdvancedEditorModal
        isOpen={showAdvancedEditor}
        onClose={() => {
          setShowAdvancedEditor(false);
          setCurrentEditingQuestion(null);
        }}
        question={currentEditingQuestion}
        onSave={handleAdvancedSave}
      />
    )}
  </>
  );
}