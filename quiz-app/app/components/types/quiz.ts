export type QuestionType = 'single' | 'multiple' | 'open';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[];
  correctAnswers: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}