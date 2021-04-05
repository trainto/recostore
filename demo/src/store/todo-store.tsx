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
    // resetTodos([
    //   { done: false, task: 'wow' },
    //   { done: true, task: 'done' },
    // ]);
  };

  const toggle = (index: number) => {
    todos[index].done = !todos[index].done;
  };

  const editTask = (index: number, task: string) => {
    todos[index].task = task;
  };

  return {
    todos,

    add,
    toggle,
    editTask,
  };
};

const TodoStore = createStore(useTodo, { displayName: 'TodoStore' });

export default TodoStore;
