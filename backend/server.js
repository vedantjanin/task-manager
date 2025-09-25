// ---------------- Imports ----------------
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// ---------------- Database Connection ----------------
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB error:', err.message);
  console.log('💡 Ensure MongoDB is running on localhost:27017');
});

// ---------------- Middleware ----------------
app.use(cors({
  origin: 'http://localhost:3000',  // frontend URL
  credentials: true                 // allow cookies/sessions
}));
app.use(express.json());             // parse JSON requests

// session config
app.use(session({
  secret: process.env.SESSION_SECRET || 'taskmanagersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,                   // set true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000      // 1 day
  }
}));

// ---------------- Routes ----------------
app.use('/api/auth', authRoutes);   // user auth routes
app.use('/api/tasks', taskRoutes);  // task management routes

// health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server running',
    timestamp: new Date().toISOString()
  });
});

// ---------------- Error Handler ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
