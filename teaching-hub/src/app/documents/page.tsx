import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Share
} from 'lucide-react';

// Mock data per testing
const mockDocuments = [
  {
    id: '1',
    title: 'Verifica Dante - Inferno Canti I-III',
    type: 'QUIZ',
    subject: 'Letteratura Italiana',
    grade: '3° Superiore',
    difficulty: 'MEDIUM',
    tags: ['dante', 'inferno', 'letteratura'],
    createdAt: new Date('2024-01-15'),
    isStarred: true
  },
  {
    id: '2',
    title: 'Test Equazioni di Secondo Grado',
    type: 'TEST',
    subject: 'Matematica',
    grade: '2° Superiore',
    difficulty: 'HARD',
    tags: ['equazioni', 'algebra'],
    createdAt: new Date('2024-01-10'),
    isStarred: false
  },
  {
    id: '3',
    title: 'Quiz Rivoluzione Francese',
    type: 'QUIZ',
    subject: 'Storia',
    grade: '4° Superiore',
    difficulty: 'EASY',
    tags: ['rivoluzione', 'francia', 'storia moderna'],
    createdAt: new Date('2024-01-08'),
    isStarred: true
  },
  {
    id: '4',
    title: 'Materiale Didattico - Fotosintesi',
    type: 'MATERIAL',
    subject: 'Scienze',
    grade: '1° Superiore',
    difficulty: 'EASY',
    tags: ['fotosintesi', 'biologia', 'piante'],
    createdAt: new Date('2024-01-05'),
    isStarred: false
  }
];

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

export default function DocumentsPage() {
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Documento
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Cerca nei tuoi documenti..." 
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtri
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDocuments.map((doc) => (
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
                        className={typeColors[doc.type as keyof typeof typeColors]}
                      >
                        {doc.type}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={difficultyColors[doc.difficulty as keyof typeof difficultyColors]}
                      >
                        {doc.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {doc.isStarred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
            Carica Altri Documenti
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}