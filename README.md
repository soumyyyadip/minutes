# MeetFlow

MeetFlow is a simple and efficient meeting management web application designed to help you organize meetings, record minutes, and track action items seamlessly.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js** (v14 or higher recommended)
- **npm** (Node Package Manager)
- **MongoDB** (You can use a local instance or MongoDB Atlas)

## Project Structure

The project is divided into two main parts:
- `backend/`: A Node.js and Express server with MongoDB.
- `frontend/`: A vanilla HTML, CSS, and JavaScript user interface.

## Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd MeetFlow-B
   ```

2. **Set up the Backend**:
   Navigate to the backend directory and install the dependencies.
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**:
   In the `backend/` directory, create a `.env` file (or use the existing one) and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   *(Note: For local testing, a default `JWT_SECRET` is used if not provided, but it's highly recommended to set one.)*

## How to Run the App

You need to run both the backend server and the frontend client.

### Step 1: Start the Backend Server

Open a terminal and run the following commands:
```bash
cd backend
npm start
# OR
node server.js
```
You should see a message indicating the server has started (e.g., `Server started on port 5000`) and connected to the database.

### Step 2: Start the Frontend

The frontend is built with vanilla web technologies, so there is no complex build process required. 

You have a few options to run it:
- **Option A (VS Code Live Server)**: If you use VS Code, install the "Live Server" extension, right-click on `frontend/index.html`, and select "Open with Live Server".
- **Option B (Python Simple HTTP Server)**: Open a new terminal in the `frontend/` directory and run:
  ```bash
  cd frontend
  python3 -m http.server 8000
  ```
  Then open your browser and navigate to `http://localhost:8000`.
- **Option C (Direct Open)**: You can simply double-click the `frontend/index.html` file to open it in your web browser. *(Note: Some features like CORS or routing might behave differently when opened directly via `file://` protocol, so a local server is recommended).*

## Usage

1. Open the frontend application in your browser.
2. Sign up for a new account or log in with existing credentials.
3. Start creating and managing your meetings and tasks!
