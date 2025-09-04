import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Wand2, Archive, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <BookOpen className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Teaching Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Il tuo hub intelligente per tagliare i tempi morti. Genera, archivia, correggi e riusa 
            verifiche e materiali didattici in pochi click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Inizia Subito
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">
                Accedi
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Wand2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Generatore AI</CardTitle>
              <CardDescription>
                Crea verifiche personalizzate con l&apos;intelligenza artificiale. 
                Domande aperte, test a crocette, varianti multiple.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Archive className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Archivio Intelligente</CardTitle>
              <CardDescription>
                Tutti i tuoi materiali in un posto. Ricerca rapida, 
                categorizzazione automatica, zero perdite di tempo.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Collaborazione</CardTitle>
              <CardDescription>
                Condividi con colleghi, crea librerie di dipartimento, 
                costruisci insieme il futuro della didattica.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto per rivoluzionare la tua didattica?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Unisciti agli insegnanti che hanno già scoperto il futuro della preparazione delle lezioni.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              Registrati Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
