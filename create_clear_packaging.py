#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import random

output_dir = "/home/ubuntu/agent/jain-sahab-special/backend/uploads"
os.makedirs(output_dir, exist_ok=True)

def create_product_image(product_info):
    """Create clear, readable product packaging"""
    width, height = 1200, 1200

    # White background with subtle gradient
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    for y in range(height):
        shade = int(250 - (y / height * 15))
        draw.rectangle([(0, y), (width, y+1)], fill=(shade, shade, shade + 5))

    # Load fonts with safe fallback
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 70)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 50)
        weight_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
    except:
        title_font = subtitle_font = weight_font = text_font = small_font = ImageFont.load_default()

    center_x = width // 2

    if product_info['type'] == 'jar':
        # Glass jar container
        jar_width = 450
        jar_height = 650
        jar_left = center_x - jar_width // 2
        jar_top = 200

        # Shadow
        shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.ellipse([jar_left - 20, jar_top + jar_height,
                            jar_left + jar_width + 20, jar_top + jar_height + 100],
                           fill=(0, 0, 0, 40))
        shadow = shadow.filter(ImageFilter.GaussianBlur(20))
        img.paste(shadow, (0, 0), shadow)

        # Jar body
        jar_color = (230, 240, 248, 250)
        draw.ellipse([jar_left, jar_top, jar_left + jar_width, jar_top + 120],
                    fill=jar_color, outline=(180, 200, 220), width=4)
        draw.rectangle([jar_left, jar_top + 60, jar_left + jar_width, jar_top + jar_height - 40],
                      fill=jar_color, outline=(180, 200, 220), width=4)
        draw.ellipse([jar_left, jar_top + jar_height - 80, jar_left + jar_width, jar_top + jar_height + 20],
                    fill=jar_color, outline=(180, 200, 220), width=4)

        # Fill with pickle content
        for i in range(70):
            x = random.randint(jar_left + 50, jar_left + jar_width - 50)
            y = random.randint(jar_top + 180, jar_top + jar_height - 60)
            size = random.randint(25, 55)
            draw.ellipse([x, y, x + size, y + size], fill=product_info['content_color'])

        # Oil layer on top
        for i in range(8):
            y_pos = jar_top + 160 + i * 3
            alpha = int(150 - i * 15)
            oil_color = (240, 200, 100, alpha)
            oil = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            oil_draw = ImageDraw.Draw(oil)
            oil_draw.rectangle([jar_left + 10, y_pos, jar_left + jar_width - 10, y_pos + 3],
                              fill=oil_color)
            img.paste(oil, (0, 0), oil)

        # Golden lid
        lid_color = (220, 180, 100)
        draw.ellipse([jar_left - 10, jar_top - 50, jar_left + jar_width + 10, jar_top + 70],
                    fill=lid_color, outline=(180, 140, 60), width=4)
        for i in range(10):
            y_ridge = jar_top - 35 + (i * 8)
            draw.line([jar_left + 20, y_ridge, jar_left + jar_width - 20, y_ridge],
                     fill=(200, 160, 80), width=2)

        label_y = jar_top + 220
        label_width = 380

    else:  # Pouch for masala
        pouch_width = 420
        pouch_height = 600
        pouch_left = center_x - pouch_width // 2
        pouch_top = 250

        # Shadow
        shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.ellipse([pouch_left - 15, pouch_top + pouch_height,
                            pouch_left + pouch_width + 15, pouch_top + pouch_height + 80],
                           fill=(0, 0, 0, 35))
        shadow = shadow.filter(ImageFilter.GaussianBlur(18))
        img.paste(shadow, (0, 0), shadow)

        # Pouch body
        pouch_color = (210, 110, 60)
        points = [
            (pouch_left + 30, pouch_top + 80),
            (pouch_left + pouch_width - 30, pouch_top + 80),
            (pouch_left + pouch_width, pouch_top + pouch_height),
            (pouch_left, pouch_top + pouch_height)
        ]
        draw.polygon(points, fill=pouch_color, outline=(120, 60, 30), width=4)

        # Top seal
        draw.rectangle([pouch_left + 30, pouch_top, pouch_left + pouch_width - 30, pouch_top + 100],
                      fill=(170, 90, 50), outline=(120, 60, 30), width=3)

        label_y = pouch_top + 150
        label_width = 360

    # LABEL WITH CLEAR TEXT
    label_height = 450
    label_left = center_x - label_width // 2

    # Label background
    label = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label)

    label_draw.rectangle([label_left, label_y, label_left + label_width, label_y + label_height],
                        fill=(255, 250, 235), outline=(180, 100, 50), width=5)
    label_draw.rectangle([label_left + 8, label_y + 8,
                         label_left + label_width - 8, label_y + label_height - 8],
                        outline=(200, 120, 60), width=2)

    # Brand header (orange background)
    for i in range(65):
        color = int(220 - i * 0.4)
        label_draw.rectangle([label_left, label_y + i, label_left + label_width, label_y + i + 1],
                            fill=(color, 100 + i//2, 40))

    # JAIN SAHAB SPECIAL
    brand_text = "JAIN SAHAB SPECIAL"
    brand_bbox = label_draw.textbbox((0, 0), brand_text, font=subtitle_font)
    brand_width = brand_bbox[2] - brand_bbox[0]
    brand_x = center_x - brand_width // 2
    label_draw.text((brand_x, label_y + 12), brand_text, fill=(255, 255, 255), font=subtitle_font)

    # Product name - ENSURE IT'S COMPLETE
    name_bbox = label_draw.textbbox((0, 0), product_info['name'], font=title_font)
    name_width = name_bbox[2] - name_bbox[0]
    name_x = center_x - name_width // 2
    label_draw.text((name_x, label_y + 95), product_info['name'], fill=(140, 40, 20), font=title_font)

    # Hindi name
    hindi_bbox = label_draw.textbbox((0, 0), product_info['hindi'], font=subtitle_font)
    hindi_width = hindi_bbox[2] - hindi_bbox[0]
    hindi_x = center_x - hindi_width // 2
    label_draw.text((hindi_x, label_y + 175), product_info['hindi'], fill=(80, 120, 50), font=subtitle_font)

    # Weight badge
    badge_size = 120
    badge_x = center_x - badge_size // 2
    badge_y = label_y + 250
    label_draw.ellipse([badge_x, badge_y, badge_x + badge_size, badge_y + badge_size],
                      fill=(220, 50, 50), outline=(150, 30, 30), width=4)

    weight_bbox = label_draw.textbbox((0, 0), product_info['weight'], font=weight_font)
    weight_width = weight_bbox[2] - weight_bbox[0]
    weight_height = weight_bbox[3] - weight_bbox[1]
    weight_x = center_x - weight_width // 2
    weight_y = badge_y + (badge_size - weight_height) // 2 - 5
    label_draw.text((weight_x, weight_y), product_info['weight'], fill=(255, 255, 255), font=weight_font)

    # Ingredients (wrapped)
    ing_y = label_y + 385
    ingredients_text = f"Ingredients: {product_info['ingredients']}"

    # Word wrap ingredients
    words = ingredients_text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = ' '.join(current_line + [word])
        test_bbox = label_draw.textbbox((0, 0), test_line, font=small_font)
        if test_bbox[2] - test_bbox[0] < label_width - 30:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))

    for i, line in enumerate(lines[:2]):  # Max 2 lines
        line_bbox = label_draw.textbbox((0, 0), line, font=small_font)
        line_width = line_bbox[2] - line_bbox[0]
        line_x = center_x - line_width // 2
        label_draw.text((line_x, ing_y + i * 22), line, fill=(60, 60, 60), font=small_font)

    img.paste(label, (0, 0), label)

    # Quality symbols at bottom
    symbol_y = height - 100
    draw.text((center_x - 80, symbol_y), "✓ 100% Natural", fill=(50, 120, 50), font=text_font)
    draw.text((center_x - 90, symbol_y + 35), "✓ Premium Quality", fill=(180, 90, 40), font=text_font)

    return img

