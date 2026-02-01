const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors'); //
const app = express();
app.use(cors()); //
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // The asterisk means "Allow All"
    methods: ["GET", "POST"]
  }
})

// Middleware to handle JSON data from your hardware
app.use(express.json());

// Serve your frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// THE MAIN ENDPOINT: This is where your hardware (ESP32/Pi) will send data
app.post('/update-bus', (req, res) => {
    // 1. Get the raw string from NodeMCU (e.g., "0102https://goo.gl/maps/...")
    const rawData = req.body.data; 

    if (!rawData || rawData.length < 5) {
        return res.status(400).send("Error: Payload too short or missing.");
    }

    // 2. Parse the string using substring
    const studentId = rawData.substring(0, 2);    // First 2 chars
    const entryStatus = rawData.substring(2, 4);  // Next 2 chars
    const locationUrl = rawData.substring(4);     // Everything else

    console.log(`Parsed -> ID: ${studentId}, Status: ${entryStatus}`);

    // 3. Emit the parsed object to your dashboard
    io.emit('busUpdate', {
        studentId: studentId,
        status: entryStatus,
        location: locationUrl
    });

    res.status(200).send("Data Processed");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
 