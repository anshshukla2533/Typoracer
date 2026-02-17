# ⌨️ TypeRacer — Typing Speed Test

A full-stack typing speed test app with user authentication, timed tests, and a global leaderboard.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## ✨ Features

- **User Authentication** — Register & login with email/password (JWT-based)
- **Timed Typing Tests** — Choose between 30s or 60s test durations
- **Live Feedback** — Real-time character highlighting (green = correct, red = incorrect)
- **WPM & Accuracy** — Words per minute and accuracy calculated on completion
- **Leaderboard** — Top 50 scores ranked globally with medals for top 3
- **Persistent Data** — All users and scores stored in PostgreSQL (Neon)

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 19, Vite 7, Axios            |
| Backend    | Node.js, Express                    |
| Database   | PostgreSQL (Neon Serverless)        |
| Auth       | JWT + bcrypt                        |

---

## 📁 Project Structure

```
backend/
├── server.js              # Express server entry point
├── db.js                  # Neon PostgreSQL connection & table init
├── middleware/
│   └── authMiddleware.js  # JWT verification middleware
├── routes/
│   ├── authRoutes.js      # POST /auth/register, POST /auth/login
│   └── scoreRoutes.js     # POST /score (protected), GET /score
└── package.json

frontend/
├── services/
│   └── api.js             # Axios instance (baseURL: localhost:3000)
├── src/
│   ├── App.jsx            # Root: auth gate, navbar, tab switching
│   ├── App.css            # Full app styling (dark theme)
│   ├── components/
│   │   ├── Auth.jsx       # Login/Register page
│   │   ├── TypingTest.jsx # Duration picker + typing test + results
│   │   └── Leaderboard.jsx# Global leaderboard
│   ├── index.css          # Base styles
│   └── main.jsx           # React entry point
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Neon](https://neon.tech/) PostgreSQL database (or update the connection string in `backend/db.js`)

### Backend

```bash
cd backend
npm install
node server.js
```

Server starts on **http://localhost:3000**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens on **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint         | Auth     | Description              |
| ------ | ---------------- | -------- | ------------------------ |
| POST   | `/auth/register` | No       | Register a new user      |
| POST   | `/auth/login`    | No       | Login & receive JWT      |
| POST   | `/score`         | Required | Save a typing test score |
| GET    | `/score`         | No       | Get top 50 scores        |

---

## 🎮 How It Works

1. **Register/Login** — Create an account or log in
2. **Pick Duration** — Choose a 30-second or 60-second test
3. **Type** — Start typing the displayed text; timer begins on first keystroke
4. **Results** — See your WPM, accuracy, and time when the countdown ends
5. **Leaderboard** — View the top scores from all users

---

## 📝 License

MIT
