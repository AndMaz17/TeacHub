'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, 
  Lightbulb,
  Clock,
  Sparkles,
  CheckCircle,
  Zap,
  Brain,
  FileCheck
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 flex flex-col h-full" onClick={() => handleQuickGenerate('literature')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center">
                <Wand2 className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl">Generatore Verifiche</CardTitle>
              <CardDescription className="text-base">
                Editor avanzato per tutte le materie con supporto formule, immagini e contenuti ricchi
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Letterature</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">STEM</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">Matematica</Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">Scienze</Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800">Storia</Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">+Altro</Badge>
              </div>
              <Button className="w-full h-12 text-base font-semibold mt-auto" onClick={(e) => { e.stopPropagation(); handleQuickGenerate('literature'); }}>
                <Sparkles className="mr-3 h-5 w-5" />
                Crea Verifica Personalizzata
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 flex flex-col h-full" onClick={() => handleQuickGenerate('quick')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full w-20 h-20 flex items-center justify-center">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl">Quiz Rapidi</CardTitle>
              <CardDescription className="text-base">
                Test veloci a risposta multipla per valutazioni immediate
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">Multiple Choice</Badge>
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">Vero/Falso</Badge>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">15 minuti</Badge>
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">Auto-corretto</Badge>
              </div>
              <Button className="w-full h-12 text-base font-semibold mt-auto" onClick={(e) => { e.stopPropagation(); handleQuickGenerate('quick'); }}>
                <Lightbulb className="mr-3 h-5 w-5" />
                Genera Quiz Veloce
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sezione Informativa */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Perché usare il nostro Generatore AI?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rivoluziona il tuo modo di creare verifiche con l'intelligenza artificiale.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="mx-auto mb-3 p-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Velocità Incredibile</h3>
              <p className="text-xs text-gray-600">
                Genera verifiche in <strong>30 secondi</strong>
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto mb-3 p-2 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Contenuti Intelligenti</h3>
              <p className="text-xs text-gray-600">
                <strong>Difficoltà automatica</strong> per ogni livello
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto mb-3 p-2 bg-gradient-to-br from-purple-400 to-violet-600 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Editor Avanzato</h3>
              <p className="text-xs text-gray-600">
                <strong>Formule e immagini</strong> integrate
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto mb-3 p-2 bg-gradient-to-br from-orange-400 to-red-600 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Qualità Garantita</h3>
              <p className="text-xs text-gray-600">
                Contenuti <strong>ministeriali</strong> italiani
              </p>
            </div>
          </div>
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