import { useWindowEvent } from '@mantine/hooks';
import { useState, useCallback } from 'react';

type ObjectLike = Record<string, unknown> | Record<string, unknown>[];

export function useLocalStorageObject<T extends ObjectLike>({
  key,
  defaultValue = undefined,
}: {
  key: string;
  defaultValue?: T;
}): readonly [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined' || !('localStorage' in window)) {
      return defaultValue as T;
    }

    const valueInStorage = JSON.parse(window.localStorage.getItem(key) || 'null');

    if (!valueInStorage) {
      window.localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue as T;
    }

    return valueInStorage as T;
  });

  const setLocalStorageValue = useCallback(
    (val: T | ((prevState: T) => T)) => {
      if (typeof val === 'function') {
        setValue((current) => {
          const result = val(current);
          window.localStorage.setItem(key, JSON.stringify(result));
          return result;
        });
      } else {
        window.localStorage.setItem(key, JSON.stringify(val));
        setValue(val);
      }
    },
    [key]
  );

  useWindowEvent('storage', (event) => {
    if (event.storageArea === window.localStorage && event.key === key) {
      setValue(JSON.parse(event.newValue || '{}') as T);
    }
  });

  return [value, setLocalStorageValue] as const;
}