# Products
products = [
    {
        "filename": "mango-pickle-1kg.jpg",
        "name": "MANGO PICKLE",
        "hindi": "आम का अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (255, 180, 60),
        "ingredients": "Raw Mango, Mustard Oil, Salt, Red Chilli, Turmeric, Fenugreek, Mustard Seeds, Fennel"
    },
    {
        "filename": "mango-pickle-500g.jpg",
        "name": "MANGO PICKLE",
        "hindi": "आम का अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (255, 180, 60),
        "ingredients": "Raw Mango, Mustard Oil, Salt, Red Chilli, Turmeric, Fenugreek, Mustard Seeds, Fennel"
    },
    {
        "filename": "lemon-pickle-1kg.jpg",
        "name": "LEMON PICKLE",
        "hindi": "निम्बू का अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (255, 225, 100),
        "ingredients": "Lemon, Mustard Oil, Salt, Red Chilli, Turmeric, Fenugreek, Mustard Seeds"
    },
    {
        "filename": "lemon-pickle-500g.jpg",
        "name": "LEMON PICKLE",
        "hindi": "निम्बू का अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (255, 225, 100),
        "ingredients": "Lemon, Mustard Oil, Salt, Red Chilli, Turmeric, Fenugreek, Mustard Seeds"
    },
    {
        "filename": "lemon-chili-pickle-1kg.jpg",
        "name": "LEMON CHILI",
        "hindi": "निम्बू मिर्च अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (235, 80, 45),
        "ingredients": "Lemon, Green Chilli, Mustard Oil, Salt, Red Chilli, Turmeric, Garlic"
    },
    {
        "filename": "lemon-chili-pickle-500g.jpg",
        "name": "LEMON CHILI",
        "hindi": "निम्बू मिर्च अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (235, 80, 45),
        "ingredients": "Lemon, Green Chilli, Mustard Oil, Salt, Red Chilli, Turmeric, Garlic"
    },
    {
        "filename": "amla-pickle-1kg.jpg",
        "name": "AMLA PICKLE",
        "hindi": "आंवला का अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (150, 200, 100),
        "ingredients": "Amla, Mustard Oil, Salt, Red Chilli, Turmeric, Fenugreek, Cumin, Coriander"
    },
    {
        "filename": "amla-pickle-500g.jpg",
        "name": "AMLA PICKLE",
        "hindi": "आंवला का अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (150, 200, 100),
        "ingredients": "Amla, Mustard Oil, Salt, Red Chilli, Turmeric, Fenugreek, Cumin, Coriander"
    },
    {
        "filename": "achaar-masala-200g.jpg",
        "name": "ACHAAR MASALA",
        "hindi": "अचार मसाला",
        "weight": "200g",
        "type": "pouch",
        "ingredients": "Coriander, Cumin, Fenugreek, Fennel, Mustard Seeds, Turmeric, Red Chilli, Black Salt"
    },
    {
        "filename": "achaar-masala-500g.jpg",
        "name": "ACHAAR MASALA",
        "hindi": "अचार मसाला",
        "weight": "500g",
        "type": "pouch",
        "ingredients": "Coriander, Cumin, Fenugreek, Fennel, Mustard Seeds, Turmeric, Red Chilli, Black Salt"
    },
    {
        "filename": "achaar-masala-1kg.jpg",
        "name": "ACHAAR MASALA",
        "hindi": "अचार मसाला",
        "weight": "1 KG",
        "type": "pouch",
        "ingredients": "Coriander, Cumin, Fenugreek, Fennel, Mustard Seeds, Turmeric, Red Chilli, Black Salt"
    }
]

print("\n🎨 Creating CLEAR Product Packaging...")
print("=" * 70)

for product in products:
    print(f"Creating {product['filename']}...")
    img = create_product_image(product)
    output_path = os.path.join(output_dir, product['filename'])
    img.save(output_path, 'JPEG', quality=95, optimize=True)
    print(f"✓ {product['filename']}")

print("\n" + "=" * 70)
print("✅ ALL PACKAGING CREATED!")
print("   • Clear, readable text")
print("   • Complete product names visible")
print("   • Properly aligned labels")
print("   • Filled jars")
print()
