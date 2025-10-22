const productsService = require('../services/productsService');

const createProduct = async (req, res) => {
  try {
    const newProduct = await productsService.createProduct(req.body);
    res.status(201).json({ 
      message: 'Product created successfully', 
      data: newProduct 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productsService.getAllProducts();
    res.status(200).json({ 
      message: 'Products retrieved successfully', 
      data: products 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductByName = async (req, res) => {
  try {
    const { product_name } = req.params;
    const product = await productsService.getProductByName(product_name);
    res.status(200).json({ 
      message: 'Product retrieved successfully', 
      data: product 
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getProductsByOwner = async (req, res) => {
  try {
    const { owner } = req.params;
    const products = await productsService.getProductsByOwner(owner);
    res.status(200).json({ 
      message: 'Products retrieved successfully', 
      data: products 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductByName,
  getProductsByOwner
};
