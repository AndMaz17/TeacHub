'use client';

import { 
  Home, 
  FileText, 
  Wand2, 
  Layout, 
  Archive,
  Settings,
  PlusCircle,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Documenti', href: '/documents', icon: FileText },
  { name: 'Generatore', href: '/generator', icon: Wand2 },
  { name: 'Template', href: '/templates', icon: Layout },
  { name: 'Archivio', href: '/archive', icon: Archive },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-50 border-r h-full">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-semibold text-gray-900">Teaching Hub</span>
        </div>
        
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon 
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex-shrink-0 p-4">
          <Link
            href="/generator/new"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Crea Verifica
          </Link>
        </div>
      </div>

      <div className="flex-shrink-0">
        <Link
          href="/settings"
          className={cn(
            'group flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            pathname === '/settings' && 'bg-gray-100 text-gray-900'
          )}
        >
          <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Impostazioni
        </Link>
      </div>
    </div>
  );
}