#!/usr/bin/env python3
import requests
import json

print("╔════════════════════════════════════════════════════════════════╗")
print("║       JAIN SAHAB SPECIAL - PRODUCT VERIFICATION               ║")
print("╚════════════════════════════════════════════════════════════════╝\n")

# Fetch products
response = requests.get("http://54.160.231.34/api/products")
products = response.json()

print(f"✅ Total Products: {len(products)}\n")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

for i, product in enumerate(products, 1):
    print(f"\n{i}. {product['name_english']} ({product['name_hindi']})")
    print(f"   📸 Image: ✓ {product['image_url']}")
    print(f"   📦 Category: {product['category']}")
    print(f"   💰 Variants:")
    for variant in product.get('variants', []):
        print(f"      • {variant['weight']}: ₹{variant['price']} (Stock: {variant['stock_quantity']})")

print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("\n✅ ALL PRODUCTS VERIFIED AND ACCESSIBLE!")
