export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'SINGLE' | 'MULTIPLE' | 'OPEN';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  answers: string[];
  correctAnswer: string[];
  quizId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  timeLimit: number | null;
  questions: Question[];
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}