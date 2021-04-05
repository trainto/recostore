import React from 'react';
import Name from './name';
import Counter from './counter';
import NameStore from './store/name-store';
import CounterStore from './store/counter-store';
import Todo from './todo';
import TodoStore from './store/todo-store';
import './App.css';

const App = () => {
  return (
    <>
      <h1>ReCoStore demo</h1>
      <hr />
      <NameStore.Provider>
        <Name />
      </NameStore.Provider>
      <hr />
      <CounterStore.Provider>
        <Counter />
      </CounterStore.Provider>
      <hr />
      <TodoStore.Provider>
        <Todo />
      </TodoStore.Provider>
    </>
  );
};

export default App;
