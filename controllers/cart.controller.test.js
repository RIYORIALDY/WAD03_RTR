const { describe, test, expect, beforeEach } = require('@jest/globals');

/**
 * Unit Test untuk Cart Controller
 */

// Mock service
const mockCartService = {
  getCartByUsername: jest.fn(),
  addItemToCart: jest.fn(),
  removeItemFromCart: jest.fn(),
  clearCart: jest.fn(),
};

jest.mock('../services/cartService', () => mockCartService);

const cartController = require('../controllers/cartController');

describe('Cart Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getCart', () => {
    test('[POSITIVE] should return cart with 200', async () => {
      // Arrange
      req.params.username = 'buyer1';
      const mockCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      mockCartService.getCartByUsername.mockResolvedValue(mockCart);

      // Act
      await cartController.getCart(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cart retrieved successfully',
        data: mockCart
      });
    });

    test('[NEGATIVE] should return 500 on error', async () => {
      // Arrange
      req.params.username = 'buyer1';
      mockCartService.getCartByUsername.mockRejectedValue(new Error('Database error'));

      // Act
      await cartController.getCart(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('addItemToCart', () => {
    test('[POSITIVE] should add item and return 200', async () => {
      // Arrange
      req.params.username = 'buyer1';
      req.body = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: 10000,
        quantity: 1
      };
      const mockCart = {
        username: 'buyer1',
        items: [req.body],
        totalItems: 1,
        totalPrice: 10000
      };
      mockCartService.addItemToCart.mockResolvedValue(mockCart);

      // Act
      await cartController.addItemToCart(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Item added to cart successfully',
        data: mockCart
      });
    });

    test('[NEGATIVE] should return 400 on validation error', async () => {
      // Arrange
      req.params.username = 'buyer1';
      req.body = { productName: '', price: 0, quantity: 0 };
      mockCartService.addItemToCart.mockRejectedValue(new Error('Invalid item data'));

      // Act
      await cartController.addItemToCart(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid item data' });
    });

    test('[NEGATIVE] should return 404 when product not found', async () => {
      // Arrange
      req.params.username = 'buyer1';
      req.body = {
        productName: 'NonExistent',
        price: 1000,
        quantity: 1
      };
      mockCartService.addItemToCart.mockRejectedValue(new Error('Product not found'));

      // Act
      await cartController.addItemToCart(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('removeItemFromCart', () => {
    test('[POSITIVE] should remove item and return 200', async () => {
      // Arrange
      req.params.username = 'buyer1';
      req.params.productName = 'Laptop';
      const mockCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      mockCartService.removeItemFromCart.mockResolvedValue(mockCart);

      // Act
      await cartController.removeItemFromCart(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Item removed from cart successfully',
        data: mockCart
      });
    });

    test('[NEGATIVE] should return 404 when cart not found', async () => {
      // Arrange
      req.params.username = 'nonexistent';
      req.params.productName = 'Laptop';
      mockCartService.removeItemFromCart.mockRejectedValue(new Error('Cart not found'));

      // Act
      await cartController.removeItemFromCart(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Cart not found' });
    });
  });

  describe('clearCart', () => {
    test('[POSITIVE] should clear cart and return 200', async () => {
      // Arrange
      req.params.username = 'buyer1';
      const mockCart = {
        username: 'buyer1',
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      mockCartService.clearCart.mockResolvedValue(mockCart);

      // Act
      await cartController.clearCart(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cart cleared successfully',
        data: mockCart
      });
    });

    test('[NEGATIVE] should return 500 on error', async () => {
      // Arrange
      req.params.username = 'buyer1';
      mockCartService.clearCart.mockRejectedValue(new Error('Database error'));

      // Act
      await cartController.clearCart(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
