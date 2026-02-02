/**
 * Greeting Routes Module
 * Defines API endpoints
 */
const express = require('express');
const greetingController = require('../controllers/greetingController');

const router = express.Router();

// POST /api/greeting – Save greeting data
router.post('/greeting', greetingController.createGreeting);

// GET /api/greeting/:id – Get greeting data
router.get('/greeting/:id', greetingController.getGreeting);

module.exports = router;
