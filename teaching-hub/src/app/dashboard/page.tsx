'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  Clock, 
  Star,
  Wand2,
  Archive,
  Download,
  Share,
  Upload
} from 'lucide-react';
import { QuizModal } from '@/components/generator/quiz-modal';
import { useActivityStore } from '@/store/useActivityStore';
import { downloadDocument } from '@/utils/downloadUtils';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'literature' | 'stem' | 'quick'>('literature');

  const { 
    activities, 
    recentDocuments, 
    totalDocuments, 
    documentsCreatedThisMonth,
    quizzesGenerated, 
    templatesUsed, 
    timesSaved,
    addActivity,
    addDocument
  } = useActivityStore();

  const handleQuickAction = (action: 'generate' | 'upload' | 'template') => {
    switch (action) {
      case 'generate':
        setModalType('quick');
        setModalOpen(true);
        break;
      case 'upload':
        // Simulate file upload
        toast.loading('Caricamento documento...', {
          duration: 2000
        });
        
        setTimeout(() => {
          const mockDocument = {
            title: 'Documento Caricato',
            subject: 'Materia Varia',
            type: 'MATERIAL',
            isStarred: false
          };
          
          addDocument(mockDocument);
          
          addActivity({
            type: 'upload',
            title: 'Documento caricato',
            description: 'Hai caricato un nuovo documento',
            icon: 'file'
          });
          
          toast.success('Documento caricato con successo!');
        }, 2000);
        break;
      case 'template':
        toast.info('Apertura biblioteca template...');
        // In una vera implementazione, questo navigherebbe alla pagina template
        setTimeout(() => {
          setModalType('literature');
          setModalOpen(true);
        }, 500);
        break;
    }
  };

  const handleDocumentAction = async (docId: string, title: string, action: 'download' | 'share' | 'star') => {
    switch (action) {
      case 'download':
        toast.loading(`Preparazione download "${title}"...`);
        try {
          await downloadDocument(title, 'QUIZ', 'pdf');
          
          addActivity({
            type: 'download',
            title: 'Documento scaricato',
            description: `Hai scaricato "${title}"`,
            icon: 'download'
          });
          
          toast.success(`"${title}" scaricato con successo!`);
        } catch (error) {
          toast.error('Errore durante il download');
        }
        break;
      case 'share':
        navigator.clipboard.writeText(`${window.location.origin}/documents/${docId}`);
        
        addActivity({
          type: 'share',
          title: 'Documento condiviso',
          description: `Hai condiviso "${title}"`,
          icon: 'share'
        });
        
        toast.success(`Link di "${title}" copiato negli appunti`);
        break;
      case 'star':
        addActivity({
          type: 'save',
          title: 'Documento preferito',
          description: `Hai aggiunto "${title}" ai preferiti`,
          icon: 'save'
        });
        
        toast.success(`"${title}" aggiunto ai preferiti`);
        break;
    }
  };

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'wand': return <Wand2 className="h-4 w-4 text-blue-600" />;
      case 'download': return <Download className="h-4 w-4 text-green-600" />;
      case 'save': return <Archive className="h-4 w-4 text-purple-600" />;
      case 'share': return <Share className="h-4 w-4 text-orange-600" />;
      case 'file': return <FileText className="h-4 w-4 text-gray-600" />;
      case 'template': return <Archive className="h-4 w-4 text-indigo-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (iconType: string) => {
    switch (iconType) {
      case 'wand': return 'bg-blue-100';
      case 'download': return 'bg-green-100';
      case 'save': return 'bg-purple-100';
      case 'share': return 'bg-orange-100';
      case 'file': return 'bg-gray-100';
      case 'template': return 'bg-indigo-100';
      default: return 'bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minuti fa`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ore fa`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} giorni fa`;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Benvenuto nel tuo hub didattico. Ecco un riepilogo delle tue attività.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documenti Totali</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDocuments}</div>
              <p className="text-xs text-muted-foreground">+{documentsCreatedThisMonth} questo mese</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verifiche Generate</CardTitle>
              <Wand2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzesGenerated}</div>
              <p className="text-xs text-muted-foreground">AI-powered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Template Utilizzati</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templatesUsed}</div>
              <p className="text-xs text-muted-foreground">Riutilizzo efficiente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Risparmiato</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timesSaved}h</div>
              <p className="text-xs text-muted-foreground">Questo mese</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documenti Recenti</CardTitle>
              <CardDescription>
                I tuoi ultimi lavori e materiali didattici
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-gray-500">{doc.subject} • {formatTimeAgo(doc.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {doc.isStarred && (
                      <button 
                        onClick={() => handleDocumentAction(doc.id, doc.title, 'star')}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDocumentAction(doc.id, doc.title, 'download')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Download className="h-4 w-4 text-gray-500" />
                    </button>
                    <button 
                      onClick={() => handleDocumentAction(doc.id, doc.title, 'share')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Share className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Azioni Rapide</CardTitle>
              <CardDescription>
                Crea nuovo contenuto in pochi click
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickAction('generate')}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Nuova Verifica con AI
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickAction('upload')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Carica Documento
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickAction('template')}
              >
                <Archive className="mr-2 h-4 w-4" />
                Crea da Template
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Attività Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 py-2">
                  <div className={`w-8 h-8 ${getActivityBgColor(activity.icon)} rounded-full flex items-center justify-center`}>
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
              
              {activities.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Nessuna attività recente</p>
                  <p className="text-sm">Le tue azioni appariranno qui</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Generation Modal */}
      <QuizModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </MainLayout>
  );
}