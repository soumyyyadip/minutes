# MeetFlow Documentation

## Overview
MeetFlow is a full-stack web application tailored for managing meetings, taking minutes, and tracking action items. It features a robust Node.js backend using Express and MongoDB, coupled with a lightweight, fast, vanilla HTML/JS/CSS frontend.

## Architecture
The application follows a standard Client-Server architecture:
- **Frontend (Client)**: Built entirely with vanilla HTML, CSS, and JavaScript. It communicates with the backend via RESTful APIs using the standard `fetch` API.
- **Backend (Server)**: A Node.js server using the Express framework. It handles business logic, routing, authentication, and database interactions.
- **Database**: MongoDB is used as the primary database, utilizing Mongoose as the Object Data Modeling (ODM) library.

## Core Features
1. **User Authentication**: Secure signup and login functionality using JSON Web Tokens (JWT) and bcrypt for password hashing.
2. **Meeting Management**: Create, read, and manage meeting records, including details such as meeting title, date, time, attendees, and minutes.
3. **Task Tracking**: Assign and manage action items/tasks associated with meetings.
4. **Data Privacy**: Users can only access and manage their own meetings and tasks.

## Database Models

### 1. User Model
Stores user credentials and profile information.
- `username` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)

### 2. Meeting Model
Stores information about individual meetings.
- `user` (ObjectId, references User)
- `title` (String, required)
- `date` (Date, required)
- `time` (String)
- `attendees` (Array of Strings)
- `minutes` (String)

### 3. Task Model
Stores action items or tasks.
- `user` (ObjectId, references User)
- `meetingId` (ObjectId, references Meeting)
- `description` (String, required)
- `status` (String, enum: ['Pending', 'In Progress', 'Completed'])
- `dueDate` (Date)

## API Endpoints

The backend exposes several REST API endpoints prefixed with `/api`.

### Authentication (`/api/auth`)
- **POST** `/api/auth/register` - Register a new user. Expects `username`, `email`, and `password`. Returns a JWT token.
- **POST** `/api/auth/login` - Authenticate an existing user. Expects `email` and `password`. Returns a JWT token.

### Meetings (`/api/meetings`)
*(All meeting endpoints require a valid JWT token in the `Authorization` header)*
- **GET** `/api/meetings` - Fetch all meetings belonging to the authenticated user.
- **POST** `/api/meetings` - Create a new meeting. Expects meeting details in the body.
- **GET** `/api/meetings/:id` - Fetch details of a specific meeting.
- **PUT** `/api/meetings/:id` - Update a specific meeting.
- **DELETE** `/api/meetings/:id` - Delete a specific meeting.

### Tasks (`/api/tasks`)
*(All task endpoints require a valid JWT token in the `Authorization` header)*
- **GET** `/api/tasks` - Fetch all tasks belonging to the authenticated user.
- **POST** `/api/tasks` - Create a new task.
- **PUT** `/api/tasks/:id` - Update an existing task (e.g., change status).
- **DELETE** `/api/tasks/:id` - Delete a specific task.

## Security Mechanisms
- **Password Hashing**: User passwords are encrypted using `bcryptjs` before being stored in the database.
- **JWT Authorization**: Sensitive API routes are protected by a custom authentication middleware that verifies the JWT token sent in the `Authorization` header (Format: `Bearer <token>`).
- **CORS**: Cross-Origin Resource Sharing is enabled to allow the frontend to interact seamlessly with the backend server running on a different port.
