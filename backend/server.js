require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const meetingRoutes = require('./routes/meetings');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/tasks', taskRoutes);

// Fallback Route
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
