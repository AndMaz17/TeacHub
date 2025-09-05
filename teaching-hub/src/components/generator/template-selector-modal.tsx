'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, School, GraduationCap, ClipboardCheck, Zap, Eye } from 'lucide-react';
import { QuizContent } from '@/types';
import { toast } from 'sonner';
import { TemplatePreviewModal } from './template-preview-modal';

export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'academic' | 'professional' | 'quick';
  preview: string;
  features: string[];
}

export interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (templateId: string, customData?: any) => void;
  onSave?: (templateId: string, customData?: any) => void;
  quizContent: QuizContent | null;
}

const PDF_TEMPLATES: PDFTemplate[] = [
  {
    id: 'school-standard',
    name: 'Template Scolastico',
    description: 'Formato tradizionale per scuole superiori con intestazione istituzionale',
    icon: <School className="h-6 w-6 text-blue-600" />,
    category: 'academic',
    preview: '/templates/school-preview.png',
    features: ['Intestazione scuola', 'Spazio nome/cognome', 'Sezione valutazione', 'Formato A4']
  },
  {
    id: 'university-formal',
    name: 'Template Universitario',
    description: 'Stile formale per esami universitari con layout accademico',
    icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
    category: 'professional',
    preview: '/templates/university-preview.png',
    features: ['Anno accademico', 'Matricola studente', 'Layout formale', 'Bordi eleganti']
  },
  {
    id: 'exam-grid',
    name: 'Template Esame Ufficiale',
    description: 'Template per esami di stato e certificazioni con criteri di valutazione',
    icon: <ClipboardCheck className="h-6 w-6 text-red-600" />,
    category: 'professional',
    preview: '/templates/exam-preview.png',
    features: ['Criteri valutazione', 'Commissione esame', 'Punteggi dettagliati', 'Protocollo ufficiale']
  },
  {
    id: 'minimalist',
    name: 'Template Minimalista',
    description: 'Design pulito senza fronzoli, focus totale sul contenuto',
    icon: <FileText className="h-6 w-6 text-gray-600" />,
    category: 'quick',
    preview: '/templates/minimal-preview.png',
    features: ['Zero distrazioni', 'Risparmio carta', 'Solo essenziale', 'Eco-friendly']
  },
  {
    id: 'quiz-compact',
    name: 'Template Quiz Veloce',
    description: 'Formato super compatto ottimizzato per test a risposta multipla',
    icon: <Zap className="h-6 w-6 text-yellow-600" />,
    category: 'quick',
    preview: '/templates/quiz-preview.png',
    features: ['Bubble sheet', 'Correzione rapida', 'Formato compatto', 'Multi-colonna']
  }
];

export function TemplateSelectorModal({ isOpen, onClose, onDownload, onSave, quizContent }: TemplateSelectorModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('school-standard');
  const [customData, setCustomData] = useState({
    schoolName: 'ISTITUTO COMPRENSIVO "ALESSANDRO MANZONI"',
    schoolAddress: 'Via dei Promessi Sposi, 25 - 20100 Milano (MI)',
    className: '3°A',
    teacherName: '',
    logoUrl: ''
  });
  const [activeCategory, setActiveCategory] = useState<'academic' | 'professional' | 'quick' | 'all'>('all');
  const [showPreview, setShowPreview] = useState(false);

  const filteredTemplates = activeCategory === 'all' 
    ? PDF_TEMPLATES 
    : PDF_TEMPLATES.filter(t => t.category === activeCategory);

  const selectedTemplateData = PDF_TEMPLATES.find(t => t.id === selectedTemplate);

  const handleDownload = () => {
    if (!quizContent) {
      toast.error('Contenuto della verifica non disponibile');
      return;
    }

    toast.loading(`Generazione PDF con template "${selectedTemplateData?.name}"...`);
    onDownload(selectedTemplate, customData);
  };

  const handleSave = () => {
    if (!quizContent || !onSave) {
      toast.error('Impossibile salvare il documento');
      return;
    }

    toast.success(`Documento salvato in "Documenti" con template "${selectedTemplateData?.name}"`);
    onSave(selectedTemplate, customData);
  };

  const handlePreview = () => {
    if (!quizContent || !selectedTemplateData) {
      toast.error('Seleziona un template per vedere l\'anteprima');
      return;
    }
    setShowPreview(true);
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Scegli Template PDF
          </DialogTitle>
          <DialogDescription>
            Seleziona il formato che meglio si adatta alle tue esigenze didattiche
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Actions moved to top */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handlePreview} variant="outline" className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Anteprima Template
            </Button>
            <Button onClick={handleSave} variant="outline" className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              Salva in Documenti
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Scarica PDF con Template
            </Button>
          </div>
          
          <Separator />
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              Tutti
            </Button>
            <Button
              variant={activeCategory === 'academic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('academic')}
            >
              Accademico
            </Button>
            <Button
              variant={activeCategory === 'professional' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('professional')}
            >
              Professionale
            </Button>
            <Button
              variant={activeCategory === 'quick' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('quick')}
            >
              Veloce
            </Button>
          </div>

          {/* Template Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                  selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        template.category === 'academic' ? 'bg-blue-100 text-blue-600' :
                        template.category === 'professional' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {template.category === 'academic' ? 'Accademico' :
                           template.category === 'professional' ? 'Professionale' : 'Veloce'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs mb-3">
                    {template.description}
                  </CardDescription>
                  <div className="space-y-1">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Template Details & Customization */}
          {selectedTemplateData && (
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
              <div className="bg-slate-50 border-b border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {selectedTemplateData.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedTemplateData.name} - Personalizzazione
                  </h3>
                </div>
                <p className="text-slate-600">
                  Configura i dettagli per il template selezionato
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="school-name">Nome Istituto</Label>
                    <Input
                      id="school-name"
                      value={customData.schoolName}
                      onChange={(e) => setCustomData({...customData, schoolName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="school-address">Indirizzo Istituto</Label>
                    <Input
                      id="school-address"
                      value={customData.schoolAddress}
                      onChange={(e) => setCustomData({...customData, schoolAddress: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="class-name">Classe</Label>
                    <Input
                      id="class-name"
                      value={customData.className}
                      onChange={(e) => setCustomData({...customData, className: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacher-name">Nome Docente (Opzionale)</Label>
                    <Input
                      id="teacher-name"
                      value={customData.teacherName}
                      onChange={(e) => setCustomData({...customData, teacherName: e.target.value})}
                      placeholder="Lascia vuoto per non stampare"
                    />
                  </div>
                </div>

                {/* Template Features */}
                <div>
                  <Label className="text-slate-700 font-semibold">Caratteristiche Template:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTemplateData.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>

    {/* Template Preview Modal */}
    {selectedTemplateData && (
      <TemplatePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        template={selectedTemplateData}
        quizContent={quizContent}
        customData={customData}
      />
    )}
  </>
  );
}