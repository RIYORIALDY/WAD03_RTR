const { describe, test, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const productsRepository = require('../repositories/productsRepository');

/**
 * Integration Test untuk Products Repository
 */

describe('Products Repository - Integration Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  }, 30000);

  afterAll(async () => {
    await Product.deleteMany({});
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('findAll', () => {
    test('[POSITIVE] should return all products', async () => {
      // Arrange
      await Product.create([
        { productName: 'Product 1', productCategory: 'Cat1', price: 1000, owner: 'seller1' },
        { productName: 'Product 2', productCategory: 'Cat2', price: 2000, owner: 'seller2' }
      ]);

      // Act
      const result = await productsRepository.findAll();

      // Assert
      expect(result).toHaveLength(2);
    });

    test('[BOUNDARY] should return empty array when no products', async () => {
      // Act
      const result = await productsRepository.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByName', () => {
    test('[POSITIVE] should find product by name', async () => {
      // Arrange
      await Product.create({ 
        productName: 'Laptop', 
        productCategory: 'Electronics', 
        price: 10000, 
        owner: 'seller1' 
      });

      // Act
      const result = await productsRepository.findByName('Laptop');

      // Assert
      expect(result).toBeTruthy();
      expect(result.productName).toBe('Laptop');
    });

    test('[NEGATIVE] should return null when product not found', async () => {
      // Act
      const result = await productsRepository.findByName('NonExistent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByOwner', () => {
    test('[POSITIVE] should return products by owner', async () => {
      // Arrange
      await Product.create([
        { productName: 'Product 1', productCategory: 'Cat1', price: 1000, owner: 'seller1' },
        { productName: 'Product 2', productCategory: 'Cat2', price: 2000, owner: 'seller1' },
        { productName: 'Product 3', productCategory: 'Cat3', price: 3000, owner: 'seller2' }
      ]);

      // Act
      const result = await productsRepository.findByOwner('seller1');

      // Assert
      expect(result).toHaveLength(2);
      expect(result.every(p => p.owner === 'seller1')).toBe(true);
    });

    test('[BOUNDARY] should return empty array if owner has no products', async () => {
      // Act
      const result = await productsRepository.findByOwner('seller999');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('save', () => {
    test('[POSITIVE] should save new product', async () => {
      // Arrange
      const productData = {
        productName: 'New Product',
        productCategory: 'Category',
        price: 5000,
        owner: 'seller1'
      };

      // Act
      const result = await productsRepository.save(productData);

      // Assert
      expect(result._id).toBeDefined();
      expect(result.productName).toBe('New Product');
      expect(result.createdAt).toBeDefined();
    });
  });

  describe('exists', () => {
    test('[POSITIVE] should return true if product exists', async () => {
      // Arrange
      await Product.create({ 
        productName: 'Existing', 
        productCategory: 'Cat', 
        price: 1000, 
        owner: 'seller1' 
      });

      // Act
      const result = await productsRepository.exists('Existing');

      // Assert
      expect(result).toBe(true);
    });

    test('[NEGATIVE] should return false if product does not exist', async () => {
      // Act
      const result = await productsRepository.exists('NonExistent');

      // Assert
      expect(result).toBe(false);
    });
  });
});
