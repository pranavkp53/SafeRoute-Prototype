/* --- Navigation & Menu Logic (Original) --- */
// Toggles the main dropdown menu [cite: 223-226]
function toggleMenu() {
 const menu = document.getElementById("dropdownMenu");
 menu.style.display = menu.style.display === "block" ? "none" : "block";
 }
 // Toggles the login submenu [cite: 227-230]
 function toggleSubmenu() {
 const submenu = document.getElementById("loginSubmenu");
 submenu.style.display = submenu.style.display === "block" ? "none" : "block";
 }
// Closes menus when clicking outside of them [cite: 231-236]
 window.onclick = function(e) {
 if (!e.target.closest('.menu-icon') && !e.target.closest('.menu')) {
 const menu = document.getElementById("dropdownMenu");
 const submenu = document.getElementById("loginSubmenu");
 if (menu) menu.style.display = "none";
 if (submenu) submenu.style.display = "none";
 }
 }
 // Manual toggle function for the UI status [cite: 237-247]
 function toggleBusStatus() {
 const statusDiv = document.getElementById("status-display");
 if (statusDiv.classList.contains("status-on")) {
 statusDiv.classList.remove("status-on");
 statusDiv.classList.add("status-off");
 statusDiv.textContent = "OFF THE BUS";
 } else {
 statusDiv.classList.remove("status-off");
statusDiv.classList.add("status-on");
statusDiv.textContent = "ON THE BUS";
 }
 }
 // Simple alert for the refresh button [cite: 248-251]
 function refreshStatus() {
 alert("Refreshing student status...");
 }
 /* --- Real-Time Map & Hardware Logic (New) --- */
 // 1. Initialize the Leaflet map (Replaces the broken Google iframe)
 
 // Coordinates [12.9716, 77.5946] are a default starting point
 // var map = L.map('map').setView([12.9716, 77.5946], 15);
 // 2. Load the free OpenStreetMap tiles
 // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 // attribution: '© OpenStreetMap contributors'
 // }).addTo(map);
 // 3. Create a marker to represent the bus
 // var busMarker = L.marker([12.9716, 77.5946]).addTo(map);
 // 4. Connect to the backend server via Socket.io
 const socket = io('https://saferoute-prototype.onrender.com');
 socket.on('connect', () => {
 console.log("Connected! ID:", socket.id);
 });
 // 5. Listen for real-time updates from the hardware/server
 // 5. Listen for real-time updates from the hardware/NodeMCU
 socket.on('busUpdate', (data) => {
    // 1. Map Hex IDs to Names
    const studentNames = {
        "D8": "Pranav KP",
        "A0": "Gayathri M",
        "E7": "Vaisakh PV"
    };

    // Use the mapped name or default to the ID if not found
    const nameToDisplay = studentNames[data.studentId] || data.studentId;
    document.getElementById('student-id').innerText = nameToDisplay;
    
    // 2. Update Status Color and Text
    const statusBox = document.getElementById('status-display');
    const isOnBus = (data.status === "EN");
    
    statusBox.innerText = isOnBus ? "ON THE BUS" : "OFF THE BUS";
    
    // Ensure these classes (on/off) exist in your style.css
    statusBox.className = isOnBus ? "bus-status status-on" : "bus-status status-off";

    // 3. Update the Map (Hard Reset)
    const mapPanel = document.querySelector('.map-panel');
    
    // Use innerHTML to force the iframe to reload with the new URL
    if (data.location) {
    mapPanel.innerHTML = `
        <iframe 
            src="${data.location}" 
            width="100%" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy">
        </iframe>`;
    }
});