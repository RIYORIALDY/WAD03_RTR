const { describe, test, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const mongoose = require('mongoose');
const User = require('../models/User');
const usersRepository = require('./usersRepository');

/**
 * Integration Test untuk Users Repository
 * Testing dengan MongoDB test database
 */

describe('Users Repository - Integration Tests', () => {
  // Setup test database
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    // Ensure indexes are created
    await User.createIndexes();
  }, 30000);

  afterAll(async () => {
    await User.deleteMany({});
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  beforeEach(async () => {
    // Clear users collection sebelum setiap test
    await User.deleteMany({});
  });

  describe('findAll', () => {
    test('[POSITIVE] should return all users', async () => {
      // Arrange
      await User.create([
        { username: 'user1', name: 'User One', email: 'user1@test.com', role: 'buyer' },
        { username: 'user2', name: 'User Two', email: 'user2@test.com', role: 'seller' }
      ]);

      // Act
      const result = await usersRepository.findAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].username).toBeDefined();
    });

    test('[BOUNDARY] should return empty array when no users', async () => {
      // Act
      const result = await usersRepository.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByUsername', () => {
    test('[POSITIVE] should find user by username', async () => {
      // Arrange
      await User.create({ 
        username: 'testuser', 
        name: 'Test User', 
        email: 'test@test.com', 
        role: 'buyer' 
      });

      // Act
      const result = await usersRepository.findByUsername('testuser');

      // Assert
      expect(result).toBeTruthy();
      expect(result.username).toBe('testuser');
      expect(result.name).toBe('Test User');
    });

    test('[NEGATIVE] should return null when user not found', async () => {
      // Act
      const result = await usersRepository.findByUsername('nonexistent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    test('[POSITIVE] should save new user', async () => {
      // Arrange
      const userData = {
        username: 'newuser',
        name: 'New User',
        email: 'new@test.com',
        role: 'buyer'
      };

      // Act
      const result = await usersRepository.save(userData);

      // Assert
      expect(result._id).toBeDefined();
      expect(result.username).toBe('newuser');
      expect(result.createdAt).toBeDefined();
    });

    test('[NEGATIVE] should throw error for duplicate username', async () => {
      // Arrange
      const userData = {
        username: 'duplicate',
        name: 'User',
        email: 'user@test.com',
        role: 'buyer'
      };
      await usersRepository.save(userData);

      // Act & Assert
      await expect(usersRepository.save(userData)).rejects.toThrow();
    });
  });

  describe('exists', () => {
    test('[POSITIVE] should return true if user exists', async () => {
      // Arrange
      await User.create({ 
        username: 'existing', 
        name: 'Existing User', 
        email: 'existing@test.com', 
        role: 'buyer' 
      });

      // Act
      const result = await usersRepository.exists('existing');

      // Assert
      expect(result).toBe(true);
    });

    test('[NEGATIVE] should return false if user does not exist', async () => {
      // Act
      const result = await usersRepository.exists('nonexistent');

      // Assert
      expect(result).toBe(false);
    });
  });
});
