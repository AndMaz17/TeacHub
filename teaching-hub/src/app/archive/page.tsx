import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Archive,
  Calendar,
  TrendingUp,
  Clock,
  FileText,
  Tag,
  SortDesc,
  Grid,
  List,
  Star
} from 'lucide-react';

const mockArchivedItems = [
  {
    id: '1',
    title: 'Verifica Dante - Inferno Canti I-V',
    type: 'QUIZ',
    subject: 'Letteratura Italiana',
    createdAt: new Date('2023-10-15'),
    lastUsed: new Date('2024-01-10'),
    usageCount: 12,
    tags: ['dante', 'inferno', 'letteratura', 'medioevo'],
    difficulty: 'MEDIUM',
    isStarred: true
  },
  {
    id: '2',
    title: 'Test Matematica - Equazioni Secondo Grado',
    type: 'TEST',
    subject: 'Matematica',
    createdAt: new Date('2023-09-20'),
    lastUsed: new Date('2023-12-15'),
    usageCount: 8,
    tags: ['equazioni', 'algebra', 'secondo grado'],
    difficulty: 'HARD',
    isStarred: false
  },
  {
    id: '3',
    title: 'Quiz Storia - Prima Guerra Mondiale',
    type: 'QUIZ',
    subject: 'Storia',
    createdAt: new Date('2023-11-03'),
    lastUsed: new Date('2024-01-20'),
    usageCount: 15,
    tags: ['guerra', 'novecento', 'storia contemporanea'],
    difficulty: 'MEDIUM',
    isStarred: true
  },
  {
    id: '4',
    title: 'Materiale - Tavola Periodica',
    type: 'MATERIAL',
    subject: 'Chimica',
    createdAt: new Date('2023-08-12'),
    lastUsed: new Date('2023-11-28'),
    usageCount: 6,
    tags: ['elementi', 'tavola periodica', 'chimica'],
    difficulty: 'EASY',
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

export default function ArchivePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Archivio</h1>
            <p className="text-gray-600 mt-2">
              La tua collezione completa di materiali didattici
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Grid className="mr-2 h-4 w-4" />
              Griglia
            </Button>
            <Button variant="ghost" size="sm">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totale Documenti</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12 questo mese</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Più Utilizzati</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Documenti ricorrenti</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ultima Attività</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2g</div>
              <p className="text-xs text-muted-foreground">fa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preferiti</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Documenti stellati</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Cerca nell'archivio per titolo, tag, materia..." 
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
              <SortDesc className="mr-2 h-4 w-4" />
              Ordina
            </Button>
            <Button variant="outline">
              <Tag className="mr-2 h-4 w-4" />
              Tag
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Archive className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Suggerimento Pro</h3>
              <p className="text-blue-700 text-sm mt-1">
                Usa i tag per organizzare i tuoi materiali. Più tag specifici usi, più facile sarà trovarli in futuro. 
                Prova combinazioni come &quot;dante-inferno-canto1&quot; per una ricerca ultra-precisa.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArchivedItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className={typeColors[item.type as keyof typeof typeColors]}
                      >
                        {item.type}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={difficultyColors[item.difficulty as keyof typeof difficultyColors]}
                      >
                        {item.difficulty}
                      </Badge>
                    </div>
                  </div>
                  {item.isStarred && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p><strong>Materia:</strong> {item.subject}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 bg-gray-50 rounded p-2">
                    <div>
                      <p className="font-medium">Creato</p>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.createdAt.toLocaleDateString('it-IT')}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Ultimo uso</p>
                      <p className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.lastUsed.toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Usato {item.usageCount} volte
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      <FileText className="mr-1 h-3 w-3" />
                      Visualizza
                    </Button>
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

        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-green-600" />
              Backup Automatico Attivo
            </CardTitle>
            <CardDescription>
              Tutti i tuoi materiali sono al sicuro nel cloud
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  I tuoi documenti vengono salvati automaticamente e sono sempre accessibili. 
                  Ultimo backup: oggi alle 14:30
                </p>
              </div>
              <Button variant="outline">
                Gestisci Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}