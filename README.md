# Event Manager – MERN Stack Application

A comprehensive Event Booking & Management System built using the MERN stack. It includes secure authentication, admin-only event controls, ticket booking with mock payments, and QR-based digital ticket verification.

---

## Features

### User Features
- Browse upcoming events with details (price, venue, date/time)
- Book tickets using a Mock Payment Gateway
- Receive digital tickets with unique QR Codes
- Verify tickets using a public verification page
- View booking history
- Fully responsive interface for all devices

### Admin Features
- Create, update, and delete events
- Dashboard overview of events and ticket sales
- Real-time ticket inventory tracking
  # NOTE : For Admin access please register the user and change role isAdmin to true  

---

## Screenshots
(Replace the empty `src` values with real image paths after uploading screenshots.)

### Home Page | Event Details
| Home Page | Event Details |
|----------|---------------|
| <img src="https://github.com/jk-7-dev/event-manager-mern/blob/main/frontend/src/assets/Home.png?raw=true" width="100%" alt="Home Page"> | <img src="https://github.com/jk-7-dev/event-manager-mern/blob/main/frontend/src/assets/Event%20Details.png?raw=true" width="100%" alt="Event Details"> |

### Payment Page | Digital Ticket
| Payment Page | Ticket with QR |
|--------------|----------------|
| <img src="https://github.com/jk-7-dev/event-manager-mern/blob/main/frontend/src/assets/payment.png?raw=true" width="100%" alt="Payment Page"> | <img src="https://github.com/jk-7-dev/event-manager-mern/blob/main/frontend/src/assets/MyBooking.png?raw=true" width="100%" alt="Digital Ticket"> |

### Admin Dashboard | Ticket Verification
| Admin Dashboard | Verification Page |
|----------------|-------------------|
| <img src="https://github.com/jk-7-dev/event-manager-mern/blob/main/frontend/src/assets/Admin.png?raw=true" width="100%" alt="Admin Dashboard"> | <img src="https://github.com/jk-7-dev/event-manager-mern/blob/main/frontend/src/assets/Ticket%20Verification.png?raw=true" width="100%" alt="Verification Page"> |

---

## Tech Stack

### Frontend
- React (Vite)
- Bootstrap 5
- Axios
- React Router
- QRCode.js

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- BcryptJS
- Swagger UI (API Documentation)

---

## Installation & Setup

### 1. Prerequisites
Install the following:
- Node.js
- MongoDB (Local or Atlas)
- Git

---

### 2. Clone the Repository
```bash
git clone https://github.com/jk-7-dev/event-manager-mern.git
cd event-manager-mern
```

---

## 3. Backend Setup (Port: 5000)

Navigate to backend:
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_manager
JWT_SECRET=your_super_secret_key_123
```

Start backend:
```bash
npm run dev
```

Backend URL:
```
http://localhost:5000
```

---

## 4. Frontend Setup (Port: 5173)

Navigate to frontend:
```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
```
http://localhost:5173
```

---

## Database Schema

### Users Collection
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique user ID |
| name | String | Full name |
| email | String | Unique email |
| password | String | Hashed password |
| isAdmin | Boolean | Role flag |

### Events Collection
| Field | Type | Description |
|-------|------|-------------|
| title | String | Event name |
| description | String | Detailed description |
| date | Date | Event date and time |
| location | String | Venue |
| price | Number | Ticket price |
| totalTickets | Number | Maximum tickets |
| availableTickets | Number | Remaining tickets |
| image | String | Poster URL |

### Bookings Collection
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | User reference |
| event | ObjectId | Event reference |
| ticketId | String | Unique ticket ID |
| count | Number | Tickets booked |
| totalCost | Number | Total price |
| bookingDate | Date | When booking was created |

---

## API Endpoints

Full Swagger documentation:
```
http://localhost:5000/api-docs
```

### Authentication
```
POST /api/auth/register        Register a new user
POST /api/auth/login           Login user and get token
```

### Events
```
GET    /api/events             Get all events
GET    /api/events/:id         Get a single event
POST   /api/events             Create event (Admin only)
PUT    /api/events/:id         Update event (Admin only)
DELETE /api/events/:id         Delete event (Admin only)
```

### Bookings
```
POST /api/bookings             Book tickets (Protected)
GET  /api/bookings/mybookings  Get logged-in user's bookings
GET  /api/bookings/verify/:ticketId   Verify a ticket (Public)
```

---

## Project Structure

```
event-manager-mern/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── api-docs.yaml
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

---

## Contributing

1. Fork the repository  
2. Create a new branch  
   ```bash
   git checkout -b feature/NewFeature
   ```
3. Commit changes  
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to GitHub  
   ```bash
   git push origin feature/NewFeature
   ```
5. Open a Pull Request

