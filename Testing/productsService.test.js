const { describe, test, expect, beforeEach } = require('@jest/globals');

/**
 * Unit Test untuk Products Service
 * Testing Pattern: AAA (Arrange, Act, Assert)
 */

// Mock repository
const mockProductsRepository = {
  findAll: jest.fn(),
  findByOwner: jest.fn(),
  findByName: jest.fn(),
  save: jest.fn(),
  exists: jest.fn(),
};

jest.mock('../repositories/productsRepository', () => mockProductsRepository);

const productsService = require('../services/productsService');

describe('Products Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    test('[POSITIVE] should create product successfully dengan data valid', () => {
      // Arrange
      const productData = {
        productName: 'Laptop Gaming',
        productCategory: 'Electronics',
        price: 15000000,
        owner: 'seller1'
      };
      
      mockProductsRepository.save.mockReturnValue(productData);

      // Act
      const result = productsService.createProduct(productData);

      // Assert
      expect(result).toEqual(productData);
      expect(mockProductsRepository.save).toHaveBeenCalledWith(productData);
    });

    test('[NEGATIVE] should throw error jika productName kosong', () => {
      // Arrange
      const invalidData = {
        productName: '',
        productCategory: 'Electronics',
        price: 15000000,
        owner: 'seller1'
      };

      // Act & Assert
      expect(() => {
        productsService.createProduct(invalidData);
      }).toThrow('All fields are required');
    });

    test('[NEGATIVE] should throw error jika price negatif', () => {
      // Arrange
      const invalidData = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: -1000,
        owner: 'seller1'
      };

      // Act & Assert
      expect(() => {
        productsService.createProduct(invalidData);
      }).toThrow('Price must be greater than 0');
    });

    test('[BOUNDARY] should throw error jika price adalah 0', () => {
      // Arrange
      const invalidData = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: 0,
        owner: 'seller1'
      };

      // Act & Assert
      expect(() => {
        productsService.createProduct(invalidData);
      }).toThrow('Price must be greater than 0');
    });

    test('[BOUNDARY] should accept price dengan nilai besar', () => {
      // Arrange
      const productData = {
        productName: 'Luxury Car',
        productCategory: 'Automotive',
        price: 5000000000,
        owner: 'seller1'
      };
      
      mockProductsRepository.save.mockReturnValue(productData);

      // Act
      const result = productsService.createProduct(productData);

      // Assert
      expect(result.price).toBe(5000000000);
    });
  });

  describe('getAllProducts', () => {
    test('[POSITIVE] should return semua products', () => {
      // Arrange
      const mockProducts = [
        { productName: 'Product 1', price: 10000 },
        { productName: 'Product 2', price: 20000 }
      ];
      
      mockProductsRepository.findAll.mockReturnValue(mockProducts);

      // Act
      const result = productsService.getAllProducts();

      // Assert
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(2);
    });

    test('[BOUNDARY] should return empty array jika tidak ada products', () => {
      // Arrange
      mockProductsRepository.findAll.mockReturnValue([]);

      // Act
      const result = productsService.getAllProducts();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getProductsByOwner', () => {
    test('[POSITIVE] should return products milik owner tertentu', () => {
      // Arrange
      const mockProducts = [
        { productName: 'Product 1', owner: 'seller1' },
        { productName: 'Product 2', owner: 'seller1' }
      ];
      
      mockProductsRepository.findByOwner.mockReturnValue(mockProducts);

      // Act
      const result = productsService.getProductsByOwner('seller1');

      // Assert
      expect(result).toEqual(mockProducts);
      expect(mockProductsRepository.findByOwner).toHaveBeenCalledWith('seller1');
    });

    test('[BOUNDARY] should return empty array jika owner tidak punya products', () => {
      // Arrange
      mockProductsRepository.findByOwner.mockReturnValue([]);

      // Act
      const result = productsService.getProductsByOwner('seller2');

      // Assert
      expect(result).toEqual([]);
    });
  });
});