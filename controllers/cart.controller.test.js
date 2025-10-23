const { describe, test, expect, beforeEach } = require('@jest/globals');
const cartController = require('../controllers/cartController');
const cartService = require('../services/cartService');

jest.mock('../services/cartService', () => ({
  getAllCarts: jest.fn(),
  getCartByUsername: jest.fn(),
  addItemToCart: jest.fn(),
  removeItemFromCart: jest.fn(),
  clearCart: jest.fn(),
}));

describe('Cart Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getAllCarts', () => {
    test('[POSITIVE] should return all carts with 200', async () => {
      const mockCarts = [{ username: 'buyer1', items: [] }, { username: 'buyer2', items: [] }];
      cartService.getAllCarts.mockResolvedValue(mockCarts);

      await cartController.getAllCarts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Carts retrieved successfully', data: mockCarts });
    });

    test('[NEGATIVE] should return 500 on error', async () => {
      cartService.getAllCarts.mockRejectedValue(new Error('Database error'));

      await cartController.getAllCarts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getCart', () => {
    test('[POSITIVE] should return cart with 200', async () => {
      req.params.username = 'buyer1';
      const mockCart = { username: 'buyer1', items: [], totalItems: 0, totalPrice: 0 };
      cartService.getCartByUsername.mockResolvedValue(mockCart);

      await cartController.getCart(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart retrieved successfully', data: mockCart });
    });

    test('[NEGATIVE] should return 500 on error', async () => {
        req.params.username = 'buyer1';
        cartService.getCartByUsername.mockRejectedValue(new Error('Database error'));
  
        await cartController.getCart(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
      });
  });

  describe('addItemToCart', () => {
    test('[POSITIVE] should add item and return 200', async () => {
      req.params.username = 'buyer1';
      req.body = { productName: 'Laptop', quantity: 1 };
      const mockCart = { username: 'buyer1', items: [req.body] };
      cartService.addItemToCart.mockResolvedValue(mockCart);

      await cartController.addItemToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item added to cart successfully', data: mockCart });
    });

    test('[NEGATIVE] should return 400 on validation error', async () => {
      req.params.username = 'buyer1';
      req.body = { productName: '' };
      cartService.addItemToCart.mockRejectedValue(new Error('Invalid item data'));

      await cartController.addItemToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid item data' });
    });

    test('[NEGATIVE] should return 404 when product not found', async () => {
        req.params.username = 'buyer1';
        req.body = { productName: 'NonExistent' };
        cartService.addItemToCart.mockRejectedValue(new Error('Product not found'));
  
        await cartController.addItemToCart(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
      });
  });

  describe('removeItemFromCart', () => {
    test('[POSITIVE] should remove item and return 200', async () => {
      req.params.username = 'buyer1';
      req.params.productName = 'Laptop';
      const mockCart = { username: 'buyer1', items: [] };
      cartService.removeItemFromCart.mockResolvedValue(mockCart);

      await cartController.removeItemFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item removed from cart successfully', data: mockCart });
    });

    test('[NEGATIVE] should return 404 when cart not found', async () => {
        req.params.username = 'nonexistent';
        req.params.productName = 'Laptop';
        cartService.removeItemFromCart.mockRejectedValue(new Error('Cart not found'));
  
        await cartController.removeItemFromCart(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Cart not found' });
      });

    test('[NEGATIVE] should return 400 on other errors', async () => {
      req.params.username = 'buyer1';
      req.params.productName = 'Laptop';
      cartService.removeItemFromCart.mockRejectedValue(new Error('Some other error'));

      await cartController.removeItemFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Some other error' });
    });
  });

  describe('clearCart', () => {
    test('[POSITIVE] should clear cart and return 200', async () => {
      req.params.username = 'buyer1';
      const mockCart = { username: 'buyer1', items: [] };
      cartService.clearCart.mockResolvedValue(mockCart);

      await cartController.clearCart(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart cleared successfully', data: mockCart });
    });

    test('[NEGATIVE] should return 500 on error', async () => {
        req.params.username = 'buyer1';
        cartService.clearCart.mockRejectedValue(new Error('Database error'));
  
        await cartController.clearCart(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
      });
  });
});
