import os
import re

directory = r"c:\Users\Yasir\Pictures\world-of-comfort\WOC\assets"
files_to_convert = [
    "component-cart-drawer.css",
    "component-cart-items.css",
    "component-totals.css",
    "component-cart.css"
]

def replace_rem_with_px(match):
    value_rem = float(match.group(1))
    value_px = value_rem * 10
    # format without trailing zero if integer
    if value_px.is_integer():
        return f"{int(value_px)}px"
    else:
        return f"{value_px}px"

for filename in files_to_convert:
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = re.sub(r'([0-9]*\.?[0-9]+)rem', replace_rem_with_px, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
print("Conversion complete.")
