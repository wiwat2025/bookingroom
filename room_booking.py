import json
from datetime import datetime

# ข้อมูลเริ่มต้น
rooms = ["Room A", "Room B", "Room C"]
bookings = []


def show_rooms():
    print("\nAvailable Rooms:")
    for i, room in enumerate(rooms, start=1):
        print(f"{i}. {room}")


def add_room():
    room_name = input("Enter new room name: ").strip()
    if room_name:
        rooms.append(room_name)
        print(f"Room '{room_name}' has been added.")
    else:
        print("Invalid room name.")


def show_bookings():
    print("\nBookings:")
    if not bookings:
        print("No bookings available.")
        return

    for i, booking in enumerate(bookings, start=1):
        print(f"{i}. Room: {booking['room']}, Date: {booking['date']}, Time: {booking['time']}, "
              f"Description: {booking['description']}")


def add_booking():
    show_rooms()
    room_index = int(input("\nSelect a room (number): ")) - 1

    if 0 <= room_index < len(rooms):
        room_name = rooms[room_index]
        date = input("Enter date (YYYY-MM-DD): ").strip()
        time = input("Enter time (HH:MM): ").strip()
        description = input("Enter description: ").strip()

        # ตรวจสอบเวลาจองซ้ำ
        for booking in bookings:
            if booking["room"] == room_name and booking["date"] == date and booking["time"] == time:
                print("This room is already booked at the selected date and time.")
                return

        bookings.append({
            "room": room_name,
            "date": date,
            "time": time,
            "description": description
        })
        print("Booking added successfully.")
    else:
        print("Invalid room selection.")


def delete_booking():
    show_bookings()
    if not bookings:
        return

    booking_index = int(input("\nSelect a booking to delete (number): ")) - 1

    if 0 <= booking_index < len(bookings):
        removed_booking = bookings.pop(booking_index)
        print(f"Booking for Room '{removed_booking['room']}' on {removed_booking['date']} at {removed_booking['time']} has been deleted.")
    else:
        print("Invalid booking selection.")


def save_data():
    data = {"rooms": rooms, "bookings": bookings}
    with open("room_booking_data.json", "w") as file:
        json.dump(data, file, indent=4)
    print("Data saved to 'room_booking_data.json'.")


def load_data():
    try:
        with open("room_booking_data.json", "r") as file:
            data = json.load(file)
            global rooms, bookings
            rooms = data["rooms"]
            bookings = data["bookings"]
            print("Data loaded successfully.")
    except FileNotFoundError:
        print("No saved data found. Starting fresh.")


def main():
    load_data()
    while True:
        print("\nRoom Booking System")
        print("1. Show Rooms")
        print("2. Add Room")
        print("3. Show Bookings")
        print("4. Add Booking")
        print("5. Delete Booking")
        print("6. Save Data")
        print("7. Exit")

        choice = input("Select an option (1-7): ").strip()
        if choice == "1":
            show_rooms()
        elif choice == "2":
            add_room()
        elif choice == "3":
            show_bookings()
        elif choice == "4":
            add_booking()
        elif choice == "5":
            delete_booking()
        elif choice == "6":
            save_data()
        elif choice == "7":
            save_data()
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
