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
app.use(express.static(__dirname));
// This handles the homepage request
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
});
// THE MAIN ENDPOINT: This is where your NodeMCU sends data
app.post('/update-bus', (req, res) => {
    // 1. Get the combined string and the location from the NodeMCU
    const { rawTag, location } = req.body; // Expecting rawTag: "a0EN", "d8EX", etc.

    if (rawTag && rawTag.length >= 4) {
        // 2. Split the string (First 2 chars = ID, Last 2 chars = Status)
        const hex = rawTag.substring(0, 2).toLowerCase(); // "a0"
        const status = rawTag.substring(2, 4).toUpperCase(); // "EN"

        const updateData = {
            studentId: hex,
            status: status,
            location: location
        };

        io.emit('busUpdate', updateData);
        console.log(`Processed Single Stretch: ${rawTag}`);
        res.status(200).send({ message: "Combined tag processed" });
    } else {
        res.status(400).send({ error: "Invalid rawTag format" });
    }
});