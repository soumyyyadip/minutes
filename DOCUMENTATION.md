# Minutes — Technical Documentation

## Overview

Minutes is a full-stack web application for managing meetings, recording minutes, tracking decisions, and managing action items. It uses a Node.js/Express backend with MongoDB, and a vanilla HTML/CSS/JS frontend styled with DM Serif Display and DM Sans fonts.

---

## Architecture

**Client-Server (MEN Stack)**

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+). Communicates with the backend via a thin `Api` class (`api.js`) using the native `fetch` API. No frameworks or build tools required.
- **Backend**: Node.js + Express.js. Handles routing, JWT auth middleware, business logic, and MongoDB interactions via Mongoose.
- **Database**: MongoDB. All user data is isolated per authenticated user using `createdBy` references.

---

## Database Models

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
| `notes` | String | Free-text meeting notes |
| `decisions` | Array | Array of decision strings |
| `actionItems` | Array | Subdocuments: `{ text, assignee, due, status }` |
| `createdBy` | ObjectId | References User |

#### actionItem status values
`open` | `in-progress` | `done`

#### meeting status values
`upcoming` | `completed` | `in-progress` | `cancelled`

> **Auto-status**: On every `GET /api/meetings`, any `upcoming` meeting whose date+time has already passed is automatically updated to `completed` in the database before the response is returned.

---

## API Endpoints

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
| PATCH | `/:id` | Any subset of meeting fields | Inline update (minutes, decisions, actionItems, status, etc.) |
| DELETE | `/:id` | — | Permanently delete |

> There is **no separate `/api/tasks` route** — tasks (`actionItems`) are embedded in the Meeting document and managed via `PATCH /api/meetings/:id`.

---

## Frontend Structure

```
frontend/
├── landing.html    # Marketing landing page
├── index.html      # Single-page app shell (auth + master-detail layout)
├── css/
│   ├── style.css   # Full design system (DM fonts, light theme, badges, layout)
│   └── landing.css # Landing page specific styles
└── js/
    ├── api.js      # Api class: login, signup, getMeetings, createMeeting, updateMeeting, deleteMeeting
    ├── app.js      # All UI logic: auth, sidebar, chips, tabs, inline edits, task cycling
    └── landing.js  # Scroll animations and smooth scrolling
```

### Key UI Behaviours

- **Landing Page**: Animated hero section, scroll-reveal features, and dynamic routing (`?mode=login` vs `?mode=signup`) to the main app auth flow.
- **New Meeting form**: clock picker for time, participant chip tags (add/remove), duration dropdown with Custom option, separate Minutes (duration) and Notes fields, decisions (comma-separated).
- **Status auto-derive on create**: frontend computes `upcoming` vs `completed` from the full `date + time` datetime at moment of creation.
- **Tabbed detail panel**: Minutes (editable), Decisions (add inline), Tasks (add/toggle done/cycle status), Participants (avatar list).
- **Sidebar stats**: live counts of total meetings, open tasks, and meetings this month.

---

## Security

| Mechanism | Implementation |
|---|---|
| Password hashing | `bcryptjs` — passwords never stored in plain text |
| Authentication | JWT signed with `JWT_SECRET`; sent as `Authorization: Bearer <token>` |
| Route protection | Custom `auth` middleware validates token on all meeting routes |
| Data isolation | All queries filter by `createdBy: req.user.id` |
| CORS | Enabled globally via `cors` middleware |
