# ✨ LifeOS — Phase 1

A personal life-management platform (MERN stack) — Auth, Dashboard, Calendar,
Task Manager (Kanban), Habit Tracker (streaks + heatmap), and Journal.

This is **Phase 1** of the full LifeOS vision. It's a complete, runnable,
production-quality slice of the app with the architecture in place to keep
extending it (Goals, Health, Finance, Study Planner, etc.) using the exact
same patterns.

---

## 🧱 Tech Stack

**Frontend:** React (Vite), React Router, Framer Motion, Axios, FullCalendar,
Recharts, React Hook Form, react-hot-toast, plain CSS

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT auth, Multer (local file
storage), Nodemailer (optional), Socket.IO (wired up, ready for realtime features)

---

## 📂 Folder Structure

```
lifeos/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
└── docs/
    ├── API.md
    └── DATABASE_SCHEMA.md
```

---

### 1. Install MongoDB locally (free)

- **Windows/Mac/Linux:** install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  and run `mongod` — OR —
- Skip installing anything and instead create a **free MongoDB Atlas M0 cluster**
  (also free, just requires a free account) and paste its connection string into
  `backend/.env` as `MONGO_URI`.

Either way, no payment is ever required.

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

The API starts at **http://localhost:5000**. Health check: `GET /api/health`.

The `.env` file already has safe local defaults:

- `MONGO_URI=mongodb://127.0.0.1:27017/lifeos`
- `JWT_SECRET` is pre-filled for local dev (change it if you like)
- `EMAIL_USER` / `EMAIL_PASS` are left **blank on purpose** — if blank, password
  reset links are printed to the backend console instead of emailed, so
  the whole app works with **zero email signup**.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Register a new account and you're in.

---

## ✅ What's Implemented in Phase 1

- Email/password auth with JWT, bcrypt password hashing
- Forgot / reset password flow (console-logged in dev mode, real email optional)
- Google Sign-In endpoint ready (`POST /api/auth/google`) — just needs a free client ID to activate the button
- Protected routes (frontend + backend)
- Profile page with avatar upload (stored locally, no Cloudinary key needed) + password change
- Dashboard: greeting, today's schedule, pending tasks, habit streaks, weekly productivity chart, recent journal entries
- Calendar: month/week/day views, drag-and-drop, category colors (FullCalendar)
- Task Manager: Kanban board (drag between columns), priorities, categories, due dates, search & filter
- Habit Tracker: create habits, daily toggle, auto-calculated streaks, 90-day GitHub-style heatmap
- Journal: rich entries with mood tagging, image attachments, search
- Dark/light mode toggle, glassmorphism cards, Framer Motion animations, loading skeletons, empty states, toast notifications, fully responsive layout (mobile bottom-nav)

---

## 📖 More Docs

- [`docs/API.md`](docs/API.md) — full REST API reference
- [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) — MongoDB collections & fields
