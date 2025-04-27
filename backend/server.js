require('dotenv').config();        // for local .env during dev
const express = require('express');
const sql = require('mssql');
const path = require('path');

const app = express();
app.use(express.json());

// Grab connection string: local or in Azure App Settings
const connStr =
  process.env.SQLAZURECONNSTR_DB_CONN ||
  process.env.DB_CONN;

if (!connStr) {
  console.error('❌ Missing database connection string');
  process.exit(1);
}

mssql.connect(connStr)
  .then(/* ... */)
  .catch(/* ... */);
  
// Initialize SQL connection pool
const poolPromise = sql.connect(connStr)
  .then(pool => {
    console.log('✔️  Connected to Azure SQL');
    return pool;
  })
  .catch(err => {
    console.error('✖️  SQL Connection Error:', err);
    process.exit(1);
  });

// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Products');
    res.json(result.recordset);
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// (Optional) Serve React from the same App Service
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🚀 Server listening on port ${port}`)
);
