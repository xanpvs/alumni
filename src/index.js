const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Root route: serves single-page temporary homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// About route: serves temporary about page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

// Legacy ok route
app.get('/ok', (req, res) => {
  res.send('ok');
});

// Hello route: responds with 'Hello, World!'
app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

// Dynamic hello route: responds with 'Hello, <Name>!'
app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  const formattedName = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  res.send(`Hello, ${formattedName}!`);
});

// Sum route: adds two numbers from URL parameters
app.get('/sum/:a/:b', (req, res) => {
  const num1 = Number(req.params.a);
  const num2 = Number(req.params.b);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).send('Lütfen geçerli sayılar girin. Örn: /sum/5/4');
  }

  const result = num1 + num2;
  res.send(String(result));
});

// Optional helper route for /sum
app.get('/sum', (req, res) => {
  res.send('Kullanım: /sum/:sayi1/:sayi2 (Örn: /sum/5/4)');
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
