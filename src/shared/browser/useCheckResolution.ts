import { useEffect, useMemo, useState } from 'react';

const DEBOUNCE_DELAY = 150;

const checkResolution = (innerWidth = 768): boolean => {
  return typeof window !== 'undefined' ? window.innerWidth <= innerWidth : false;
};

const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number): T => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
};

export const useCheckResolution = (breakpoint: number, defaultValue: boolean = false): boolean => {
  const [isResolution, setIsResolution] = useState(defaultValue);

  const debouncedResize = useMemo(
    () => debounce(() => setIsResolution(checkResolution(breakpoint)), DEBOUNCE_DELAY),
    [breakpoint]
  );

  useEffect(() => {
    setIsResolution(checkResolution(breakpoint));
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [breakpoint, debouncedResize]);

  return isResolution;
};
