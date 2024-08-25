const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all to-do items
app.get('/todos', (req, res) => {
  const sql = 'SELECT * FROM todos';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new to-do item
app.post('/todos', (req, res) => {
  const { title } = req.body;
  const sql = 'INSERT INTO todos (title) VALUES (?)';
  db.query(sql, [title], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, title, completed: false });
  });
});

// Update a to-do item
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const query = 'UPDATE todos SET completed = ? WHERE id = ?';

  db.query(query, [completed, id], (err, result) => {
    if (err) {
      console.error('Error updating todo:', err);
      return res.status(500).send('Server error');
    }
    console.log('Updated todo with ID:', id, 'to completed status:', completed);
    res.send(result);
  });
});

// Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM todos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

