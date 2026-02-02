/**
 * Greeting Service Module
 * Business logic for greeting operations
 */
const fileHandler = require('../utils/fileHandler');

/**
 * Create or update a greeting
 * @param {Object} greetingData - Greeting data
 * @returns {Object} Result with id
 */
function saveGreeting(greetingData) {
  const { id, name, message, tier, senderName, photos, voice, video, music, timeCapsule } = greetingData;
  
  if (!id || !name) {
    throw new Error('id and name are required');
  }

  const data = fileHandler.readData();
  
  data[id] = {
    id,
    name,
    message: message || '',
    tier: tier || 'standard',
    senderName: senderName || '',
    photos: photos || [],
    voice: voice || '',
    video: video || '',
    music: music || '',
    timeCapsule: timeCapsule || '',
    createdAt: new Date().toISOString()
  };

  fileHandler.writeData(data);
  
  return { ok: true, id };
}

/**
 * Get greeting by ID
 * @param {string} id - Greeting ID
 * @returns {Object|null} Greeting data or null
 */
function getGreetingById(id) {
  const data = fileHandler.readData();
  return data[id] || null;
}

module.exports = {
  saveGreeting,
  getGreetingById
};
