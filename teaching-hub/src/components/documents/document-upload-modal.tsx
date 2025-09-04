'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Image, File, X, Plus, Loader2 } from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import { toast } from 'sonner';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FilePreview {
  file: File;
  id: string;
  preview?: string;
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

const tagSuggestions = [
  // Matematica
  'algebra', 'geometria', 'analisi', 'statistica', 'equazioni', 'funzioni', 'derivate', 'integrali',
  // Italiano/Letteratura
  'analisi testuale', 'comprensione', 'grammatica', 'sintassi', 'poetica', 'narrativa', 'saggio', 'tema',
  // Storia
  'cronologia', 'cause conseguenze', 'fonti storiche', 'medioevo', 'rinascimento', 'contemporanea',
  // Scienze
  'esperimenti', 'laboratorio', 'teoria', 'cellula', 'DNA', 'ecosistema', 'chimica organica',
  // Lingue
  'vocabulary', 'grammar', 'conversation', 'reading', 'writing', 'listening',
  // Generali
  'base', 'intermedio', 'avanzato', 'ripasso', 'verifica', 'esercizi', 'teoria', 'pratica',
  'primo biennio', 'secondo biennio', 'quinto anno', 'preparazione esame', 'recupero'
];

export function DocumentUploadModal({ isOpen, onClose }: DocumentUploadModalProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'MATERIAL',
    difficulty: 'MEDIUM',
    tags: [] as string[],
    currentTag: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addActivity, addDocument } = useActivityStore();

  const acceptedTypes = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt',
    'image/jpeg': '.jpg,.jpeg',
    'image/png': '.png',
    'image/gif': '.gif'
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FilePreview[] = [];
    
    Array.from(selectedFiles).forEach((file) => {
      if (Object.keys(acceptedTypes).includes(file.type)) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview: FilePreview = { file, id };
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFiles(prev => prev.map(f => 
              f.id === id ? { ...f, preview: e.target?.result as string } : f
            ));
          };
          reader.readAsDataURL(file);
        }
        
        newFiles.push(preview);
      } else {
        toast.error(`Formato file non supportato: ${file.name}`);
      }
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const addTag = () => {
    const tag = formData.currentTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        currentTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Il titolo è obbligatorio');
      return;
    }

    if (files.length === 0) {
      toast.error('Seleziona almeno un file');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

      // Add document to store
      const documentData = {
        title: formData.title,
        subject: formData.subject || 'Materia Varia',
        type: formData.type,
        isStarred: false
      };

      addDocument(documentData);

      // Add activity
      addActivity({
        type: 'upload',
        title: 'Documento caricato',
        description: `Hai caricato "${formData.title}" (${files.length} file${files.length > 1 ? 's' : ''})`,
        icon: 'file'
      });

      toast.success(`Documento "${formData.title}" caricato con successo!`);
      
      // Reset form
      setFiles([]);
      setFormData({
        title: '',
        description: '',
        subject: '',
        type: 'MATERIAL',
        difficulty: 'MEDIUM',
        tags: [],
        currentTag: ''
      });
      
      onClose();
    } catch (error) {
      toast.error('Errore durante il caricamento');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type === 'application/pdf') return <FileText className="h-4 w-4 text-red-600" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Carica Nuovo Documento
          </DialogTitle>
          <DialogDescription>
            Carica PDF, immagini, documenti di testo e organizzali con tag personalizzati
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <CardContent className="p-6">
              <div 
                className="text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Seleziona o trascina i file</h3>
                <p className="text-gray-600 mb-4">
                  Supportati: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (max 10MB per file)
                </p>
                <Button variant="outline">
                  Seleziona File
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={Object.values(acceptedTypes).join(',')}
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </CardContent>
          </Card>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">File selezionati ({files.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {files.map((filePreview) => (
                  <Card key={filePreview.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        {filePreview.preview ? (
                          <img 
                            src={filePreview.preview} 
                            alt="Preview" 
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            {getFileIcon(filePreview.file.type)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {filePreview.file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(filePreview.file.size)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => removeFile(filePreview.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titolo Documento *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Es. Materiali Letteratura Italiana"
                />
              </div>

              <div>
                <Label htmlFor="subject">Materia</Label>
                <Autocomplete
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  suggestions={subjectSuggestions}
                  placeholder="Scrivi per cercare... (es. Mat, Storia, Ita...)"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo Documento</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MATERIAL">Materiale</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                    <SelectItem value="TEST">Verifica</SelectItem>
                    <SelectItem value="HOMEWORK">Compito</SelectItem>
                    <SelectItem value="LESSON_PLAN">Piano Lezione</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="difficulty">Difficoltà</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
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

              <div>
                <Label htmlFor="description">Descrizione (opzionale)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrizione del contenuto..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tag</Label>
            <div className="flex gap-2 mt-2">
              <Autocomplete
                value={formData.currentTag}
                onValueChange={(value) => setFormData({ ...formData, currentTag: value })}
                suggestions={tagSuggestions}
                placeholder="Cerca tag esistenti o creane di nuovi..."
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Annulla
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Caricamento...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Carica Documento
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}