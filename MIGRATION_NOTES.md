# 📝 Migration Notes - File to Database

## Tanggal: 22 Oktober 2025

### ✨ Perubahan yang Dilakukan

Aplikasi telah berhasil dimigrasikan dari **file-based storage (JSON)** ke **MongoDB database**.

---

## 🔄 Perubahan Detail

### 1. **Repositories** 
   - ✅ `usersRepository.js` - Sekarang menggunakan **User model** (Mongoose)
   - ✅ `productsRepository.js` - Sekarang menggunakan **Product model** (Mongoose)
   - ✅ `cartRepository.js` - Sekarang menggunakan **Cart model** (Mongoose)
   
   **Sebelumnya:** Menggunakan `fs.readFileSync()` dan `fs.writeFileSync()`  
   **Sekarang:** Menggunakan Mongoose methods (`find()`, `findOne()`, `save()`, dll)

### 2. **Services**
   - ✅ Semua service methods sekarang **async/await**
   - ✅ `usersService.js` - Updated untuk async
   - ✅ `productsService.js` - Updated untuk async
   - ✅ `cartService.js` - Complete rewrite dengan async methods

### 3. **Controllers**
   - ✅ Semua controller methods sekarang **async/await**
   - ✅ `usersController.js` - Updated
   - ✅ `productsController.js` - Updated + added `getProductsByOwner`
   - ✅ `cartController.js` - Complete rewrite

### 4. **Middleware**
   - ✅ `buyerOnly.js` - Sekarang query database untuk validasi user
   - ✅ `sellerOnly.js` - Sekarang query database untuk validasi user

### 5. **Routes**
   - ✅ `cartRoute.js` - Updated endpoints untuk RESTful API:
     - `GET /carts/:username` - Get cart
     - `POST /carts/:username/items` - Add item
     - `DELETE /carts/:username/items/:productName` - Remove item
     - `DELETE /carts/:username` - Clear cart
   - ✅ `productsRoute.js` - Added `GET /products/owner/:owner`

### 6. **Database Configuration**
   - ✅ `database.js` - Removed deprecated options
   - ✅ `User.js` model - Removed duplicate index
   - ✅ `Cart.js` model - Removed duplicate index

---

## 🚀 Cara Menjalankan

### 1. Pastikan MongoDB Running
```bash
sudo systemctl status mongod
# atau
sudo systemctl start mongod
```

### 2. Install Dependencies
```bash
cd /app
npm install
```

### 3. Seed Database (Hanya Pertama Kali atau Reset Data)
```bash
npm run seed
```

### 4. Start Server
```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start
```

---

## 📊 Data Migration

Data dari file JSON telah berhasil dimigrasikan ke MongoDB:
- ✅ **3 Users** dari `data/users.json`
- ✅ **1 Product** dari `data/products.json`
- ✅ **2 Carts** dari `data/carts.json`

Database MongoDB: `mongodb://localhost:27017/ecommerce_wad03`

---

## ✅ Testing

Semua API endpoints telah ditest dan berfungsi dengan baik:
- ✅ Users API (create, get all, get by username)
- ✅ Products API (create, get all, get by name, get by owner)
- ✅ Carts API (get, add item, remove item, clear)
- ✅ Role-based middleware (buyer only, seller only)

### Test Commands:
```bash
# Get all users
curl http://localhost:3000/users

# Get all products
curl http://localhost:3000/products

# Get cart (as buyer)
curl -H "x-username: rayen_buyer" http://localhost:3000/carts/rayen_buyer

# Create product (as seller)
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "x-username: riyo_seller" \
  -d '{
    "productName": "Keyboard Gaming",
    "productCategory": "Electronics",
    "price": 750000,
    "owner": "riyo_seller"
  }'

# Add item to cart (as buyer)
curl -X POST http://localhost:3000/carts/test_buyer/items \
  -H "Content-Type: application/json" \
  -H "x-username: test_buyer" \
  -d '{
    "productName": "Mouse Gaming",
    "productCategory": "Electronics",
    "price": 500000,
    "quantity": 2
  }'
```

---

## 🎯 Keuntungan Migrasi

1. **✅ Data Persistence** - Data tersimpan di database, tidak hilang saat server restart
2. **✅ Better Performance** - MongoDB indexing untuk query lebih cepat
3. **✅ Scalability** - Siap untuk aplikasi yang lebih besar
4. **✅ Data Validation** - Mongoose schema validation otomatis
5. **✅ Relationships** - Bisa membuat relasi antar collections
6. **✅ Concurrent Access** - Multiple users bisa akses bersamaan tanpa conflict
7. **✅ ACID Transactions** - Data integrity terjamin

---

## 🔒 Notes Penting

- ⚠️ File JSON di folder `data/` masih ada dan bisa digunakan untuk re-seeding
- ⚠️ MongoDB harus running sebelum start aplikasi
- ⚠️ Connection string MongoDB bisa diubah di `database.js` atau via environment variable `MONGODB_URI`

---

## 📞 Support

Jika ada masalah atau pertanyaan, hubungi team WAD03_RTR.

**Dibuat dengan ❤️ oleh E1 Agent**
