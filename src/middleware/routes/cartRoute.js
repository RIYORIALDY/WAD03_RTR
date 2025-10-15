const express = require('express');
const router = express.Router();
const cartController = require('../src/middleware/controller/cartController');
const buyerOnly = require('../buyerOnly');

// POST /carts/:username/add - Add to cart (Buyer only)
router.post('/:username/add', buyerOnly, cartController.addToCart);

// POST /carts/:username/remove - Remove from cart (Buyer only)
router.post('/:username/remove', buyerOnly, cartController.removeFromCart);

// GET /carts/:username - Get cart (Buyer only)
router.get('/:username', buyerOnly, cartController.getCart);

module.exports = router;