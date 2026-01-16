from typing import Dict, Any, Optional
from app.core.config import SDXL_INPAINT_MODEL, HUGGINGFACE_CACHE_DIR

def inpaint_logo(
    image_base64: str,
    mask_base64: str,
    prompt: str,
    negative_prompt: str,
    seed: Optional[int] = None
) -> Dict[str, Any]:
    import torch
    from diffusers import StableDiffusionXLInpaintPipeline
    from app.utils.image import base64_to_pil, pil_to_base64
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    pipe = StableDiffusionXLInpaintPipeline.from_pretrained(
        SDXL_INPAINT_MODEL,
        torch_dtype=torch.float16,
        cache_dir=HUGGINGFACE_CACHE_DIR
    )
    pipe.to(device)
    
    if device == "cuda":
        pipe.enable_model_cpu_offload()
    
    image = base64_to_pil(image_base64).convert("RGB")
    mask = base64_to_pil(mask_base64).convert("L")
    
    generator = torch.Generator(device=device)
    if seed is not None:
        generator.manual_seed(seed)
    else:
        seed = generator.seed()
    
    result = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        image=image,
        mask_image=mask,
        num_inference_steps=30,
        guidance_scale=7.5,
        strength=0.99,
        generator=generator
    )
    
    return {
        "image_base64": pil_to_base64(result.images[0]),
        "seed": seed
    }
