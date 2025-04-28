// server.js
require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const path = require('path');

const app = express();
app.use(express.json());

// 1) Connection string: local (.env) or Azure App Setting
const connStr = process.env.DB_CONN || process.env.SQLAZURECONNSTR_DB_CONN;
if (!connStr) {
  console.error('❌ Missing DB_CONN / SQLAZURECONNSTR_DB_CONN');
  process.exit(1);
}

// 2) Create a single shared connection pool
const poolPromise = sql.connect(connStr)
  .then(pool => {
    console.log('✔️  Connected to Azure SQL');
    return pool;
  })
  .catch(err => {
    console.error('🔴 SQL Connection Error:', err);
    process.exit(1);
  });

// 3) Products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Products');
    res.json(result.recordset);
  } catch (err) {
    console.error('🔴 Query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

const path = require('path');

// Serve static React files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// All other requests get served index.html so React Router works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// 5) Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 API listening on port ${port}`));
