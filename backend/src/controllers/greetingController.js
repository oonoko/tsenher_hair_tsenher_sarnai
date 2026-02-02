/**
 * Greeting Controller Module
 * Handles HTTP requests and responses
 */
const greetingService = require('../services/greetingService');

/**
 * Create or update greeting
 * POST /api/greeting
 */
async function createGreeting(req, res) {
  try {
    const result = greetingService.saveGreeting(req.body);
    res.json(result);
  } catch (error) {
    if (error.message.includes('required')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error creating greeting:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Get greeting by ID
 * GET /api/greeting/:id
 */
async function getGreeting(req, res) {
  try {
    const greeting = greetingService.getGreetingById(req.params.id);
    
    if (!greeting) {
      return res.status(404).json({ error: 'Greeting not found' });
    }
    
    res.json(greeting);
  } catch (error) {
    console.error('Error getting greeting:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  createGreeting,
  getGreeting
};
