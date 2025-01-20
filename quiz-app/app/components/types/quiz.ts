export type QuestionType = 'SINGLE' | 'MULTIPLE' | 'OPEN';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id?: string;
  title: string;
  type: QuestionType;
  answers: string[];
  correctAnswer: string[];
  quizId?: string;
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
  createdById: string;
}

export interface QuizFormData {
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  timeLimit?: number;
  questions: Omit<Question, 'id' | 'quizId'>[];
  createdById?: string;
}

export interface QuizSubmission {
  answers: {
    [questionId: string]: string[];
  };
  timeSpent?: number;
  submittedAt: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentageScore: number;
  timeTaken: number;
  submittedAt: string;
  answers: {
    questionId: string;
    correct: boolean;
    points: number;
    userAnswer: string[];
    correctAnswer: string[];
  }[];
  feedback?: {
    overall: string;
    byQuestion: {
      [questionId: string]: {
        correct: boolean;
        feedback: string;
      };
    };
  };
}