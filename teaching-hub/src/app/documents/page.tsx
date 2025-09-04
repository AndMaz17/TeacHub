'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Autocomplete } from '@/components/ui/autocomplete';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter,
  Plus,
  FileText,
  Calendar,
  Tag,
  MoreVertical,
  Star,
  Download,
  Share,
  Eye,
  X,
  Trash2
} from 'lucide-react';
import { useDocumentsStore } from '@/store/useDocumentsStore';
import { DocumentPreviewModal } from '@/components/documents/document-preview-modal';
import { DocumentUploadModal } from '@/components/documents/document-upload-modal';
import { DocumentPrintPreview } from '@/components/documents/document-print-preview';
import { DocumentType, Difficulty } from '@/types';
import { toast } from 'sonner';

const difficultyColors = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HARD: 'bg-red-100 text-red-800'
};

const typeColors = {
  QUIZ: 'bg-blue-100 text-blue-800',
  TEST: 'bg-purple-100 text-purple-800',
  HOMEWORK: 'bg-orange-100 text-orange-800',
  LESSON_PLAN: 'bg-green-100 text-green-800',
  MATERIAL: 'bg-gray-100 text-gray-800'
};

const subjectSuggestions = [
  'Matematica', 'Italiano', 'Letteratura Italiana', 'Storia', 
  'Geografia', 'Scienze', 'Fisica', 'Chimica', 'Biologia',
  'Inglese', 'Francese', 'Spagnolo', 'Tedesco', 'Latino', 'Greco',
  'Filosofia', 'Arte', 'Musica', 'Educazione Fisica', 'Tecnologia',
  'Informatica', 'Economia', 'Diritto', 'Storia dell\'Arte'
];

const gradeSuggestions = [
  '1° Elementare', '2° Elementare', '3° Elementare', '4° Elementare', '5° Elementare',
  '1° Media', '2° Media', '3° Media',
  '1° Superiore', '2° Superiore', '3° Superiore', '4° Superiore', '5° Superiore'
];

