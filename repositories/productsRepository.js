const Product = require('../models/Product');

class ProductsRepository {
  /**
   * Get all products from database
   * @returns {Promise<Array>} Array of products
   */
  async findAll() {
    try {
      const products = await Product.find({}).sort({ createdAt: -1 });
      return products;
    } catch (error) {
      console.error('Error in productsRepository.findAll:', error.message);
      throw error;
    }
  }

  /**
   * Find product by name
   * @param {string} productName - Product name to find
   * @returns {Promise<Object|null>} Product object or null
   */
  async findByName(productName) {
    try {
      const product = await Product.findOne({ productName });
      return product;
    } catch (error) {
      console.error('Error in productsRepository.findByName:', error.message);
      throw error;
    }
  }

  /**
   * Find products by owner username
   * @param {string} owner - Owner username
   * @returns {Promise<Array>} Array of products
   */
  async findByOwner(owner) {
    try {
      const products = await Product.find({ owner }).sort({ createdAt: -1 });
      return products;
    } catch (error) {
      console.error('Error in productsRepository.findByOwner:', error.message);
      throw error;
    }
  }

  /**
   * Save new product to database
   * @param {Object} productData - Product data to save
   * @returns {Promise<Object>} Saved product object
   */
  async save(productData) {
    try {
      const product = new Product(productData);
      const savedProduct = await product.save();
      return savedProduct;
    } catch (error) {
      console.error('Error in productsRepository.save:', error.message);
      throw error;
    }
  }

  /**
   * Check if product exists by name
   * @param {string} productName - Product name to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(productName) {
    try {
      const product = await Product.findOne({ productName });
      return product !== null;
    } catch (error) {
      console.error('Error in productsRepository.exists:', error.message);
      throw error;
    }
  }
}

module.exports = new ProductsRepository();
