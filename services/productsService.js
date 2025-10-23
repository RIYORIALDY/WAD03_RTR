const productsRepository = require('../repositories/productsRepository');
const usersRepository = require('../repositories/usersRepository');

class ProductsService {
  async createProduct(productData) {
    const { productName, productCategory, price, owner: ownerUsername } = productData;

    if (!productName || !productCategory || !ownerUsername) {
      throw new Error('All fields are required: productName, productCategory, price, owner');
    }

    if (price === undefined || price === null || price === '') {
      throw new Error('All fields are required: productName, productCategory, price, owner');
    }

    if (isNaN(price) || price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const existingProduct = await productsRepository.findByName(productName);
    if (existingProduct) {
      throw new Error('Product name already exists');
    }

    const owner = await usersRepository.findByUsername(ownerUsername);
    if (!owner) {
      throw new Error('Owner not found');
    }

    const newProduct = {
      name: productName,
      category: productCategory,
      price: parseFloat(price),
      ownerId: owner.id,
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

  async getProductsByOwner(ownerUsername) {
    const owner = await usersRepository.findByUsername(ownerUsername);
    if (!owner) {
      throw new Error('Owner not found');
    }
    return await productsRepository.findByOwner(owner.id);
  }
}

module.exports = new ProductsService();
