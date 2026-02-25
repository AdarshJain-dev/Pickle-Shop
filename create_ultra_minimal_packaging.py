#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import random

output_dir = "/home/ubuntu/agent/jain-sahab-special/backend/uploads"
os.makedirs(output_dir, exist_ok=True)

def create_ultra_minimal_product(product_info):
    """Create ULTRA MINIMAL product images with very short weight text"""
    width, height = 900, 900

    # Clean white background
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Subtle gradient
    for y in range(height):
        shade = int(250 - (y / height * 5))
        draw.rectangle([(0, y), (width, y+1)], fill=(shade, shade, shade))

    # Load fonts - EVEN SMALLER
    try:
        brand_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        hindi_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
        weight_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)  # SMALLER WEIGHT FONT
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
    except:
        brand_font = title_font = hindi_font = weight_font = small_font = ImageFont.load_default()

    center_x = width // 2

    if product_info['type'] == 'jar':
        # Jar
        jar_width = 340
        jar_height = 500
        jar_left = center_x - jar_width // 2
        jar_top = 120

        # Shadow
        shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.ellipse([jar_left - 12, jar_top + jar_height,
                            jar_left + jar_width + 12, jar_top + jar_height + 60],
                           fill=(0, 0, 0, 25))
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        img.paste(shadow, (0, 0), shadow)

        # Glass jar
        jar_color = (238, 245, 250)
        draw.ellipse([jar_left, jar_top, jar_left + jar_width, jar_top + 85],
                    fill=jar_color, outline=(195, 205, 215), width=3)
        draw.rectangle([jar_left, jar_top + 42, jar_left + jar_width, jar_top + jar_height - 25],
                      fill=jar_color, outline=(195, 205, 215), width=3)
        draw.ellipse([jar_left, jar_top + jar_height - 50, jar_left + jar_width, jar_top + jar_height + 15],
                    fill=jar_color, outline=(195, 205, 215), width=3)

        # Pickle content
        for i in range(50):
            x = random.randint(jar_left + 35, jar_left + jar_width - 35)
            y = random.randint(jar_top + 130, jar_top + jar_height - 40)
            size = random.randint(18, 38)
            draw.ellipse([x, y, x + size, y + size], fill=product_info['content_color'])

        # Oil shine
        oil_y = jar_top + 120
        for i in range(4):
            oil = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            oil_draw = ImageDraw.Draw(oil)
            oil_draw.rectangle([jar_left + 8, oil_y + i * 2, jar_left + jar_width - 8, oil_y + i * 2 + 2],
                              fill=(245, 215, 130, 100 - i * 20))
            img.paste(oil, (0, 0), oil)

        # Lid
        lid_color = (205, 165, 85)
        draw.ellipse([jar_left - 8, jar_top - 35, jar_left + jar_width + 8, jar_top + 42],
                    fill=lid_color, outline=(165, 125, 55), width=3)

        label_top = jar_top + 165
        label_width = 240  # EVEN SMALLER LABEL
        label_height = 250  # SHORTER HEIGHT

    else:  # Pouch
        pouch_width = 320
        pouch_height = 460
        pouch_left = center_x - pouch_width // 2
        pouch_top = 160

        # Shadow
        shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.ellipse([pouch_left - 10, pouch_top + pouch_height,
                            pouch_left + pouch_width + 10, pouch_top + pouch_height + 50],
                           fill=(0, 0, 0, 20))
        shadow = shadow.filter(ImageFilter.GaussianBlur(10))
        img.paste(shadow, (0, 0), shadow)

        # Pouch
        pouch_color = (195, 95, 50)
        points = [
            (pouch_left + 22, pouch_top + 60),
            (pouch_left + pouch_width - 22, pouch_top + 60),
            (pouch_left + pouch_width - 5, pouch_top + pouch_height),
            (pouch_left + 5, pouch_top + pouch_height)
        ]
        draw.polygon(points, fill=pouch_color, outline=(115, 55, 25), width=3)

        # Top seal
        draw.rectangle([pouch_left + 22, pouch_top, pouch_left + pouch_width - 22, pouch_top + 75],
                      fill=(155, 80, 40), outline=(115, 55, 25), width=3)

        label_top = pouch_top + 115
        label_width = 220  # EVEN SMALLER
        label_height = 270

    # ULTRA MINIMAL LABEL
    label_left = center_x - label_width // 2

    # Label background
    draw.rectangle([label_left, label_top, label_left + label_width, label_top + label_height],
                  fill=(255, 250, 235), outline=(155, 85, 35), width=3)

    # Small orange header
    draw.rectangle([label_left, label_top, label_left + label_width, label_top + 35],
                  fill=(215, 95, 35))

    # Brand - SHORT
    brand_text = "JAIN SAHAB"
    brand_bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_w = brand_bbox[2] - brand_bbox[0]
    draw.text((center_x - brand_w // 2, label_top + 8), brand_text, fill=(255, 255, 255), font=brand_font)

    # Product name - SHORT
    name_y = label_top + 50
    name_bbox = draw.textbbox((0, 0), product_info['name'], font=title_font)
    name_w = name_bbox[2] - name_bbox[0]
    draw.text((center_x - name_w // 2, name_y), product_info['name'], fill=(130, 35, 15), font=title_font)

    # Hindi name - SHORT
    hindi_y = label_top + 92
    hindi_bbox = draw.textbbox((0, 0), product_info['hindi'], font=hindi_font)
    hindi_w = hindi_bbox[2] - hindi_bbox[0]
    draw.text((center_x - hindi_w // 2, hindi_y), product_info['hindi'], fill=(75, 105, 45), font=hindi_font)

    # Weight badge - MUCH SMALLER
    badge_size = 60  # Was 75, now 60
    badge_x = center_x - badge_size // 2
    badge_y = label_top + 135
    draw.ellipse([badge_x, badge_y, badge_x + badge_size, badge_y + badge_size],
                fill=(195, 35, 35), outline=(135, 25, 25), width=2)

    # SHORT weight text
    weight_bbox = draw.textbbox((0, 0), product_info['weight'], font=weight_font)
    weight_w = weight_bbox[2] - weight_bbox[0]
    weight_h = weight_bbox[3] - weight_bbox[1]
    draw.text((center_x - weight_w // 2, badge_y + (badge_size - weight_h) // 2 - 4),
             product_info['weight'], fill=(255, 255, 255), font=weight_font)

    # MINIMAL text at bottom
    bottom_y = label_top + label_height - 25
    draw.text((center_x - 45, bottom_y), "100% Natural", fill=(55, 95, 55), font=small_font)

    return img

# Products with SHORTEST weight format
products = [
    {"filename": "mango-pickle-1kg.jpg", "name": "MANGO", "hindi": "आम अचार",
     "weight": "1kg", "type": "jar", "content_color": (255, 185, 70)},  # "1kg" not "1 KG"
    {"filename": "mango-pickle-500g.jpg", "name": "MANGO", "hindi": "आम अचार",
     "weight": "500g", "type": "jar", "content_color": (255, 185, 70)},
    {"filename": "lemon-pickle-1kg.jpg", "name": "LEMON", "hindi": "नींबू अचार",
     "weight": "1kg", "type": "jar", "content_color": (255, 230, 110)},
    {"filename": "lemon-pickle-500g.jpg", "name": "LEMON", "hindi": "नींबू अचार",
     "weight": "500g", "type": "jar", "content_color": (255, 230, 110)},
    {"filename": "lemon-chili-pickle-1kg.jpg", "name": "LEMON CHILI", "hindi": "नींबू मिर्च",
     "weight": "1kg", "type": "jar", "content_color": (240, 90, 55)},
    {"filename": "lemon-chili-pickle-500g.jpg", "name": "LEMON CHILI", "hindi": "नींबू मिर्च",
     "weight": "500g", "type": "jar", "content_color": (240, 90, 55)},
    {"filename": "amla-pickle-1kg.jpg", "name": "AMLA", "hindi": "आंवला अचार",
     "weight": "1kg", "type": "jar", "content_color": (160, 205, 110)},
    {"filename": "amla-pickle-500g.jpg", "name": "AMLA", "hindi": "आंवला अचार",
     "weight": "500g", "type": "jar", "content_color": (160, 205, 110)},
    {"filename": "achaar-masala-200g.jpg", "name": "MASALA", "hindi": "अचार मसाला",
     "weight": "200g", "type": "pouch"},
    {"filename": "achaar-masala-500g.jpg", "name": "MASALA", "hindi": "अचार मसाला",
     "weight": "500g", "type": "pouch"},
    {"filename": "achaar-masala-1kg.jpg", "name": "MASALA", "hindi": "अचार मसाला",
     "weight": "1kg", "type": "pouch"}
]

print("\n🎨 Creating ULTRA MINIMAL Packaging...")
print("=" * 50)
print("Changes:")
print("  • Weight badge: 60px (was 75px)")
print("  • Weight font: 32pt (was 42pt)")
print("  • Weight text: '1kg' not '1 KG'")
print("  • Label width: 240px/220px (was 260px/240px)")
print("=" * 50)

for product in products:
    print(f"Creating {product['filename']}...")
    img = create_ultra_minimal_product(product)
    output_path = os.path.join(output_dir, product['filename'])
    img.save(output_path, 'JPEG', quality=90, optimize=True)
    print(f"✓ {product['filename']}")

print("\n" + "=" * 50)
print("✅ DONE! Weight text will fit now!")
print()
