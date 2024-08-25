import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:5000/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (!newTodo) return;
    const response = await axios.post('http://localhost:5000/todos', { title: newTodo });
    setTodos([...todos, response.data]);
    setNewTodo('');
  };

  const toggleTodo = async (id, completed) => {
    const response = await axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed });
    setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo.id, todo.completed)}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
