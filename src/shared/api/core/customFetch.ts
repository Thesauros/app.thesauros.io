import { isError } from '@/shared/api/core/error';

export const customFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, options);

  if (response.ok) {
    return await response.json();
  }
  const error = JSON.parse(await response.text());
  if (isError(error)) {
    throw new Error(error?.message);
  }
  throw new Error(error);
};
