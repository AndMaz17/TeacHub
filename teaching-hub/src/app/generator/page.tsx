import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, 
  Settings,
  BookOpen,
  FileText,
  Brain,
  Lightbulb,
  Target,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';

export default function GeneratorPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wand2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generatore AI</h1>
          <p className="text-gray-600">
            Crea verifiche personalizzate in pochi secondi con l&apos;intelligenza artificiale
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Materie Letterarie</CardTitle>
              <CardDescription>
                Comprensione del testo, analisi letteraria, domande aperte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Dante</Badge>
                <Badge variant="secondary">Manzoni</Badge>
                <Badge variant="secondary">Analisi</Badge>
              </div>
              <Button className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Genera Verifica
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Brain className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Materie STEM</CardTitle>
              <CardDescription>
                Problemi parametrizzati, esercizi matematici, formule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Equazioni</Badge>
                <Badge variant="secondary">Fisica</Badge>
                <Badge variant="secondary">Chimica</Badge>
              </div>
              <Button className="w-full">
                <Target className="mr-2 h-4 w-4" />
                Genera Esercizi
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Lightbulb className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Quiz Rapidi</CardTitle>
              <CardDescription>
                Domande a risposta multipla, vero/falso, test veloci
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Storia</Badge>
                <Badge variant="secondary">Geografia</Badge>
                <Badge variant="secondary">Scienze</Badge>
              </div>
              <Button className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Quiz Veloce
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Generazione Personalizzata
            </CardTitle>
            <CardDescription>
              Configura i parametri per creare la verifica perfetta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Materia</Label>
                  <Input 
                    id="subject" 
                    placeholder="Es. Letteratura Italiana, Matematica..."
                  />
                </div>
                <div>
                  <Label htmlFor="topic">Argomento Specifico</Label>
                  <Input 
                    id="topic" 
                    placeholder="Es. Dante Inferno, Equazioni di 2° grado..."
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Classe/Livello</Label>
                  <Input 
                    id="grade" 
                    placeholder="Es. 3° Superiore, Università..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="difficulty">Difficoltà</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Facile</option>
                    <option>Medio</option>
                    <option>Difficile</option>
                    <option>Misto</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="questions">Numero Domande</Label>
                  <Input 
                    id="questions" 
                    type="number" 
                    placeholder="10" 
                    min="1" 
                    max="50"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Tempo (minuti)</Label>
                  <Input 
                    id="time" 
                    type="number" 
                    placeholder="60" 
                    min="10" 
                    max="180"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="instructions">Istruzioni Aggiuntive (Opzionale)</Label>
              <Textarea 
                id="instructions"
                placeholder="Aggiungi istruzioni specifiche per l'AI: stile delle domande, riferimenti particolari, formato desiderato..."
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1">
                <Wand2 className="mr-2 h-5 w-5" />
                Genera Verifica con AI
              </Button>
              <Button variant="outline" size="lg">
                <FileText className="mr-2 h-5 w-5" />
                Salva come Template
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Template della Community
            </CardTitle>
            <CardDescription>
              Scopri i template più utilizzati da altri docenti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold mb-2">Verifica Dante</h4>
                <p className="text-sm text-gray-600 mb-3">Comprensione Inferno I-III</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">Letteratura</Badge>
                  <span className="text-xs text-gray-500">1.2k usi</span>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold mb-2">Quiz Storia</h4>
                <p className="text-sm text-gray-600 mb-3">Rivoluzione Francese</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">Storia</Badge>
                  <span className="text-xs text-gray-500">856 usi</span>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold mb-2">Test Matematica</h4>
                <p className="text-sm text-gray-600 mb-3">Equazioni 2° grado</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">Matematica</Badge>
                  <span className="text-xs text-gray-500">743 usi</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}