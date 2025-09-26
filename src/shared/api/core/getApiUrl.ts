const API_URL = 'https://api.thesauros.tech/api/';
const GRAFANA_URL = 'https://api-production-ca82.up.railway.app/';

export const getApiUrl = (endpoint: string): string => {
  return `${API_URL}${endpoint}`;
};

export const getGrafanaUrl = (endpoint: string): string => {
  return `${GRAFANA_URL}${endpoint}`;
};
