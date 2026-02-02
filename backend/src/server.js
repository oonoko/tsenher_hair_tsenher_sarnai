/**
 * Server Entry Point
 * Romantic Greeting Web App Backend
 */
const app = require('./app');
const config = require('./config');

app.listen(config.PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${config.PORT}`);
  console.log(`📁 Data directory: ${config.DATA_DIR}`);
});
