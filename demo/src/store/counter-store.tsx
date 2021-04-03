import { useState } from 'react';
import { createStore } from '../../../src';

const useCount = () => {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount(count + 1);
  };

  const decrease = () => {
    setCount(count - 1);
  };

  return {
    count,

    increase,
    decrease,
  };
};

const CountStore = createStore(useCount, { displayName: 'CountStore' });

export default CountStore;
