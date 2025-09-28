const express = require('express');
const fs = require('fs');
const path = require('path');

const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
app.use(express.json());

// pastikan folder data dan file JSON ada
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
['users.json','products.json','carts.json'].forEach(f => {
  const p = path.join(dataDir, f);
  if (!fs.existsSync(p)) fs.writeFileSync(p, '[]', 'utf8');
});

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
