export const shortString = (string = '', size = 4) => {
  return `${string.slice(0, size)}…${string.slice(-size)}`;
};

export const capitalize = (string = '') => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
