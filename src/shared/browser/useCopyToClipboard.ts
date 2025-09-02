import { useState } from 'react';

export const useCopyToClipboard = () => {
  const [isCopying, setIsCopying] = useState(false);

  const copy = (value: string) => {
    setIsCopying(true);
    navigator.clipboard.writeText(value);
    setTimeout(() => {
      setIsCopying(false);
    }, 1000);
  };

  return { isCopying, copy };
};
