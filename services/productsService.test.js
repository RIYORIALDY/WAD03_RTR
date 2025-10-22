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

const productsService = require('./productsService');

describe('Products Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    test('[POSITIVE] should create product successfully dengan data valid', async () => {
      // Arrange
      const productData = {
        productName: 'Laptop Gaming',
        productCategory: 'Electronics',
        price: 15000000,
        owner: 'seller1'
      };
      
      mockProductsRepository.exists.mockResolvedValue(false);
      mockProductsRepository.save.mockResolvedValue(productData);

      // Act
      const result = await productsService.createProduct(productData);

      // Assert
      expect(result).toEqual(productData);
      expect(mockProductsRepository.save).toHaveBeenCalledWith(productData);
    });

    test('[NEGATIVE] should throw error jika productName kosong', async () => {
      // Arrange
      const invalidData = {
        productName: '',
        productCategory: 'Electronics',
        price: 15000000,
        owner: 'seller1'
      };

      // Act & Assert
      await expect(async () => {
        await productsService.createProduct(invalidData);
      }).rejects.toThrow('All fields are required');
    });

    test('[NEGATIVE] should throw error jika price negatif', async () => {
      // Arrange
      const invalidData = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: -1000,
        owner: 'seller1'
      };

      // Act & Assert
      await expect(async () => {
        await productsService.createProduct(invalidData);
      }).rejects.toThrow('Price must be greater than 0');
    });

    test('[BOUNDARY] should throw error jika price adalah 0', async () => {
      // Arrange
      const invalidData = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: 0,
        owner: 'seller1'
      };

      // Act & Assert
      await expect(async () => {
        await productsService.createProduct(invalidData);
      }).rejects.toThrow('Price must be greater than 0');
    });

    test('[BOUNDARY] should accept price dengan nilai besar', async () => {
      // Arrange
      const productData = {
        productName: 'Luxury Car',
        productCategory: 'Automotive',
        price: 5000000000,
        owner: 'seller1'
      };
      
      mockProductsRepository.exists.mockResolvedValue(false);
      mockProductsRepository.save.mockResolvedValue(productData);

      // Act
      const result = await productsService.createProduct(productData);

      // Assert
      expect(result.price).toBe(5000000000);
    });
  });

  describe('getAllProducts', () => {
    test('[POSITIVE] should return semua products', async () => {
      // Arrange
      const mockProducts = [
        { productName: 'Product 1', price: 10000 },
        { productName: 'Product 2', price: 20000 }
      ];
      
      mockProductsRepository.findAll.mockResolvedValue(mockProducts);

      // Act
      const result = await productsService.getAllProducts();

      // Assert
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(2);
    });

    test('[BOUNDARY] should return empty array jika tidak ada products', async () => {
      // Arrange
      mockProductsRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await productsService.getAllProducts();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getProductsByOwner', () => {
    test('[POSITIVE] should return products milik owner tertentu', async () => {
      // Arrange
      const mockProducts = [
        { productName: 'Product 1', owner: 'seller1' },
        { productName: 'Product 2', owner: 'seller1' }
      ];
      
      mockProductsRepository.findByOwner.mockResolvedValue(mockProducts);

      // Act
      const result = await productsService.getProductsByOwner('seller1');

      // Assert
      expect(result).toEqual(mockProducts);
      expect(mockProductsRepository.findByOwner).toHaveBeenCalledWith('seller1');
    });

    test('[BOUNDARY] should return empty array jika owner tidak punya products', async () => {
      // Arrange
      mockProductsRepository.findByOwner.mockResolvedValue([]);

      // Act
      const result = await productsService.getProductsByOwner('seller2');

      // Assert
      expect(result).toEqual([]);
    });
  });
});
