function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleSubmenu() {
  const submenu = document.getElementById("loginSubmenu");
  submenu.style.display = submenu.style.display === "block" ? "none" : "block";
}

// MAP INIT
const map = L.map('map').setView([12.9716, 77.5946], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let busMarker = L.marker([12.9716, 77.5946]).addTo(map);

// SOCKET
const socket = io();

socket.on('busUpdate', (data) => {

  document.getElementById('student-id-display').innerText = data.studentId;

  const statusDiv = document.getElementById("busStatus");
  if (data.status === "EN") {
    statusDiv.className = "bus-status on";
    statusDiv.innerText = "ON THE BUS";
  } else {
    statusDiv.className = "bus-status off";
    statusDiv.innerText = "OFF THE BUS";
  }

  if (data.location.includes("?q=")) {
    const coords = data.location.split("?q=")[1].split(",");
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);

    busMarker.setLatLng([lat, lng]);
    map.setView([lat, lng], 16);
  }
});
