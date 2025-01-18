const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return { data: data as T };
  } catch (error) {
    console.error('API error:', error);
    return { 
      error: error instanceof Error ? error.message : 'An error occurred' 
    };
  }
}



export const quizService = {
    getQuizzes: () => fetchApi('/quizzes'),
    
    getQuiz: (id: string) => fetchApi(`/quizzes/${id}`),
    
    createQuiz: (data: any) => 
      fetchApi('/quizzes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      
    updateQuiz: (id: string, data: any) =>
      fetchApi(`/quizzes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
      
    deleteQuiz: (id: string) =>
      fetchApi(`/quizzes/${id}`, {
        method: 'DELETE',
      }),
      
    searchQuizzes: (pattern: string) =>
      fetchApi(`/quizzes/search?pattern=${pattern}`),
};