import React from 'react';
import CountStore from './store/counter-store';

const style = {
  display: 'flex',
};

const Counter = () => {
  const counterStore = CountStore.useStore();

  return (
    <div style={style}>
      <button onClick={() => counterStore.decrease()}>-</button>
      <h3>{counterStore.count}</h3>
      <button onClick={() => counterStore.increase()}>+</button>
    </div>
  );
};

export default Counter;
