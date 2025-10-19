# Testing Documentation - WAD03_RTR ECommerce App

## 📋 Overview
Folder ini berisi unit tests untuk ECommerce Web Application menggunakan **Jest.js** sebagai testing framework.

## 🎯 Testing Objectives
1. **Detect Regressions Early** - Mendeteksi bug sebelum masuk production
2. **Verify Business Logic** - Memastikan semua logic berjalan sesuai requirement
3. **Enable Safe Refactoring** - Memberikan safety net untuk refactoring code

## 📁 File Structure

```
Testing/
├── README.md                    # Dokumentasi ini
├── setup.js                     # Setup configuration untuk Jest
├── usersService.test.js         # Unit test untuk Users Service
├── productsService.test.js      # Unit test untuk Products Service
└── cartService.test.js          # Unit test untuk Cart Service
```

## 🧪 Test Coverage

### 1. Users Service Tests (`usersService.test.js`)
- ✅ Create user dengan data valid
- ✅ Validasi field required (username, name, email, role)
- ✅ Validasi role (harus buyer atau seller)
- ✅ Cek username duplicate
- ✅ Get all users
- ✅ Get user by username
- ✅ Handle user not found

### 2. Products Service Tests (`productsService.test.js`)
- ✅ Create product dengan data valid
- ✅ Validasi field required
- ✅ Validasi price (tidak boleh negatif atau 0)
- ✅ Test boundary conditions (large price values)
- ✅ Get all products
- ✅ Get products by owner

### 3. Cart Service Tests (`cartService.test.js`)
- ✅ Get cart by username
- ✅ Add item to cart
- ✅ Validasi item data
- ✅ Validasi quantity (harus positif)
- ✅ Test boundary conditions (large quantity)
- ✅ Remove item from cart
- ✅ Clear cart

## 🚀 Running Tests

### Run All Tests
```bash
npm test
# atau
yarn test
```

### Run Tests with Watch Mode
```bash
npm run test:watch
# atau
yarn test:watch
```

### Run Tests with Verbose Output
```bash
npm run test:verbose
# atau
yarn test:verbose
```

### Run Tests with Coverage
```bash
npm test -- --coverage
# atau
yarn test --coverage
```

## 📊 Testing Pattern: AAA

Semua tests mengikuti pattern **AAA (Arrange, Act, Assert)**:

```javascript
test('should do something', () => {
  // Arrange - Setup data dan mock
  const input = { /* ... */ };
  mockRepository.someMethod.mockReturnValue(expectedValue);

  // Act - Jalankan function yang di-test
  const result = service.doSomething(input);

  // Assert - Verify hasil
  expect(result).toEqual(expectedValue);
});
```

## ✅ Best Practices

1. **Isolation** - Setiap test independent, tidak depend pada test lain
2. **Deterministic** - Selalu menghasilkan hasil yang sama
3. **Mock External Dependencies** - Database, network, filesystem di-mock
4. **Full Coverage** - Test success path, failure path, validation errors, boundary conditions
5. **Clear Names** - Nama test menjelaskan behavior yang di-test

## 🔍 Test Cases

### Positive Cases
Test dengan input valid untuk memastikan function berjalan dengan benar.

### Negative Cases
Test dengan input invalid untuk memastikan error handling berjalan dengan benar.

### Boundary Cases
Test dengan edge cases seperti:
- Empty values
- Zero values
- Very large values
- Null/undefined values

## 📝 Mocking Strategy

Tests menggunakan **mocking** untuk isolasi:
- Repository methods di-mock agar tidak hit database
- External dependencies di-mock
- Database connection di-mock

```javascript
const mockRepository = {
  findAll: jest.fn(),
  save: jest.fn(),
  // ... other methods
};

jest.mock('../repositories/someRepository', () => mockRepository);
```

## 🎓 What is Unit Testing?

**Unit Testing** adalah metode testing yang:
- Test individual functions/methods secara terisolasi
- Tidak test external frameworks atau database
- Focus pada business logic
- Fast execution
- Easy to maintain

## 🔗 Integration vs Unit Testing

| Aspect | Unit Test | Integration Test |
|--------|-----------|------------------|
| Scope | Single function | Multiple modules |
| Dependencies | Mocked | Real |
| Speed | Fast | Slower |
| Complexity | Simple | Complex |
| Purpose | Logic correctness | Module interaction |

## 📚 Tools Used

- **Jest.js** - Testing framework
- **@jest/globals** - Jest utilities
- **Supertest** - HTTP testing (untuk integration test)

## 💡 Tips

1. Run tests sebelum commit code
2. Maintain test coverage > 80%
3. Update tests saat ada perubahan business logic
4. Write tests untuk bug yang ditemukan (regression tests)
5. Keep tests simple dan readable

## 🐛 Debugging Tests

Jika test gagal:
1. Baca error message dengan teliti
2. Check apakah mock di-setup dengan benar
3. Verify expected vs actual values
4. Use `console.log()` untuk debug (tapi remove sebelum commit)
5. Run single test untuk isolasi: `jest -t "test name"`

## 📞 Contact

Untuk pertanyaan atau issues terkait testing, hubungi tim WAD03_RTR.

---
**Happy Testing! 🎉**
