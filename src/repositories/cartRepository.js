const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../../data/carts.json');

class CartRepository {
  findAll() {
    const data = fs.readFileSync(cartsFilePath, 'utf8');
    return JSON.parse(data);
  }

  findByUsername(username) {
    const carts = this.findAll();
    return carts.find(c => c.username === username);
  }

  saveAll(carts) {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
  }

  create(username) {
    const carts = this.findAll();
    const newCart = {
      username,
      items: []
    };
    carts.push(newCart);
    this.saveAll(carts);
    return newCart;
  }

  update(cart) {
    const carts = this.findAll();
    const index = carts.findIndex(c => c.username === cart.username);
    if (index !== -1) {
      carts[index] = cart;
      this.saveAll(carts);
    }
    return cart;
  }
}

module.exports = new CartRepository();
