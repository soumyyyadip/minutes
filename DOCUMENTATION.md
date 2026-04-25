# Minutes — Technical Documentation

## 1. Overview
Minutes is an all-in-one meeting records and action items platform designed for teams to capture notes, track decisions, and assign tasks. Initially developed as "MeetFlow", the project was refactored for simplicity and renamed to "Minutes", featuring a clean, professional aesthetic using DM Serif Display and DM Sans fonts.

## 2. Platform Architecture
The platform is a full-stack web application with a strict separation between frontend and backend.

**Client-Server (MEN Stack)**
- **Frontend**: Vanilla HTML5, CSS3 (Modern features like CSS Variables, Grid, Flexbox), and JavaScript (ES6+). Communicates with the backend via a thin `Api` class (`api.js`) using the native `fetch` API. No frameworks or build tools required.
- **Backend**: Node.js + Express.js. Handles routing, JWT auth middleware, business logic, and MongoDB interactions via Mongoose.
- **Database**: MongoDB. All user data is isolated per authenticated user using `createdBy` references.

### Folder Structure
```text
Minutes/
├── backend/            # Express server and API logic
│   ├── .env            # Environment variables (port, DB URI, JWT secret)
│   ├── .gitignore
│   ├── controllers/    # Route controllers (auth, meetings)
│   ├── models/         # Mongoose schemas (User, Meeting)
│   ├── routes/         # Express routers
│   └── server.js       # Entry point
├── frontend/           # Static assets and UI
│   ├── css/
│   │   ├── landing.css # Styles for the landing page
│   │   └── style.css   # Core application styles
│   ├── js/
│   │   ├── api.js      # API interaction logic
│   │   ├── app.js      # Main application logic
│   │   └── landing.js  # Landing page interactivity
│   ├── index.html      # Main app & Auth gateway
│   └── landing.html    # Marketing landing page
├── README.md
├── DOCUMENTATION.md
└── PROJECT_REPORT.md
```

## 3. Database Models

### User
| Field | Type | Notes |
|---|---|---|
| `username` | String | Required, unique |
| `password` | String | Hashed with bcryptjs |

### Meeting
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `date` | String | `YYYY-MM-DD` format |
| `time` | String | `H:MM AM/PM` format (e.g. `2:30 PM`) |
| `status` | String | `upcoming`, `completed`, `in-progress`, `cancelled` |
| `participants` | Array | Subdocuments: `{ name, role, initials, color }` |
| `minutes` | String | Duration (e.g. `1 hr 30 min`) |
| `notes` | String | Free-text meeting notes added during creation/editing |
| `decisions` | Array | Array of decision strings |
| `actionItems` | Array | Subdocuments: `{ text, assignee, due, status }` |
| `createdBy` | ObjectId | References User |

#### Status Values
- **actionItem**: `open` | `in-progress` | `done`
- **meeting**: `upcoming` | `completed` | `in-progress` | `cancelled`

> **Auto-status**: On every `GET /api/meetings`, any `upcoming` meeting whose date+time has already passed is automatically updated to `completed` in the database before the response is returned.

## 4. API Endpoints

All routes under `/api/meetings` require `Authorization: Bearer <jwt_token>`.

### Auth — `/api/auth`
| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/signup` | `{ username, password }` | `{ token, username }` |
| POST | `/login` | `{ username, password }` | `{ token, username }` |

### Meetings — `/api/meetings`
| Method | Path | Query / Body | Description |
|---|---|---|---|
| GET | `/` | `?search=`, `?status=` | List user's meetings; auto-corrects stale statuses |
| GET | `/:id` | — | Fetch one meeting |
| POST | `/` | Full meeting object | Create a meeting |
| PATCH | `/:id` | Any subset of fields | Inline update (notes, decisions, actionItems, status, etc.) |
| DELETE | `/:id` | — | Permanently delete |

> There is **no separate `/api/tasks` route** — tasks (`actionItems`) are embedded in the Meeting document and managed via `PATCH /api/meetings/:id`.

## 5. Frontend Details

### 5.1 Design System
The Minutes platform follows a modern, clean, and professional design language.
- **Colors**: Green Primary (`#2D6A4F`), Green Dark (`#1B4332`), Green Light (`#D8F3DC`), Background (`#F4F6F4`), White (`#FFFFFF`).
- **Typography**: `DM Serif Display` for headings, `DM Sans` for body/UI.
- **UI Components & Patterns**:
  - **Navbar**: Glassmorphism effect (`rgba(244, 246, 244, 0.85)` background with `backdrop-filter: blur(14px)`).
  - **Buttons**: Primary buttons (`.btn-primary`) feature a solid green background, 10px radius, and a subtle shadow.
  - **Layout**: Features white cards with subtle borders, rounded pills/badges for tags, large blurred radial gradients (`rgba(45,106,79,0.13)`) for depth, and noise overlay (SVG turbulence filter) for texture.

### 5.2 Authentication Gateway Redesign
The authentication gateway (`index.html`) is a modern split-screen experience:
- **Left Panel (Brand/Marketing)**: Features the Hero gradient background with glow effects, a noise overlay, and a mini-mockup previewing the dashboard UI.
- **Right Panel (Interactive Form)**: Clean white background with a centered `auth-card`, labeled inputs, and a password visibility toggle (eye icon).
- **Dynamic Mode Switching**: JavaScript toggles the UI between Login and Signup modes seamlessly based on URL parameters (e.g., `?mode=signup`).

### 5.3 Meeting Management (Master-Detail Interface)
- **Creation Flow**: Form captures Title, Date & Time, Participants (interactive chip-based entry), Duration, Notes, and Initial Decisions. The frontend auto-derives the initial status (`upcoming` vs `completed`) based on the current time.
- **Detail View Tabs**:
  - **Minutes**: Focuses on meeting duration or technical minutes (inline editable).
  - **Notes**: Formatted text (`pre-wrap`) for context/background information.
  - **Decisions**: List of specific outcomes or agreements.
  - **Tasks**: Action items with assignee, due date, and a cyclic status lifecycle (`open` -> `in-progress` -> `done`).
  - **Participants**: Roster of attendees and their roles.
- **Dashboard Stats**: Sidebar displays live counts of total meetings, open tasks, and meetings this month.

## 6. Security Implementation
| Mechanism | Implementation |
|---|---|
| Password hashing | `bcryptjs` — passwords never stored in plain text |
| Authentication | JWT signed with `JWT_SECRET`; sent as `Authorization: Bearer <token>` |
| Route protection | Custom `auth` middleware validates token on all meeting routes |
| Data isolation | All queries filter by `createdBy: req.user.id` |
| CORS | Enabled globally via `cors` middleware |
