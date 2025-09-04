import { create } from 'zustand';
import { QuizContent } from '@/types';

export interface Activity {
  id: string;
  type: 'generate' | 'download' | 'save' | 'share' | 'upload' | 'template';
  title: string;
  description: string;
  timestamp: Date;
  icon: 'wand' | 'download' | 'save' | 'share' | 'file' | 'template';
}

interface ActivityStore {
  activities: Activity[];
  recentDocuments: Array<{
    id: string;
    title: string;
    subject: string;
    type: string;
    isStarred: boolean;
    createdAt: Date;
  }>;
  
  // Statistics
  totalDocuments: number;
  documentsCreatedThisMonth: number;
  quizzesGenerated: number;
  templatesUsed: number;
  timesSaved: number; // in hours
  
  // Actions
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  addDocument: (document: Omit<ActivityStore['recentDocuments'][0], 'id' | 'createdAt'>) => void;
  updateStats: (updates: Partial<Pick<ActivityStore, 'totalDocuments' | 'documentsCreatedThisMonth' | 'quizzesGenerated' | 'templatesUsed' | 'timesSaved'>>) => void;
  generateQuizFromTemplate: (templateName: string, subject: string) => Promise<QuizContent>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock data iniziali
const initialActivities: Activity[] = [
  {
    id: '1',
    type: 'generate',
    title: 'Verifica generata',
    description: 'Hai generato una nuova verifica di Letteratura',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 ore fa
    icon: 'wand'
  },
  {
    id: '2',
    type: 'save',
    title: 'Documento salvato',
    description: 'Hai salvato "Quiz Rivoluzione Francese"',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 giorno fa
    icon: 'save'
  },
  {
    id: '3',
    type: 'template',
    title: 'Template utilizzato',
    description: 'Hai usato il template "Verifica Dante"',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 giorni fa
    icon: 'template'
  }
];

const initialRecentDocuments = [
  {
    id: '1',
    title: 'Verifica Dante - Inferno Canti I-III',
    subject: 'Letteratura Italiana',
    type: 'QUIZ',
    isStarred: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Test Equazioni di Secondo Grado',
    subject: 'Matematica',
    type: 'TEST',
    isStarred: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Quiz Rivoluzione Francese',
    subject: 'Storia',
    type: 'QUIZ',
    isStarred: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: initialActivities,
  recentDocuments: initialRecentDocuments,
  
  // Stats iniziali
  totalDocuments: 12,
  documentsCreatedThisMonth: 4,
  quizzesGenerated: 8,
  templatesUsed: 5,
  timesSaved: 24,

  addActivity: (activity) => {
    const newActivity: Activity = {
      ...activity,
      id: generateId(),
      timestamp: new Date()
    };
    
    set((state) => ({
      activities: [newActivity, ...state.activities.slice(0, 9)] // Keep only last 10
    }));
  },

  addDocument: (document) => {
    const newDocument = {
      ...document,
      id: generateId(),
      createdAt: new Date()
    };
    
    set((state) => ({
      recentDocuments: [newDocument, ...state.recentDocuments.slice(0, 2)], // Keep only last 3
      totalDocuments: state.totalDocuments + 1,
      documentsCreatedThisMonth: state.documentsCreatedThisMonth + 1
    }));
  },

  updateStats: (updates) => {
    set((state) => ({ ...state, ...updates }));
  },

  generateQuizFromTemplate: async (templateName: string, subject: string): Promise<QuizContent> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    const { addActivity, updateStats } = get();
    
    // Add activity
    addActivity({
      type: 'template',
      title: 'Template utilizzato',
      description: `Hai usato il template "${templateName}"`,
      icon: 'template'
    });

    // Update stats
    updateStats({ templatesUsed: get().templatesUsed + 1 });

    // Generate template-based content
    const templateContent = {
      'Verifica Dante': {
        title: 'Verifica su Dante Alighieri - Template',
        instructions: 'Verifica basata sul template della community. Tempo: 60 minuti.',
        questions: [
          {
            id: '1',
            text: 'Chi accompagna Dante nel suo viaggio attraverso l\'Inferno?',
            type: 'multiple_choice' as const,
            options: ['Beatrice', 'Virgilio', 'San Bernardo', 'Catone'],
            correctAnswer: 1,
            points: 5
          },
          {
            id: '2',
            text: 'Analizza il significato allegorico della "selva oscura" nel primo canto dell\'Inferno.',
            type: 'open_ended' as const,
            points: 15
          },
          {
            id: '3',
            text: 'Le tre fiere che ostacolano Dante simboleggiano:',
            type: 'multiple_choice' as const,
            options: [
              'I tre regni dell\'oltretomba',
              'I peccati di incontinenza, violenza e frode',
              'Le tre guide del viaggio',
              'I tre cantori classici'
            ],
            correctAnswer: 1,
            points: 5
          }
        ],
        totalPoints: 25,
        timeLimit: 60
      },
      'Quiz Storia': {
        title: 'Quiz Storia - Rivoluzione Francese Template',
        instructions: 'Quiz basato su template della community per la Rivoluzione Francese.',
        questions: [
          {
            id: '1',
            text: 'La Rivoluzione Francese iniziò nel:',
            type: 'multiple_choice' as const,
            options: ['1788', '1789', '1790', '1791'],
            correctAnswer: 1,
            points: 3
          },
          {
            id: '2',
            text: 'Quali furono le principali cause della Rivoluzione Francese?',
            type: 'open_ended' as const,
            points: 12
          },
          {
            id: '3',
            text: 'La presa della Bastiglia avvenne il:',
            type: 'multiple_choice' as const,
            options: ['14 luglio 1789', '14 luglio 1790', '15 luglio 1789', '13 luglio 1789'],
            correctAnswer: 0,
            points: 3
          }
        ],
        totalPoints: 18,
        timeLimit: 45
      },
      'Test Matematica': {
        title: 'Test Matematica - Equazioni di Secondo Grado Template',
        instructions: 'Test basato su template per equazioni di secondo grado.',
        questions: [
          {
            id: '1',
            text: 'Risolvi l\'equazione: x² - 7x + 12 = 0',
            type: 'open_ended' as const,
            points: 10
          },
          {
            id: '2',
            text: 'Il discriminante (Delta) dell\'equazione ax² + bx + c = 0 è:',
            type: 'multiple_choice' as const,
            options: ['b² - 4ac', 'b² + 4ac', '4ac - b²', 'ab - 4c'],
            correctAnswer: 0,
            points: 5
          },
          {
            id: '3',
            text: 'Determina per quali valori di k l\'equazione kx² - 4x + 1 = 0 ha soluzioni reali.',
            type: 'open_ended' as const,
            points: 15
          }
        ],
        totalPoints: 30,
        timeLimit: 75
      }
    };

    return templateContent[templateName as keyof typeof templateContent] || templateContent['Quiz Storia'];
  }
}));