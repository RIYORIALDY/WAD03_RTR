const productsRepository = require('../repositories/productsRepository');

class ProductsService {
  createProduct(productData) {
    const { productName, productCategory, price, owner } = productData;

    if (!productName || !productCategory || !price || !owner) {
      throw new Error('All fields are required: productName, productCategory, price, owner');
    }

    if (isNaN(price) || price <= 0) {
      throw new Error('Price must be a positive number');
    }

    if (productsRepository.exists(productName)) {
      throw new Error('Product name already exists');
    }

    const newProduct = {
      productName,
      productCategory,
      price: parseFloat(price),
      owner
    };

    return productsRepository.save(newProduct);
  }

  getAllProducts() {
    return productsRepository.findAll();
  }

  getProductByName(productName) {
    const product = productsRepository.findByName(productName);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}

module.exports = new ProductsService();
