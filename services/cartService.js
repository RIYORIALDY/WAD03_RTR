const cartRepository = require('../repositories/cartRepository');
function getCartByUsername(username) {
  const cart = cartRepository.findByUsername(username);
  if (!cart) throw new Error('Cart not found');
  return cart;
}

function validateItem(item) {
  if (!item || !item.productName || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
    throw new Error('Invalid item data');
  }
  if (item.quantity <= 0) throw new Error('Quantity must be greater than 0');
}

function addItemToCart(username, item) {
  validateItem(item);
  const updated = cartRepository.addItem(username, item);
  return updated;
}

function removeItemFromCart(username, productName) {
  if (!productName) throw new Error('Product name is required');
  const updated = cartRepository.removeItem(username, productName);
  return updated;
}

function clearCart(username) {
  const result = cartRepository.clearCart(username);
  return result;
}

module.exports = {
  getCartByUsername,
  addItemToCart,
  removeItemFromCart,
  clearCart
};
