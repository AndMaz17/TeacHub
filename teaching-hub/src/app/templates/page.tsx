'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TemplatePreviewModal } from '@/components/templates/template-preview-modal';
import { DocumentPrintPreview } from '@/components/documents/document-print-preview';
import { useActivityStore } from '@/store/useActivityStore';
import { toast } from 'sonner';
import { 
  Search, 
  Filter,
  Plus,
  Layout,
  Copy,
  Star,
  Download,
  Share,
  Users,
  Crown,
  TrendingUp
} from 'lucide-react';

const mockTemplates = [
  {
    id: '1',
    title: 'Verifica Letteratura - Analisi del Testo',
    description: 'Template per analisi di brani letterari con domande strutturate',
    subject: 'Letteratura Italiana',
    difficulty: 'MEDIUM',
    tags: ['analisi', 'letteratura', 'comprensione'],
    isPublic: true,
    usageCount: 1250,
    isStarred: true,
    author: 'Mario Rossi',
    isVerified: true
  },
  {
    id: '2',
    title: 'Quiz Storia - Periodo Storico',
    description: 'Template per quiz storici con domande a scelta multipla',
    subject: 'Storia',
    difficulty: 'EASY',
    tags: ['quiz', 'storia', 'multipla'],
    isPublic: true,
    usageCount: 987,
    isStarred: false,
    author: 'Anna Bianchi',
    isVerified: true
  },
  {
    id: '3',
    title: 'Esercizi Matematica - Equazioni',
    description: 'Template parametrizzato per esercizi di algebra',
    subject: 'Matematica',
    difficulty: 'HARD',
    tags: ['equazioni', 'algebra', 'parametrico'],
    isPublic: false,
    usageCount: 45,
    isStarred: true,
    author: 'Tu',
    isVerified: false
  },
  {
    id: '4',
    title: 'Test Scienze - Biologia Base',
    description: 'Verifica base di biologia per primo biennio',
    subject: 'Scienze',
    difficulty: 'EASY',
    tags: ['biologia', 'cellula', 'base'],
    isPublic: true,
    usageCount: 756,
    isStarred: false,
    author: 'Luigi Verdi',
    isVerified: false
  }
];

const difficultyColors = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HARD: 'bg-red-100 text-red-800'
};

export default function TemplatesPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof mockTemplates[0] | null>(null);
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const { addActivity } = useActivityStore();

  const handleUseTemplate = (template: typeof mockTemplates[0]) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleDownloadTemplate = (template: typeof mockTemplates[0]) => {
    toast.success(`Template "${template.title}" scaricato`);
    
    addActivity({
      type: 'download',
      title: 'Template scaricato',
      description: `Hai scaricato il template "${template.title}"`,
      icon: 'download'
    });
  };

  const handleShareTemplate = (template: typeof mockTemplates[0]) => {
    navigator.clipboard.writeText(`${window.location.origin}/templates/${template.id}`);
    
    addActivity({
      type: 'share',
      title: 'Template condiviso',
      description: `Hai condiviso il template "${template.title}"`,
      icon: 'share'
    });
    
    toast.success(`Link del template "${template.title}" copiato negli appunti`);
  };

  const handleOpenPrintPreview = () => {
    setPreviewOpen(false);
    setPrintPreviewOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Template</h1>
            <p className="text-gray-600 mt-2">
              Riutilizza e condividi modelli per le tue verifiche
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Template
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Layout className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Cosa sono i Template?</h3>
              <p className="text-blue-700 text-sm mt-1">
                I template sono modelli riutilizzabili che ti permettono di creare rapidamente nuove verifiche 
                mantenendo la stessa struttura ma con contenuti diversi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Cerca template per materia, argomento..." 
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtri
            </Button>
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Popolari
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg leading-tight">
                        {template.title}
                      </CardTitle>
                      {template.isVerified && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                      {template.isStarred && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <CardDescription className="mb-3">
                      {template.description}
                    </CardDescription>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {template.subject}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${difficultyColors[template.difficulty as keyof typeof difficultyColors]}`}
                      >
                        {template.difficulty}
                      </Badge>
                      {!template.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Privato
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {template.usageCount} usi
                      </span>
                      <span>di {template.author}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button 
                      size="sm" 
                      className="flex-1 mr-2"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Usa Template
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleShareTemplate(template)}
                      >
                        <Share className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownloadTemplate(template)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="outline">
            Carica Altri Template
          </Button>
        </div>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Diventa Contributor
            </CardTitle>
            <CardDescription>
              Condividi i tuoi template con la community e aiuta altri docenti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  I template più utilizzati vengono premiati con badge speciali e visibilità maggiore.
                </p>
              </div>
              <Button>
                Condividi Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          isOpen={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setSelectedTemplate(null);
          }}
          onOpenPrintPreview={handleOpenPrintPreview}
          templateName={getTemplateName(selectedTemplate)}
          templateSubject={selectedTemplate.subject}
          templateDescription={selectedTemplate.description}
          usageCount={selectedTemplate.usageCount}
        />
      )}

      {/* Template Print Preview */}
      {selectedTemplate && (
        <DocumentPrintPreview
          isOpen={printPreviewOpen}
          onClose={() => {
            setPrintPreviewOpen(false);
            setSelectedTemplate(null);
          }}
          document={{
            id: selectedTemplate.id,
            title: selectedTemplate.title,
            description: selectedTemplate.description,
            subject: selectedTemplate.subject,
            type: 'TEMPLATE',
            difficulty: selectedTemplate.difficulty,
            createdAt: new Date()
          }}
        />
      )}
    </MainLayout>
  );
}

function getTemplateName(template: typeof mockTemplates[0]): string {
  if (template.subject === 'Letteratura Italiana') {
    return 'Verifica Dante';
  } else if (template.subject === 'Storia') {
    return 'Quiz Storia';
  } else if (template.subject === 'Matematica') {
    return 'Test Matematica';
  }
  return 'Quiz Storia';
}