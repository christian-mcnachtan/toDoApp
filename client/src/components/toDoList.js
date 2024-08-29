import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Form, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://https://test-wa-efgcb5bgheehf9ev.eastus-01.azurewebsites.net//todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async () => {
        if (!newTodo) return;
        try {
            const response = await axios.post('http://https://test-wa-efgcb5bgheehf9ev.eastus-01.azurewebsites.net//todos', { title: newTodo });
            setTodos([...todos, response.data]);
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id, completed) => {
        try {
            await axios.put(`http://https://test-wa-efgcb5bgheehf9ev.eastus-01.azurewebsites.net//todos/${id}`, {
                completed: !completed
            });
            setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !completed } : todo));
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://https://test-wa-efgcb5bgheehf9ev.eastus-01.azurewebsites.net//todos/${id}`);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="text-center my-4">Welcome to McNacTo-do App!</h1>
                <Button onClick={toggleDarkMode}>
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                </Button>
            </div>
            <Form className="d-flex mb-4">
                <Form.Control
                    as="textarea"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task"
                />
                <Button onClick={addTodo} className="ms-2">Add</Button>
            </Form>
            {todos.map(todo => (
                <Card key={todo.id} className="mb-2">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                {todo.title}
                            </span>
                            <div>
                                <Button
                                    variant={todo.completed ? "success" : "warning"}
                                    onClick={() => toggleTodo(todo.id, todo.completed)}
                                    className="me-2"
                                >
                                    {todo.completed ? "Completed" : "Incomplete"}
                                </Button>
                                <Button variant="danger" onClick={() => deleteTodo(todo.id)}>Delete</Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default TodoList;











