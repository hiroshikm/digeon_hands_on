'use client';

import { useEffect, useState, FormEvent } from 'react';

type Todo = { id: string; title: string; completed: boolean };

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');

  const loadTodos = async () => {
    const res = await fetch('/api/todos');
    if (res.ok) {
      setTodos(await res.json());
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const todo: Todo = await res.json();
      setTodos((t) => [...t, todo]);
      setTitle('');
    }
  };

  const toggleTodo = async (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    const res = await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !target.completed }),
    });
    if (res.ok) {
      const updated: Todo = await res.json();
      setTodos((t) => t.map((todo) => (todo.id === id ? updated : todo)));
    }
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setTodos((t) => t.filter((todo) => todo.id !== id));
    }
  };

  return (
    <main>
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add todo"
          required
          maxLength={100}
        />
        <button className="bg-blue-500 text-white px-4" type="submit">
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'line-through flex-1' : 'flex-1'}>
              {todo.title}
            </span>
            <button
              className="text-red-500"
              type="button"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
