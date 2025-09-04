import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Mail, Lock, User, School, BookText, Chrome } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Unisciti a Teaching Hub</h1>
          <p className="text-gray-600 mt-2">Crea il tuo account gratuito</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registrazione</CardTitle>
            <CardDescription>
              Inizia subito a creare verifiche intelligenti
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              <Chrome className="mr-2 h-4 w-4" />
              Registrati con Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Oppure compila il form
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="name" 
                    placeholder="Mario Rossi"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="mario.rossi@scuola.it"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">Scuola (Opzionale)</Label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="school" 
                    placeholder="Liceo Scientifico Galilei"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Materia Principale (Opzionale)</Label>
                <div className="relative">
                  <BookText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="subject" 
                    placeholder="Letteratura Italiana"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10"
                    placeholder="Minimo 8 caratteri"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Conferma Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Accetto i{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Termini di Servizio
                  </Link>
                  {' '}e la{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button className="w-full">
                Crea Account Gratuito
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Hai già un account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Accedi qui
            </Link>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">🎯 Cosa otterrai:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Generatore AI per verifiche personalizzate</li>
            <li>• Archivio intelligente dei tuoi materiali</li>
            <li>• Template riutilizzabili e condivisibili</li>
            <li>• Correzione assistita dall&apos;AI</li>
          </ul>
        </div>
      </div>
    </div>
  );
}