# 🚀 Quick Start Guide

## Aplikasi ECommerce - MongoDB Version

---

## ✅ Prerequisites

- Node.js installed
- MongoDB installed dan running
- npm atau yarn

---

## 📦 Installation

### 1. Install Dependencies
```bash
cd /app
npm install
```

### 2. Start MongoDB (jika belum running)
```bash
sudo systemctl start mongod
```

### 3. Seed Database (First time only)
```bash
npm run seed
```

Output yang diharapkan:
```
✅ Connected to MongoDB
✅ 3 users seeded
✅ 1 products seeded
✅ 2 carts seeded
```

---

## 🎯 Running the Application

### Development Mode (dengan auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server akan berjalan di: `http://localhost:3000`

---

## 🧪 Testing API

### Option 1: Menggunakan Test Script
```bash
./test-api.sh
```

### Option 2: Manual Testing dengan curl

**1. Get all users:**
```bash
curl http://localhost:3000/users
```

**2. Get all products:**
```bash
curl http://localhost:3000/products
```

**3. Get products by owner:**
```bash
curl http://localhost:3000/products/owner/riyo_seller
```

**4. Get cart (as buyer):**
```bash
curl -H "x-username: rayen_buyer" http://localhost:3000/carts/rayen_buyer
```

**5. Create new product (as seller):**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "x-username: riyo_seller" \
  -d '{
    "productName": "Keyboard Mechanical",
    "productCategory": "Electronics",
    "price": 850000,
    "owner": "riyo_seller"
  }'
```

**6. Add item to cart (as buyer):**
```bash
curl -X POST http://localhost:3000/carts/rayen_buyer/items \
  -H "Content-Type: application/json" \
  -H "x-username: rayen_buyer" \
  -d '{
    "productName": "Laptop Gaming",
    "productCategory": "Electronics",
    "price": 15000000,
    "quantity": 1
  }'
```

**7. Remove item from cart:**
```bash
curl -X DELETE http://localhost:3000/carts/rayen_buyer/items/Laptop%20Gaming \
  -H "x-username: rayen_buyer"
```

**8. Clear cart:**
```bash
curl -X DELETE http://localhost:3000/carts/rayen_buyer \
  -H "x-username: rayen_buyer"
```

---

## 👥 Default Users

Setelah seeding, tersedia 3 users:

1. **Seller:**
   - Username: `riyo_seller`
   - Name: RIYO RIALDY URDA
   - Role: seller

2. **Buyers:**
   - Username: `rayen_buyer`
   - Name: RAYEN AURILIANSYAH
   - Role: buyer
   
   - Username: `taqi_buyer`
   - Name: MUHAMMAD TAQI DZAKWAN
   - Role: buyer

---

## 📋 API Endpoints

### Users API
- `GET /users` - Get all users
- `GET /users/:username` - Get user by username
- `POST /users` - Create new user

### Products API
- `GET /products` - Get all products
- `GET /products/owner/:owner` - Get products by owner
- `GET /products/:product_name` - Get product by name
- `POST /products` - Create new product (seller only)

### Cart API
- `GET /carts/:username` - Get cart by username (buyer only)
- `POST /carts/:username/items` - Add item to cart (buyer only)
- `DELETE /carts/:username/items/:productName` - Remove item from cart (buyer only)
- `DELETE /carts/:username` - Clear cart (buyer only)

---

## 🔐 Authentication

API menggunakan simple header-based authentication:
- Header: `x-username: <username>`
- Middleware akan check role user dari database

---

## 🧪 Running Unit Tests

```bash
npm test
```

Untuk watch mode:
```bash
npm run test:watch
```

---

## 🗃️ Database

- **Database Name:** `ecommerce_wad03`
- **Connection:** `mongodb://localhost:27017/ecommerce_wad03`
- **Collections:**
  - `users` - User data
  - `products` - Product data
  - `carts` - Shopping cart data

### Reset Database
```bash
npm run seed
```
⚠️ **Warning:** Ini akan menghapus semua data yang ada dan re-seed dengan data default!

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- Full README: [README.md](./README.md)
- Migration Notes: [MIGRATION_NOTES.md](./MIGRATION_NOTES.md)
- Testing Guide: [Testing/README.md](./Testing/README.md)

---

## 💡 Tips

1. **Gunakan Postman atau Thunder Client** untuk testing API yang lebih mudah
2. **Check logs** jika ada error: `console.log` akan muncul di terminal
3. **MongoDB Compass** bagus untuk visualisasi database
4. **Seeding ulang** jika data korup: `npm run seed`

---

## 🤝 Team WAD03_RTR

- RIYO RIALDY URDA
- RAYEN AURILIANSYAH
- MUHAMMAD TAQI DZAKWAN

---

**Happy Coding! 🚀**
