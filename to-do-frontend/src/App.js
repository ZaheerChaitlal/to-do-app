import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [editText, setEditText] = useState('');
    const [editingId, setEditingId] = useState(null);

    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        axios.get(`${API_BASE}/todos`)
            .then(response => setTodos(response.data));
    }, []);

    const addTodo = () => {
        if (text) {
            axios.post(`${API_BASE}/todos`, { text })
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
            axios.put(`${API_BASE}/todos/${id}`, { text: editText })
                .then(response => {
                    setTodos(todos.map(todo => todo._id === id ? response.data : todo));
                    setEditingId(null);
                    setEditText('');
                });
        }
    };

    const deleteTodo = (id) => {
        axios.delete(`${API_BASE}/todos/${id}`)
            .then(() => setTodos(todos.filter(todo => todo._id !== id)));
    };

    return (
        <div className="container">
            <h1 className="header">Todo App (MERN)</h1>
            <div className="input-container">
                <input 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="Add a new todo" 
                />
                <button onClick={addTodo}>Add</button>
            </div>
            <ul>
                {todos.map(todo => (
                    <li key={todo._id}>
                        {editingId === todo._id ? (
                            <>
                                <input 
                                    value={editText} 
                                    onChange={(e) => setEditText(e.target.value)} 
                                    placeholder="Edit todo"
                                />
                                <button className='update' onClick={() => updateTodo(todo._id)}>Update</button>
                            </>
                        ) : (
                            <>
                                <span>{todo.text}</span>
                                <button className='edit' onClick={() => startEditing(todo._id, todo.text)}>Edit</button>
                                <button className='delete' onClick={() => deleteTodo(todo._id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <img
                src="/Landscape.jpg"
                alt="Landscape"
                className="responsive"
                width="1200"
                height="600"
            />
        </div>
    );
}

export default App;
