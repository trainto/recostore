import { createStore, useMutableState } from '../../../src';

type Todo = {
  done: boolean;
  task: string;
};

const useTodo = () => {
  const [todos, resetTodos] = useMutableState<Todo[]>([], {
    persist: { key: 'recostore.todos' },
  });

  const add = () => {
    todos.push({ done: false, task: '' });
  };

  const toggle = (index: number) => {
    todos[index].done = !todos[index].done;
  };

  const edit = (index: number, task: string) => {
    todos[index].task = task;
  };

  const remove = (index: number) => {
    todos.splice(index, 1);
  };

  const clearAll = () => {
    resetTodos([]);
  };

  return {
    todos,

    add,
    toggle,
    edit,
    remove,
    clearAll,
  };
};

const TodoStore = createStore(useTodo, { displayName: 'TodoStore' });

export default TodoStore;
