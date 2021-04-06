export const persist = (key: string, value: unknown, type: PersistType = 'local') => {
  const storage = type === 'session' ? sessionStorage : localStorage;
  if (value === undefined) {
    const loaded = storage.getItem(key);
    if (loaded) {
      return JSON.parse(loaded);
    }

    return loaded;
  }

  storage.setItem(key, JSON.stringify(value));
};

export const constructProxy = (() => {
  const symbol = Symbol('ReCoStoreProxy');

  const isRecostoreMutable = (obj: unknown): obj is Record<string, unknown> | unknown[] => {
    if (typeof obj === 'object' && typeof obj !== 'function' && obj !== null) {
      return true;
    } else {
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  const searchInsideAndWrap = <T extends object>(target: T, handler: ProxyHandler<object>) => {
    if (Array.isArray(target)) {
      for (let i = 0; i < target.length; i += 1) {
        if (isRecostoreMutable(target[i])) {
          searchInsideAndWrap(target[i], handler);
          target[i] = new Proxy(target[i], handler);
        }
      }
    } else {
      for (const prop in target) {
        if (isRecostoreMutable(target[prop])) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          searchInsideAndWrap(target[prop] as any, handler);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          target[prop] = new Proxy(target[prop] as any, handler);
        }
      }
    }
  };

  class RecostoreDispatcher implements RecoMutableDispatcher {
    dispatch = null;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const construct = <T extends Record<string, unknown> | unknown[], K extends keyof T>(
    target: T
  ): [T, RecoMutableDispatcher] => {
    const dispatcher: RecoMutableDispatcher = new RecostoreDispatcher();

    if (isRecostoreMutable(target) === false || (target as { [symbol]?: number })[symbol] === 1) {
      return [target, dispatcher];
    }

    (target as { [symbol]?: number })[symbol] === 1;

    const handler: ProxyHandler<T> = {
      set: (obj, prop, value) => {
        if (obj[prop as K] === value) {
          return true;
        }

        if (isRecostoreMutable(value) && (value as { [symbol]?: number })[symbol] !== 1) {
          searchInsideAndWrap(value, handler);
          (target as { [symbol]?: number })[symbol] === 1;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          obj[prop as K] = new Proxy(value as any, handler);
        } else {
          obj[prop as K] = value;
        }
        dispatcher.dispatch && dispatcher.dispatch();

        return true;
      },
      deleteProperty: (obj, prop) => {
        if (prop in obj) {
          delete obj[prop as K];
        } else {
          return false;
        }
        dispatcher.dispatch && dispatcher.dispatch();

        return true;
      },
      ownKeys: (obj) => {
        return Reflect.ownKeys(obj).filter((key) => key !== symbol);
      },
    };

    searchInsideAndWrap(target, handler);
    return [new Proxy(target, handler), dispatcher];
  };

  return construct;
})();
