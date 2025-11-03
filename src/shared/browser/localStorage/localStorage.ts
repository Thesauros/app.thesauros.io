export enum LocalStorageKey {
  CONNECTED_WALLET = 'CONNECTED_WALLET',
  REGISTERED_REFERRALS = 'REGISTERED_REFERRALS',
}

const addArrayItem = <T>(key: LocalStorageKey, value: T): void => {
  const localStorageValue = localStorage.getItem(key);
  let values: T[] = [];
  if (localStorageValue !== null) {
    values = JSON.parse(localStorageValue) as T[];
  }

  if (values.includes(value)) {
    return;
  }

  const newValues = [...values, value];
  localStorage.setItem(key, JSON.stringify(newValues));
};

const getArrayValues = <T>(key: LocalStorageKey): T[] => {
  const localStorageValue = localStorage.getItem(key);
  if (localStorageValue === null) {
    return [];
  }

  return JSON.parse(localStorageValue) as T[];
};

const addItem = <T>(key: LocalStorageKey, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: LocalStorageKey) => {
  return localStorage.getItem(key);
};

export const storage = {
  addItem,
  getItem,
  addArrayItem,
  getArrayValues,
};
