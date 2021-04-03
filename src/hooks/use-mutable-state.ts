import { useState } from 'react';
import { persist, PersistType } from '../utils/persist';

const useMutableState = <V extends Record<string | symbol, unknown> | unknown[]>(
  value: V,
  options?: { persist?: { key: string; type?: PersistType } }
) => {
  const handler = {
    set: (obj: V, prop: string | symbol, value: unknown) => {
      if (obj[prop] === value) {
        return true;
      }

      obj[prop] = value;

      if (options && options.persist) {
        persist(options.persist.key, obj, options.persist.type);
      }

      setState(new Proxy(obj, handler));

      return true;
    },
  };

  let valueToUse = value;

  if (options && options.persist) {
    const saved = persist(options.persist.key, undefined, options.persist.type);
    if (saved) {
      valueToUse = saved;
    }
  }

  const [state, setState] = useState(new Proxy(valueToUse, handler));

  return state;
};

export default useMutableState;
