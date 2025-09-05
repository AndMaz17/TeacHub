export interface User {
  id: string;
  email: string;
  name: string;
  school?: string;
  subject?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DocumentType {
  QUIZ = 'QUIZ',
  TEST = 'TEST',
  HOMEWORK = 'HOMEWORK',
  LESSON_PLAN = 'LESSON_PLAN',
  MATERIAL = 'MATERIAL'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Document {
  id: string;
  title: string;
  content: any;
  type: DocumentType;
  subject: string;
  grade?: string;
  difficulty: Difficulty;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
  schoolInfo?: {
    schoolName: string;
    schoolAddress: string;
    className: string;
    date: string;
  };
}

export interface Template {
  id: string;
  title: string;
  description?: string;
  content: any;
  type: DocumentType;
  subject: string;
  difficulty: Difficulty;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
}

export interface RichContent {
  type: 'text' | 'latex' | 'image' | 'table';
  content: string;
  id: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'open_ended' | 'true_false';
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  richContent?: RichContent[];
}

export interface QuizContent {
  title: string;
  instructions?: string;
  questions: Question[];
  totalPoints: number;
  timeLimit?: number;
}