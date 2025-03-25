const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json());

// Path to the SQLite database file
const dbFilePath = path.join(__dirname, 'tasks.db');

// Create the SQLite database file if it does not exist
const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Ensure the tasks table exists, create it if it doesn't
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      priority TEXT,
      dueDate TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err.message);
    } else {
      console.log('Tasks table is ready.');
    }
  });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      console.error('Error fetching tasks:', err.message);
      return res.status(500).json({ error: 'Unable to fetch tasks' });
    }
    res.json(rows);
  });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const { title, priority, dueDate } = req.body;

  const stmt = db.prepare('INSERT INTO tasks (title, priority, dueDate) VALUES (?, ?, ?)');
  stmt.run(title, priority, dueDate, function (err) {
    if (err) {
      console.error('Error inserting task:', err.message);
      return res.status(500).json({ error: 'Unable to save task' });
    }
    res.status(201).json({ id: this.lastID, title, priority, dueDate });
  });
  stmt.finalize();
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(taskId, function (err) {
    if (err) {
      console.error('Error deleting task:', err.message);
      return res.status(500).send('Error deleting task');
    }
    if (this.changes === 0) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send('Task deleted');
  });
  stmt.finalize();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
