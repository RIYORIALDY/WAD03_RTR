const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const buyerOnly = require('../middleware/buyerOnly');

// GET /carts - Get all carts
router.get('/', cartController.getAllCarts);

// GET /carts/:username - Get cart (Buyer only)
router.get('/:username', buyerOnly, cartController.getCart);

// POST /carts/:username/items - Add item to cart (Buyer only)
router.post('/:username/items', buyerOnly, cartController.addItemToCart);

// DELETE /carts/:username/items/:productName - Remove item from cart (Buyer only)
router.delete('/:username/items/:productName', buyerOnly, cartController.removeItemFromCart);

// DELETE /carts/:username - Clear cart (Buyer only)
router.delete('/:username', buyerOnly, cartController.clearCart);

module.exports = router;