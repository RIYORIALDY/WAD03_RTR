const express = require('express');
const database = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

// Koneksi ke database
database.connect()
  .then(() => {
    console.log('✅ Database siap digunakan');
  })
  .catch((error) => {
    console.error('❌ Gagal koneksi database:', error.message);
    // Tidak exit process, biarkan app tetap jalan untuk development
  });

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const usersRoute = require('./routes/usersRoutes');
const productsRoute = require('./routes/productsRoute');
const cartRoute = require('./routes/cartRoute');

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ECommerce API',
    endpoints: {
      users: '/users',
      products: '/products',
      carts: '/carts'
    }
  });
});

// Use routes
app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/carts', cartRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
