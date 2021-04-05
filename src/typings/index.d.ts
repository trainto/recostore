type ReCoStoreMutable = Record<string, unknown> | unknown[];
type PersistType = 'local' | 'session';
type ReCoStoreDispatcher = { dispatch: () => void };
