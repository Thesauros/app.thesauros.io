export const shortString = (string = '', size = 4) => {
  return `${string.slice(0, size)}…${string.slice(-size)}`;
};
