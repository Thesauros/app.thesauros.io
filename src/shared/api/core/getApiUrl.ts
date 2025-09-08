const API_URL = 'https://api.thesauros.tech/api/';

export const getApiUrl = (endpoint: string): string => {
  return `${API_URL}${endpoint}`;
};
