const API_URL = 'https://api.thesauros.tech/api/';
const VAULT_DATA_URL = process.env.NEXT_PUBLIC_VAULT_DATA_URL || '';

const NETWORK_MAP: Record<number, string> = {
  42161: 'Arbitrum',
  8453: 'Base',
  56: 'BSC',
  1: 'Ethereum',
  9745: 'Plasma',
  143: 'Monad',
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_URL}${endpoint}`;
};

export const getVaultDataUrl = (endpoint: string, chainID: number): string => {
  const network = NETWORK_MAP[chainID];

  return `${VAULT_DATA_URL}${endpoint}?network=${network}`;
};
