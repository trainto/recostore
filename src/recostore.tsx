import React, { useContext } from 'react';

const createStore = <T extends unknown>(useHook: () => T, options?: { displayName?: string }) => {
  const context = React.createContext<T | null>(null);
  if (options) {
    if (options.displayName) {
      context.displayName = options.displayName;
    }
  }

  const Provider = ({ children }: { children: React.ReactNode }) => {
    return <context.Provider value={useHook()}>{children}</context.Provider>;
  };

  const useStore = (): T => {
    const store = useContext(context);
    if (!store) {
      throw new Error(
        `Component must be wrapped with <${
          options && options.displayName ? options.displayName : 'Context'
        }.Provider>`
      );
    }

    return store;
  };

  return { Provider, useStore };
};

export default createStore;
