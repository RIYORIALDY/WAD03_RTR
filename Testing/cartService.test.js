const { describe, test, expect, beforeEach } = require('@jest/globals');

/**
 * Unit Test untuk Cart Service
 * Testing Pattern: AAA (Arrange, Act, Assert)
 */

// Mock repository
const mockCartRepository = {
  findByUsername: jest.fn(),
  save: jest.fn(),
  addItem: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
  exists: jest.fn(),
};

jest.mock('../repositories/cartRepository', () => mockCartRepository);

const cartService = require('../services/cartService');

describe('Cart Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCartByUsername', () => {
    test('[POSITIVE] should return cart untuk user yang valid', () => {
      // Arrange
      const mockCart = {
        username: 'buyer1',
        items: [
          { productName: 'Laptop', price: 10000000, quantity: 1 }
        ],
        totalItems: 1,
        totalPrice: 10000000
      };
      
      mockCartRepository.findByUsername.mockReturnValue(mockCart);

      // Act
      const result = cartService.getCartByUsername('buyer1');

      // Assert
      expect(result).toEqual(mockCart);
      expect(mockCartRepository.findByUsername).toHaveBeenCalledWith('buyer1');
    });

    test('[NEGATIVE] should throw error jika cart tidak ditemukan', () => {
      // Arrange
      mockCartRepository.findByUsername.mockReturnValue(null);

      // Act & Assert
      expect(() => {
        cartService.getCartByUsername('nonexistent');
      }).toThrow('Cart not found');
    });
  });

  describe('addItemToCart', () => {
    test('[POSITIVE] should add item ke cart successfully', () => {
      // Arrange
      const item = {
        productName: 'Laptop Gaming',
        productCategory: 'Electronics',
        price: 15000000,
        quantity: 1
      };
      
      const updatedCart = {
        username: 'buyer1',
        items: [item],
        totalItems: 1,
        totalPrice: 15000000
      };
      
      mockCartRepository.addItem.mockReturnValue(updatedCart);

      // Act
      const result = cartService.addItemToCart('buyer1', item);

      // Assert
      expect(result).toEqual(updatedCart);
      expect(mockCartRepository.addItem).toHaveBeenCalledWith('buyer1', item);
    });

    test('[NEGATIVE] should throw error jika item tidak valid', () => {
      // Arrange
      const invalidItem = {
        productName: '',
        price: 10000,
        quantity: 1
      };

      // Act & Assert
      expect(() => {
        cartService.addItemToCart('buyer1', invalidItem);
      }).toThrow('Invalid item data');
    });

    test('[NEGATIVE] should throw error jika quantity negatif', () => {
      // Arrange
      const invalidItem = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: 10000,
        quantity: -1
      };

      // Act & Assert
      expect(() => {
        cartService.addItemToCart('buyer1', invalidItem);
      }).toThrow('Quantity must be greater than 0');
    });

    test('[BOUNDARY] should accept large quantity', () => {
      // Arrange
      const item = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: 10000,
        quantity: 1000
      };
      
      const updatedCart = {
        username: 'buyer1',
        items: [item],
        totalItems: 1000,
        totalPrice: 10000000
      };
      
      mockCartRepository.addItem.mockReturnValue(updatedCart);

      // Act
      const result = cartService.addItemToCart('buyer1', item);

      // Assert
      expect(result.totalItems).toBe(1000);
    });
  });

  describe('removeItemFromCart', () => {
    test('[POSITIVE] should remove item dari cart successfully', () => {
      // Arrange
      const updatedCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      
      mockCartRepository.removeItem.mockReturnValue(updatedCart);

      // Act
      const result = cartService.removeItemFromCart('buyer1', 'Laptop');

      // Assert
      expect(result).toEqual(updatedCart);
      expect(mockCartRepository.removeItem).toHaveBeenCalledWith('buyer1', 'Laptop');
    });

    test('[NEGATIVE] should throw error jika productName kosong', () => {
      // Act & Assert
      expect(() => {
        cartService.removeItemFromCart('buyer1', '');
      }).toThrow('Product name is required');
    });
  });

  describe('clearCart', () => {
    test('[POSITIVE] should clear cart successfully', () => {
      // Arrange
      const emptyCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      
      mockCartRepository.clearCart.mockReturnValue(emptyCart);

      // Act
      const result = cartService.clearCart('buyer1');

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.totalItems).toBe(0);
      expect(mockCartRepository.clearCart).toHaveBeenCalledWith('buyer1');
    });
  });
});
