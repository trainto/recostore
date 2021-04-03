import React, { useState } from 'react';
import NameStore from './store/name-store';

const Name = () => {
  const [editing, setEditing] = useState(false);

  const nameStore = NameStore.useStore();

  return (
    <div>
      <h2>Hello, {nameStore.name}.</h2>
      <div>
        {editing && (
          <input
            type="text"
            style={{ marginRight: '10px' }}
            value={nameStore.name}
            onChange={(e) => nameStore.setName(e.target.value)}
          />
        )}
        <button onClick={() => setEditing(!editing)}>{editing ? 'Submit' : 'Edit'}</button>
      </div>
      <small>Test for state persistence.</small>
    </div>
  );
};

export default Name;
