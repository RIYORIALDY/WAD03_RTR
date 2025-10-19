# 🔧 Fix Guide untuk Test Failures

## ❌ Problem
Tests gagal di local dengan errors:
1. `"Price must be a positive number"` vs `"Price must be greater than 0"` 
2. `productsService.getProductsByOwner is not a function`

## ✅ Solution

### Option 1: Replace File Completely (RECOMMENDED)

1. **Buka file**: `services/productsService.js`

2. **Replace seluruh content dengan code berikut:**

```javascript
const productsRepository = require('../repositories/productsRepository');

class ProductsService {
  createProduct(productData) {
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

  getProductsByOwner(owner) {
    return productsRepository.findByOwner(owner);
  }
}

module.exports = new ProductsService();
```

3. **Save file**

4. **Run tests again:**
```bash
npm test
```

### Option 2: Manual Fixes

Jika prefer edit manual, lakukan perubahan berikut di `services/productsService.js`:

#### Fix 1: Change Error Message (Line 12)
**BEFORE:**
```javascript
throw new Error('Price must be a positive number');
```

**AFTER:**
```javascript
throw new Error('Price must be greater than 0');
```

#### Fix 2: Fix Price Validation (Lines 7-14)
**BEFORE:**
```javascript
if (!productName || !productCategory || !price || !owner) {
  throw new Error('All fields are required: productName, productCategory, price, owner');
}

if (isNaN(price) || price <= 0) {
  throw new Error('Price must be greater than 0');
}
```

**AFTER:**
```javascript
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
```

#### Fix 3: Add Missing Method (After getProductByName method)
**ADD THIS METHOD:**
```javascript
getProductsByOwner(owner) {
  return productsRepository.findByOwner(owner);
}
```

### Verify Fix

After applying fixes, run:
```bash
npm test
```

Expected output:
```
PASS  Testing/usersService.test.js
PASS  Testing/productsService.test.js
PASS  Testing/cartService.test.js

Test Suites: 3 passed, 3 total
Tests:       27 passed, 27 total
```

## 📋 Complete Fixed File

File lengkap yang sudah di-fix tersedia di: `FIX_productsService.js`

Copy content dari file tersebut dan paste ke `services/productsService.js`

## 🐛 Jika Masih Error

1. **Clear Jest Cache:**
```bash
npx jest --clearCache
npm test
```

2. **Restart Terminal/IDE**

3. **Reinstall node_modules:**
```bash
rm -rf node_modules
npm install
npm test
```

4. **Check file path:** Pastikan file ada di `services/productsService.js` bukan di folder lain

---

**Setelah fix, semua 27 tests harus PASS! ✅**
