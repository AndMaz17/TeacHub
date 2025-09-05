'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, 
  BookOpen,
  Brain,
  Lightbulb,
  Target,
  Clock,
  Sparkles
} from 'lucide-react';
import { QuizModal } from '@/components/generator/quiz-modal';

export default function GeneratorPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'literature' | 'stem' | 'quick'>('literature');
  const [modalPresetSubject, setModalPresetSubject] = useState<string>('');

  const handleQuickGenerate = (type: 'literature' | 'stem' | 'quick', presetSubject?: string) => {
    setModalType(type);
    setModalPresetSubject(presetSubject || '');
    setModalOpen(true);
  };

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
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleQuickGenerate('literature')}>
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
              <Button className="w-full" onClick={(e) => { e.stopPropagation(); handleQuickGenerate('literature'); }}>
                <Sparkles className="mr-2 h-4 w-4" />
                Genera Verifica
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleQuickGenerate('stem')}>
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
              <Button className="w-full" onClick={(e) => { e.stopPropagation(); handleQuickGenerate('stem'); }}>
                <Target className="mr-2 h-4 w-4" />
                Genera Esercizi
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleQuickGenerate('quick')}>
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
              <Button className="w-full" onClick={(e) => { e.stopPropagation(); handleQuickGenerate('quick'); }}>
                <Clock className="mr-2 h-4 w-4" />
                Quiz Veloce
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <QuizModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        presetSubject={modalPresetSubject}
      />
    </MainLayout>
  );
}