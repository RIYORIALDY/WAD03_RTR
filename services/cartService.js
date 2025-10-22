const cartRepository = require('../repositories/cartRepository');
const usersRepository = require('../repositories/usersRepository');

class CartService {
  /**
   * Get cart by username, create if not exists
   */
  async getCartByUsername(username) {
    try {
      let cart = await cartRepository.findByUsername(username);
      
      // Create cart if not exists
      if (!cart) {
        cart = await cartRepository.create(username);
      }
      
      return cart;
    } catch (error) {
      console.error('Error in cartService.getCartByUsername:', error.message);
      throw error;
    }
  }

  /**
   * Validate item data
   */
  validateItem(item) {
    if (!item || !item.productName || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      throw new Error('Invalid item data');
    }
    if (item.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
  }

  /**
   * Add item to cart
   */
  async addItemToCart(username, item) {
    try {
      this.validateItem(item);

      // Get or create cart
      let cart = await cartRepository.findByUsername(username);
      if (!cart) {
        cart = await cartRepository.create(username);
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        cartItem => cartItem.productName === item.productName
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cart.items.push({
          productName: item.productName,
          productCategory: item.productCategory || 'Uncategorized',
          price: item.price,
          quantity: item.quantity
        });
      }

      // Update cart
      const updatedCart = await cartRepository.update(cart);
      return updatedCart;
    } catch (error) {
      console.error('Error in cartService.addItemToCart:', error.message);
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  async removeItemFromCart(username, productName) {
    try {
      if (!productName) {
        throw new Error('Product name is required');
      }

      const cart = await cartRepository.findByUsername(username);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Filter out the item
      cart.items = cart.items.filter(item => item.productName !== productName);

      // Update cart
      const updatedCart = await cartRepository.update(cart);
      return updatedCart;
    } catch (error) {
      console.error('Error in cartService.removeItemFromCart:', error.message);
      throw error;
    }
  }

  /**
   * Clear all items from cart
   */
  async clearCart(username) {
    try {
      const cart = await cartRepository.findByUsername(username);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Clear items
      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;

      // Update cart
      const updatedCart = await cartRepository.update(cart);
      return updatedCart;
    } catch (error) {
      console.error('Error in cartService.clearCart:', error.message);
      throw error;
    }
  }
}

module.exports = new CartService();
