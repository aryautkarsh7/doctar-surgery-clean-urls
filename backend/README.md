# Doctar Backend

Node.js + Express + MongoDB API for the Doctar surgery website.

## Folder structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── bookingController.js  # Booking request handlers
├── models/
│   └── Booking.js         # Booking Mongoose schema
├── routes/
│   └── booking.js         # /api/bookings routes
├── server.js              # App entry point
├── .env                   # Secrets (not committed)
└── .env.example           # Env template
```

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGODB_URI
npm run dev            # auto-restart on changes
# or
npm start
```

Server runs on `http://localhost:3001`.

## API

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | `/`                   | Health check           |
| POST   | `/api/bookings/book`  | Create a booking       |
| GET    | `/api/bookings/all`   | List all bookings      |

### Create a booking

```json
POST /api/bookings/book
{ "name": "Riya", "phone": "9876543210", "disease": "Knee Replacement" }
```
