const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetcher<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | null> {
  try {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const res = await fetch(url, {
      credentials: 'include',
      cache: 'no-store',
      ...options,
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    console.error(`fetcher error for [${endpoint}]:`, error);
    return null;
  }
}
