import { useEffect, useState } from 'react';
import { persist } from '../utils';

const useStatePersist = <V extends unknown>(
  value: V,
  key: string,
  type: PersistType = 'local'
): [V, (newValue: V) => void] => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const saved = persist(key, undefined, type);
    if (saved !== null) {
      setState(saved);
    }
  }, [key, type]);

  const setPersist = (newValue: V) => {
    setState(newValue);
    persist(key, newValue, type);
  };

  return [state, setPersist];
};

export default useStatePersist;
