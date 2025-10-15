const cartRepository = require('../repositories/cartRepository');
const productsRepository = require('../repositories/productsRepository');

class CartService {
  addToCart(username, productName) {
    if (!productName) {
      throw new Error('productName is required');
    }

    const product = productsRepository.findByName(productName);
    if (!product) {
      throw new Error('Product not found');
    }

    let userCart = cartRepository.findByUsername(username);

    if (!userCart) {
      userCart = cartRepository.create(username);
    }

    const existingItem = userCart.items.find(item => item.productName === productName);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      userCart.items.push({
        productName,
        productCategory: product.productCategory,
        price: product.price,
        quantity: 1
      });
    }

    return cartRepository.update(userCart);
  }

  removeFromCart(username, productName) {
    if (!productName) {
      throw new Error('productName is required');
    }

    const userCart = cartRepository.findByUsername(username);

    if (!userCart) {
      throw new Error('Cart not found');
    }

    const itemIndex = userCart.items.findIndex(item => item.productName === productName);

    if (itemIndex === -1) {
      throw new Error('Product not found in cart');
    }

    if (userCart.items[itemIndex].quantity > 1) {
      userCart.items[itemIndex].quantity -= 1;
    } else {
      userCart.items.splice(itemIndex, 1);
    }

    return cartRepository.update(userCart);
  }

  getCart(username) {
    let userCart = cartRepository.findByUsername(username);

    if (!userCart) {
      userCart = {
        username,
        items: []
      };
    }

    return userCart;
  }
}

module.exports = new CartService();
