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

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'open_ended' | 'true_false';
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

export interface QuizContent {
  title: string;
  instructions?: string;
  questions: Question[];
  totalPoints: number;
  timeLimit?: number;
}