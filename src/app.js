const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// Catch 404 Route Not Found
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
