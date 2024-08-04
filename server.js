const express = require('express');
const https = require('https');  // Use https module instead of http
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');

const app = express();

// Load your SSL certificate and key
const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

// Create HTTPS server
const server = https.createServer(sslOptions, app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/broadcast', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'broadcast.html'));
});

app.get('/listen', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'listen.html'));
});

io.on('connection', (socket) => {
  console.log('A new client connected');

  socket.on('audio-stream', (data) => {
    console.log('Received audio stream data:', data);
    socket.broadcast.emit('audio-stream', data);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is listening on https://localhost:3000');
});
