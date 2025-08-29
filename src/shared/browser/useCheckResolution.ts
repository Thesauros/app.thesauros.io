import { useCallback, useEffect, useState } from 'react';

const checkResolution = (innerWidth = 768): boolean => {
  return typeof window !== 'undefined' ? window.innerWidth <= innerWidth : false;
};

export const useCheckResolution = (breakpoint: number, defaultValue: boolean = false): boolean => {
  const [isResolution, setSsResolution] = useState(defaultValue);

  const onResize = useCallback(() => {
    setSsResolution(checkResolution(breakpoint));
  }, [breakpoint]);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);

  return isResolution;
};
