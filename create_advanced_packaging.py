#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os
import random

output_dir = "/home/ubuntu/agent/jain-sahab-special/backend/uploads"
os.makedirs(output_dir, exist_ok=True)

def add_barcode(draw, x, y, width=200, height=60):
    """Add a simple barcode representation"""
    bar_width = 3
    for i in range(0, width, bar_width * 2):
        if random.choice([True, False, True]):
            draw.rectangle([x + i, y, x + i + bar_width, y + height], fill=(0, 0, 0))

def create_advanced_pickle_packaging(product_info):
    """Create ultra-realistic FMCG-style pickle packaging"""
    width, height = 1400, 1400

    # Create base with studio lighting effect
    img = Image.new('RGB', (width, height), (250, 250, 250))
    draw = ImageDraw.Draw(img)

    # Gradient background (professional photo studio style)
    for y in range(height):
        shade = int(245 - (y / height * 35))
        draw.rectangle([(0, y), (width, y+1)], fill=(shade, shade, shade + 10))

    # Add subtle shadow on table
    shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)

    # Professional product photography setup
    jar_center_x = width // 2
    jar_center_y = height // 2 + 80

    if product_info['type'] == 'jar':
        jar_width = 500
        jar_height = 680
    else:  # pouch for masala
        jar_width = 450
        jar_height = 650

    jar_left = jar_center_x - jar_width // 2
    jar_top = jar_center_y - jar_height // 2

    # Drop shadow (professional product photo)
    shadow_draw.ellipse([
        jar_left - 20, jar_top + jar_height - 30,
        jar_left + jar_width + 20, jar_top + jar_height + 100
    ], fill=(0, 0, 0, 50))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    img.paste(shadow, (0, 0), shadow)

    # Load fonts
    try:
        brand_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 65)
        product_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 95)
        hindi_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 65)
        weight_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 110)
        ingredient_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        tiny_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    except:
        brand_font = product_font = hindi_font = weight_font = ingredient_font = small_font = tiny_font = ImageFont.load_default()

    if product_info['type'] == 'jar':
        # Glass jar body with realistic glass effect
        jar_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        jar_draw = ImageDraw.Draw(jar_img)

        # Jar glass color (slight blue tint)
        glass_color = (220, 235, 245, 250)
        glass_dark = (180, 200, 215)

        # Top rim
        jar_draw.ellipse([
            jar_left, jar_top,
            jar_left + jar_width, jar_top + 130
        ], fill=glass_color, outline=glass_dark, width=6)

        # Jar body
        jar_draw.rectangle([
            jar_left, jar_top + 65,
            jar_left + jar_width, jar_top + jar_height - 60
        ], fill=glass_color, outline=glass_dark, width=6)

        # Bottom curve
        jar_draw.ellipse([
            jar_left, jar_top + jar_height - 120,
            jar_left + jar_width, jar_top + jar_height + 20
        ], fill=glass_color, outline=glass_dark, width=6)

        # Glass reflection/shine
        shine = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        shine_draw = ImageDraw.Draw(shine)
        shine_draw.ellipse([
            jar_left + 60, jar_top + 180,
            jar_left + 220, jar_top + 450
        ], fill=(255, 255, 255, 80))
        shine = shine.filter(ImageFilter.GaussianBlur(20))

        # Pickle contents visible through glass
        content = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        content_draw = ImageDraw.Draw(content)

        # Add pickle pieces
        for i in range(35):
            x = random.randint(jar_left + 100, jar_left + jar_width - 100)
            y = random.randint(jar_top + 220, jar_top + jar_height - 150)
            size = random.randint(25, 60)
            content_draw.ellipse([x, y, x + size, y + size], fill=product_info['content_color'])

        content = content.filter(ImageFilter.GaussianBlur(2))

        # Oil layer on top
        oil = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        oil_draw = ImageDraw.Draw(oil)
        oil_draw.ellipse([
            jar_left + 50, jar_top + 200,
            jar_left + jar_width - 50, jar_top + 250
        ], fill=(255, 200, 50, 120))
        oil = oil.filter(ImageFilter.GaussianBlur(10))

        img.paste(content, (0, 0), content)
        img.paste(oil, (0, 0), oil)
        img.paste(jar_img, (0, 0), jar_img)
        img.paste(shine, (0, 0), shine)

        # Professional metal cap/lid
        lid = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        lid_draw = ImageDraw.Draw(lid)

        # Gold/brass colored lid
        lid_main = (210, 180, 100)
        lid_dark = (160, 140, 70)
        lid_light = (240, 220, 150)

        # Lid top
        lid_draw.ellipse([
            jar_left + 40, jar_top - 60,
            jar_left + jar_width - 40, jar_top + 40
        ], fill=lid_main, outline=lid_dark, width=4)

        # Lid shine
        lid_draw.ellipse([
            jar_left + 120, jar_top - 40,
            jar_left + 260, jar_top + 10
        ], fill=lid_light)

        # Lid side/depth
        lid_draw.rectangle([
            jar_left + 40, jar_top,
            jar_left + jar_width - 40, jar_top + 70
        ], fill=lid_dark)

        # Lid ridges
        for i in range(10):
            y_pos = jar_top + 5 + (i * 6)
            lid_draw.line([
                jar_left + 40, y_pos,
                jar_left + jar_width - 40, y_pos
            ], fill=lid_main, width=2)

        lid = lid.filter(ImageFilter.GaussianBlur(1))
        img.paste(lid, (0, 0), lid)

        label_y = jar_top + 220
        label_height = 420

    else:  # Masala pouch
        # Create standing pouch design
        pouch = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        pouch_draw = ImageDraw.Draw(pouch)

        # Pouch background (metallic/plastic finish)
        pouch_color = product_info.get('pouch_color', (200, 100, 50))

        # Main pouch body
        points = [
            (jar_left + 30, jar_top + 80),  # top left
            (jar_left + jar_width - 30, jar_top + 80),  # top right
            (jar_left + jar_width, jar_top + jar_height),  # bottom right
            (jar_left, jar_top + jar_height)  # bottom left
        ]
        pouch_draw.polygon(points, fill=pouch_color, outline=(100, 50, 20), width=4)

        # Top seal area (darker)
        pouch_draw.rectangle([
            jar_left + 30, jar_top,
            jar_left + jar_width - 30, jar_top + 100
        ], fill=(150, 80, 40), outline=(100, 50, 20), width=3)

        # Tear notch
        pouch_draw.polygon([
            (jar_left + jar_width - 60, jar_top + 50),
            (jar_left + jar_width - 40, jar_top + 70),
            (jar_left + jar_width - 60, jar_top + 90)
        ], fill=(100, 50, 20))

        # Side seals (3D effect)
        pouch_draw.polygon([
            (jar_left, jar_top + 100),
            (jar_left + 30, jar_top + 80),
            (jar_left + 30, jar_top + jar_height - 20),
            (jar_left, jar_top + jar_height)
        ], fill=(160, 80, 40))

        pouch_draw.polygon([
            (jar_left + jar_width, jar_top + 100),
            (jar_left + jar_width - 30, jar_top + 80),
            (jar_left + jar_width - 30, jar_top + jar_height - 20),
            (jar_left + jar_width, jar_top + jar_height)
        ], fill=(160, 80, 40))

        img.paste(pouch, (0, 0), pouch)

        label_y = jar_top + 120
        label_height = 480

    # Professional Product Label
    label_width = jar_width - 80
    label_x = jar_left + 40

    label = Image.new('RGBA', (label_width, label_height), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label)

    # Label background (premium paper texture)
    label_draw.rectangle([0, 0, label_width, label_height],
                         fill=(255, 250, 235), outline=(180, 100, 50), width=6)

    # Decorative border
    label_draw.rectangle([15, 15, label_width-15, label_height-15],
                         outline=(200, 120, 60), width=4)

    # Brand strip at top
    label_draw.rectangle([0, 0, label_width, 90], fill=(220, 100, 40))
    label_draw.rectangle([15, 15, label_width-15, 75], fill=(240, 130, 60))

    # Brand name
    brand_text = "JAIN SAHAB SPECIAL"
    brand_bbox = label_draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_w = brand_bbox[2] - brand_bbox[0]
    label_draw.text((label_width//2 - brand_w//2, 20), brand_text,
                    fill=(255, 255, 255), font=brand_font)

    # Product name (English)
    product_bbox = label_draw.textbbox((0, 0), product_info['name'], font=product_font)
    product_w = product_bbox[2] - product_bbox[0]
    label_draw.text((label_width//2 - product_w//2, 110), product_info['name'],
                    fill=(180, 50, 20), font=product_font)

    # Product name (Hindi)
    hindi_bbox = label_draw.textbbox((0, 0), product_info['hindi'], font=hindi_font)
    hindi_w = hindi_bbox[2] - hindi_bbox[0]
    label_draw.text((label_width//2 - hindi_w//2, 215), product_info['hindi'],
                    fill=(100, 150, 80), font=hindi_font)

    # Weight badge (prominent)
    weight_badge_y = 295
    label_draw.ellipse([
        label_width//2 - 90, weight_badge_y,
        label_width//2 + 90, weight_badge_y + 100
    ], fill=(220, 60, 40), outline=(180, 40, 20), width=4)

    weight_text = product_info['weight']
    weight_bbox = label_draw.textbbox((0, 0), weight_text, font=weight_font)
    weight_w = weight_bbox[2] - weight_bbox[0]
    label_draw.text((label_width//2 - weight_w//2, weight_badge_y + 15),
                    weight_text, fill=(255, 255, 255), font=weight_font)

    # Ingredients section
    ing_y = weight_badge_y + 120
    label_draw.text((20, ing_y), "INGREDIENTS:", fill=(0, 0, 0), font=ingredient_font)

    # Wrap ingredients text
    ing_text = product_info['ingredients']
    words = ing_text.split(', ')
    current_line = ""
    line_y = ing_y + 35
    max_width = label_width - 40

    for i, word in enumerate(words):
        test_line = current_line + word + ", "
        bbox = label_draw.textbbox((0, 0), test_line, font=small_font)
        if bbox[2] - bbox[0] < max_width:
            current_line = test_line
        else:
            label_draw.text((20, line_y), current_line.rstrip(", "),
                          fill=(60, 60, 60), font=small_font)
            current_line = word + ", "
            line_y += 30

        if i == len(words) - 1:
            label_draw.text((20, line_y), current_line.rstrip(", "),
                          fill=(60, 60, 60), font=small_font)

    # Footer info
    footer_y = label_height - 120
    label_draw.line([20, footer_y, label_width - 20, footer_y], fill=(180, 100, 50), width=2)

    # Storage instructions
    label_draw.text((20, footer_y + 10), "Store in cool, dry place",
                    fill=(80, 80, 80), font=tiny_font)

    # Shelf life
    label_draw.text((20, footer_y + 35),
                    f"Best Before: 12 months from MFG",
                    fill=(80, 80, 80), font=tiny_font)

    # Manufacturer
    label_draw.text((20, footer_y + 60),
                    "Mfd by: Jain Sahab Special, Raghogarh, MP",
                    fill=(80, 80, 80), font=tiny_font)

    # Barcode
    add_barcode(label_draw, label_width - 230, footer_y + 20)
    label_draw.text((label_width - 230, footer_y + 85), "8901234567890",
                    fill=(0, 0, 0), font=tiny_font)

    # Quality badges
    badge_y = 100
    # Veg symbol
    label_draw.ellipse([label_width - 70, badge_y, label_width - 30, badge_y + 40],
                       outline=(0, 150, 0), width=3)
    label_draw.ellipse([label_width - 60, badge_y + 10, label_width - 40, badge_y + 30],
                       fill=(0, 150, 0))

    # FSSAI logo placeholder
    label_draw.rectangle([label_width - 70, badge_y + 50, label_width - 30, badge_y + 90],
                         outline=(100, 100, 100), width=2)
    label_draw.text((label_width - 68, badge_y + 58), "FSSAI",
                    fill=(100, 100, 100), font=tiny_font)

    # Paste label onto product
    img.paste(label, (label_x, label_y), label)

    # Final enhancements
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.15)

    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.2)

    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.1)

    return img

# Product definitions with proper FMCG details
products = [
    # 1kg products
    {
        "filename": "mango-pickle-1kg.jpg",
        "name": "MANGO PICKLE",
        "hindi": "आम का अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (255, 180, 60, 200),
        "ingredients": "Raw Mango, Mustard Oil, Salt, Red Chilli Powder, Turmeric Powder, Fenugreek Seeds, Mustard Seeds, Fennel Seeds, Nigella Seeds, Asafoetida"
    },
    {
        "filename": "lemon-pickle-1kg.jpg",
        "name": "LEMON PICKLE",
        "hindi": "निम्बू का अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (255, 230, 100, 200),
        "ingredients": "Lemon, Mustard Oil, Salt, Red Chilli Powder, Turmeric Powder, Fenugreek Seeds, Mustard Seeds, Asafoetida"
    },
    {
        "filename": "lemon-chili-pickle-1kg.jpg",
        "name": "LEMON CHILI",
        "hindi": "निम्बू मिर्ची अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (220, 80, 40, 200),
        "ingredients": "Lemon, Green Chilli, Mustard Oil, Salt, Red Chilli Powder, Turmeric Powder, Fenugreek Seeds, Mustard Seeds, Garlic"
    },
    {
        "filename": "amla-pickle-1kg.jpg",
        "name": "AMLA PICKLE",
        "hindi": "आंवला का अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (150, 200, 100, 200),
        "ingredients": "Amla (Indian Gooseberry), Mustard Oil, Salt, Red Chilli Powder, Turmeric Powder, Fenugreek Seeds, Cumin Seeds, Coriander Seeds"
    },
    # 500g products
    {
        "filename": "mango-pickle-500g.jpg",
        "name": "MANGO PICKLE",
        "hindi": "आम का अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (255, 180, 60, 200),
        "ingredients": "Raw Mango, Mustard Oil, Salt, Red Chilli Powder, Turmeric Powder, Fenugreek Seeds, Mustard Seeds, Fennel Seeds, Nigella Seeds, Asafoetida"
    },
    {
        "filename": "lemon-pickle-500g.jpg",
        "name": "LEMON PICKLE",
        "hindi": "निम्बू का अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (255, 230, 100, 200),
        "ingredients": "Lemon, Mustard Oil, Salt, Red Chilli Powder, Turmeric Powder, Fenugreek Seeds, Mustard Seeds, Asafoetida"
    },
    {
        "filename": "lemon-chili-pickle-500g.jpg",
        "name": "LEMON CHILI",
        "hindi": "निम्बू मिर्ची अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (220, 80, 40, 200),
        "ingredients": "Lemon, Green Chilli, Mustard Oil, Salt, Red Chilli Powder, Turmeric Powder, Fenugreek Seeds, Mustard Seeds, Garlic"
    },
    {
        "filename": "amla-pickle-500g.jpg",
        "name": "AMLA PICKLE",
        "hindi": "आंवला का अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (150, 200, 100, 200),
        "ingredients": "Amla (Indian Gooseberry), Mustard Oil, Salt, Red Chilli Powder, Turmeric Powder, Fenugreek Seeds, Cumin Seeds, Coriander Seeds"
    },
    # Achaar Masala products
    {
        "filename": "achaar-masala-200g.jpg",
        "name": "ACHAAR MASALA",
        "hindi": "अचार मसाला",
        "weight": "200g",
        "type": "pouch",
        "pouch_color": (200, 100, 50),
        "ingredients": "Coriander Seeds, Cumin Seeds, Fenugreek Seeds, Fennel Seeds, Mustard Seeds, Turmeric Powder, Red Chilli Powder, Black Salt, Asafoetida, Nigella Seeds"
    },
    {
        "filename": "achaar-masala-500g.jpg",
        "name": "ACHAAR MASALA",
        "hindi": "अचार मसाला",
        "weight": "500g",
        "type": "pouch",
        "pouch_color": (200, 100, 50),
        "ingredients": "Coriander Seeds, Cumin Seeds, Fenugreek Seeds, Fennel Seeds, Mustard Seeds, Turmeric Powder, Red Chilli Powder, Black Salt, Asafoetida, Nigella Seeds"
    },
    {
        "filename": "achaar-masala-1kg.jpg",
        "name": "ACHAAR MASALA",
        "hindi": "अचार मसाला",
        "weight": "1 KG",
        "type": "pouch",
        "pouch_color": (200, 100, 50),
        "ingredients": "Coriander Seeds, Cumin Seeds, Fenugreek Seeds, Fennel Seeds, Mustard Seeds, Turmeric Powder, Red Chilli Powder, Black Salt, Asafoetida, Nigella Seeds"
    }
]

print("🎨 Creating ADVANCED FMCG-Style Product Packaging...")
print("━" * 70)

for product in products:
    print(f"Creating {product['filename']}...")
    img = create_advanced_pickle_packaging(product)
    output_path = os.path.join(output_dir, product['filename'])
    img.save(output_path, 'JPEG', quality=95, optimize=True)
    print(f"✓ Saved: {product['filename']}")

print("\n" + "━" * 70)
print("✅ All ADVANCED product packaging created successfully!")
print(f"📦 Total products: {len(products)}")
print("🏭 FMCG-style professional packaging with:")
print("   • Product labels with branding")
print("   • Ingredient lists")
print("   • Weight badges")
print("   • Barcodes")
print("   • Manufacturing details")
print("   • Quality symbols")
