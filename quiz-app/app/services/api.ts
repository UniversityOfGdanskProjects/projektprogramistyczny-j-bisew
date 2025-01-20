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

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { data: { success: true } as any };
    }

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'An error occurred' };
    }

    return { data: data as T };
  } catch (error) {
    console.error('API error:', error);
    return { 
      error: error instanceof Error ? error.message : 'An error occurred' 
    };
  }
}
