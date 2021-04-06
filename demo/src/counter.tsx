import React from 'react';
import CountStore from './store/counter-store';

const Counter = () => {
  const counterStore = CountStore.useStore();

  return (
    <div>
      <h2>Counter</h2>
      <small>Test for normal useState</small>
      <h3>{counterStore.count}</h3>
      <button onClick={() => counterStore.decrease()}>-</button>
      <button onClick={() => counterStore.increase()}>+</button>
    </div>
  );
};

export default Counter;
