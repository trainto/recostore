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

  const isRecostoreMutable = (obj: unknown): obj is ReCoStoreMutable => {
    if (typeof obj === 'object' && obj !== null) {
      return true;
    } else {
      return false;
    }
  };

  const searchInsideAndWrap = (
    target: ReCoStoreMutable,
    handler: ProxyHandler<ReCoStoreMutable>
  ) => {
    if (Array.isArray(target)) {
      for (let i = 0; i < target.length; i += 1) {
        if (isRecostoreMutable(target[i])) {
          searchInsideAndWrap(target[i] as ReCoStoreMutable, handler);
          target[i] = new Proxy(target[i] as ReCoStoreMutable, handler);
        }
      }
    } else {
      for (const prop in target) {
        if (isRecostoreMutable(target[prop])) {
          searchInsideAndWrap(target[prop] as ReCoStoreMutable, handler);
          target[prop] = new Proxy(target[prop] as ReCoStoreMutable, handler);
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

  const construct = <T extends ReCoStoreMutable>(target: T): [T | null, ReCoStoreDispatcher] => {
    console.log('hehe');
    const dispatcher: ReCoStoreDispatcher = new RecostoreDispatcher();

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
