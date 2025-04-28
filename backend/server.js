const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React build/ directory
app.use(express.static(path.join(__dirname, 'build')));

// Example API endpoint (e.g. GET /api/products)
app.get('/api/products', (req, res) => {
  // TODO: replace this with actual DB query to Azure SQL
  const sampleProducts = [
    { id: 1, name: "Sample Product 1" },
    { id: 2, name: "Sample Product 2" }
  ];
  res.json(sampleProducts);
});

// All other GET requests (not handled by API) should return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Listen on the port that Azure provides (fallback to 3000 for local testing)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
