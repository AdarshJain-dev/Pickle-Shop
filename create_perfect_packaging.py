#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os
import random

output_dir = "/home/ubuntu/agent/jain-sahab-special/backend/uploads"
os.makedirs(output_dir, exist_ok=True)

def add_barcode(draw, x, y, width=200, height=60):
    """Add barcode"""
    bar_width = 3
    for i in range(0, width, bar_width * 2):
        if random.choice([True, False, True]):
            draw.rectangle([x + i, y, x + i + bar_width, y + height], fill=(0, 0, 0))

def create_professional_pickle_jar(product_info):
    """Create perfectly aligned, filled pickle jars"""
    width, height = 1400, 1400

    # Professional white background
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Subtle gradient
    for y in range(height):
        shade = int(252 - (y / height * 12))
        draw.rectangle([(0, y), (width, y+1)], fill=(shade, shade, shade + 3))

    # Jar dimensions
    jar_center_x = width // 2
    jar_center_y = height // 2 + 50

    if product_info['type'] == 'jar':
        jar_width = 520
        jar_height = 720
    else:
        jar_width = 480
        jar_height = 700

    jar_left = jar_center_x - jar_width // 2
    jar_top = jar_center_y - jar_height // 2

    # Shadow
    shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse([
        jar_left - 15, jar_top + jar_height - 20,
        jar_left + jar_width + 15, jar_top + jar_height + 90
    ], fill=(0, 0, 0, 45))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    img.paste(shadow, (0, 0), shadow)

    # Load fonts
    try:
        brand_font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 55)
        product_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 85)
        hindi_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 58)
        weight_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 95)
        ingredient_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
        tiny_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except:
        brand_font_large = product_font = hindi_font = weight_font = ingredient_font = small_font = tiny_font = ImageFont.load_default()

    if product_info['type'] == 'jar':
        # FILLED GLASS JAR
        jar_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        jar_draw = ImageDraw.Draw(jar_img)

        glass_color = (225, 238, 248, 245)
        glass_outline = (170, 190, 210)

        # Top opening
        jar_draw.ellipse([jar_left, jar_top, jar_left + jar_width, jar_top + 140],
                        fill=glass_color, outline=glass_outline, width=5)

        # Body
        jar_draw.rectangle([jar_left, jar_top + 70, jar_left + jar_width, jar_top + jar_height - 50],
                          fill=glass_color, outline=glass_outline, width=5)

        # Bottom
        jar_draw.ellipse([jar_left, jar_top + jar_height - 100, jar_left + jar_width, jar_top + jar_height + 40],
                        fill=glass_color, outline=glass_outline, width=5)

        # FILL JAR WITH LOTS OF PICKLE PIECES
        pickle_content = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        pickle_draw = ImageDraw.Draw(pickle_content)

        # Fill from 70% to top with pickle pieces
        fill_start_y = jar_top + 200
        fill_end_y = jar_top + jar_height - 80

        # Add MANY pickle pieces (doubled amount)
        for i in range(80):  # Increased from 40 to 80
            x = random.randint(jar_left + 70, jar_left + jar_width - 70)
            y = random.randint(fill_start_y, fill_end_y)
            size_w = random.randint(30, 70)
            size_h = random.randint(25, 60)
            pickle_draw.ellipse([x, y, x + size_w, y + size_h], fill=product_info['content_color'])

        pickle_content = pickle_content.filter(ImageFilter.GaussianBlur(1))

        # Oil/liquid (mustard oil color)
        oil_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        oil_draw = ImageDraw.Draw(oil_layer)

        # Thick oil layer at top
        for i in range(3):
            oil_draw.ellipse([
                jar_left + 45, fill_start_y - 20 + (i * 10),
                jar_left + jar_width - 45, fill_start_y + 30 + (i * 10)
            ], fill=(240, 180, 40, 100 - i * 20))

        oil_layer = oil_layer.filter(ImageFilter.GaussianBlur(12))

        # Apply layers
        img.paste(pickle_content, (0, 0), pickle_content)
        img.paste(oil_layer, (0, 0), oil_layer)
        img.paste(jar_img, (0, 0), jar_img)

        # Glass shine
        shine = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        shine_draw = ImageDraw.Draw(shine)
        shine_draw.ellipse([jar_left + 70, jar_top + 160, jar_left + 240, jar_top + 480],
                          fill=(255, 255, 255, 70))
        shine = shine.filter(ImageFilter.GaussianBlur(18))
        img.paste(shine, (0, 0), shine)

        # Professional metal lid
        lid = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        lid_draw = ImageDraw.Draw(lid)

        lid_gold = (215, 185, 105)
        lid_dark = (165, 145, 75)
        lid_light = (245, 225, 160)

        # Lid top
        lid_draw.ellipse([jar_left + 45, jar_top - 65, jar_left + jar_width - 45, jar_top + 45],
                        fill=lid_gold, outline=lid_dark, width=5)

        # Shine on lid
        lid_draw.ellipse([jar_left + 130, jar_top - 45, jar_left + 280, jar_top + 15],
                        fill=lid_light)

        # Lid side
        lid_draw.rectangle([jar_left + 45, jar_top, jar_left + jar_width - 45, jar_top + 75],
                          fill=lid_dark)

        # Ridges
        for i in range(11):
            y_ridge = jar_top + 5 + (i * 6)
            lid_draw.line([jar_left + 45, y_ridge, jar_left + jar_width - 45, y_ridge],
                         fill=lid_gold, width=2)

        img.paste(lid, (0, 0), lid)

        # PERFECTLY ALIGNED LABEL
        label_width = 420
        label_height = 480
        label_x = jar_center_x - label_width // 2
        label_y = jar_top + 180  # Better positioning

    else:  # Pouch for masala
        pouch = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        pouch_draw = ImageDraw.Draw(pouch)

        pouch_color = product_info.get('pouch_color', (210, 110, 60))

        # Standing pouch shape
        points = [
            (jar_left + 35, jar_top + 90),
            (jar_left + jar_width - 35, jar_top + 90),
            (jar_left + jar_width, jar_top + jar_height),
            (jar_left, jar_top + jar_height)
        ]
        pouch_draw.polygon(points, fill=pouch_color, outline=(110, 60, 30), width=5)

        # Top seal
        pouch_draw.rectangle([jar_left + 35, jar_top, jar_left + jar_width - 35, jar_top + 110],
                            fill=(160, 90, 50), outline=(110, 60, 30), width=4)

        # Tear notch
        pouch_draw.polygon([
            (jar_left + jar_width - 65, jar_top + 55),
            (jar_left + jar_width - 45, jar_top + 75),
            (jar_left + jar_width - 65, jar_top + 95)
        ], fill=(110, 60, 30))

        # Side seals (3D effect)
        pouch_draw.polygon([
            (jar_left, jar_top + 110),
            (jar_left + 35, jar_top + 90),
            (jar_left + 35, jar_top + jar_height - 25),
            (jar_left, jar_top + jar_height)
        ], fill=(170, 90, 50))

        pouch_draw.polygon([
            (jar_left + jar_width, jar_top + 110),
            (jar_left + jar_width - 35, jar_top + 90),
            (jar_left + jar_width - 35, jar_top + jar_height - 25),
            (jar_left + jar_width, jar_top + jar_height)
        ], fill=(170, 90, 50))

        img.paste(pouch, (0, 0), pouch)

        label_width = 400
        label_height = 520
        label_x = jar_center_x - label_width // 2
        label_y = jar_top + 140

    # PROFESSIONAL LABEL - PERFECTLY ALIGNED
    label = Image.new('RGBA', (label_width, label_height), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label)

    # Label background
    label_draw.rectangle([0, 0, label_width, label_height],
                        fill=(255, 252, 240), outline=(160, 90, 40), width=6)

    # Inner border
    label_draw.rectangle([12, 12, label_width-12, label_height-12],
                        outline=(190, 110, 50), width=3)

    # BRAND HEADER (Orange/Red gradient effect)
    for i in range(80):
        color_val = int(220 - i * 0.5)
        label_draw.rectangle([0, i, label_width, i + 1], fill=(color_val, 90 + i//2, 35))

    # JAIN SAHAB SPECIAL (centered perfectly)
    brand_text = "JAIN SAHAB SPECIAL"
    brand_bbox = label_draw.textbbox((0, 0), brand_text, font=brand_font_large)
    brand_w = brand_bbox[2] - brand_bbox[0]
    label_draw.text((label_width//2 - brand_w//2, 18),
                   brand_text, fill=(255, 255, 255), font=brand_font_large)

    # Product name (perfectly centered)
    product_y = 105
    product_bbox = label_draw.textbbox((0, 0), product_info['name'], font=product_font)
    product_w = product_bbox[2] - product_bbox[0]
    label_draw.text((label_width//2 - product_w//2, product_y),
                   product_info['name'], fill=(160, 40, 20), font=product_font)

    # Hindi name (perfectly centered)
    hindi_y = 200
    hindi_bbox = label_draw.textbbox((0, 0), product_info['hindi'], font=hindi_font)
    hindi_w = hindi_bbox[2] - hindi_bbox[0]
    label_draw.text((label_width//2 - hindi_w//2, hindi_y),
                   product_info['hindi'], fill=(80, 130, 60), font=hindi_font)

    # WEIGHT BADGE (prominent, centered)
    weight_badge_y = 275
    badge_radius = 85
    label_draw.ellipse([
        label_width//2 - badge_radius, weight_badge_y,
        label_width//2 + badge_radius, weight_badge_y + badge_radius * 2
    ], fill=(210, 50, 30), outline=(160, 30, 10), width=5)

    weight_text = product_info['weight']
    weight_bbox = label_draw.textbbox((0, 0), weight_text, font=weight_font)
    weight_w = weight_bbox[2] - weight_bbox[0]
    weight_h = weight_bbox[3] - weight_bbox[1]
    label_draw.text((label_width//2 - weight_w//2, weight_badge_y + badge_radius - weight_h//2 - 10),
                   weight_text, fill=(255, 255, 255), font=weight_font)

    # INGREDIENTS (properly formatted)
    ing_y = weight_badge_y + 190
    label_draw.text((15, ing_y), "INGREDIENTS:", fill=(0, 0, 0), font=ingredient_font)

    # Wrap ingredients
    words = product_info['ingredients'].split(', ')
    line_y = ing_y + 32
    current_line = ""

    for i, word in enumerate(words):
        test_line = current_line + word + ", "
        bbox = label_draw.textbbox((0, 0), test_line, font=small_font)

        if bbox[2] - bbox[0] < label_width - 30:
            current_line = test_line
        else:
            if current_line:
                label_draw.text((15, line_y), current_line.rstrip(", "),
                              fill=(50, 50, 50), font=small_font)
                current_line = word + ", "
                line_y += 26

        if i == len(words) - 1 and current_line:
            label_draw.text((15, line_y), current_line.rstrip(", "),
                          fill=(50, 50, 50), font=small_font)

    # FOOTER
    footer_y = label_height - 105
    label_draw.line([15, footer_y, label_width - 15, footer_y],
                   fill=(160, 90, 40), width=2)

    label_draw.text((15, footer_y + 8), "Store in cool, dry place",
                   fill=(70, 70, 70), font=tiny_font)
    label_draw.text((15, footer_y + 30), "Best Before: 12 months from MFG",
                   fill=(70, 70, 70), font=tiny_font)
    label_draw.text((15, footer_y + 52),
                   "Mfd: Jain Sahab, Raghogarh, MP",
                   fill=(70, 70, 70), font=tiny_font)

    # Barcode
    add_barcode(label_draw, label_width - 215, footer_y + 15)
    label_draw.text((label_width - 215, footer_y + 80), "8901234567890",
                   fill=(0, 0, 0), font=tiny_font)

    # Quality symbols (VEG + FSSAI)
    # Veg symbol
    label_draw.rectangle([label_width - 55, 95, label_width - 20, 130],
                        outline=(0, 140, 0), width=3)
    label_draw.ellipse([label_width - 48, 102, label_width - 27, 123],
                      fill=(0, 140, 0))

    # FSSAI
    label_draw.rectangle([label_width - 55, 140, label_width - 20, 170],
                        outline=(80, 80, 80), width=2)
    label_draw.text((label_width - 52, 145), "FSSAI",
                   fill=(80, 80, 80), font=tiny_font)

    # Paste label perfectly aligned
    img.paste(label, (label_x, label_y), label)

    # Final enhancements
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.12)

    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.15)

    return img

# Products with proper details
products = [
    {
        "filename": "mango-pickle-1kg.jpg",
        "name": "MANGO PICKLE",
        "hindi": "आम का अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (255, 170, 50, 220),
        "ingredients": "Raw Mango, Mustard Oil, Salt, Red Chilli Powder, Turmeric, Fenugreek Seeds, Mustard Seeds, Fennel Seeds, Nigella Seeds, Asafoetida"
    },
    {
        "filename": "mango-pickle-500g.jpg",
        "name": "MANGO PICKLE",
        "hindi": "आम का अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (255, 170, 50, 220),
        "ingredients": "Raw Mango, Mustard Oil, Salt, Red Chilli Powder, Turmeric, Fenugreek Seeds, Mustard Seeds, Fennel Seeds, Nigella Seeds, Asafoetida"
    },
    {
        "filename": "lemon-pickle-1kg.jpg",
        "name": "LEMON PICKLE",
        "hindi": "निम्बू का अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (255, 220, 90, 220),
        "ingredients": "Lemon, Mustard Oil, Salt, Red Chilli Powder, Turmeric, Fenugreek Seeds, Mustard Seeds, Asafoetida"
    },
    {
        "filename": "lemon-pickle-500g.jpg",
        "name": "LEMON PICKLE",
        "hindi": "निम्बू का अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (255, 220, 90, 220),
        "ingredients": "Lemon, Mustard Oil, Salt, Red Chilli Powder, Turmeric, Fenugreek Seeds, Mustard Seeds, Asafoetida"
    },
    {
        "filename": "lemon-chili-pickle-1kg.jpg",
        "name": "LEMON CHILI",
        "hindi": "निम्बू मिर्ची अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (230, 70, 35, 220),
        "ingredients": "Lemon, Green Chilli, Mustard Oil, Salt, Red Chilli Powder, Turmeric, Fenugreek Seeds, Mustard Seeds, Garlic"
    },
    {
        "filename": "lemon-chili-pickle-500g.jpg",
        "name": "LEMON CHILI",
        "hindi": "निम्बू मिर्ची अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (230, 70, 35, 220),
        "ingredients": "Lemon, Green Chilli, Mustard Oil, Salt, Red Chilli Powder, Turmeric, Fenugreek Seeds, Mustard Seeds, Garlic"
    },
    {
        "filename": "amla-pickle-1kg.jpg",
        "name": "AMLA PICKLE",
        "hindi": "आंवला का अचार",
        "weight": "1 KG",
        "type": "jar",
        "content_color": (140, 190, 90, 220),
        "ingredients": "Amla (Indian Gooseberry), Mustard Oil, Salt, Red Chilli Powder, Turmeric, Fenugreek Seeds, Cumin Seeds, Coriander Seeds"
    },
    {
        "filename": "amla-pickle-500g.jpg",
        "name": "AMLA PICKLE",
        "hindi": "आंवला का अचार",
        "weight": "500g",
        "type": "jar",
        "content_color": (140, 190, 90, 220),
        "ingredients": "Amla (Indian Gooseberry), Mustard Oil, Salt, Red Chilli Powder, Turmeric, Fenugreek Seeds, Cumin Seeds, Coriander Seeds"
    },
    {
        "filename": "achaar-masala-200g.jpg",
        "name": "ACHAAR MASALA",
        "hindi": "अचार मसाला",
        "weight": "200g",
        "type": "pouch",
        "pouch_color": (210, 110, 60),
        "ingredients": "Coriander Seeds, Cumin Seeds, Fenugreek Seeds, Fennel Seeds, Mustard Seeds, Turmeric, Red Chilli, Black Salt, Asafoetida, Nigella Seeds"
    },
    {
        "filename": "achaar-masala-500g.jpg",
        "name": "ACHAAR MASALA",
        "hindi": "अचार मसाला",
        "weight": "500g",
        "type": "pouch",
        "pouch_color": (210, 110, 60),
        "ingredients": "Coriander Seeds, Cumin Seeds, Fenugreek Seeds, Fennel Seeds, Mustard Seeds, Turmeric, Red Chilli, Black Salt, Asafoetida, Nigella Seeds"
    },
    {
        "filename": "achaar-masala-1kg.jpg",
        "name": "ACHAAR MASALA",
        "hindi": "अचार मसाला",
        "weight": "1 KG",
        "type": "pouch",
        "pouch_color": (210, 110, 60),
        "ingredients": "Coriander Seeds, Cumin Seeds, Fenugreek Seeds, Fennel Seeds, Mustard Seeds, Turmeric, Red Chilli, Black Salt, Asafoetida, Nigella Seeds"
    }
]

print("🎨 Creating PERFECT Product Packaging...")
print("━" * 70)

for product in products:
    print(f"Creating {product['filename']}...")
    img = create_professional_pickle_jar(product)
    output_path = os.path.join(output_dir, product['filename'])
    img.save(output_path, 'JPEG', quality=98, optimize=True)
    print(f"✓ {product['filename']}")

print("\n" + "━" * 70)
print("✅ PERFECT packaging created!")
print("   • Labels perfectly aligned")
print("   • Jars FILLED with pickle")
print("   • Professional appearance")
