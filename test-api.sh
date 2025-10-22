#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}   ECommerce API Testing${NC}"
echo -e "${BLUE}================================${NC}\n"

# Test 1: Root endpoint
echo -e "${YELLOW}1. Testing root endpoint...${NC}"
curl -s $BASE_URL | jq .
echo ""

# Test 2: Get all users
echo -e "${YELLOW}2. Getting all users...${NC}"
curl -s $BASE_URL/users | jq '.data | length as $count | "Total users: \($count)"'
echo ""

# Test 3: Get specific user
echo -e "${YELLOW}3. Getting specific user (riyo_seller)...${NC}"
curl -s $BASE_URL/users/riyo_seller | jq '.data | {username, name, role}'
echo ""

# Test 4: Get all products
echo -e "${YELLOW}4. Getting all products...${NC}"
curl -s $BASE_URL/products | jq '.data | length as $count | "Total products: \($count)"'
echo ""

# Test 5: Get products by owner
echo -e "${YELLOW}5. Getting products by owner (riyo_seller)...${NC}"
curl -s $BASE_URL/products/owner/riyo_seller | jq '.data | map(.productName)'
echo ""

# Test 6: Get cart
echo -e "${YELLOW}6. Getting cart (rayen_buyer)...${NC}"
curl -s -H "x-username: rayen_buyer" $BASE_URL/carts/rayen_buyer | jq '.data | {username, totalItems, totalPrice}'
echo ""

# Test 7: Create new product (as seller)
echo -e "${YELLOW}7. Creating new product (as seller)...${NC}"
TIMESTAMP=$(date +%s)
curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -H "x-username: riyo_seller" \
  -d "{
    \"productName\": \"Test Product $TIMESTAMP\",
    \"productCategory\": \"Test\",
    \"price\": 100000,
    \"owner\": \"riyo_seller\"
  }" | jq '.message'
echo ""

# Test 8: Try to create product as buyer (should fail)
echo -e "${YELLOW}8. Trying to create product as buyer (should fail)...${NC}"
curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -H "x-username: rayen_buyer" \
  -d '{
    "productName": "Should Fail",
    "productCategory": "Test",
    "price": 100000,
    "owner": "rayen_buyer"
  }' | jq '.error'
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}   Testing Complete!${NC}"
echo -e "${GREEN}================================${NC}"
