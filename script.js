const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user1", password: "user123", role: "user" },
];

let currentUser = null;

document.getElementById("login-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    document.getElementById("user-name").textContent = user.username;
    alert(`Welcome, ${user.username} (${user.role})!`);
    showApp();
  } else {
    alert("Invalid username or password.");
  }
});

function showApp() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("booking-form").style.display = currentUser.role === "user" ? "block" : "none";
  document.getElementById("add-room-form").style.display = currentUser.role === "admin" ? "block" : "none";
  document.getElementById("clear-bookings-container").style.display = currentUser.role === "admin" ? "block" : "none";

  updateRoomOptions();
  updateRoomList();
  updateBookingList();
  updateCalendar();
}

document.getElementById("logout-btn").addEventListener("click", () => {
  currentUser = null;
  document.getElementById("login-form").style.display = "block";
  document.getElementById("app").style.display = "none";
});

document.getElementById("add-room-btn").addEventListener("click", () => {
  const roomName = document.getElementById("new-room-name").value.trim();
  if (roomName) {
    const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
    rooms.push(roomName);
    localStorage.setItem("rooms", JSON.stringify(rooms));
    document.getElementById("new-room-name").value = "";
    updateRoomList();
  }
});

function updateRoomList() {
  const roomList = document.getElementById("room-list");
  roomList.innerHTML = "";

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.textContent = room;
    roomList.appendChild(li);
  });
}

function updateRoomOptions() {
  const roomSelect = document.getElementById("room");
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  roomSelect.innerHTML = "";

  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    roomSelect.appendChild(option);
  });
}

function updateCalendar() {
  const calendarContainer = document.getElementById("calendar-container");
  calendarContainer.innerHTML = "";

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("calendar-day");
    dayDiv.textContent = day;
    calendarContainer.appendChild(dayDiv);
  }
}
