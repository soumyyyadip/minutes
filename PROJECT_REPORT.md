# Project Report: Minutes

## 1. Introduction

Minutes is a full-stack, web-based meeting management application developed as a college project. It enables users to create meeting records, document minutes and decisions, track action items, and manage participants — all within a clean, modern interface. The application emphasises data privacy, usability, and a professional design aesthetic inspired by productivity tools.

---

## 2. Project Objectives

- Build a functional end-to-end full-stack web application using the MEN stack.
- Implement secure user authentication and data isolation using JWT.
- Provide a Master-Detail UI that allows users to manage structured meeting data inline, without page reloads.
- Design a visually polished interface using modern typography (DM Serif Display, DM Sans) and a light-themed color system.
- Automatically manage meeting lifecycle (Upcoming → Completed) based on real datetime comparison.

---

## 3. Technologies Used

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Typography | DM Serif Display + DM Sans (Google Fonts) |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Auth | bcryptjs (password hashing), jsonwebtoken (JWT) |

---

## 4. System Architecture

Minutes uses a standard Client-Server architecture:

- **Frontend**: A single HTML file with vanilla JS handles all UI rendering, state management, and API communication via `fetch`. No frontend framework or build tool is required.
- **Backend**: An Express.js REST API with MVC separation — controllers handle business logic, models define the schema, and middleware enforces authentication.
- **Database**: MongoDB stores all data. Tasks (action items) are embedded as subdocuments within Meeting documents, eliminating the need for a separate collection and costly joins.

---

## 5. Core Features

### User Authentication
- Beautiful landing page for feature overview and onboarding.
- Secure signup and login with JWT-based session management.
- Passwords hashed with bcryptjs before storage.
- All meeting routes are protected by an `auth` middleware.

### Meeting Management
- Create meetings with title, date, time (clock picker), facilitator, participants, duration, meeting notes, and initial decisions.
- View all meetings in a sidebar with live stats (total, open tasks, this month).
- Search across titles, notes, decisions, tasks, and participant names.
- Filter meetings by status: All, Completed, Upcoming.

### Inline Detail Panel (Tabbed)
- **Minutes tab**: View and edit the meeting's recorded notes (editable in place with Save/Cancel).
- **Decisions tab**: View recorded decisions; add new ones inline with Enter key support.
- **Tasks tab**: Full action item management — add tasks with assignee and due date; toggle done or cycle status (Open → In Progress → Done) with a single click.
- **Participants tab**: View all participants with avatar initials and role (facilitator / attendee).

### Smart Status Management
- On **creation**: status is automatically derived by comparing the meeting's full `date + time` against the current datetime — past meetings are marked Completed immediately.
- On every **fetch**: the backend scans for any `upcoming` meetings whose datetime has passed and bulk-updates them to `completed` in MongoDB before responding.

### Participant Chip Input
- Dynamic chip-tag interface for adding multiple participants when creating a meeting.
- Each participant gets an auto-assigned avatar color; duplicates are silently rejected.
- Chips are removable before form submission.

### Delete
- Meetings can be permanently deleted from the detail panel with a confirmation prompt.

---

## 6. Database Schema

### Meeting Model (key fields)

```
title        String      Required
date         String      YYYY-MM-DD
time         String      H:MM AM/PM (e.g. "2:30 PM")
status       String      upcoming | completed | in-progress | cancelled
participants [{name, role, initials, color}]
minutes      String      Meeting duration (e.g. "1 hr 30 min")
notes        String      Free-text notes
decisions    [String]
actionItems  [{text, assignee, due, status: open|in-progress|done}]
createdBy    ObjectId    → User
```

> Tasks are embedded within the Meeting document — there is no separate Task collection.

---

## 7. API Design

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/meetings` | List (with search, status filter, auto-status correction) |
| POST | `/api/meetings` | Create |
| GET | `/api/meetings/:id` | Fetch one |
| PATCH | `/api/meetings/:id` | Update any fields inline |
| DELETE | `/api/meetings/:id` | Delete permanently |

---

## 8. Setup & Running

1. Clone the repository
2. `cd backend && npm install`
3. Create `backend/.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`
4. `node server.js` to start the backend
5. Serve `frontend/landing.html` via Live Server or `python3 -m http.server`

---

## 9. Conclusion

Minutes demonstrates a complete, production-structured web application built without heavy frontend frameworks. By embedding action items within meeting documents, applying JWT-based security, and implementing intelligent status management, the project goes beyond a basic CRUD app. The Master-Detail UI with inline editing, participant chip input, and auto-status correction reflect real-world application design patterns.
