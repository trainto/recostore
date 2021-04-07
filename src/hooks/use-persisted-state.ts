import React, { useCallback, useEffect, useState } from 'react';
import { persist } from '../utils';

const usePersistedState = <S extends unknown>(
  value: S,
  key: string,
  type: PersistType = 'local'
): [S, (newValue: S) => void] => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const saved = persist(key, undefined, type);
    if (saved !== null) {
      setState(saved);
    }
  }, [key, type]);

  const setPersistedState = useCallback(
    (newValue: React.SetStateAction<S>) => {
      setState(newValue);
      persist(key, newValue, type);
    },
    [key, type]
  );

  return [state, setPersistedState];
};

export default usePersistedState;
