# Minutes

> A clean, lightweight meeting management app — record minutes, track decisions, manage action items and participants. Built with Node.js, Express, MongoDB, and a HTML/CSS/JS frontend.

## Features

- 🚀 **Landing Page** — beautiful, responsive intro page with scroll animations
- 🔐 **JWT Authentication** — secure signup & login
- 📋 **Master-Detail UI** — sidebar meeting list + tabbed detail panel
- 📝 **Meeting Minutes** — inline editable notes per meeting
- ✅ **Action Items** — add tasks with assignee, due date, and status cycling (Open → In Progress → Done)
- 🗳️ **Decisions** — record key decisions taken in each meeting
- 👥 **Participants** — rich participant list with avatar initials and role (facilitator / attendee)
- 🔍 **Search & Filter** — search across titles, notes, decisions, tasks, and participants; filter by Completed / Upcoming
- ⏱️ **Smart Status** — meetings auto-transition from *Upcoming* → *Completed* when their datetime passes, on every refresh
- 🗑️ **Delete** — permanently remove meetings with confirmation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Fonts | DM Serif Display + DM Sans (Google Fonts) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## Project Structure

```
Minutes/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # meetingController, authController
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Meeting.js, User.js
│   ├── routes/         # meetings.js, auth.js
│   ├── .env            # Environment variables (not committed)
│   └── server.js
├── frontend/
│   ├── css/
│   │   ├── style.css
│   │   └── landing.css # Landing page styles
│   ├── js/
│   │   ├── app.js      # Main UI logic
│   │   ├── api.js      # API client (fetch wrapper)
│   │   └── landing.js  # Landing page animations
│   ├── index.html      # Main App (Auth + Dashboard)
│   └── landing.html    # Landing Page Entry
└── README.md
```

---

## Prerequisites

- **Node.js** v14+
- **npm**
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/soumyyyadip/meetflow-v1.git
cd meetflow-v1
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_strong_jwt_secret_here
```

---

## Running the App

### Step 1 — Start the backend

```bash
cd backend
node server.js
```

You should see:
```
Server started on port 5000
MongoDB Connected
```

### Step 2 — Serve the frontend

The frontend is pure HTML/JS — no build step needed.

**Option A — VS Code Live Server** *(recommended)*
Right-click `frontend/landing.html` → *Open with Live Server*

**Option B — Python**
```bash
cd frontend
python3 -m http.server 8000
# Open http://localhost:8000
```

**Option C — Direct file open**
Double-click `frontend/landing.html`. Note: direct `file://` access may have CORS restrictions with the backend.

---

## API Reference

All meeting routes require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | `{ username, password }` | Register new user |
| POST | `/api/auth/login` | `{ username, password }` | Login, returns JWT |

### Meetings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/meetings` | List all meetings (supports `?search=` and `?status=`) |
| GET | `/api/meetings/:id` | Get a specific meeting |
| POST | `/api/meetings` | Create a new meeting |
| PATCH | `/api/meetings/:id` | Update any fields (minutes, decisions, actionItems, status, etc.) |
| DELETE | `/api/meetings/:id` | Permanently delete a meeting |

---

## Usage

1. Open the landing page (`landing.html`) in your browser to explore features, then click **Log in** or **Get started free**
2. Click **+ New Meeting** to create a record — set title, date, time (clock picker), facilitator, participants, duration, notes, and decisions
3. Select a meeting from the sidebar to open the **detail panel**
4. Use the **Minutes / Decisions / Tasks / Participants** tabs to manage content inline
5. Tasks can be toggled done or cycled through Open → In Progress → Done by clicking the status badge
6. Meetings auto-update to **Completed** once their date and time has passed
