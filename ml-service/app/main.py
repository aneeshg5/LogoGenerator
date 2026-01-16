import modal
import time
from app.core.config import app, image, GPU_CONFIG_A10G, GPU_CONFIG_T4
from app.schemas import GenerateLogoRequest, SegmentRequest, InpaintRequest
from app.utils.prompts import build_logo_prompt, get_negative_prompt

@app.function(**GPU_CONFIG_A10G)
def generate_logo_internal(prompt: str, negative_prompt: str, width: int, height: int, seed: int = None):
    from app.services.generation import generate_logo as generate_logo_service
    return generate_logo_service(prompt, negative_prompt, width, height, seed)

@app.function(**GPU_CONFIG_T4)
def segment_image_internal(image_base64: str, points: list, labels: list):
    from app.services.segmentation import segment_image as segment_image_service
    return segment_image_service(image_base64, points, labels)

@app.function(**GPU_CONFIG_A10G)
def inpaint_logo_internal(image_base64: str, mask_base64: str, prompt: str, seed: int = None):
    from app.services.inpainting import inpaint_logo as inpaint_logo_service
    return inpaint_logo_service(image_base64, mask_base64, prompt, get_negative_prompt(), seed)

@app.function(image=image)
@modal.web_endpoint(method="POST")
def generate_logo(data: dict):
    from fastapi.responses import JSONResponse
    request = GenerateLogoRequest(**data)
    start = time.time()
    
    prompt = build_logo_prompt(
        description=request.description,
        style=request.style,
        industry=request.industry,
        colors=request.colors,
        additional_details=request.additional_details
    )
    
    result = generate_logo_internal.remote(
        prompt=prompt,
        negative_prompt=get_negative_prompt(),
        width=request.width,
        height=request.height,
        seed=request.seed
    )
    
    return JSONResponse(
        content={
            "image_base64": result["image_base64"],
            "prompt_used": prompt,
            "seed": result["seed"],
            "generation_time_seconds": time.time() - start
        },
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

@app.function(image=image)
@modal.web_endpoint(method="POST")
def segment_image(data: dict):
    from fastapi.responses import JSONResponse
    request = SegmentRequest(**data)
    
    mask_b64 = segment_image_internal.remote(
        image_base64=request.image_base64,
        points=request.points,
        labels=request.labels
    )
    
    return JSONResponse(
        content={"mask_base64": mask_b64},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

@app.function(image=image)
@modal.web_endpoint(method="POST")
def inpaint_logo(data: dict):
    from fastapi.responses import JSONResponse
    request = InpaintRequest(**data)
    
    result = inpaint_logo_internal.remote(
        image_base64=request.image_base64,
        mask_base64=request.mask_base64,
        prompt=request.edit_instruction,
        seed=request.seed
    )
    
    return JSONResponse(
        content={
            "image_base64": result["image_base64"],
            "seed": result["seed"],
            "prompt_used": f"professional logo design, {request.edit_instruction}"
        },
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

@app.function(image=image)
@modal.web_endpoint(method="GET")
def health():
    from fastapi.responses import JSONResponse
    return JSONResponse(
        content={"status": "healthy", "service": "logo-generator-ml"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

@app.local_entrypoint()
def test():
    print("Testing logo generation...")
    
    request = GenerateLogoRequest(
        description="coffee cup with steam",
        style="minimalist",
        industry="cafe",
        colors=["brown", "cream"],
        width=1024,
        height=1024
    )
    
    response = generate_logo.remote(request)
    print(f"✅ Generated logo in {response.generation_time_seconds:.2f}s")
    print(f"Seed: {response.seed}")
    print(f"Image data: {response.image_base64[:50]}...")
