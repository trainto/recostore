import { createStore, useStatePersist } from '../../../src';

const useName = () => {
  const [name, persistName] = useStatePersist('', 'name');

  const setName = (name: string) => {
    persistName(name);
  };

  return {
    name,

    setName,
  };
};

const NameStore = createStore(useName, { displayName: 'NameStore' });

export default NameStore;
