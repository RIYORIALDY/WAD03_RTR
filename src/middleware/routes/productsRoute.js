const express = require('express');
const router = express.Router();
const productsController = require('../src/middleware/controller/productsController');
const sellerOnly = require('../sellerOnly');

// POST /products/ - Create product (Seller only)
router.post('/', sellerOnly, productsController.createProduct);

// GET /products/ - Get all products (Public)
router.get('/', productsController.getAllProducts);

// GET /products/:product_name - Get product by name (Public)
router.get('/:product_name', productsController.getProductByName);

module.exports = router;