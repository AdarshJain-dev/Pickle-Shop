#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os
import random

output_dir = "/home/ubuntu/agent/jain-sahab-special/backend/uploads"
os.makedirs(output_dir, exist_ok=True)

def create_realistic_pickle_jar(product_info):
    """Create a realistic pickle jar image"""
    width, height = 1200, 1200

    # Create base image with gradient background
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Background gradient (light to slightly darker)
    for y in range(height):
        shade = int(255 - (y / height * 15))
        draw.rectangle([(0, y), (width, y+1)], fill=(shade, shade, shade + 5))

    # Add subtle shadow for depth
    shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)

    # Draw jar shadow
    jar_center_x = width // 2
    jar_center_y = height // 2 + 50
    jar_width = 450
    jar_height = 600

    # Shadow ellipse
    shadow_draw.ellipse([
        jar_center_x - jar_width//2 + 20,
        jar_center_y + jar_height//2 - 50,
        jar_center_x + jar_width//2 + 20,
        jar_center_y + jar_height//2 + 80
    ], fill=(0, 0, 0, 40))

    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    img.paste(shadow, (0, 0), shadow)

    # Draw the glass jar with realistic effects
    jar_left = jar_center_x - jar_width // 2
    jar_top = jar_center_y - jar_height // 2

    # Jar body (glass effect with transparency simulation)
    jar_body = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    jar_draw = ImageDraw.Draw(jar_body)

    # Main jar shape - cylindrical
    jar_color = (230, 240, 245)  # Light blue-ish glass

    # Top ellipse (jar opening)
    jar_draw.ellipse([
        jar_left, jar_top,
        jar_left + jar_width, jar_top + 120
    ], fill=jar_color, outline=(180, 190, 200), width=4)

    # Jar body rectangle
    jar_draw.rectangle([
        jar_left, jar_top + 60,
        jar_left + jar_width, jar_top + jar_height
    ], fill=jar_color, outline=(180, 190, 200), width=4)

    # Bottom ellipse
    jar_draw.ellipse([
        jar_left, jar_top + jar_height - 60,
        jar_left + jar_width, jar_top + jar_height + 60
    ], fill=jar_color, outline=(180, 190, 200), width=4)

    # Add glass shine/reflection
    shine = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    shine_draw = ImageDraw.Draw(shine)
    shine_draw.ellipse([
        jar_left + 50, jar_top + 150,
        jar_left + 200, jar_top + 400
    ], fill=(255, 255, 255, 60))
    shine = shine.filter(ImageFilter.GaussianBlur(15))

    img.paste(jar_body, (0, 0), jar_body)
    img.paste(shine, (0, 0), shine)

    # Pickle contents (colored fill inside jar)
    content_color = product_info['content_color']
    content_fill = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    content_draw = ImageDraw.Draw(content_fill)

    # Add pickle pieces/texture
    for i in range(30):
        x = random.randint(jar_left + 80, jar_left + jar_width - 80)
        y = random.randint(jar_top + 200, jar_top + jar_height - 100)
        size = random.randint(20, 50)
        content_draw.ellipse([x, y, x + size, y + size], fill=content_color)

    # Blur for realistic effect
    content_fill = content_fill.filter(ImageFilter.GaussianBlur(3))
    img.paste(content_fill, (0, 0), content_fill)

    # Add oil/liquid effect on top
    oil_overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    oil_draw = ImageDraw.Draw(oil_overlay)
    oil_draw.ellipse([
        jar_left + 40, jar_top + 180,
        jar_left + jar_width - 40, jar_top + 220
    ], fill=(255, 200, 50, 100))
    oil_overlay = oil_overlay.filter(ImageFilter.GaussianBlur(8))
    img.paste(oil_overlay, (0, 0), oil_overlay)

    # Metal lid
    lid = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    lid_draw = ImageDraw.Draw(lid)

    # Lid top
    lid_color = (200, 160, 80)  # Golden metallic
    lid_draw.ellipse([
        jar_left + 30, jar_top - 40,
        jar_left + jar_width - 30, jar_top + 30
    ], fill=lid_color, outline=(150, 120, 50), width=3)

    # Lid side
    lid_draw.rectangle([
        jar_left + 30, jar_top,
        jar_left + jar_width - 30, jar_top + 50
    ], fill=(180, 140, 60))

    # Lid ridges for grip
    for i in range(8):
        y_pos = jar_top + 5 + (i * 5)
        lid_draw.line([
            jar_left + 30, y_pos,
            jar_left + jar_width - 30, y_pos
        ], fill=(150, 120, 50), width=2)

    img.paste(lid, (0, 0), lid)

    # Label on jar
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 55)
        brand_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 50)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        brand_font = ImageFont.load_default()
        small_font = ImageFont.load_default()

    # Label background (cream colored paper)
    label_width = 350
    label_height = 400
    label_x = jar_center_x - label_width // 2
    label_y = jar_center_y - 50

    # Label with slight curve effect
    label_img = Image.new('RGBA', (label_width, label_height), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label_img)

    # Label background
    label_draw.rectangle([0, 0, label_width, label_height], fill=(255, 248, 230), outline=(139, 69, 19), width=5)

    # Decorative border
    label_draw.rectangle([10, 10, label_width-10, label_height-10], outline=(210, 105, 30), width=3)

    # Brand name
    brand_text = "Jain Sahab\nSpecial"
    brand_bbox = label_draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_w = brand_bbox[2] - brand_bbox[0]
    label_draw.text((label_width//2 - brand_w//2, 25), brand_text, fill=(139, 69, 19), font=brand_font, align='center')

    # Divider line
    label_draw.line([30, 140, label_width-30, 140], fill=(210, 105, 30), width=3)

    # Product name
    title_bbox = label_draw.textbbox((0, 0), product_info['title'], font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    label_draw.text((label_width//2 - title_w//2, 160), product_info['title'], fill=(178, 34, 34), font=title_font)

    # Hindi name
    hindi_bbox = label_draw.textbbox((0, 0), product_info['hindi'], font=subtitle_font)
    hindi_w = hindi_bbox[2] - hindi_bbox[0]
    label_draw.text((label_width//2 - hindi_w//2, 260), product_info['hindi'], fill=(85, 107, 47), font=subtitle_font)

    # Footer text
    footer_text = "Premium Quality"
    footer_bbox = label_draw.textbbox((0, 0), footer_text, font=small_font)
    footer_w = footer_bbox[2] - footer_bbox[0]
    label_draw.text((label_width//2 - footer_w//2, 340), footer_text, fill=(139, 69, 19), font=small_font)

    # Paste label onto jar
    img.paste(label_img, (label_x, label_y), label_img)

    # Add final touches - table reflection
    reflection = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    reflection_draw = ImageDraw.Draw(reflection)
    reflection_draw.ellipse([
        jar_center_x - jar_width//2 - 30,
        jar_center_y + jar_height//2 + 60,
        jar_center_x + jar_width//2 + 30,
        jar_center_y + jar_height//2 + 100
    ], fill=(255, 255, 255, 20))
    img.paste(reflection, (0, 0), reflection)

    # Enhance colors
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.2)

    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.1)

    return img

# Product definitions with realistic colors
products = [
    {
        "name": "mango-pickle.jpg",
        "title": "Mango",
        "hindi": "आम का अचार",
        "content_color": (255, 180, 60, 180)  # Orange-yellow mango pieces
    },
    {
        "name": "lemon-pickle.jpg",
        "title": "Lemon",
        "hindi": "निम्बू का अचार",
        "content_color": (255, 230, 100, 180)  # Yellow lemon
    },
    {
        "name": "lemon-chili-pickle.jpg",
        "title": "Lemon Chili",
        "hindi": "निम्बू मिर्ची",
        "content_color": (220, 80, 40, 180)  # Red-orange chili
    },
    {
        "name": "amla-pickle.jpg",
        "title": "Amla",
        "hindi": "आंवला का अचार",
        "content_color": (150, 200, 100, 180)  # Green amla
    },
    {
        "name": "achaar-masala.jpg",
        "title": "Masala",
        "hindi": "अचार मसाला",
        "content_color": (180, 90, 40, 180)  # Brown masala
    }
]

print("🎨 Creating realistic product images...")
print("━" * 60)

for product in products:
    print(f"Creating {product['name']}...")
    img = create_realistic_pickle_jar(product)
    output_path = os.path.join(output_dir, product['name'])
    img.save(output_path, 'JPEG', quality=95)
    print(f"✓ Saved: {output_path}")

print("\n" + "━" * 60)
print("✅ All realistic product images created successfully!")
