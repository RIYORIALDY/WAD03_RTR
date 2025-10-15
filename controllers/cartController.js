const cartService = require('../services/cartService');

const addToCart = (req, res) => {
  try {
    const { username } = req.params;
    const { productName } = req.body;
    
    const userCart = cartService.addToCart(username, productName);
    
    res.status(200).json({ 
      message: 'Product added to cart successfully', 
      data: userCart 
    });
  } catch (error) {
    const statusCode = error.message === 'Product not found' ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
};

const removeFromCart = (req, res) => {
  try {
    const { username } = req.params;
    const { productName } = req.body;
    
    const userCart = cartService.removeFromCart(username, productName);
    
    res.status(200).json({ 
      message: 'Product removed from cart successfully', 
      data: userCart 
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
};

const getCart = (req, res) => {
  try {
    const { username } = req.params;
    const userCart = cartService.getCart(username);
    
    res.status(200).json({ 
      message: 'Cart retrieved successfully', 
      data: userCart 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart
};
