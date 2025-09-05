'use client';

import { 
  Home, 
  FileText, 
  Wand2, 
  Layout, 
  BookOpen,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MiniCalendar = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  // Primo giorno del mese
  const firstDay = new Date(currentYear, currentMonth, 1);
  // Ultimo giorno del mese
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  
  // Giorni della settimana (abbreviazioni italiane)
  const weekDays = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
  
  // Calcola il primo giorno della settimana (lunedì = 0)
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
  
  const days = [];
  
  // Aggiungi giorni vuoti per allineare il primo giorno
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Aggiungi tutti i giorni del mese
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(day);
  }

  return (
    <div className="text-xs">
      {/* Header giorni settimana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-gray-500 font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Griglia giorni */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "text-center py-1 rounded",
              day ? "hover:bg-gray-100 cursor-pointer" : "",
              day === currentDate
                ? "bg-blue-600 text-white font-semibold"
                : day
                ? "text-gray-700"
                : ""
            )}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Generatore', href: '/generator', icon: Wand2 },
  { name: 'Documenti', href: '/documents', icon: FileText },
  { name: 'Template', href: '/templates', icon: Layout },
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
      </div>

      <div className="flex-shrink-0 p-4">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="flex items-center justify-center py-2 border-b bg-gray-50 rounded-t-lg">
            <Calendar className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="p-2">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}