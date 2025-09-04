'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, User, Menu, Plus, Search, Bell } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Teaching Hub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/documents" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Documenti
              </Link>
              <Link 
                href="/generator" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Generatore
              </Link>
              <Link 
                href="/templates" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Template
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4 mr-2" />
              Cerca
            </Button>
            
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo
            </Button>

            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}