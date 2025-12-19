const API_URL = 'https://api.thesauros.tech/api/';
const GRAFANA_URL = 'https://api-production-ca82.up.railway.app/';
const BASE_URL = 'https://api-base-production-87ce.up.railway.app/';

export const getApiUrl = (endpoint: string): string => {
  return `${API_URL}${endpoint}`;
};

export const getGrafanaUrl = (endpoint: string): string => {
  return `${GRAFANA_URL}${endpoint}`;
};

export const getBaseUrl = (endpoint: string): string => {
  return `${BASE_URL}${endpoint}`;
};