export default function DocumentsPage() {
  const {
    filteredDocuments,
    searchTerm,
    filterType,
    filterDifficulty,
    filterSubject,
    filterGrade,
    setSearchTerm,
    setFilterType,
    setFilterDifficulty,
    setFilterSubject,
    setFilterGrade,
    clearFilters,
    deleteDocument
  } = useDocumentsStore();

  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

  useEffect(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (filterType !== 'ALL') count++;
    if (filterDifficulty !== 'ALL') count++;
    if (filterSubject.trim()) count++;
    if (filterGrade.trim()) count++;
    setActiveFiltersCount(count);
  }, [searchTerm, filterType, filterDifficulty, filterSubject, filterGrade]);

  const handleStarClick = (docId: string, isStarred: boolean) => {
    toast.success(
      isStarred ? 'Documento rimosso dai preferiti' : 'Documento aggiunto ai preferiti'
    );
  };

  const handleDownload = (docId: string, title: string) => {
    toast.success(`Download di "${title}" avviato`);
  };

  const handleShare = (docId: string, title: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/documents/${docId}`);
    toast.success(`Link di "${title}" copiato negli appunti`);
  };

  const handlePreview = (document: any) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  const handleOpenPrintPreview = () => {
    setPreviewOpen(false);
    setPrintPreviewOpen(true);
  };

  const handleNewDocument = () => {
    setUploadOpen(true);
  };

  const handleDeleteDocument = (docId: string, title: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare il documento "${title}"? Questa azione non può essere annullata.`)) {
      deleteDocument(docId);
      toast.success(`Documento "${title}" eliminato con successo`);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">I Tuoi Documenti</h1>
            <p className="text-gray-600 mt-2">
              Gestisci e organizza tutti i tuoi materiali didattici
            </p>
          </div>
          <Button onClick={handleNewDocument}>
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Documento
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Cerca nei tuoi documenti..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filtri
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Filtri Documenti</DialogTitle>
                <DialogDescription>
                  Filtra i tuoi documenti per trovare quello che cerchi
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo Documento</label>
                  <Select value={filterType} onValueChange={(value) => setFilterType(value as DocumentType | 'ALL')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tutti i tipi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tutti i tipi</SelectItem>
                      <SelectItem value={DocumentType.QUIZ}>Quiz</SelectItem>
                      <SelectItem value={DocumentType.TEST}>Test</SelectItem>
                      <SelectItem value={DocumentType.HOMEWORK}>Compiti</SelectItem>
                      <SelectItem value={DocumentType.LESSON_PLAN}>Piani di Lezione</SelectItem>
                      <SelectItem value={DocumentType.MATERIAL}>Materiali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficoltà</label>
                  <Select value={filterDifficulty} onValueChange={(value) => setFilterDifficulty(value as Difficulty | 'ALL')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tutte le difficoltà" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tutte le difficoltà</SelectItem>
                      <SelectItem value={Difficulty.EASY}>Facile</SelectItem>
                      <SelectItem value={Difficulty.MEDIUM}>Medio</SelectItem>
                      <SelectItem value={Difficulty.HARD}>Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Materia</label>
                  <Autocomplete
                    value={filterSubject}
                    onValueChange={setFilterSubject}
                    suggestions={subjectSuggestions}
                    placeholder="Es. Matematica, Letteratura..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Classe</label>
                  <Autocomplete
                    value={filterGrade}
                    onValueChange={setFilterGrade}
                    suggestions={gradeSuggestions}
                    placeholder="Es. 3° Superiore, 2° Media..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      clearFilters();
                      toast.success('Filtri rimossi');
                    }}
                    className="flex-1"
                  >
                    Pulisci Filtri
                  </Button>
                  <Button onClick={() => setShowFilters(false)} className="flex-1">
                    Applica
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 font-medium">Filtri attivi:</span>
            {searchTerm.trim() && (
              <Badge variant="secondary" className="gap-1">
                Cerca: "{searchTerm}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSearchTerm('')}
                />
              </Badge>
            )}
            {filterType !== 'ALL' && (
              <Badge variant="secondary" className="gap-1">
                Tipo: {filterType}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilterType('ALL')}
                />
              </Badge>
            )}
            {filterDifficulty !== 'ALL' && (
              <Badge variant="secondary" className="gap-1">
                Difficoltà: {filterDifficulty}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilterDifficulty('ALL')}
                />
              </Badge>
            )}
            {filterSubject.trim() && (
              <Badge variant="secondary" className="gap-1">
                Materia: {filterSubject}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilterSubject('')}
                />
              </Badge>
            )}
            {filterGrade.trim() && (
              <Badge variant="secondary" className="gap-1">
                Classe: {filterGrade}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilterGrade('')}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Trovati {filteredDocuments.length} documenti
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">
                      {doc.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className={typeColors[doc.type]}
                      >
                        {doc.type}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={difficultyColors[doc.difficulty]}
                      >
                        {doc.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleStarClick(doc.id, false)}
                    >
                      <Star className="h-4 w-4 text-yellow-500" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleDeleteDocument(doc.id, doc.title)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Elimina
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p><strong>Materia:</strong> {doc.subject}</p>
                    <p><strong>Classe:</strong> {doc.grade}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {doc.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{doc.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="mr-1 h-3 w-3" />
                      {doc.createdAt.toLocaleDateString('it-IT')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handlePreview(doc)}
                        title="Anteprima documento"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleShare(doc.id, doc.title)}
                        title="Condividi documento"
                      >
                        <Share className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownload(doc.id, doc.title)}
                        title="Scarica come PDF"
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

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nessun documento trovato
            </h3>
            <p className="text-gray-600 mb-4">
              Prova a modificare i filtri o a cercare con termini diversi
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Rimuovi tutti i filtri
            </Button>
          </div>
        )}

        {filteredDocuments.length > 0 && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => toast.info('Funzione in arrivo!')}>
              Carica Altri Documenti
            </Button>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreviewModal
          isOpen={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setSelectedDocument(null);
          }}
          onOpenPrintPreview={handleOpenPrintPreview}
          document={selectedDocument}
        />
      )}

      {/* Document Print Preview */}
      {selectedDocument && (
        <DocumentPrintPreview
          isOpen={printPreviewOpen}
          onClose={() => {
            setPrintPreviewOpen(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument}
        />
      )}

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </MainLayout>
  );
}