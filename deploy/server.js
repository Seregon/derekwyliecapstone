// server.js
require('dotenv').config();                 // loads .env file locally
const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.json());

// 2.3 Connection string from .env (local) or Azure App Setting (prod)
const connStr = process.env.DB_CONN 
             || process.env.SQLAZURECONNSTR_DB_CONN;
if (!connStr) {
  console.error('✖️ No connection string found. Set DB_CONN in .env or in Azure App Settings.');
  process.exit(1);
}

// 2.4 Create a shared connection pool
const poolPromise = sql.connect(connStr)
  .then(pool => {
    console.log('✅ Connected to Azure SQL');
    return pool;
  })
  .catch(err => {
    console.error('🔴 DB Connection Error:', err);
    process.exit(1);
  });

// 2.5 Define the /api/products route
app.get('/api/products', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Products');
    res.json(result.recordset);
  } catch (err) {
    console.error('🔴 Query Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2.6 Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 API listening on http://localhost:${port}`));
