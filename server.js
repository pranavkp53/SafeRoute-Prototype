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
    const { rawTag, location } = req.body; 

    if (rawTag && rawTag.length >= 4) {
        // 1. Force IDs back to Uppercase (D8, A0, E7)
        const hex = rawTag.substring(0, 2).toUpperCase(); 
        const status = rawTag.substring(2, 4).toUpperCase(); 

        // 2. Logic: If hardware sends no location, use the default bit
        const finalLocation = location || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4273190040894!2d76.42879817355194!3d10.778547159157624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7d8c845c845e3%3A0x58a2e5f7cd1811c7!2sJawaharlal%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1770223482756!5m2!1sen!2sin";

        const updateData = {
            studentId: hex,
            status: status,
            location: finalLocation
        };

        io.emit('busUpdate', updateData);
        console.log(`Updated: ${hex}${status} at ${finalLocation}`);
        res.status(200).send({ message: "Success" });
    } else {
        res.status(400).send({ error: "Invalid format" });
    }
});