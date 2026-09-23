const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Root route: responds with 'ok'
app.get('/', (req, res) => {
  res.send('ok');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = parseInt(process.env.PORT, 10) || 80;
const ALT_PORT = 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost (port ${PORT})`);
});

server.on('error', (err) => {
  console.error(`Error on port ${PORT}:`, err.message);
});

// Also listen on port 3000 if PORT is not 3000
if (PORT !== ALT_PORT) {
  const altServer = app.listen(ALT_PORT, '0.0.0.0', () => {
    console.log(`Server is also running on http://localhost:${ALT_PORT}`);
  });

  altServer.on('error', (err) => {
    // If port 3000 is already in use, don't crash
    console.log(`Secondary port ${ALT_PORT} note: ${err.message}`);
  });
}
