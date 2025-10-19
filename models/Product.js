const mongoose = require('mongoose');

// Schema untuk Product
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name wajib diisi'],
      trim: true
    },
    productCategory: {
      type: String,
      required: [true, 'Product category wajib diisi'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price wajib diisi'],
      min: [0, 'Price tidak boleh negatif']
    },
    owner: {
      type: String,
      required: [true, 'Owner wajib diisi'],
      ref: 'User' // Relasi ke User model
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index untuk performa query
productSchema.index({ owner: 1 });
productSchema.index({ productCategory: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
