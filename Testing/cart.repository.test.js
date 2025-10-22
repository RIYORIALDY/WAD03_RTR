const { describe, test, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const cartRepository = require('../repositories/cartRepository');

/**
 * Integration Test untuk Cart Repository
 */

describe('Cart Repository - Integration Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    // Ensure indexes are created
    await Cart.createIndexes();
  }, 30000);

  afterAll(async () => {
    await Cart.deleteMany({});
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  beforeEach(async () => {
    await Cart.deleteMany({});
  });

  describe('findAll', () => {
    test('[POSITIVE] should return all carts', async () => {
      // Arrange
      await Cart.create([
        { username: 'buyer1', items: [], totalItems: 0, totalPrice: 0 },
        { username: 'buyer2', items: [], totalItems: 0, totalPrice: 0 }
      ]);

      // Act
      const result = await cartRepository.findAll();

      // Assert
      expect(result).toHaveLength(2);
    });

    test('[BOUNDARY] should return empty array when no carts', async () => {
      // Act
      const result = await cartRepository.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByUsername', () => {
    test('[POSITIVE] should find cart by username', async () => {
      // Arrange
      await Cart.create({ 
        username: 'buyer1', 
        items: [{ productName: 'Product', productCategory: 'Cat', price: 1000, quantity: 1 }],
        totalItems: 1,
        totalPrice: 1000
      });

      // Act
      const result = await cartRepository.findByUsername('buyer1');

      // Assert
      expect(result).toBeTruthy();
      expect(result.username).toBe('buyer1');
      expect(result.items).toHaveLength(1);
    });

    test('[NEGATIVE] should return null when cart not found', async () => {
      // Act
      const result = await cartRepository.findByUsername('nonexistent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    test('[POSITIVE] should create new cart', async () => {
      // Act
      const result = await cartRepository.create('newbuyer');

      // Assert
      expect(result._id).toBeDefined();
      expect(result.username).toBe('newbuyer');
      expect(result.items).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPrice).toBe(0);
    });

    test('[NEGATIVE] should throw error for duplicate username', async () => {
      // Arrange
      await cartRepository.create('duplicate');

      // Act & Assert
      await expect(cartRepository.create('duplicate')).rejects.toThrow();
    });
  });

  describe('update', () => {
    test('[POSITIVE] should update existing cart', async () => {
      // Arrange
      const cart = await Cart.create({ 
        username: 'buyer1', 
        items: [],
        totalItems: 0,
        totalPrice: 0
      });

      cart.items.push({ 
        productName: 'Product', 
        productCategory: 'Cat', 
        price: 1000, 
        quantity: 2 
      });

      // Act
      const result = await cartRepository.update(cart);

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.totalItems).toBe(2);
      expect(result.totalPrice).toBe(2000);
    });

    test('[NEGATIVE] should throw error if cart not found', async () => {
      // Arrange
      const fakeCart = {
        username: 'nonexistent',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };

      // Act & Assert
      await expect(cartRepository.update(fakeCart)).rejects.toThrow('Cart not found');
    });
  });

  describe('delete', () => {
    test('[POSITIVE] should delete cart', async () => {
      // Arrange
      await Cart.create({ 
        username: 'buyer1', 
        items: [],
        totalItems: 0,
        totalPrice: 0
      });

      // Act
      const result = await cartRepository.delete('buyer1');

      // Assert
      expect(result).toBeTruthy();
      expect(result.username).toBe('buyer1');

      // Verify deletion
      const found = await Cart.findOne({ username: 'buyer1' });
      expect(found).toBeNull();
    });

    test('[NEGATIVE] should return null if cart not found', async () => {
      // Act
      const result = await cartRepository.delete('nonexistent');

      // Assert
      expect(result).toBeNull();
    });
  });
});
