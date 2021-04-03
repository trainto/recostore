export type PersistType = 'local' | 'session';

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
