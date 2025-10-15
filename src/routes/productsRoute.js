const express = require('express');
const router = express.Router();
const productsController = require('../src/middleware/controller/productsController');
const sellerOnly = require('../sellerOnly');

router.post('/', sellerOnly, productsController.createProduct);

router.get('/', productsController.getAllProducts);

router.get('/:product_name', productsController.getProductByName);

module.exports = router;