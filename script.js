const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user1", password: "user123", role: "user" },
];

let currentUser = null;

// Handle Login
document.getElementById("login-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    currentUser = user;
    document.getElementById("user-name").textContent = user.username;
    alert(`Welcome, ${user.username} (${user.role})!`);
    showApp();
  } else {
    alert("Invalid username or password");
  }
});

// Show App
function showApp() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("booking-form").style.display =
    currentUser.role === "user" ? "block" : "none";
  document.getElementById("add-room-form").style.display =
    currentUser.role === "admin" ? "block" : "none";

  updateRoomOptions();
  updateRoomList();
}

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  currentUser = null;
  document.getElementById("login-form").style.display = "block";
  document.getElementById("app").style.display = "none";
});

// Add Room
document.getElementById("add-room-btn").addEventListener("click", () => {
  const roomName = document.getElementById("new-room-name").value.trim();
  if (roomName) {
    const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
    rooms.push(roomName);
    localStorage.setItem("rooms", JSON.stringify(rooms));
    updateRoomList();
  }
});

// Update Room Options
function updateRoomOptions() {
  const roomSelect = document.getElementById("room");
  roomSelect.innerHTML = "";
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    roomSelect.appendChild(option);
  });
}

// Update Room List
function updateRoomList() {
  const roomList = document.getElementById("list");
  roomList.innerHTML = "";
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.textContent = room;
    roomList.appendChild(li);
  });
}
