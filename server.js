const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const db = new sqlite3.Database(':memory:');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Create messages table
db.run(`CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, message TEXT)`);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Load and emit previous messages when a user connects
  db.all('SELECT username, message FROM messages', (err, rows) => {
    if (!err) {
      rows.forEach((row) => {
        socket.emit('chat message', { username: row.username, message: row.message });
      });
    }
  });

  // Listen for new chat messages
  socket.on('chat message', (data) => {
    const { username, message } = data;

    // Save message to the database
    db.run('INSERT INTO messages (username, message) VALUES (?, ?)', [username, message], (err) => {
      if (err) {
        return console.error('Error saving message:', err.message);
      }
      // Broadcast message to all connected users
      io.emit('chat message', { username, message });
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
