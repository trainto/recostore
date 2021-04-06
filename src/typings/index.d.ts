type RecoMutable = Record<string, unknown> | unknown[];
type RecoMutableDispatcher = { dispatch: null | (() => void) };
type PersistType = 'local' | 'session';
