/**
 * Backend API – Romantic Greeting Web App
 * Stores and serves greeting data so shared links work
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'greetings.json');

app.use(cors());
app.use(express.json({ limit: '20mb' }));

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '{}');
}

function readData() {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function writeData(data) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST /api/greeting – Save greeting data
app.post('/api/greeting', (req, res) => {
  try {
    const { id, name, message, tier, senderName, photos, voice, video, music, timeCapsule } = req.body;
    if (!id || !name) {
      return res.status(400).json({ error: 'id and name required' });
    }
    const data = readData();
    data[id] = {
      id, name, message: message || '', tier: tier || 'standard',
      senderName: senderName || '', photos: photos || [], voice: voice || '',
      video: video || '', music: music || '', timeCapsule: timeCapsule || '',
      createdAt: new Date().toISOString()
    };
    writeData(data);
    res.json({ ok: true, id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/greeting/:id – Get greeting data
app.get('/api/greeting/:id', (req, res) => {
  try {
    const data = readData();
    const greeting = data[req.params.id];
    if (!greeting) return res.status(404).json({ error: 'Not found' });
    res.json(greeting);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log('Backend running at http://localhost:' + PORT);
});
