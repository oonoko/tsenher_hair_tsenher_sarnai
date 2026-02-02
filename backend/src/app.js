/**
 * Express App Configuration
 */
const express = require('express');
const cors = require('cors');
const config = require('./config');
const greetingRoutes = require('./routes/greetingRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: config.JSON_LIMIT }));

// Routes
app.use('/api', greetingRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;
