/**
 * File Handler Module
 * Handles file system operations for greeting data
 */
const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Ensure data directory exists
 */
function ensureDataDir() {
  const dir = path.dirname(config.DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(config.DATA_FILE)) {
    fs.writeFileSync(config.DATA_FILE, '{}');
  }
}

/**
 * Read all greeting data
 * @returns {Object} All greetings
 */
function readData() {
  ensureDataDir();
  try {
    const content = fs.readFileSync(config.DATA_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading data:', error);
    return {};
  }
}

/**
 * Write greeting data to file
 * @param {Object} data - Greeting data to write
 */
function writeData(data) {
  ensureDataDir();
  fs.writeFileSync(config.DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  ensureDataDir,
  readData,
  writeData
};
