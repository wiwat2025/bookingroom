document.getElementById("login-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please fill in both username and password.");
    return;
  }

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

function saveBooking(room, date, time, description = "") {
  if (!room || !date || !time) {
    alert("Please fill in all booking details.");
    return;
  }

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  if (bookings.some((b) => b.room === room && b.date === date && b.time === time)) {
    alert("This room is already booked for the selected time.");
    return;
  }

  bookings.push({
    room,
    date,
    time,
    description: description || "No details",
    confirmed: false,
  });

  localStorage.setItem("bookings", JSON.stringify(bookings));
  updateBookingList();
  alert("Booking saved successfully!");
}

document.getElementById("add-room-btn").addEventListener("click", () => {
  const roomName = document.getElementById("new-room-name").value.trim();

  if (!roomName) {
    alert("Room name cannot be empty.");
    return;
  }

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  if (rooms.includes(roomName)) {
    alert("Room name already exists.");
    return;
  }

  rooms.push(roomName);
  localStorage.setItem("rooms", JSON.stringify(rooms));
  document.getElementById("new-room-name").value = "";
  updateRoomList();
  alert("Room added successfully!");
});
