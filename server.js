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
    // 1. Get the 3 strings sent from your NodeMCU JSON
    const { hex, status, location } = req.body;

    // Log the data to the console for debugging
    console.log(`Hex: ${hex}, Status: ${status}, Location: ${location}`);

    // 2. Prepare the object for the dashboard
    const updateData = {
        studentId: hex,      // Your hexVal (e.g., D8)
        status: status,      // Your status (e.g., EN)
        location: location   // Your long Google URL
    };

    // 3. Emit the update to all connected dashboards
    io.emit('busUpdate', updateData);
    
    // 4. Send a success response back to the NodeMCU
    res.status(200).send({ message: "Data received successfully" });
});

// The server start logic stays at the bottom
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});