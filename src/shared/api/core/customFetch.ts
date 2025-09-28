import { isError } from '@/shared/api/core/error';

export const customFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, options);

  if (response.ok) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await response.json()) as T;
    }
    const text = await response.text();
    return text as unknown as T;
  }
  const error = JSON.parse(await response.text());
  if (isError(error)) {
    throw new Error(error?.message);
  }
  throw new Error(error);
};
