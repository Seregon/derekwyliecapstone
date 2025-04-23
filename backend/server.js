// backend/server.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const sql = require('mssql');
const app = express();

// Serve React static files
app.use(express.static(path.join(__dirname, '..', 'build')));

// Connect to Azure SQL
const connStr = process.env.SQLAZURECONNSTR_DB_CONN;
let poolPromise = sql.connect(connStr);

// API test endpoint
app.get('/api/dbtest', async (req, res) => {
  try {
    await (await poolPromise).request().query('SELECT 1');
    res.send('✅ DB connection OK');
  } catch (err) {
    res.status(500).send(`❌ DB error: ${err.message}`);
  }
});

// Catch-all to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
