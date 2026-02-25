#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import random

output_dir = "/home/ubuntu/agent/jain-sahab-special/backend/uploads"
os.makedirs(output_dir, exist_ok=True)

def create_simple_product(product_info):
    """Create simple, clean product images with contained labels"""
    width, height = 1000, 1000

    # Clean white background
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Subtle gradient
    for y in range(height):
        shade = int(248 - (y / height * 8))
        draw.rectangle([(0, y), (width, y+1)], fill=(shade, shade, shade + 2))

    # Load fonts
    try:
        brand_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        hindi_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        weight_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 52)
        text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    except:
        brand_font = title_font = hindi_font = weight_font = text_font = ImageFont.load_default()

    center_x = width // 2

    if product_info['type'] == 'jar':
        # Simple jar shape
        jar_width = 380
        jar_height = 580
        jar_left = center_x - jar_width // 2
        jar_top = 150

        # Shadow
        shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.ellipse([jar_left - 15, jar_top + jar_height,
                            jar_left + jar_width + 15, jar_top + jar_height + 70],
                           fill=(0, 0, 0, 30))
        shadow = shadow.filter(ImageFilter.GaussianBlur(15))
        img.paste(shadow, (0, 0), shadow)

        # Glass jar
        jar_color = (235, 242, 248)
        draw.ellipse([jar_left, jar_top, jar_left + jar_width, jar_top + 100],
                    fill=jar_color, outline=(190, 200, 210), width=3)
        draw.rectangle([jar_left, jar_top + 50, jar_left + jar_width, jar_top + jar_height - 30],
                      fill=jar_color, outline=(190, 200, 210), width=3)
        draw.ellipse([jar_left, jar_top + jar_height - 60, jar_left + jar_width, jar_top + jar_height + 20],
                    fill=jar_color, outline=(190, 200, 210), width=3)

        # Fill with pickle
        for i in range(55):
            x = random.randint(jar_left + 40, jar_left + jar_width - 40)
            y = random.randint(jar_top + 150, jar_top + jar_height - 50)
            size = random.randint(20, 45)
            draw.ellipse([x, y, x + size, y + size], fill=product_info['content_color'])

        # Oil shine on top
        oil_y = jar_top + 140
        for i in range(5):
            alpha = int(120 - i * 20)
            oil = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            oil_draw = ImageDraw.Draw(oil)
            oil_draw.rectangle([jar_left + 8, oil_y + i * 2, jar_left + jar_width - 8, oil_y + i * 2 + 2],
                              fill=(245, 210, 120, alpha))
            img.paste(oil, (0, 0), oil)

        # Simple lid
        lid_color = (210, 170, 90)
        draw.ellipse([jar_left - 8, jar_top - 40, jar_left + jar_width + 8, jar_top + 50],
                    fill=lid_color, outline=(170, 130, 60), width=3)

        label_top = jar_top + 180
        label_width = 320
        label_height = 350

    else:  # Pouch
        pouch_width = 360
        pouch_height = 520
        pouch_left = center_x - pouch_width // 2
        pouch_top = 180

        # Shadow
        shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.ellipse([pouch_left - 10, pouch_top + pouch_height,
                            pouch_left + pouch_width + 10, pouch_top + pouch_height + 60],
                           fill=(0, 0, 0, 25))
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        img.paste(shadow, (0, 0), shadow)

        # Pouch body
        pouch_color = (200, 100, 55)
        points = [
            (pouch_left + 25, pouch_top + 70),
            (pouch_left + pouch_width - 25, pouch_top + 70),
            (pouch_left + pouch_width - 5, pouch_top + pouch_height),
            (pouch_left + 5, pouch_top + pouch_height)
        ]
        draw.polygon(points, fill=pouch_color, outline=(120, 60, 30), width=3)

        # Top seal
        draw.rectangle([pouch_left + 25, pouch_top, pouch_left + pouch_width - 25, pouch_top + 85],
                      fill=(160, 85, 45), outline=(120, 60, 30), width=3)

        label_top = pouch_top + 120
        label_width = 300
        label_height = 360

    # SIMPLE CONTAINED LABEL
    label_left = center_x - label_width // 2

    # Label background - simple white box
    draw.rectangle([label_left, label_top, label_left + label_width, label_top + label_height],
                  fill=(255, 248, 230), outline=(160, 90, 40), width=4)

    # Inner border
    draw.rectangle([label_left + 6, label_top + 6, label_left + label_width - 6, label_top + label_height - 6],
                  outline=(180, 110, 50), width=2)

    # Brand header (small orange bar)
    draw.rectangle([label_left, label_top, label_left + label_width, label_top + 50],
                  fill=(220, 100, 40))

    # Brand name
    brand_text = "JAIN SAHAB SPECIAL"
    brand_bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_w = brand_bbox[2] - brand_bbox[0]
    draw.text((center_x - brand_w // 2, label_top + 12), brand_text, fill=(255, 255, 255), font=brand_font)

    # Product name (fits perfectly)
    name_y = label_top + 70
    name_bbox = draw.textbbox((0, 0), product_info['name'], font=title_font)
    name_w = name_bbox[2] - name_bbox[0]
    draw.text((center_x - name_w // 2, name_y), product_info['name'], fill=(140, 40, 20), font=title_font)

    # Hindi name
    hindi_y = label_top + 130
    hindi_bbox = draw.textbbox((0, 0), product_info['hindi'], font=hindi_font)
    hindi_w = hindi_bbox[2] - hindi_bbox[0]
    draw.text((center_x - hindi_w // 2, hindi_y), product_info['hindi'], fill=(80, 110, 50), font=hindi_font)

    # Weight badge (small circle)
    badge_size = 90
    badge_x = center_x - badge_size // 2
    badge_y = label_top + 190
    draw.ellipse([badge_x, badge_y, badge_x + badge_size, badge_y + badge_size],
                fill=(200, 40, 40), outline=(140, 30, 30), width=3)

    weight_bbox = draw.textbbox((0, 0), product_info['weight'], font=weight_font)
    weight_w = weight_bbox[2] - weight_bbox[0]
    weight_h = weight_bbox[3] - weight_bbox[1]
    draw.text((center_x - weight_w // 2, badge_y + (badge_size - weight_h) // 2 - 8),
             product_info['weight'], fill=(255, 255, 255), font=weight_font)

    # Simple ingredient text (one line)
    ing_y = label_top + 295
    ing_text = product_info['ingredients'][:40] + "..."
    ing_bbox = draw.textbbox((0, 0), ing_text, font=text_font)
    ing_w = ing_bbox[2] - ing_bbox[0]
    draw.text((center_x - ing_w // 2, ing_y), ing_text, fill=(80, 80, 80), font=text_font)

    # Quality marks
    draw.text((center_x - 60, label_top + label_height - 25), "100% Natural", fill=(60, 100, 60), font=text_font)

    return img

# Products
products = [
    {"filename": "mango-pickle-1kg.jpg", "name": "MANGO PICKLE", "hindi": "आम का अचार",
     "weight": "1 KG", "type": "jar", "content_color": (255, 180, 65),
     "ingredients": "Mango, Mustard Oil, Salt, Spices"},
    {"filename": "mango-pickle-500g.jpg", "name": "MANGO PICKLE", "hindi": "आम का अचार",
     "weight": "500g", "type": "jar", "content_color": (255, 180, 65),
     "ingredients": "Mango, Mustard Oil, Salt, Spices"},
    {"filename": "lemon-pickle-1kg.jpg", "name": "LEMON PICKLE", "hindi": "नींबू का अचार",
     "weight": "1 KG", "type": "jar", "content_color": (255, 225, 105),
     "ingredients": "Lemon, Mustard Oil, Salt, Spices"},
    {"filename": "lemon-pickle-500g.jpg", "name": "LEMON PICKLE", "hindi": "नींबू का अचार",
     "weight": "500g", "type": "jar", "content_color": (255, 225, 105),
     "ingredients": "Lemon, Mustard Oil, Salt, Spices"},
    {"filename": "lemon-chili-pickle-1kg.jpg", "name": "LEMON CHILI", "hindi": "नींबू मिर्च अचार",
     "weight": "1 KG", "type": "jar", "content_color": (235, 85, 50),
     "ingredients": "Lemon, Chili, Mustard Oil, Spices"},
    {"filename": "lemon-chili-pickle-500g.jpg", "name": "LEMON CHILI", "hindi": "नींबू मिर्च अचार",
     "weight": "500g", "type": "jar", "content_color": (235, 85, 50),
     "ingredients": "Lemon, Chili, Mustard Oil, Spices"},
    {"filename": "amla-pickle-1kg.jpg", "name": "AMLA PICKLE", "hindi": "आंवला का अचार",
     "weight": "1 KG", "type": "jar", "content_color": (155, 200, 105),
     "ingredients": "Amla, Mustard Oil, Salt, Spices"},
    {"filename": "amla-pickle-500g.jpg", "name": "AMLA PICKLE", "hindi": "आंवला का अचार",
     "weight": "500g", "type": "jar", "content_color": (155, 200, 105),
     "ingredients": "Amla, Mustard Oil, Salt, Spices"},
    {"filename": "achaar-masala-200g.jpg", "name": "ACHAAR MASALA", "hindi": "अचार मसाला",
     "weight": "200g", "type": "pouch",
     "ingredients": "Coriander, Cumin, Fenugreek, Spices"},
    {"filename": "achaar-masala-500g.jpg", "name": "ACHAAR MASALA", "hindi": "अचार मसाला",
     "weight": "500g", "type": "pouch",
     "ingredients": "Coriander, Cumin, Fenugreek, Spices"},
    {"filename": "achaar-masala-1kg.jpg", "name": "ACHAAR MASALA", "hindi": "अचार मसाला",
     "weight": "1 KG", "type": "pouch",
     "ingredients": "Coriander, Cumin, Fenugreek, Spices"}
]

print("\n✨ Creating Simple, Clean Product Images...")
print("=" * 60)

for product in products:
    print(f"Creating {product['filename']}...")
    img = create_simple_product(product)
    output_path = os.path.join(output_dir, product['filename'])
    img.save(output_path, 'JPEG', quality=92, optimize=True)
    print(f"✓ {product['filename']}")

print("\n" + "=" * 60)
print("✅ DONE! Simple, clean packaging with contained labels")
print()
