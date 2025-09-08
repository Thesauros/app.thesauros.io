import { useCallback, useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react';

type TSetter<T> = (value: T) => T;

function getValue<T>(source: (() => T) | T | null): T | null {
  if (typeof source === 'function') {
    return (source as () => T)();
  }
  return source;
}

type Listener = (() => void) | Dispatch<SetStateAction<string>>;

const localStorageListeners: {
  [key: string]: Listener[];
} = {};

function useLocalStorageStringState(
  key: string,
  defaultState: (() => string) | string | null = null
): [string | null, (newState: string | null | TSetter<string>) => void] {
  const query = useCallback(
    () =>
      typeof window !== 'undefined'
        ? localStorage.getItem(key) || getValue(defaultState) || ''
        : getValue(defaultState) || '',
    [key, defaultState]
  );

  const state = query();

  const [, notify] = useState(`${key}\n${state}`);

  useEffect(() => {
    if (!localStorageListeners[key]) {
      localStorageListeners[key] = [];
    }
    localStorageListeners[key].push(notify);
    return () => {
      localStorageListeners[key] = localStorageListeners[key].filter(
        (listener: Listener) => listener !== notify
      );
      if (localStorageListeners[key].length === 0) {
        delete localStorageListeners[key];
      }
    };
  }, [key]);

  const setState = useCallback<(newState: string | null | TSetter<string>) => void>(
    newState => {
      const resultingState = typeof newState == 'function' ? newState(query()) : newState;

      if (state === resultingState) {
        return;
      }

      if (resultingState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, resultingState);
      }

      if (localStorageListeners[key]) {
        localStorageListeners[key].forEach((listener: Listener) =>
          listener(`${key}\n${resultingState}`)
        );
      }
    },
    [state, key, query]
  );

  return [state, setState];
}

export function useLocalStorageState<T = unknown>(
  key: string,
  defaultState: (() => T) | T | null = null
): [T, (newState: T | TSetter<T>) => void] {
  const [stringState, setStringState] = useLocalStorageStringState(key, () =>
    JSON.stringify(getValue(defaultState))
  );

  useEffect(() => {
    if (!stringState || stringState === 'undefined') {
      localStorage.removeItem(key);
    }
  }, [stringState, key]);

  return [
    useMemo(() => stringState && JSON.parse(stringState), [stringState]),
    (newState: T | TSetter<T>) => {
      if (typeof newState == 'function') {
        setStringState((oldState: string) =>
          JSON.stringify((newState as TSetter<T>)(JSON.parse(oldState)))
        );
      } else {
        setStringState(JSON.stringify(newState));
      }
    },
  ];
}
