const User = require('../models/User');

class UsersRepository {
  /**
   * Get all users from database
   * @returns {Promise<Array>} Array of users
   */
  async findAll() {
    try {
      const users = await User.find({}).sort({ createdAt: -1 });
      return users;
    } catch (error) {
      console.error('Error in usersRepository.findAll:', error.message);
      throw error;
    }
  }

  /**
   * Find user by username
   * @param {string} username - Username to find
   * @returns {Promise<Object|null>} User object or null
   */
  async findByUsername(username) {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (error) {
      console.error('Error in usersRepository.findByUsername:', error.message);
      throw error;
    }
  }

  /**
   * Save new user to database
   * @param {Object} userData - User data to save
   * @returns {Promise<Object>} Saved user object
   */
  async save(userData) {
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      console.error('Error in usersRepository.save:', error.message);
      throw error;
    }
  }

  /**
   * Check if user exists by username
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(username) {
    try {
      const user = await User.findOne({ username });
      return user !== null;
    } catch (error) {
      console.error('Error in usersRepository.exists:', error.message);
      throw error;
    }
  }
}

module.exports = new UsersRepository();
