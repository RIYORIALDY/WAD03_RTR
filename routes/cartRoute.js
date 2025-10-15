const express = require('express');
const router = express.Router();
const cartController = require('../src/middleware/controller/cartController');
const buyerOnly = require('../buyerOnly');

router.post('/:username/add', buyerOnly, cartController.addToCart);

router.post('/:username/remove', buyerOnly, cartController.removeFromCart);

router.get('/:username', buyerOnly, cartController.getCart);

module.exports = router;