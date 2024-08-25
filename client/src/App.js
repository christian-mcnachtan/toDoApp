import React, { useState, useEffect } from 'react';
import TodoList from './components/toDoList';
import './App.css'; // Import general styles here

function App() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Apply the theme to the body element
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={`App ${theme}`}>
            <TodoList />
        </div>
    );
}

export default App;



