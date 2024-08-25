import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Form, Container } from 'react-bootstrap';

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
        setTodos(todos.map(todo => todo.id === id ? response.data : todo));
    };

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:5000/todos/${id}`);
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <Container>
            <h1 className="text-center my-4">Welcome to McNacTo-do App!</h1>
            <Form className="d-flex mb-4">
                <Form.Control
                    type="text"
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



