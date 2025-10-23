const cartService = require('../services/cartService');

const getAllCarts = async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.status(200).json({
      message: 'Carts retrieved successfully',
      data: carts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { username } = req.params;
    const userCart = await cartService.getCartByUsername(username);
    
    res.status(200).json({ 
      message: 'Cart retrieved successfully', 
      data: userCart 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { username } = req.params;
    const item = req.body;
    
    const userCart = await cartService.addItemToCart(username, item);
    
    res.status(200).json({ 
      message: 'Item added to cart successfully', 
      data: userCart 
    });
  } catch (error) {
    const statusCode = error.message === 'Product not found' ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { username, productName } = req.params;
    
    const userCart = await cartService.removeItemFromCart(username, productName);
    
    res.status(200).json({ 
      message: 'Item removed from cart successfully', 
      data: userCart 
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { username } = req.params;
    const userCart = await cartService.clearCart(username);
    
    res.status(200).json({ 
      message: 'Cart cleared successfully', 
      data: userCart 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCarts,
  getCart,
  addItemToCart,
  removeItemFromCart,
  clearCart
};
