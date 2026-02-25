#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import math

# Create professional logo
width, height = 400, 400
img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

center_x, center_y = width // 2, height // 2

# Load fonts
try:
    title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
    subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
    text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
except:
    title_font = subtitle_font = text_font = ImageFont.load_default()

# Circular background - orange/red gradient
for i in range(180, 0, -2):
    color_r = int(220 - (180 - i) * 0.3)
    color_g = int(100 + (180 - i) * 0.2)
    color_b = 40
    draw.ellipse([center_x - i, center_y - i, center_x + i, center_y + i],
                fill=(color_r, color_g, color_b), outline=None)

# Outer border
draw.ellipse([10, 10, width - 10, height - 10],
            outline=(180, 80, 30), width=8)

# Inner border
draw.ellipse([25, 25, width - 25, height - 25],
            outline=(240, 200, 150), width=3)

# Pickle jar icon (simple)
jar_width = 100
jar_height = 130
jar_x = center_x - jar_width // 2
jar_y = 60

# Jar body
draw.rectangle([jar_x, jar_y + 20, jar_x + jar_width, jar_y + jar_height],
              fill=(255, 240, 200), outline=(120, 80, 40), width=3)
# Jar top
draw.ellipse([jar_x, jar_y, jar_x + jar_width, jar_y + 40],
            fill=(255, 240, 200), outline=(120, 80, 40), width=3)
# Lid
draw.ellipse([jar_x - 5, jar_y - 15, jar_x + jar_width + 5, jar_y + 25],
            fill=(200, 160, 80), outline=(140, 110, 50), width=3)

# Pickle content in jar
for i in range(8):
    for j in range(3):
        px = jar_x + 20 + i * 10
        py = jar_y + 40 + j * 25
        draw.ellipse([px, py, px + 12, py + 12], fill=(255, 150, 50))

# Text: JSS
jss_text = "JSS"
jss_bbox = draw.textbbox((0, 0), jss_text, font=title_font)
jss_w = jss_bbox[2] - jss_bbox[0]
jss_x = center_x - jss_w // 2

# JSS shadow
draw.text((jss_x + 3, 205), jss_text, fill=(80, 40, 20), font=title_font)
# JSS main
draw.text((jss_x, 202), jss_text, fill=(255, 255, 255), font=title_font)

# Subtitle
sub_text = "JAIN SAHAB SPECIAL"
sub_bbox = draw.textbbox((0, 0), sub_text, font=text_font)
sub_w = sub_bbox[2] - sub_bbox[0]
draw.text((center_x - sub_w // 2, 270), sub_text, fill=(255, 240, 200), font=text_font)

# Tagline
tag_text = "Traditional Pickles"
tag_bbox = draw.textbbox((0, 0), tag_text, font=text_font)
tag_w = tag_bbox[2] - tag_bbox[0]
draw.text((center_x - tag_w // 2, 305), tag_text, fill=(255, 240, 200), font=text_font)

# Save
output_path = "/home/ubuntu/agent/jain-sahab-special/frontend/public/logo.png"
img.save(output_path, 'PNG', quality=95)
print("✅ Professional logo created!")
print(f"   Saved to: {output_path}")
print("   • Clean circular design")
print("   • Simple pickle jar icon")
print("   • JSS branding")
print("   • Professional look")
