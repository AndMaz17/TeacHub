import { create } from 'zustand';
import { Document, DocumentType, Difficulty } from '@/types';

interface DocumentsStore {
  documents: Document[];
  filteredDocuments: Document[];
  searchTerm: string;
  filterType: DocumentType | 'ALL';
  filterDifficulty: Difficulty | 'ALL';
  filterSubject: string;
  isLoading: boolean;
  
  // Actions
  setDocuments: (documents: Document[]) => void;
  setSearchTerm: (term: string) => void;
  setFilterType: (type: DocumentType | 'ALL') => void;
  setFilterDifficulty: (difficulty: Difficulty | 'ALL') => void;
  setFilterSubject: (subject: string) => void;
  setIsLoading: (loading: boolean) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Verifica Dante - Inferno Canti I-III',
    content: { questions: ['Chi è Virgilio?', 'Descrivi il primo cerchio'] },
    type: DocumentType.QUIZ,
    subject: 'Letteratura Italiana',
    grade: '3° Superiore',
    difficulty: Difficulty.MEDIUM,
    tags: ['dante', 'inferno', 'letteratura'],
    isPublic: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    userId: 'user1'
  },
  {
    id: '2',
    title: 'Test Equazioni di Secondo Grado',
    content: { questions: ['Risolvi x² - 5x + 6 = 0', 'Delta e soluzioni'] },
    type: DocumentType.TEST,
    subject: 'Matematica',
    grade: '2° Superiore',
    difficulty: Difficulty.HARD,
    tags: ['equazioni', 'algebra'],
    isPublic: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    userId: 'user1'
  },
  {
    id: '3',
    title: 'Quiz Rivoluzione Francese',
    content: { questions: ['Quando iniziò?', 'Cause principali', 'Personaggi chiave'] },
    type: DocumentType.QUIZ,
    subject: 'Storia',
    grade: '4° Superiore',
    difficulty: Difficulty.EASY,
    tags: ['rivoluzione', 'francia', 'storia moderna'],
    isPublic: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    userId: 'user1'
  },
  {
    id: '4',
    title: 'Materiale Didattico - Fotosintesi',
    content: { description: 'Processo di fotosintesi clorofilliana' },
    type: DocumentType.MATERIAL,
    subject: 'Scienze',
    grade: '1° Superiore',
    difficulty: Difficulty.EASY,
    tags: ['fotosintesi', 'biologia', 'piante'],
    isPublic: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    userId: 'user1'
  },
  {
    id: '5',
    title: 'Verifica Manzoni - I Promessi Sposi',
    content: { questions: ['Analizza Renzo', 'Il tema della Provvidenza'] },
    type: DocumentType.QUIZ,
    subject: 'Letteratura Italiana',
    grade: '3° Superiore',
    difficulty: Difficulty.MEDIUM,
    tags: ['manzoni', 'promessi-sposi', 'romanzo'],
    isPublic: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    userId: 'user1'
  },
  {
    id: '6',
    title: 'Test Fisica - Meccanica',
    content: { questions: ['Leggi di Newton', 'Moto rettilineo uniforme'] },
    type: DocumentType.TEST,
    subject: 'Fisica',
    grade: '4° Superiore',
    difficulty: Difficulty.HARD,
    tags: ['fisica', 'meccanica', 'newton'],
    isPublic: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    userId: 'user1'
  }
];

export const useDocumentsStore = create<DocumentsStore>((set, get) => ({
  documents: mockDocuments,
  filteredDocuments: mockDocuments,
  searchTerm: '',
  filterType: 'ALL',
  filterDifficulty: 'ALL',
  filterSubject: '',
  isLoading: false,

  setDocuments: (documents) => {
    set({ documents, filteredDocuments: documents });
    get().applyFilters();
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },

  setFilterType: (type) => {
    set({ filterType: type });
    get().applyFilters();
  },

  setFilterDifficulty: (difficulty) => {
    set({ filterDifficulty: difficulty });
    get().applyFilters();
  },

  setFilterSubject: (subject) => {
    set({ filterSubject: subject });
    get().applyFilters();
  },

  setIsLoading: (loading) => set({ isLoading: loading }),

  applyFilters: () => {
    const { documents, searchTerm, filterType, filterDifficulty, filterSubject } = get();
    
    let filtered = [...documents];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        doc.subject.toLowerCase().includes(term) ||
        doc.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Type filter
    if (filterType !== 'ALL') {
      filtered = filtered.filter(doc => doc.type === filterType);
    }

    // Difficulty filter
    if (filterDifficulty !== 'ALL') {
      filtered = filtered.filter(doc => doc.difficulty === filterDifficulty);
    }

    // Subject filter
    if (filterSubject.trim()) {
      filtered = filtered.filter(doc => 
        doc.subject.toLowerCase().includes(filterSubject.toLowerCase())
      );
    }

    set({ filteredDocuments: filtered });
  },

  clearFilters: () => {
    set({
      searchTerm: '',
      filterType: 'ALL',
      filterDifficulty: 'ALL',
      filterSubject: '',
    });
    get().applyFilters();
  }
}));