# ML Service Documentation

Complete documentation for the Modal-based ML inference service powering the logo generator.

## Table of Contents
1. [Architecture](#architecture)
2. [Setup & Deployment](#setup--deployment)
3. [Color System](#color-system)
4. [Prompt Engineering](#prompt-engineering)
5. [Modal Best Practices](#modal-best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Architecture

### Project Structure

```
ml-service/
├── app/
│   ├── main.py              # Modal app + web endpoint definitions
│   ├── core/
│   │   └── config.py        # Modal configuration, GPU settings, model paths
│   ├── schemas/
│   │   └── logo.py          # Pydantic request/response models
│   ├── services/
│   │   ├── generation.py    # Logo generation business logic (SDXL + LoRA)
│   │   ├── segmentation.py  # SAM segmentation logic
│   │   └── inpainting.py    # Inpainting business logic
│   ├── utils/
│   │   ├── image.py         # Base64/PIL conversion utilities
│   │   └── prompts.py       # Prompt engineering functions
│   └── routers/
│       └── logos.py         # Modal GPU function wrappers
├── requirements.txt
└── ML_SERVICE.md
```

### Design Principles

1. **FastAPI-Style Organization**: Clear separation of concerns
2. **All Imports at Top**: No lazy loading except for heavy ML libraries inside GPU functions
3. **Type Safety**: Pydantic models for all requests/responses
4. **Separation of Concerns**:
   - `core/` - Infrastructure and configuration
   - `schemas/` - Data validation
   - `services/` - Pure business logic
   - `utils/` - Helper functions
   - `routers/` - Modal function definitions
   - `main.py` - Web endpoints

### GPU Configuration

**A10G (Logo Generation)**
- VRAM: 24GB
- Cost: ~$1.10/hour
- Use: SDXL generation with LoRA
- Timeout: 600s
- Scale down: 120s

**T4 (Segmentation)**
- VRAM: 16GB
- Cost: ~$0.60/hour
- Use: SAM segmentation
- Timeout: 300s
- Scale down: 120s

---

## Setup & Deployment

### Prerequisites

```bash
# Install Modal CLI only - no ML dependencies needed locally!
pip install modal

# Authenticate
modal token new
```

### Deploy

```bash
cd ml-service
modal deploy -m app.main
```

**Output:**
```
✓ Created web function generate_logo => https://username--logo-generator-ml-generate-logo.modal.run
✓ Created web function segment_image => https://username--logo-generator-ml-segment-image.modal.run
✓ Created web function inpaint_logo => https://username--logo-generator-ml-inpaint-logo.modal.run
✓ Created web function health => https://username--logo-generator-ml-health.modal.run
```

Add these URLs to `frontend/.env.local`:
```env
NEXT_PUBLIC_MODAL_GENERATE_URL="https://username--logo-generator-ml-generate-logo.modal.run"
NEXT_PUBLIC_MODAL_SEGMENT_URL="https://username--logo-generator-ml-segment-image.modal.run"
NEXT_PUBLIC_MODAL_INPAINT_URL="https://username--logo-generator-ml-inpaint-logo.modal.run"
```

### Test Deployment

```bash
# Health check
curl https://username--logo-generator-ml-health.modal.run

# Expected: {"status":"healthy","service":"logo-generator-ml"}

# View logs
modal logs logo-generator-ml

# Test generation locally
modal run -m app.main::test
```

---

## Color System

### Problem Solved

**Before:**
```
Input: ["#9257db", "#95bbf9"]
Output: "blue, blue colored mountain peak"
```
Both colors incorrectly mapped to "blue", causing duplicate and inaccurate prompts.

**After:**
```
Input: ["#9257db", "#95bbf9"]
Converted: ["purple", "light blue"]
Output: "purple and light blue color palette"
```

### Hex to Color Name Conversion

The `hex_to_color_name()` function in `app/utils/prompts.py` uses intelligent RGB analysis:

```python
def hex_to_color_name(hex_color: str) -> str:
    r, g, b = parse_hex(hex_color)
    
    # Black/white detection
    if r > 200 and g > 200 and b > 200: return 'white'
    if r < 50 and g < 50 and b < 50: return 'black'
    
    # Grayscale detection (low saturation)
    if saturation < 30:
        return 'light gray' | 'gray' | 'dark gray'
    
    # Two-channel dominance (mixed colors)
    if r ≈ g: return 'yellow'
    if r ≈ b: return 'purple' | 'pink' | 'magenta'
    if g ≈ b: return 'cyan' | 'teal'
    
    # Single channel dominance
    if r is dominant: return 'red' | 'orange'
    if g is dominant: return 'green'
    if b is dominant: return 'light blue' | 'blue' | 'navy'
```

**Key Features:**
- Distinguishes purple from blue (`b > r + 20`)
- Detects brightness levels (light blue 180+, blue 120+, navy <120)
- Identifies grayscale colors
- Handles pink, cyan, teal, orange, etc.

### Color Formatting

The `format_color_names()` function ensures proper grammar:

```python
# 1 color
["red"] → "red"

# 2 colors
["red", "blue"] → "red and blue"

# 3+ colors (Oxford comma)
["red", "blue", "green"] → "red, blue, and green"

# Deduplicates
["blue", "blue"] → "blue"
```

### Logging

Modal logs show full color conversion:
```
Input hex colors: ['#9257db', '#95bbf9']
  #9257db -> purple
  #95bbf9 -> light blue
Formatted color palette: 'purple and light blue'
```

---

## Prompt Engineering

### Prompt Structure

**Template:**
```
LogoRedAF, {description}, {style} style, {color_palette} color palette,
single logo design, white background, vector art, clean and simple,
{industry} branding, {additional_details}, minimal detail, high contrast
```

**Example:**
```
Input:
- Description: "mountain peak"
- Style: "minimal"
- Colors: ["#9257db", "#95bbf9"]
- Industry: "Hiking"

Output:
"LogoRedAF, mountain peak, minimal style, purple and light blue color palette,
single logo design, white background, vector art, clean and simple,
Hiking branding, minimal detail, high contrast"
```

### Key Improvements

**Before (redundant, 242 chars):**
```
LogoRedAF, blue, blue colored mountain peak, minimal style, using only blue, blue colors,
(blue, blue) color scheme, single logo design, white background, vector art, clean and simple,
Hiking branding, strict blue, blue palette, minimal detail, high contrast
```

**After (clean, 170 chars - 30% shorter):**
```
LogoRedAF, mountain peak, minimal style, purple and light blue color palette,
single logo design, white background, vector art, clean and simple,
Hiking branding, minimal detail, high contrast
```

### Negative Prompt

```
multiple logos, grid layout, mockup, blurry, low quality, 3d render, photograph, realistic,
busy background, cluttered, text artifacts, watermark, signature, frame, border,
wrong colors, off-brand colors, different colors, muted colors
```

Explicitly prevents:
- Grid/mockup layouts
- Wrong or off-brand colors
- Busy backgrounds
- Low quality outputs

### Generation Parameters

**Optimized for Accuracy:**
```python
guidance_scale=12.0        # Very strict prompt adherence (default: 7.5)
num_inference_steps=35     # Higher quality (default: 30)
```

**Why guidance_scale=12.0?**
- User-facing logos need exact specifications
- Higher guidance = model prioritizes prompt over creativity
- Better color accuracy
- More predictable results

---

## Modal Best Practices

### 1. Lazy Imports for Heavy Libraries

**Why:** Modal validates your code locally before deployment. Heavy ML imports will fail if not installed locally.

**Solution:** Import inside GPU functions:

```python
# ❌ BAD: At file top
import torch
from diffusers import DiffusionPipeline

def generate_logo():
    pipe = DiffusionPipeline.from_pretrained(...)
```

```python
# ✅ GOOD: Inside GPU function
def generate_logo():
    import torch
    from diffusers import DiffusionPipeline
    
    pipe = DiffusionPipeline.from_pretrained(...)
```

### 2. System Packages

If you need `git` or `curl` in the container:

```python
image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("git", "curl")  # System packages
    .pip_install("fastapi[standard]")
    .pip_install_from_requirements("requirements.txt")
)
```

### 3. FastAPI Installation

Explicitly install FastAPI in the image:

```python
.pip_install("fastapi[standard]")
```

Then reference the image in function decorators:

```python
@app.function(image=image)
@modal.web_endpoint(method="POST")
def generate_logo(data: dict):
    # ...
```

### 4. Model Caching

Models are cached in Modal volumes:

```python
model_volume = modal.Volume.from_name("logo-models", create_if_missing=True)

GPU_CONFIG_A10G = {
    "gpu": "A10G",
    "image": image,
    "volumes": {"/models": model_volume},  # Cache here
}

# In service function
pipe = DiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    cache_dir="/models/huggingface"  # Use volume
)
```

### 5. CORS Headers

For direct frontend calls, add CORS to responses:

```python
from fastapi.responses import JSONResponse

@app.function(image=image)
@modal.web_endpoint(method="POST")
def generate_logo(data: dict):
    result = generate_logo_endpoint.local(request)
    return JSONResponse(
        content=result.model_dump(),
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )
```

### 6. Local vs Remote Calls

**Within Modal app (web endpoints calling GPU functions):**
```python
# Use .local() to avoid redirects
result = generate_logo_internal.local(request)
```

**From external services:**
```python
# Use .remote() for actual distributed execution
result = generate_logo_internal.remote(request)
```

---

## Troubleshooting

### Issue: "Module 'modal' has no attribute 'Stub'"

**Cause:** Modal API changed `Stub` → `App`

**Fix:**
```python
# Before
stub = modal.Stub("logo-generator-ml")

# After
app = modal.App("logo-generator-ml")
```

Also update:
- `container_idle_timeout` → `scaledown_window`
- `@modal.web_endpoint` → `@modal.fastapi_endpoint` (deprecation warning)

### Issue: "FastAPI not installed in Image"

**Cause:** Image doesn't have FastAPI or was cached without it

**Fix:**
```python
image = (
    modal.Image.debian_slim(python_version="3.10")
    .pip_install("fastapi[standard]")  # Explicit install
    .pip_install_from_requirements("requirements.txt")
)

# Then explicitly reference in decorators
@app.function(image=image)  # Must specify image!
```

### Issue: "git: command not found"

**Cause:** Installing from GitHub requires `git` in container

**Fix:**
```python
image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("git")  # Add git
    .pip_install("git+https://github.com/...")
)
```

### Issue: "ImportError: cannot import 'cached_download'"

**Cause:** Heavy ML libraries imported at file top level during local validation

**Fix:** Move imports inside GPU functions:
```python
def generate_logo():
    import torch  # Import inside function
    from diffusers import DiffusionPipeline
    # ...
```

### Issue: CORS errors from frontend

**Cause:** Missing CORS headers in responses

**Fix:** Use `JSONResponse` with explicit headers (see CORS Headers section above)

### Issue: 303 redirects on web endpoints

**Cause:** Using `.remote()` instead of `.local()` within Modal app

**Fix:**
```python
# Web endpoint calling GPU function
result = generate_logo_internal.local(request)  # Not .remote()
```

---

## Performance & Cost

### Generation Times

- **Cold start**: 15-20 seconds (first request after idle)
- **Warm**: 5-10 seconds (model already loaded)
- **Scaling**: Automatic scale-down after 120 seconds

### Cost Breakdown

**Per Logo Generation:**
- A10G GPU: ~5-10 seconds = ~$0.0015-$0.003
- Total: ~$0.005 per logo

**Monthly Estimate:**
- 100 logos: ~$0.50
- 500 logos: ~$2.50
- 1,000 logos: ~$5.00
- **Plus $30 free credit**

### Optimization Tips

1. **Reduce inference steps** (35 → 30): Faster but slightly lower quality
2. **Lower guidance scale** (12.0 → 10.0): Faster but less prompt adherence
3. **Use T4 instead of A10G**: Cheaper but slower
4. **Batch requests**: Process multiple at once (future feature)

---

## API Reference

### Generate Logo

**Endpoint:** `POST /generate_logo`

**Request:**
```json
{
  "description": "coffee cup with steam",
  "style": "minimal",
  "industry": "cafe",
  "colors": ["#8B4513", "#FFFFFF"],
  "width": 1024,
  "height": 1024,
  "additional_details": "elegant and modern",
  "seed": 12345
}
```

**Response:**
```json
{
  "image_base64": "iVBORw0KGgoAAAANS...",
  "prompt_used": "LogoRedAF, coffee cup with steam, minimal style, brown and white color palette...",
  "seed": 12345,
  "generation_time_seconds": 8.5
}
```

### Segment Image

**Endpoint:** `POST /segment_image`

**Request:**
```json
{
  "image_base64": "iVBORw0KGgoAAAANS...",
  "points": [[512, 512], [600, 400]],
  "labels": [1, 1]
}
```

**Response:**
```json
{
  "mask_base64": "iVBORw0KGgoAAAANS..."
}
```

### Inpaint Logo

**Endpoint:** `POST /inpaint_logo`

**Request:**
```json
{
  "image_base64": "iVBORw0KGgoAAAANS...",
  "mask_base64": "iVBORw0KGgoAAAANS...",
  "edit_instruction": "change color to blue",
  "seed": 12345
}
```

**Response:**
```json
{
  "image_base64": "iVBORw0KGgoAAAANS...",
  "seed": 12345,
  "prompt_used": "professional logo design, change color to blue"
}
```

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "logo-generator-ml"
}
```

---

## Development

### Local Testing

```bash
# Run test function
modal run -m app.main::test

# View logs
modal logs logo-generator-ml

# Follow logs in real-time
modal logs logo-generator-ml --follow
```

### Debugging

1. **Check Modal Dashboard**: https://modal.com/apps
2. **View Function Execution**: Click on any function run
3. **Check Logs**: Look for print statements and errors
4. **Test Endpoints**: Use `curl` or Postman

### Code Style

- All imports at top (except heavy ML libs)
- Type hints everywhere
- Pydantic models for validation
- Comprehensive logging
- No comments (self-documenting code)

---

## Future Improvements

1. **Batch Processing**: Generate multiple logos in one request
2. **Caching**: Cache generated logos for identical prompts
3. **A/B Testing**: Generate variants, return best
4. **ControlNet Integration**: Exact color control via color palette images
5. **Post-Processing**: Automatic color correction and enhancement
6. **Analytics**: Track popular styles, colors, industries

---

**Last Updated**: 2026-01-16  
**Modal Version**: 1.0+  
**Python Version**: 3.10
