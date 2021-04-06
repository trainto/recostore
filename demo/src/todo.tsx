import React, { memo } from 'react';
import TodoStore from './store/todo-store';

const Todo = () => {
  const todoStore = TodoStore.useStore();

  return (
    <div>
      <h2>Todo</h2>
      <small>Test for muttable state with persistence.</small>

      <div style={{ marginTop: '30px' }}>
        {todoStore.todos.map((_todo, i) => (
          <TodoItem index={i} key={i} />
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => todoStore.add()}>Add</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => todoStore.clearAll()}>Clear All</button>
      </div>
    </div>
  );
};

export default Todo;

const TodoItemImpl = ({ index }: { index: number }) => {
  const todoStore = TodoStore.useStore();

  return (
    <div>
      <input
        type="checkbox"
        defaultChecked={todoStore.todos[index].done}
        onChange={() => todoStore.toggle(index)}
      />
      <input
        type="text"
        value={todoStore.todos[index].task}
        onChange={(e) => todoStore.edit(index, e.target.value)}
      />
      <button
        className="btn-sm"
        style={{ marginLeft: '5px' }}
        onClick={() => todoStore.remove(index)}
      >
        X
      </button>
    </div>
  );
};

const TodoItem = memo(TodoItemImpl);
