import { useEffect, useState } from 'react';

/**
 * Touch devices have no hover, so hover-only affordances (tooltips) are
 * unreachable there and have to be opened by a tap instead.
 */
export const useIsTouchDevice = (): boolean => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouch(query.matches);

    const onChange = (event: MediaQueryListEvent) => setIsTouch(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isTouch;
};
