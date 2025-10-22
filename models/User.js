const mongoose = require('mongoose');

// Schema untuk User
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username wajib diisi'],
      unique: true,
      trim: true,
      minlength: [3, 'Username minimal 3 karakter']
    },
    name: {
      type: String,
      required: [true, 'Name wajib diisi'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid']
    },
    role: {
      type: String,
      required: [true, 'Role wajib diisi'],
      enum: {
        values: ['buyer', 'seller'],
        message: 'Role harus buyer atau seller'
      }
    }
  },
  {
    timestamps: true, // Otomatis tambah createdAt dan updatedAt
    versionKey: false
  }
);

// Index untuk performa query (username sudah unique, tidak perlu index lagi)
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
