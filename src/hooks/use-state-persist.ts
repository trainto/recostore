import React, { useEffect, useState } from 'react';
import { persist } from '../utils';

const useStatePersist = <S extends unknown>(
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

  const setStatePersist = (newValue: React.SetStateAction<S>) => {
    setState(newValue);
    persist(key, newValue, type);
  };

  return [state, setStatePersist];
};

export default useStatePersist;
