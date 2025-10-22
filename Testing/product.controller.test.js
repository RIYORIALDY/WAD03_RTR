const { describe, test, expect, beforeEach } = require('@jest/globals');

/**
 * Unit Test untuk Products Controller
 */

// Mock service
const mockProductsService = {
  createProduct: jest.fn(),
  getAllProducts: jest.fn(),
  getProductByName: jest.fn(),
  getProductsByOwner: jest.fn(),
};

jest.mock('../services/productsService', () => mockProductsService);

const productsController = require('../controllers/productsController');

describe('Products Controller - Unit Tests', () => {
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

  describe('createProduct', () => {
    test('[POSITIVE] should create product and return 201', async () => {
      // Arrange
      req.body = {
        productName: 'Laptop',
        productCategory: 'Electronics',
        price: 10000,
        owner: 'seller1'
      };
      mockProductsService.createProduct.mockResolvedValue(req.body);

      // Act
      await productsController.createProduct(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product created successfully',
        data: req.body
      });
    });

    test('[NEGATIVE] should return 400 on validation error', async () => {
      // Arrange
      req.body = { productName: '' };
      mockProductsService.createProduct.mockRejectedValue(new Error('Validation error'));

      // Act
      await productsController.createProduct(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });
  });

  describe('getAllProducts', () => {
    test('[POSITIVE] should return all products with 200', async () => {
      // Arrange
      const mockProducts = [
        { productName: 'Product 1', price: 1000 },
        { productName: 'Product 2', price: 2000 }
      ];
      mockProductsService.getAllProducts.mockResolvedValue(mockProducts);

      // Act
      await productsController.getAllProducts(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Products retrieved successfully',
        data: mockProducts
      });
    });

    test('[NEGATIVE] should return 500 on error', async () => {
      // Arrange
      mockProductsService.getAllProducts.mockRejectedValue(new Error('Database error'));

      // Act
      await productsController.getAllProducts(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getProductByName', () => {
    test('[POSITIVE] should return product with 200', async () => {
      // Arrange
      req.params.product_name = 'Laptop';
      const mockProduct = { productName: 'Laptop', price: 10000 };
      mockProductsService.getProductByName.mockResolvedValue(mockProduct);

      // Act
      await productsController.getProductByName(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product retrieved successfully',
        data: mockProduct
      });
    });

    test('[NEGATIVE] should return 404 when product not found', async () => {
      // Arrange
      req.params.product_name = 'NonExistent';
      mockProductsService.getProductByName.mockRejectedValue(new Error('Product not found'));

      // Act
      await productsController.getProductByName(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('getProductsByOwner', () => {
    test('[POSITIVE] should return products by owner with 200', async () => {
      // Arrange
      req.params.owner = 'seller1';
      const mockProducts = [
        { productName: 'Product 1', owner: 'seller1' },
        { productName: 'Product 2', owner: 'seller1' }
      ];
      mockProductsService.getProductsByOwner.mockResolvedValue(mockProducts);

      // Act
      await productsController.getProductsByOwner(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Products retrieved successfully',
        data: mockProducts
      });
    });

    test('[BOUNDARY] should return empty array if owner has no products', async () => {
      // Arrange
      req.params.owner = 'seller999';
      mockProductsService.getProductsByOwner.mockResolvedValue([]);

      // Act
      await productsController.getProductsByOwner(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Products retrieved successfully',
        data: []
      });
    });
  });
});
