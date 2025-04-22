require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const app = express();
app.use(express.json());

const connStr = process.env.SQLAZURECONNSTR_DB_CONNECTION_STRING;
if (!connStr) {
  console.error('Driver={ODBC Driver 18 for SQL Server};Server=tcp:derekwyliecapstone.database.windows.net,1433;Database=derekwyliecapstone;Uid={your_user_name};Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;Authentication=ActiveDirectoryPassword');
  process.exit(1);
}

let poolPromise = sql.connect(connStr);

// Health check
app.get('/api/health', (req, res) => res.send('OK'));

// 1. List all products
app.get('/api/products', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT id, name, description, price, imageUrl FROM Products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Products WHERE id=@id');
    if (!result.recordset.length) return res.status(404).send('Not found');
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Place an order
app.post('/api/orders', async (req, res) => {
  const { customerId, items, deliveryOptions } = req.body;
  if (!items?.length) return res.status(400).send('Cart is empty');
  try {
    const pool = await poolPromise;
    const tx = new sql.Transaction(pool);
    await tx.begin();

    // Insert order
    const orderResult = await tx.request()
      .input('customerId', sql.Int, customerId)
      .input('delOpts', sql.NVarChar(sql.MAX), JSON.stringify(deliveryOptions))
      .query(`
        INSERT INTO Orders (customerId, deliveryOptions)
        OUTPUT INSERTED.id
        VALUES (@customerId, @delOpts)
      `);
    const orderId = orderResult.recordset[0].id;

    // Insert each item
    const ps = new sql.PreparedStatement(tx);
    ps.input('orderId', sql.Int);
    ps.input('productId', sql.Int);
    ps.input('quantity', sql.Int);
    await ps.prepare(`
      INSERT INTO OrderItems (orderId, productId, quantity)
      VALUES (@orderId, @productId, @quantity)
    `);
    for (let it of items) {
      await ps.execute({
        orderId,
        productId: it.productId,
        quantity: it.quantity
      });
    }
    await ps.unprepare();

    await tx.commit();
    res.status(201).json({ orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Fetch an order with items
app.get('/api/orders/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const orderQ = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Orders WHERE id=@id');
    const itemsQ = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT oi.id, p.name, oi.quantity, p.price
        FROM OrderItems oi
        JOIN Products p ON p.id=oi.productId
        WHERE oi.orderId=@id
      `);
    if (!orderQ.recordset.length) return res.status(404).send('Order not found');
    res.json({
      ...orderQ.recordset[0],
      items: itemsQ.recordset
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on ${port}`));