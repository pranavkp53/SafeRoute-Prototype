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
// THE MAIN ENDPOINT: Updated to accept "data" from NodeMCU
app.post('/update-bus', (req, res) => {
    // 1. Get the combined string ("data") and location from the NodeMCU
    const { data, location } = req.body; 

    // 2. Process the string if it exists and is the right length
    if (data && data.length >= 4) {
        
        // Split the string: First 2 chars = ID (D8), last 2 = Status (EN)
        const hex = data.substring(0, 2).toUpperCase(); 
        const status = data.substring(2, 4).toUpperCase(); 

        // Use default location if none is provided
        const finalLocation = location || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4273190040894!2d76.42879817355194!3d10.778547159157624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7d8c845c845e3%3A0x58a2e5f7cd1811c7!2sJawaharlal%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1770223482756!5m2!1sen!2sin";

        const updateData = {
            studentId: hex,    // "D8", "A0", etc.
            status: status,    // "EN" or "EX"
            location: finalLocation
        };

        // 3. Emit to the dashboard
        io.emit('busUpdate', updateData);
        
        console.log(`Success! Data: ${data}, Location: ${finalLocation}`);
        res.status(200).send({ message: "Data processed successfully" });
    } else {
        console.log("Error: Received invalid data format");
        res.status(400).send({ error: "Invalid data format" });
    }
});