import time
from app.core.config import app, GPU_CONFIG_A10G, GPU_CONFIG_T4
from app.schemas import (
    GenerateLogoRequest,
    GenerateLogoResponse,
    SegmentRequest,
    SegmentResponse,
    InpaintRequest,
    InpaintResponse,
)
from app.services.generation import generate_logo as generate_logo_service
from app.services.segmentation import segment_image as segment_image_service
from app.services.inpainting import inpaint_logo as inpaint_logo_service
from app.utils.prompts import build_logo_prompt, get_negative_prompt

@app.function(**GPU_CONFIG_A10G)
def generate_logo_internal(
    prompt: str,
    negative_prompt: str,
    width: int,
    height: int,
    seed: int = None
):
    return generate_logo_service(prompt, negative_prompt, width, height, seed)

@app.function(**GPU_CONFIG_T4)
def segment_image_internal(
    image_base64: str,
    points: list,
    labels: list
):
    return segment_image_service(image_base64, points, labels)

@app.function(**GPU_CONFIG_A10G)
def inpaint_logo_internal(
    image_base64: str,
    mask_base64: str,
    prompt: str,
    seed: int = None
):
    return inpaint_logo_service(
        image_base64,
        mask_base64,
        prompt,
        get_negative_prompt(),
        seed
    )

@app.function()
def generate_logo_endpoint(request: GenerateLogoRequest):
    start = time.time()
    
    prompt = build_logo_prompt(
        description=request.description,
        style=request.style,
        industry=request.industry,
        colors=request.colors,
        additional_details=request.additional_details
    )
    
    negative_prompt = get_negative_prompt()
    
    print("=" * 80)
    print("FULL PROMPT SENT TO DIFFUSION MODEL:")
    print(prompt)
    print("-" * 80)
    print("NEGATIVE PROMPT:")
    print(negative_prompt)
    print("=" * 80)
    
    result = generate_logo_internal.remote(
        prompt=prompt,
        negative_prompt=negative_prompt,
        width=request.width,
        height=request.height,
        seed=request.seed
    )
    
    return GenerateLogoResponse(
        image_base64=result["image_base64"],
        prompt_used=prompt,
        seed=result["seed"],
        generation_time_seconds=time.time() - start
    )

@app.function()
def segment_image_endpoint(request: SegmentRequest):
    mask_b64 = segment_image_internal.remote(
        image_base64=request.image_base64,
        points=request.points,
        labels=request.labels
    )
    
    return SegmentResponse(mask_base64=mask_b64)

@app.function()
def inpaint_logo_endpoint(request: InpaintRequest):
    result = inpaint_logo_internal.remote(
        image_base64=request.image_base64,
        mask_base64=request.mask_base64,
        prompt=request.edit_instruction,
        seed=request.seed
    )
    
    return InpaintResponse(
        image_base64=result["image_base64"],
        seed=result["seed"],
        prompt_used=f"professional logo design, {request.edit_instruction}"
    )
