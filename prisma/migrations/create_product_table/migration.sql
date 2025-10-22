-- Create Product Table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productName TEXT NOT NULL,
  productCategory TEXT NOT NULL,
  price INTEGER NOT NULL,
  owner TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index on owner for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_owner ON products(owner);
