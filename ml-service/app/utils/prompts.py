from typing import Optional, List

def hex_to_color_name(hex_color: str) -> str:
    clean_hex = hex_color.replace('#', '').lower()
    r = int(clean_hex[0:2], 16)
    g = int(clean_hex[2:4], 16)
    b = int(clean_hex[4:6], 16)
    
    if r > 200 and g > 200 and b > 200:
        return 'white'
    if r < 50 and g < 50 and b < 50:
        return 'black'
    
    max_val = max(r, g, b)
    min_val = min(r, g, b)
    diff = max_val - min_val
    
    if diff < 30:
        if max_val > 180:
            return 'light gray'
        if max_val > 100:
            return 'gray'
        return 'dark gray'
    
    if r >= max_val and g >= max_val:
        return 'yellow'
    
    if r >= max_val and b >= max_val:
        if r > 180 and b > 180:
            return 'pink'
        if b > r + 20:
            return 'purple'
        return 'magenta'
    
    if g >= max_val and b >= max_val:
        if g > 180 and b > 180:
            return 'cyan'
        return 'teal'
    
    if r >= max_val:
        if r > 200 and g < 100 and b < 100:
            return 'red'
        if g > 100:
            return 'orange'
        return 'red'
    
    if g >= max_val:
        if g > 200 and r < 100 and b < 100:
            return 'green'
        return 'green'
    
    if b >= max_val:
        if b > 180:
            return 'light blue'
        if b > 120:
            return 'blue'
        return 'navy'
    
    return 'vibrant'

def format_color_names(color_names: List[str]) -> str:
    unique_names = list(dict.fromkeys(color_names))
    
    if len(unique_names) == 0:
        return "vibrant"
    if len(unique_names) == 1:
        return unique_names[0]
    if len(unique_names) == 2:
        return f"{unique_names[0]} and {unique_names[1]}"
    
    last = unique_names.pop()
    return f"{', '.join(unique_names)}, and {last}"

def build_logo_prompt(
    description: str,
    style: str,
    industry: Optional[str] = None,
    colors: Optional[List[str]] = None,
    additional_details: Optional[str] = None
) -> str:
    color_names = []
    if colors:
        print(f"Input hex colors: {colors}")
        for color in colors:
            if color.startswith('#'):
                color_name = hex_to_color_name(color)
                color_names.append(color_name)
                print(f"  {color} -> {color_name}")
            else:
                color_names.append(color)
    
    color_palette = format_color_names(color_names) if color_names else "vibrant"
    print(f"Formatted color palette: '{color_palette}'")
    
    description_clean = description.strip()
    additional_clean = additional_details.strip() if additional_details else ""
    
    if additional_clean and additional_clean.lower() == description_clean.lower():
        additional_clean = ""
    
    prompt_parts = [
        "LogoRedAF",
        description_clean,
        f"{style} style" if style else "minimal style",
        f"{color_palette} color palette",
        "single logo design",
        "white background",
        "vector art",
        "clean and simple"
    ]
    
    if industry:
        prompt_parts.append(f"{industry} branding")
    
    if additional_clean:
        prompt_parts.append(additional_clean)
    
    prompt_parts.extend([
        "minimal detail",
        "high contrast"
    ])
    
    prompt = ", ".join(filter(None, prompt_parts))
    prompt = prompt.replace(",,", ",").replace(", ,", ",").strip()
    
    print(f"Final prompt: {prompt}")
    
    return prompt

def get_negative_prompt() -> str:
    return (
        "multiple logos, grid layout, mockup, blurry, low quality, "
        "3d render, photograph, realistic, busy background, cluttered, "
        "text artifacts, watermark, signature, frame, border, "
        "wrong colors, off-brand colors, different colors, muted colors"
    )
