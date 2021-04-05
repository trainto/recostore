import { useCallback, useEffect, useReducer, useRef } from 'react';
import { constructProxy, persist } from '../utils';

const useMutableState = <V extends RecoMutable>(
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

  const proxyRef = useRef<V>(null);
  const dispatcherRef = useRef<RecoMutableDispatcher>(null);
  if (proxyRef.current === null || dispatcherRef.current === null) {
    const [proxy, dispatcher] = constructProxy(initialStateOrSaved);
    proxyRef.current = proxy;
    dispatcherRef.current = dispatcher;
    if (dispatcherRef.current) {
      dispatcherRef.current.dispatch = () => forceUpdate();
    }
  }

  useEffect(() => {
    if (options && options.persist && proxyRef.current) {
      persist(options.persist.key, proxyRef.current, options.persist.type);
    }
  }, [options, updateCount]);

  const reset = useCallback((anotherState: V) => {
    const [proxy, dispatcher] = constructProxy(anotherState);
    proxyRef.current = proxy;
    dispatcherRef.current = dispatcher;
    if (dispatcherRef.current) {
      dispatcherRef.current.dispatch = () => forceUpdate();
    }
    forceUpdate();
  }, []);

  return [proxyRef.current, reset];
};

export default useMutableState;
