#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

output_dir = "/home/ubuntu/agent/jain-sahab-special/frontend/public"
os.makedirs(output_dir, exist_ok=True)

# Create logo
width, height = 400, 400
img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Draw circular background with gradient
for i in range(200, 0, -1):
    alpha = int(255 * (i / 200))
    color = (241, 115, 21, alpha)  # Orange gradient
    draw.ellipse([200-i, 200-i, 200+i, 200+i], fill=color)

# Inner circle
draw.ellipse([50, 50, 350, 350], fill='#F07315', outline='#E1580B', width=8)

# Draw pickle jar silhouette
jar_color = '#FFF8DC'
# Jar body
draw.ellipse([120, 100, 280, 160], fill=jar_color, outline='white', width=3)
draw.rectangle([120, 130, 280, 280], fill=jar_color, outline='white', width=3)
draw.ellipse([120, 250, 280, 310], fill=jar_color, outline='white', width=3)

# Jar lid
draw.rectangle([140, 80, 260, 110], fill='#DAA520', outline='white', width=2)

# Try to use a nice font
try:
    font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 35)
    font_hindi = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
except:
    font_large = ImageFont.load_default()
    font_small = ImageFont.load_default()
    font_hindi = ImageFont.load_default()

# Draw "JS" in the jar
js_text = "JS"
js_bbox = draw.textbbox((0, 0), js_text, font=font_large)
js_w = js_bbox[2] - js_bbox[0]
draw.text(((width - js_w) // 2, 170), js_text, fill='#E1580B', font=font_large)

# Save logo
logo_path = os.path.join(output_dir, 'logo.png')
img.save(logo_path, 'PNG')
print(f"✓ Logo created: {logo_path}")

# Create favicon
favicon = img.resize((64, 64), Image.Resampling.LANCZOS)
favicon_path = os.path.join(output_dir, 'favicon.ico')
favicon.save(favicon_path, 'ICO')
print(f"✓ Favicon created: {favicon_path}")

print("\n✓ Branding assets generated successfully!")
