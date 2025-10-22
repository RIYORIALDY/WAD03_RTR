const { describe, test, expect, beforeEach } = require('@jest/globals');

/**
 * Unit Test untuk Cart Service
 * Testing Pattern: AAA (Arrange, Act, Assert)
 */

// Mock repository
const mockCartRepository = {
  findByUsername: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../repositories/cartRepository', () => mockCartRepository);

const cartService = require('../services/cartService');

describe('Cart Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCartByUsername', () => {
    test('[POSITIVE] should return cart untuk user yang valid', async () => {
      // Arrange
      const mockCart = {
        username: 'buyer1',
        items: [
          { productName: 'Laptop', price: 10000000, quantity: 1 }
        ],
        totalItems: 1,
        totalPrice: 10000000
      };
      
      mockCartRepository.findByUsername.mockResolvedValue(mockCart);

      // Act
      const result = await cartService.getCartByUsername('buyer1');

      // Assert
      expect(result).toEqual(mockCart);
      expect(mockCartRepository.findByUsername).toHaveBeenCalledWith('buyer1');
    });

    test('[POSITIVE] should create cart if not exists', async () => {
      // Arrange
      const newCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      
      mockCartRepository.findByUsername.mockResolvedValue(null);
      mockCartRepository.create.mockResolvedValue(newCart);

      // Act
      const result = await cartService.getCartByUsername('buyer1');

      // Assert
      expect(result).toEqual(newCart);
      expect(mockCartRepository.create).toHaveBeenCalledWith('buyer1');
    });
  });

  describe('addItemToCart', () => {
    test('[POSITIVE] should add item ke cart successfully', async () => {
      // Arrange
      const item = {
        productName: 'Laptop Gaming',
        productCategory: 'Electronics',
        price: 15000000,
        quantity: 1
      };
      
      const existingCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      
      const updatedCart = {
        username: 'buyer1',
        items: [item],
        totalItems: 1,
        totalPrice: 15000000
      };
      
      mockCartRepository.findByUsername.mockResolvedValue(existingCart);
      mockCartRepository.update.mockResolvedValue(updatedCart);

      // Act
      const result = await cartService.addItemToCart('buyer1', item);

      // Assert
      expect(result).toEqual(updatedCart);
      expect(mockCartRepository.update).toHaveBeenCalled();
    });

    test('[NEGATIVE] should throw error jika item tidak valid', async () => {
      // Arrange
      const invalidItem = {
        productName: '',
        price: 10000,
        quantity: 1
      };

      // Act & Assert
      await expect(async () => {
        await cartService.addItemToCart('buyer1', invalidItem);
      }).rejects.toThrow('Invalid item data');
    });

    test('[NEGATIVE] should throw error jika quantity negatif', async () => {
      // Arrange
      const invalidItem = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: 10000,
        quantity: -1
      };

      // Act & Assert
      await expect(async () => {
        await cartService.addItemToCart('buyer1', invalidItem);
      }).rejects.toThrow('Quantity must be greater than 0');
    });

    test('[BOUNDARY] should accept large quantity', async () => {
      // Arrange
      const item = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: 10000,
        quantity: 1000
      };
      
      const existingCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      
      const updatedCart = {
        username: 'buyer1',
        items: [item],
        totalItems: 1000,
        totalPrice: 10000000
      };
      
      mockCartRepository.findByUsername.mockResolvedValue(existingCart);
      mockCartRepository.update.mockResolvedValue(updatedCart);

      // Act
      const result = await cartService.addItemToCart('buyer1', item);

      // Assert
      expect(result.totalItems).toBe(1000);
    });
  });

  describe('removeItemFromCart', () => {
    test('[POSITIVE] should remove item dari cart successfully', async () => {
      // Arrange
      const existingCart = {
        username: 'buyer1',
        items: [
          { productName: 'Laptop', price: 10000, quantity: 1 }
        ],
        totalItems: 1,
        totalPrice: 10000
      };
      
      const updatedCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      
      mockCartRepository.findByUsername.mockResolvedValue(existingCart);
      mockCartRepository.update.mockResolvedValue(updatedCart);

      // Act
      const result = await cartService.removeItemFromCart('buyer1', 'Laptop');

      // Assert
      expect(result).toEqual(updatedCart);
      expect(mockCartRepository.update).toHaveBeenCalled();
    });

    test('[NEGATIVE] should throw error jika productName kosong', async () => {
      // Act & Assert
      await expect(async () => {
        await cartService.removeItemFromCart('buyer1', '');
      }).rejects.toThrow('Product name is required');
    });
  });

  describe('clearCart', () => {
    test('[POSITIVE] should clear cart successfully', async () => {
      // Arrange
      const existingCart = {
        username: 'buyer1',
        items: [
          { productName: 'Laptop', price: 10000, quantity: 1 }
        ],
        totalItems: 1,
        totalPrice: 10000
      };
      
      const emptyCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      
      mockCartRepository.findByUsername.mockResolvedValue(existingCart);
      mockCartRepository.update.mockResolvedValue(emptyCart);

      // Act
      const result = await cartService.clearCart('buyer1');

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.totalItems).toBe(0);
      expect(mockCartRepository.update).toHaveBeenCalled();
    });
  });
});
