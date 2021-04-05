import React, { memo } from 'react';
import TodoStore from './store/todo-store';

const Todo = () => {
  const todoStore = TodoStore.useStore();

  return (
    <div>
      <h2>Todo</h2>
      {todoStore.todos.map((_todo, i) => (
        <TodoItem index={i} key={i} />
      ))}
      <button style={{ marginTop: '20px' }} onClick={() => todoStore.add()}>
        Add
      </button>
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
        onChange={(e) => todoStore.editTask(index, e.target.value)}
      />
    </div>
  );
};

const TodoItem = memo(TodoItemImpl);
