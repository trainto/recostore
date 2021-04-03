import React from 'react';
import NameStore from './store/name-store';

const Name = () => {
  const nameStore = NameStore.useStore();

  return (
    <div>
      <h2>{nameStore.name}</h2>
      <input type="text" onChange={(e) => nameStore.setName(e.target.value)} />
    </div>
  );
};

export default Name;
