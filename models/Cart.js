const mongoose = require('mongoose');

// Schema untuk Cart Item
const cartItemSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true
    },
    productCategory: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity minimal 1'],
      default: 1
    }
  },
  { _id: false }
);

// Schema untuk Cart
const cartSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username wajib diisi'],
      unique: true,
      ref: 'User' // Relasi ke User model
    },
    items: {
      type: [cartItemSchema],
      default: []
    },
    totalItems: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Method untuk calculate total
cartSchema.methods.calculateTotals = function() {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Index untuk performa query
cartSchema.index({ username: 1 });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
