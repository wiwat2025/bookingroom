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
    alert("Invalid username or password");
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

// ฟังก์ชันบันทึกการจอง
function saveBooking(room, date, time, description = "") {
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
}

function updateBookingList() {
  const bookingList = document.getElementById("list");
  bookingList.innerHTML = "";

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.forEach((booking, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div><strong>Room:</strong> ${booking.room}</div>
      <div><strong>Date:</strong> ${booking.date}</div>
      <div><strong>Time:</strong> ${booking.time}</div>
      <div><strong>Description:</strong> ${booking.description}</div>
      <div><strong>Status:</strong> ${booking.confirmed ? "Confirmed" : "Pending Confirmation"}</div>
    `;

    if (currentUser.role === "admin") {
      if (!booking.confirmed) {
        li.appendChild(createButton("Confirm", () => confirmBooking(index)));
      }
      li.appendChild(createButton("Cancel", () => deleteBooking(index)));
    }

    bookingList.appendChild(li);
  });
}

function createButton(text, action) {
  const button = document.createElement("button");
  button.textContent = text;
  button.onclick = action;
  return button;
}

function confirmBooking(index) {
  const bookings = JSON.parse(localStorage.getItem("bookings"));
  bookings[index].confirmed = true;
  localStorage.setItem("bookings", JSON.stringify(bookings));
  updateBookingList();
  updateCalendar();
  alert("Booking confirmed!");
}

function deleteBooking(index) {
  const bookings = JSON.parse(localStorage.getItem("bookings"));
  bookings.splice(index, 1);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  updateBookingList();
  updateCalendar();
  alert("Booking canceled!");
}

function generateCalendar(year, month) {
  const calendarContainer = document.getElementById("calendar-container");
  calendarContainer.innerHTML = "";

  const date = new Date(year, month, 1);
  const firstDayIndex = date.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty-day");
    calendarContainer.appendChild(emptyDiv);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("calendar-day");
    dayDiv.innerHTML = `<strong>${day}</strong>`;

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.forEach((booking) => {
      const [bookingYear, bookingMonth, bookingDay] = booking.date.split("-").map(Number);

      if (bookingYear === year && bookingMonth === month + 1 && bookingDay === day) {
        const bookingSpan = document.createElement("span");
        bookingSpan.classList.add("booking");
        bookingSpan.textContent = `${booking.room} - ${booking.time}`;
        dayDiv.appendChild(bookingSpan);

        if (booking.confirmed) {
          const descriptionSpan = document.createElement("span");
          descriptionSpan.classList.add("description");
          descriptionSpan.textContent = `Confirmed: ${booking.description}`;
          dayDiv.appendChild(descriptionSpan);
        }
      }
    });

    calendarContainer.appendChild(dayDiv);
  }
}

function updateCalendar() {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  generateCalendar(year, month);
}

// ฟังก์ชันเพิ่มห้องประชุม
document.getElementById("add-room-btn").addEventListener("click", () => {
  const roomName = document.getElementById("new-room-name").value.trim();
  if (roomName) {
    const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
    rooms.push(roomName);
    localStorage.setItem("rooms", JSON.stringify(rooms));
    updateRoomOptions();
    updateRoomList();  // อัปเดตแสดงรายการห้อง
  }
});

// ฟังก์ชันแสดงรายการห้องประชุม
function updateRoomList() {
  const roomList = document.getElementById("room-list");
  roomList.innerHTML = "";

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  rooms.forEach((room, index) => {
    const li = document.createElement("li");
    li.textContent = room;

    if (currentUser.role === "admin") {
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => deleteRoom(index);
      li.appendChild(deleteButton);
    }

    roomList.appendChild(li);
  });
}

// ฟังก์ชันลบห้องประชุม
function deleteRoom(index) {
  const rooms = JSON.parse(localStorage.getItem("rooms"));
  rooms.splice(index, 1);
  localStorage.setItem("rooms", JSON.stringify(rooms));
  updateRoomList();
  alert("Room deleted successfully!");
}

// ฟังก์ชันอัปเดตตัวเลือกห้อง
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
