// Frontend: React App
// File: App.js
// Run 'npm start' to start the app
import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [editText, setEditText] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/todos')
            .then(response => setTodos(response.data));
    }, []);

    const addTodo = () => {
        if (text) {
            axios.post('http://localhost:5000/todos', { text })
                .then(response => setTodos([...todos, response.data]));
            setText('');
        }
    };

    const startEditing = (id, currentText) => {
        setEditingId(id);
        setEditText(currentText);
    };

    const updateTodo = (id) => {
        if (editText) {
            axios.put(`http://localhost:5000/todos/${id}`, { text: editText })
                .then(response => {
                    setTodos(todos.map(todo => todo._id === id ? response.data : todo));
                    setEditingId(null);
                    setEditText('');
                });
        }
    };

    const deleteTodo = (id) => {
        axios.delete(`http://localhost:5000/todos/${id}`)
            .then(() => setTodos(todos.filter(todo => todo._id !== id)));
    };

    return (
        <div>
            <h1>Todo App (MERN)</h1>
            <input 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Add a new todo" 
            />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map(todo => (
                    <li key={todo._id}>
                        {editingId === todo._id ? (
                            <div>
                                <input 
                                    value={editText} 
                                    onChange={(e) => setEditText(e.target.value)} 
                                    placeholder="Edit todo"
                                />
                                <button className='update' onClick={() => updateTodo(todo._id)}>Update</button>
                            </div>
                        ) : (
                            <div>
                                <span>{todo.text}</span>
                                <button className='edit' onClick={() => startEditing(todo._id, todo.text)}>Edit</button>
                                <button className='delete' onClick={() => deleteTodo(todo._id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
