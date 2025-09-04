import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Wand2, 
  Archive, 
  Users, 
  ArrowRight, 
  GraduationCap,
  PenTool,
  FileText,
  Calculator,
  Globe,
  Microscope,
  Palette,
  Sparkles,
  Zap,
  Ruler,
  Scissors,
  Eraser,
  Compass,
  BookMarked,
  Notebook,
  Highlighter,
  Brain
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Educational Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-12 text-blue-400 opacity-60 transform rotate-12">
          <GraduationCap className="h-16 w-16" />
        </div>
        <div className="absolute top-32 right-24 text-green-500 opacity-55 transform -rotate-6">
          <Calculator className="h-12 w-12" />
        </div>
        <div className="absolute top-64 left-1/4 text-purple-500 opacity-45 transform rotate-45">
          <PenTool className="h-10 w-10" />
        </div>
        <div className="absolute bottom-36 right-16 text-indigo-500 opacity-60 transform -rotate-12">
          <Microscope className="h-14 w-14" />
        </div>
        <div className="absolute bottom-72 left-20 text-pink-500 opacity-50 transform rotate-24">
          <Globe className="h-12 w-12" />
        </div>
        <div className="absolute top-1/2 right-1/4 text-yellow-500 opacity-45 transform -rotate-30">
          <Palette className="h-8 w-8" />
        </div>
        <div className="absolute top-24 left-1/3 text-emerald-500 opacity-50 transform rotate-18">
          <FileText className="h-10 w-10" />
        </div>
        <div className="absolute bottom-24 right-1/3 text-cyan-500 opacity-55 transform -rotate-15">
          <BookOpen className="h-12 w-12" />
        </div>
        {/* Nuove icone scolastiche */}
        <div className="absolute top-1/3 left-8 text-orange-500 opacity-50 transform rotate-30">
          <Ruler className="h-10 w-10" />
        </div>
        <div className="absolute top-48 right-12 text-red-500 opacity-45 transform -rotate-20">
          <Scissors className="h-8 w-8" />
        </div>
        <div className="absolute bottom-48 left-1/3 text-blue-500 opacity-50 transform rotate-60">
          <Compass className="h-9 w-9" />
        </div>
        <div className="absolute top-80 right-1/5 text-violet-500 opacity-45 transform -rotate-45">
          <BookMarked className="h-11 w-11" />
        </div>
        <div className="absolute bottom-80 right-8 text-teal-500 opacity-55 transform rotate-15">
          <Notebook className="h-10 w-10" />
        </div>
        <div className="absolute top-1/4 left-1/5 text-amber-500 opacity-50 transform -rotate-25">
          <Highlighter className="h-8 w-8" />
        </div>
        <div className="absolute bottom-1/3 left-8 text-rose-500 opacity-45 transform rotate-40">
          <Eraser className="h-9 w-9" />
        </div>
        <div className="absolute bottom-1/4 right-1/5 text-slate-500 opacity-50 transform -rotate-10">
          <Brain className="h-12 w-12" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8 relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 blur-lg"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-full">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8 leading-tight">
            Teaching Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
            Il tuo hub intelligente per tagliare i <span className="bg-yellow-200 px-2 py-1 rounded-md font-semibold">tempi morti</span>. 
            Genera, archivia, correggi e riusa verifiche e materiali didattici in <span className="bg-green-200 px-2 py-1 rounded-md font-semibold">pochi click</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
              <Link href="/dashboard">
                <Zap className="mr-2 h-5 w-5" />
                Inizia Subito
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 border-indigo-600 bg-white hover:bg-indigo-50 text-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-200">
              <Link href="/login">
                Accedi
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="relative mx-auto mb-6 w-fit">
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-md"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full">
                  <Wand2 className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-3 text-gray-800">Generatore AI</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed text-base">
                Crea verifiche personalizzate con l&apos;intelligenza artificiale. 
                Domande aperte, test a crocette, varianti multiple.
                <div className="mt-3 text-blue-600 font-medium">✨ Powered by AI</div>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-0 shadow-2xl bg-gradient-to-br from-white to-green-50 hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="relative mx-auto mb-6 w-fit">
                <div className="absolute -inset-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-md"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full">
                  <Archive className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-3 text-gray-800">Archivio Intelligente</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed text-base">
                Tutti i tuoi materiali in un posto. Ricerca rapida, 
                categorizzazione automatica, zero perdite di tempo.
                <div className="mt-3 text-green-600 font-medium">📚 Sempre organizzato</div>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50 hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="relative mx-auto mb-6 w-fit">
                <div className="absolute -inset-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-md"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                  <Users className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-3 text-gray-800">Collaborazione</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed text-base">
                Condividi con colleghi, crea librerie di dipartimento, 
                costruisci insieme il futuro della didattica.
                <div className="mt-3 text-purple-600 font-medium">🤝 Insieme è meglio</div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl transform rotate-1"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-center text-white">
            <div className="absolute top-6 left-6">
              <GraduationCap className="h-8 w-8 text-white/30" />
            </div>
            <div className="absolute bottom-6 right-6">
              <Sparkles className="h-8 w-8 text-white/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto per rivoluzionare<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">la tua didattica?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Unisciti agli insegnanti che hanno già scoperto il futuro della preparazione delle lezioni.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-indigo-600 hover:bg-gray-50 shadow-xl transform hover:scale-105 transition-all duration-200">
                <Link href="/register">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Registrati Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-2 border-white bg-white/10 text-white hover:bg-white/20 backdrop-blur shadow-lg transform hover:scale-105 transition-all duration-200">
                <Link href="/dashboard">
                  Prova la Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
