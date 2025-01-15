'use client';

import QuizForm from '../components/quiz/quizForm';

export default function CreateQuizPage() {
  const handleCreateQuiz = async (quizData: any) => {
    try {
      // TODO: Implement API call to create quiz
      console.log('Creating quiz:', quizData);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return <QuizForm onSubmit={handleCreateQuiz} />;
}