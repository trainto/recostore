export const isArray = (obj: unknown): obj is unknown[] => {
  return Array.isArray(obj);
};

export const persist = (key: string, value: unknown, type: PersistType = 'local') => {
  switch (type) {
    case 'local':
      if (value === undefined) {
        return JSON.parse(localStorage.getItem(key));
      }
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    case 'session':
      if (value === undefined) {
        return JSON.parse(sessionStorage.getItem(key));
      }
      sessionStorage.setItem(key, JSON.stringify(value));
      return value;
    default:
      throw new TypeError(`Persist type must be 'local' or 'session`);
  }
};

export const constructProxy = (() => {
  const symbol = Symbol('ReCoStoreProxy');

  const isRecostoreMutable = (obj: unknown): obj is RecoMutable => {
    if (typeof obj === 'object' && obj !== null) {
      return true;
    } else {
      return false;
    }
  };

  const searchInsideAndWrap = (target: RecoMutable, handler: ProxyHandler<RecoMutable>) => {
    if (Array.isArray(target)) {
      for (let i = 0; i < target.length; i += 1) {
        if (isRecostoreMutable(target[i])) {
          searchInsideAndWrap(target[i] as RecoMutable, handler);
          target[i] = new Proxy(target[i] as RecoMutable, handler);
        }
      }
    } else {
      for (const prop in target) {
        if (isRecostoreMutable(target[prop])) {
          searchInsideAndWrap(target[prop] as RecoMutable, handler);
          target[prop] = new Proxy(target[prop] as RecoMutable, handler);
        }
      }
    }
  };

  function RecostoreDispatcher() {
    this.dispatch = null;
  }

  RecostoreDispatcher.prototype.dispatch = function () {
    this.dispatch && this.dispatch();
  };

  const construct = <T extends RecoMutable>(target: T): [T | null, RecoMutableDispatcher] => {
    const dispatcher: RecoMutableDispatcher = new RecostoreDispatcher();

    if (target[symbol] === 1) {
      return [null, dispatcher];
    }

    target[symbol] = 1;

    const handler = {
      set: (obj: T, prop: string, value: unknown) => {
        if (obj[prop] === value) {
          return true;
        }

        if (isRecostoreMutable(value) && value[symbol] !== 1) {
          searchInsideAndWrap(value, handler);
          value[symbol] = 1;
          obj[prop] = new Proxy(value, handler);
        } else {
          obj[prop] = value;
        }
        dispatcher.dispatch();

        return true;
      },
      deleteProperty: (obj: T, prop: string) => {
        if (prop in obj) {
          delete obj[prop];
        } else {
          return false;
        }
        dispatcher.dispatch();

        return true;
      },
      ownKeys: (obj: T) => {
        return Reflect.ownKeys(obj).filter((key) => key !== symbol);
      },
    };

    searchInsideAndWrap(target, handler);
    return [new Proxy(target, handler), dispatcher];
  };

  return construct;
})();
