const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔴 MAIN ENDPOINT (ESP8266)
app.post('/update-bus', (req, res) => {

  const { hex, status, location } = req.body;

  if (!hex || !status || !location) {
    return res.status(400).send("Invalid payload");
  }

  console.log("DATA RECEIVED:", req.body);

  io.emit('busUpdate', {
    studentId: hex,
    status: status,
    location: location
  });

  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
