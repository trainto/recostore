import React from 'react';
import Name from './name';
import Counter from './counter';
import NameStore from './store/name-store';
import CounterStore from './store/counter-store';
import './App.css';

const App = () => {
  return (
    <CounterStore.Provider>
      <NameStore.Provider>
        <Name />
        <Counter />
      </NameStore.Provider>
    </CounterStore.Provider>
  );
};

export default App;
