import { useCallback, useEffect, useReducer, useRef } from 'react';
import { constructProxy, persist } from '../utils';

const useMutableState = <V extends unknown[] | Record<string, unknown>>(
  initialState: V,
  options?: { persist?: { key: string; type?: PersistType } }
): [V, (state: V) => void] => {
  const [updateCount, forceUpdate] = useReducer((current) => {
    if (current >= Number.MAX_SAFE_INTEGER) {
      return 0;
    } else {
      return current + 1;
    }
  }, 0);

  const persistedRef = useRef(false);
  let initialStateOrSaved = initialState;
  if (persistedRef.current === false) {
    if (options && options.persist) {
      persistedRef.current = true;
      initialStateOrSaved =
        persist(options.persist.key, undefined, options.persist.type) || initialState;
    }
  }

  const tryProxy = useCallback((stateToProxy) => {
    const [proxy, dispatcher] = constructProxy(stateToProxy);
    proxyRef.current = proxy;
    dispatcher.dispatch = () => forceUpdate();
  }, []);

  const proxyRef = useRef<V>(initialStateOrSaved);
  if (proxyRef.current === initialStateOrSaved) {
    tryProxy(initialStateOrSaved);
  }

  useEffect(() => {
    if (options && options.persist && proxyRef.current) {
      persist(options.persist.key, proxyRef.current, options.persist.type);
    }
  }, [options, updateCount]);

  const reset = useCallback(
    (anotherState: V) => {
      tryProxy(anotherState);
      forceUpdate();
    },
    [tryProxy]
  );

  return [proxyRef.current, reset];
};

export default useMutableState;
