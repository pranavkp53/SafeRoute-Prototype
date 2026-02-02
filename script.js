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
 const statusDiv = document.getElementById("status-text");
 if (statusDiv.classList.contains("on")) {
 statusDiv.classList.remove("on");
 statusDiv.classList.add("off");
 statusDiv.textContent = "OFF THE BUS";
 } else {
 statusDiv.classList.remove("off");
statusDiv.classList.add("on");
statusDiv.textContent = "ON THE BUS";
 }
 }
 // Simple alert for the refresh button [cite: 248-251]
 function refreshStatus() {
 alert("Refreshing student status... (This simulates a system call)");
 }
 /* --- Real-Time Map & Hardware Logic (New) --- */
 // 1. Initialize the Leaflet map (Replaces the broken Google iframe)
 
 // Coordinates [12.9716, 77.5946] are a default starting point
 var map = L.map('map').setView([12.9716, 77.5946], 15);
 // 2. Load the free OpenStreetMap tiles
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '© OpenStreetMap contributors'
 }).addTo(map);
 // 3. Create a marker to represent the bus
 var busMarker = L.marker([12.9716, 77.5946]).addTo(map);
 // 4. Connect to the backend server via Socket.io
 const socket = io('https://saferoute-prototype.onrender.com');
 socket.on('connect', () => {
 console.log("Connected to Backend Successfully! ID:", socket.id);
 });
 // 5. Listen for real-time updates from the hardware/server
 // 5. Listen for real-time updates from the hardware/NodeMCU
 socket.on('busUpdate', (data) => {
 // Add this name mapping logic
const nameMap = {
 "D8": "Pranav KP",
 "A0": "Gayathri M",
 "E7": "Vaisakh PV"
};

// Update the display name based on the ID received
const studentName = nameMap[data.studentId] || "Unknown Student";
document.querySelector(".student-info strong").innerText = studentName;
 // 1. Update Student ID and Status text
 // Ensure these IDs match the ones you added to your index.html
 document.getElementById('student-id-display').innerText = data.studentId;
 const statusDiv = document.getElementById("status-text");
 if (data.status === "EN") { // "EN" represents Entry
 statusDiv.className = "bus-status on";
 statusDiv.textContent = "ON THE BUS";
 } else if (data.status === "EX") {
 statusDiv.className = "bus-status off";
 statusDiv.textContent = "OFF THE BUS";
 }
 // 2. Update the Google Map Iframe
 const mapFrame = document.getElementById('map-frame');
 let finalUrl = data.location;
 // Add embed parameter if it's a standard link to allow iframe display
 if (finalUrl.includes("google") && !finalUrl.includes("embed")) {
 finalUrl += finalUrl.includes("?") ? "&output=embed" : "?output=embed";
 }
 // FORCE REFRESH: Add a timestamp so the map always reloads
const cacheBuster = "&t=" + new Date().getTime();
mapFrame.src = finalUrl + cacheBuster;
});