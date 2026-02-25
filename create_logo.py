#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import math

# Create a new image with transparent background
width, height = 400, 400
img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Colors
skin_color = (255, 220, 177)  # Skin tone
hair_color = (50, 30, 20)  # Dark brown hair
eye_color = (80, 50, 30)  # Brown eyes
mouth_color = (200, 100, 100)  # Mouth
shirt_color = (200, 120, 60)  # Orange/brown shirt
pickle_color = (180, 140, 0)  # Pickle yellow/green
outline_color = (40, 20, 10)  # Dark brown outline

center_x, center_y = width // 2, height // 2

# Draw face (circle)
face_radius = 120
draw.ellipse([center_x - face_radius, center_y - face_radius,
              center_x + face_radius, center_y + face_radius],
             fill=skin_color, outline=outline_color, width=4)

# Draw hair
hair_points = []
for angle in range(180, 360, 10):
    rad = math.radians(angle)
    x = center_x + (face_radius + 20) * math.cos(rad)
    y = center_y + (face_radius + 20) * math.sin(rad)
    hair_points.append((x, y))
if hair_points:
    draw.polygon([(center_x - face_radius - 20, center_y),
                  *hair_points,
                  (center_x + face_radius + 20, center_y)],
                fill=hair_color, outline=outline_color, width=3)

# Draw eyes (happy eyes)
eye_y = center_y - 30
eye_offset = 40

# Left eye (closed/happy)
draw.arc([center_x - eye_offset - 20, eye_y - 10,
          center_x - eye_offset + 20, eye_y + 10],
         start=0, end=180, fill=outline_color, width=5)

# Right eye (closed/happy)
draw.arc([center_x + eye_offset - 20, eye_y - 10,
          center_x + eye_offset + 20, eye_y + 10],
         start=0, end=180, fill=outline_color, width=5)

# Draw nose
nose_y = center_y
draw.line([center_x, nose_y - 15, center_x - 5, nose_y], fill=outline_color, width=3)
draw.line([center_x - 5, nose_y, center_x + 5, nose_y], fill=outline_color, width=3)

# Draw big smile (person enjoying pickle)
smile_y = center_y + 30
draw.arc([center_x - 60, smile_y - 30,
          center_x + 60, smile_y + 40],
         start=0, end=180, fill=outline_color, width=8)

# Draw tongue (eating)
tongue_y = smile_y + 15
draw.ellipse([center_x - 20, tongue_y, center_x + 20, tongue_y + 20],
            fill=(255, 120, 120), outline=outline_color, width=2)

# Draw pickle piece near mouth (being eaten)
pickle_x = center_x + 80
pickle_y = center_y + 20

# Draw pickle jar shape
pickle_points = [
    (pickle_x, pickle_y - 25),
    (pickle_x - 15, pickle_y - 20),
    (pickle_x - 20, pickle_y),
    (pickle_x - 15, pickle_y + 20),
    (pickle_x, pickle_y + 25),
    (pickle_x + 15, pickle_y + 20),
    (pickle_x + 20, pickle_y),
    (pickle_x + 15, pickle_y - 20)
]
draw.polygon(pickle_points, fill=(255, 200, 0), outline=(150, 100, 0), width=3)

# Add pickle texture (dots)
for i in range(5):
    for j in range(3):
        dot_x = pickle_x - 10 + i * 5
        dot_y = pickle_y - 15 + j * 8
        draw.ellipse([dot_x - 1, dot_y - 1, dot_x + 1, dot_y + 1],
                    fill=(180, 140, 0))

# Draw hand holding pickle
hand_y = center_y + 60
draw.ellipse([pickle_x - 10, hand_y, pickle_x + 10, hand_y + 30],
            fill=skin_color, outline=outline_color, width=3)

# Draw fingers
for i in range(3):
    finger_x = pickle_x - 5 + i * 5
    draw.line([finger_x, hand_y, finger_x, hand_y - 15],
             fill=skin_color, width=4)
    draw.line([finger_x, hand_y, finger_x, hand_y - 15],
             fill=outline_color, width=1)

# Draw shirt/body (bottom part)
body_y = center_y + face_radius - 20
draw.rectangle([center_x - face_radius, body_y,
               center_x + face_radius, height],
              fill=shirt_color, outline=outline_color, width=3)

# Add "JSS" text at bottom
try:
    title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 50)
except:
    title_font = ImageFont.load_default()

text = "JSS"
text_bbox = draw.textbbox((0, 0), text, font=title_font)
text_w = text_bbox[2] - text_bbox[0]
text_x = center_x - text_w // 2

# Draw text with shadow
shadow_offset = 3
draw.text((text_x + shadow_offset, height - 70 + shadow_offset), text,
          fill=(0, 0, 0, 100), font=title_font)
draw.text((text_x, height - 70), text,
          fill=(200, 50, 0), font=title_font)

# Draw circular border
draw.ellipse([10, 10, width - 10, height - 10],
            outline=(200, 100, 0), width=6)

# Save
output_path = "/home/ubuntu/agent/jain-sahab-special/frontend/public/logo.png"
img.save(output_path, 'PNG', quality=95)
print(f"✅ Logo created: {output_path}")
print("   👨 Person's face eating pickle")
print("   🥒 Pickle in hand near mouth")
print("   😊 Happy expression enjoying the taste")
