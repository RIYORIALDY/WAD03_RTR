const { describe, test, expect, beforeEach } = require('@jest/globals');
const productsController = require('../controllers/productsController');
const productsService = require('../services/productsService');

jest.mock('../services/productsService', () => ({
  createProduct: jest.fn(),
  getAllProducts: jest.fn(),
  getProductByName: jest.fn(),
  getProductsByOwner: jest.fn(),
}));

describe('Products Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createProduct', () => {
    test('[POSITIVE] should create product and return 201', async () => {
      req.body = { productName: 'Laptop', productCategory: 'Electronics', price: 10000, owner: 'seller1' };
      productsService.createProduct.mockResolvedValue(req.body);

      await productsController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product created successfully', data: req.body });
    });

    test('[NEGATIVE] should return 400 on validation error', async () => {
      req.body = { productName: '' };
      productsService.createProduct.mockRejectedValue(new Error('Validation error'));

      await productsController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });
  });

  describe('getAllProducts', () => {
    test('[POSITIVE] should return all products with 200', async () => {
      const mockProducts = [{ productName: 'Product 1', price: 1000 }, { productName: 'Product 2', price: 2000 }];
      productsService.getAllProducts.mockResolvedValue(mockProducts);

      await productsController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Products retrieved successfully', data: mockProducts });
    });

    test('[NEGATIVE] should return 500 on error', async () => {
        productsService.getAllProducts.mockRejectedValue(new Error('Database error'));
  
        await productsController.getAllProducts(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
      });
  });

  describe('getProductByName', () => {
    test('[POSITIVE] should return product with 200', async () => {
      req.params.product_name = 'Laptop';
      const mockProduct = { productName: 'Laptop', price: 10000 };
      productsService.getProductByName.mockResolvedValue(mockProduct);

      await productsController.getProductByName(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product retrieved successfully', data: mockProduct });
    });

    test('[NEGATIVE] should return 404 when product not found', async () => {
      req.params.product_name = 'NonExistent';
      productsService.getProductByName.mockRejectedValue(new Error('Product not found'));

      await productsController.getProductByName(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('getProductsByOwner', () => {
    test('[POSITIVE] should return products by owner with 200', async () => {
      req.params.owner = 'seller1';
      const mockProducts = [{ productName: 'Product 1', owner: 'seller1' }, { productName: 'Product 2', owner: 'seller1' }];
      productsService.getProductsByOwner.mockResolvedValue(mockProducts);

      await productsController.getProductsByOwner(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Products retrieved successfully', data: mockProducts });
    });

    test('[BOUNDARY] should return empty array if owner has no products', async () => {
        req.params.owner = 'seller999';
        productsService.getProductsByOwner.mockResolvedValue([]);
  
        await productsController.getProductsByOwner(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Products retrieved successfully',
          data: []
        });
      });
  });
});
