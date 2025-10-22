const productsRepository = require('../repositories/productsRepository');

class ProductsService {
  async createProduct(productData) {
    const { productName, productCategory, price, owner } = productData;

    if (!productName || !productCategory || !owner) {
      throw new Error('All fields are required: productName, productCategory, price, owner');
    }

    // Check if price exists and is valid
    if (price === undefined || price === null || price === '') {
      throw new Error('All fields are required: productName, productCategory, price, owner');
    }

    if (isNaN(price) || price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const exists = await productsRepository.exists(productName);
    if (exists) {
      throw new Error('Product name already exists');
    }

    const newProduct = {
      productName,
      productCategory,
      price: parseFloat(price),
      owner
    };

    return await productsRepository.save(newProduct);
  }

  async getAllProducts() {
    return await productsRepository.findAll();
  }

  async getProductByName(productName) {
    const product = await productsRepository.findByName(productName);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async getProductsByOwner(owner) {
    return await productsRepository.findByOwner(owner);
  }
}

module.exports = new ProductsService();
