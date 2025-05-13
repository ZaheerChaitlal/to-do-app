require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = process.env.MONGO_URI;
let db, todosCollection;

MongoClient.connect(uri)
    .then(client => {
        db = client.db('todoApp');
        todosCollection = db.collection('todos');
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.get('/todos', async (req, res) => {
    try {
        const todos = await todosCollection.find().toArray();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching todos' });
    }
});

app.post('/todos', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    try {
        const result = await todosCollection.insertOne({ text });
        const newTodo = { _id: result.insertedId, text };
        res.status(201).json(newTodo);
    } catch (err) {
        console.error('Error adding todo:', err);
        res.status(500).json({ error: 'Error adding todo' });
    }
});

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: 'Text is required' });

    try {
        const result = await todosCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { text } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        const updatedTodo = await todosCollection.findOne({ _id: new ObjectId(id) });
        res.json(updatedTodo);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ error: 'Error updating todo' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await todosCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ error: 'Error deleting todo' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
