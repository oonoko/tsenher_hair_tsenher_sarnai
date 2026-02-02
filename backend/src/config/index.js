/**
 * Configuration Module
 */
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  DATA_DIR: path.join(__dirname, '../../data'),
  DATA_FILE: path.join(__dirname, '../../data/greetings.json'),
  JSON_LIMIT: '20mb'
};
