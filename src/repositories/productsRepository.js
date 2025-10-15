const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../../data/products.json');

class ProductsRepository {
  findAll() {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  }

  findByName(productName) {
    const products = this.findAll();
    return products.find(p => p.productName === productName);
  }

  save(product) {
    const products = this.findAll();
    products.push(product);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    return product;
  }

  exists(productName) {
    return this.findByName(productName) !== undefined;
  }
}

module.exports = new ProductsRepository();
