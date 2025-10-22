const Cart = require('../models/Cart');

class CartRepository {
  /**
   * Get all carts from database
   * @returns {Promise<Array>} Array of carts
   */
  async findAll() {
    try {
      const carts = await Cart.find({}).sort({ createdAt: -1 });
      return carts;
    } catch (error) {
      console.error('Error in cartRepository.findAll:', error.message);
      throw error;
    }
  }

  /**
   * Find cart by username
   * @param {string} username - Username to find
   * @returns {Promise<Object|null>} Cart object or null
   */
  async findByUsername(username) {
    try {
      const cart = await Cart.findOne({ username });
      return cart;
    } catch (error) {
      console.error('Error in cartRepository.findByUsername:', error.message);
      throw error;
    }
  }

  /**
   * Save all carts (not used in MongoDB, kept for compatibility)
   * @param {Array} carts - Array of carts
   * @returns {Promise<void>}
   */
  async saveAll(carts) {
    // This method is not needed in MongoDB implementation
    // Kept for backward compatibility
    console.warn('cartRepository.saveAll is deprecated in MongoDB implementation');
  }

  /**
   * Create new cart for user
   * @param {string} username - Username
   * @returns {Promise<Object>} Created cart object
   */
  async create(username) {
    try {
      const newCart = new Cart({
        username,
        items: [],
        totalItems: 0,
        totalPrice: 0
      });
      const savedCart = await newCart.save();
      return savedCart;
    } catch (error) {
      console.error('Error in cartRepository.create:', error.message);
      throw error;
    }
  }

  /**
   * Update existing cart
   * @param {Object} cartData - Cart data to update
   * @returns {Promise<Object>} Updated cart object
   */
  async update(cartData) {
    try {
      // Calculate totals before saving
      if (cartData.calculateTotals && typeof cartData.calculateTotals === 'function') {
        cartData.calculateTotals();
      } else {
        // Manual calculation if not a Mongoose document
        cartData.totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
        cartData.totalPrice = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }

      const updatedCart = await Cart.findOneAndUpdate(
        { username: cartData.username },
        cartData,
        { new: true, runValidators: true }
      );
      
      if (!updatedCart) {
        throw new Error('Cart not found');
      }
      
      return updatedCart;
    } catch (error) {
      console.error('Error in cartRepository.update:', error.message);
      throw error;
    }
  }

  /**
   * Delete cart by username
   * @param {string} username - Username
   * @returns {Promise<Object>} Deleted cart object
   */
  async delete(username) {
    try {
      const deletedCart = await Cart.findOneAndDelete({ username });
      return deletedCart;
    } catch (error) {
      console.error('Error in cartRepository.delete:', error.message);
      throw error;
    }
  }
}

module.exports = new CartRepository();
