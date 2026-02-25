#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Create output directory
output_dir = "/home/ubuntu/agent/jain-sahab-special/backend/uploads"
os.makedirs(output_dir, exist_ok=True)

# Product definitions with colors
products = [
    {
        "name": "mango-pickle.jpg",
        "title": "Mango\nPickle",
        "hindi": "आम का अचार",
        "bg_color": "#FF9500",
        "emoji": "🥭"
    },
    {
        "name": "lemon-pickle.jpg",
        "title": "Lemon\nPickle",
        "hindi": "निम्बू का अचार",
        "bg_color": "#FFD700",
        "emoji": "🍋"
    },
    {
        "name": "lemon-chili-pickle.jpg",
        "title": "Lemon Chili\nPickle",
        "hindi": "निम्बू मिर्ची",
        "bg_color": "#DC143C",
        "emoji": "🌶️🍋"
    },
    {
        "name": "amla-pickle.jpg",
        "title": "Amla\nPickle",
        "hindi": "आंवला का अचार",
        "bg_color": "#32CD32",
        "emoji": "🍏"
    },
    {
        "name": "achaar-masala.jpg",
        "title": "Achaar\nMasala",
        "hindi": "अचार मसाला",
        "bg_color": "#D2691E",
        "emoji": "🌶️"
    }
]

def create_product_image(product_info):
    # Create image
    width, height = 800, 800
    img = Image.new('RGB', (width, height), product_info['bg_color'])
    draw = ImageDraw.Draw(img)

    # Try to use a nice font, fallback to default
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 70)
        emoji_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 150)
        hindi_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 45)
        brand_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 35)
    except:
        title_font = ImageFont.load_default()
        emoji_font = ImageFont.load_default()
        hindi_font = ImageFont.load_default()
        brand_font = ImageFont.load_default()

    # Add gradient effect (darker at bottom)
    for y in range(height):
        alpha = int(50 * (y / height))
        draw.rectangle([(0, y), (width, y+1)], fill=(0, 0, 0, alpha))

    # Draw jar shape
    jar_width = 400
    jar_height = 500
    jar_x = (width - jar_width) // 2
    jar_y = 150

    # Jar body
    draw.ellipse([jar_x, jar_y, jar_x + jar_width, jar_y + 100], fill='white', outline='#8B4513', width=5)
    draw.rectangle([jar_x, jar_y + 50, jar_x + jar_width, jar_y + jar_height], fill='white', outline='#8B4513', width=5)
    draw.ellipse([jar_x, jar_y + jar_height - 50, jar_x + jar_width, jar_y + jar_height + 50], fill='white', outline='#8B4513', width=5)

    # Jar lid
    lid_height = 40
    draw.rectangle([jar_x + 50, jar_y - lid_height, jar_x + jar_width - 50, jar_y + 10], fill='#CD853F', outline='#8B4513', width=3)
    draw.ellipse([jar_x + 50, jar_y - lid_height - 20, jar_x + jar_width - 50, jar_y - lid_height + 20], fill='#DAA520', outline='#8B4513', width=3)

    # Label on jar
    label_width = 300
    label_height = 200
    label_x = (width - label_width) // 2
    label_y = jar_y + 120

    # Label background
    draw.rectangle([label_x, label_y, label_x + label_width, label_y + label_height], fill='#FFF8DC', outline='#8B4513', width=3)

    # Brand name on label
    brand_text = "Jain Sahab\nSpecial"
    brand_bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_w = brand_bbox[2] - brand_bbox[0]
    draw.text((label_x + (label_width - brand_w) // 2, label_y + 15), brand_text, fill='#8B4513', font=brand_font, align='center')

    # Product name on label
    title_bbox = draw.textbbox((0, 0), product_info['title'], font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    draw.text((label_x + (label_width - title_w) // 2, label_y + 80), product_info['title'], fill='#DC143C', font=title_font, align='center')

    # Hindi name
    hindi_bbox = draw.textbbox((0, 0), product_info['hindi'], font=hindi_font)
    hindi_w = hindi_bbox[2] - hindi_bbox[0]
    draw.text((label_x + (label_width - hindi_w) // 2, label_y + 150), product_info['hindi'], fill='#4B0082', font=hindi_font)

    # Emoji at top
    emoji_text = product_info['emoji']
    emoji_bbox = draw.textbbox((0, 0), emoji_text, font=emoji_font)
    emoji_w = emoji_bbox[2] - emoji_bbox[0]
    draw.text(((width - emoji_w) // 2, 20), emoji_text, font=emoji_font)

    # Save image
    output_path = os.path.join(output_dir, product_info['name'])
    img.save(output_path, 'JPEG', quality=95)
    print(f"Created: {output_path}")

# Generate all product images
for product in products:
    create_product_image(product)

print("\n✓ All product images generated successfully!")
