import time
from typing import Dict, Any, Optional
from app.core.config import SDXL_BASE_MODEL, LOGO_LORA, HUGGINGFACE_CACHE_DIR

def generate_logo(
    prompt: str,
    negative_prompt: str,
    width: int,
    height: int,
    seed: Optional[int] = None
) -> Dict[str, Any]:
    import torch
    from diffusers import DiffusionPipeline
    from app.utils.image import pil_to_base64
    
    start_time = time.time()
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    pipe = DiffusionPipeline.from_pretrained(
        SDXL_BASE_MODEL,
        torch_dtype=torch.float16,
        use_safetensors=True,
        cache_dir=HUGGINGFACE_CACHE_DIR
    )
    pipe.to(device)
    
    pipe.load_lora_weights(LOGO_LORA)
    
    if device == "cuda":
        pipe.enable_model_cpu_offload()
        pipe.enable_vae_slicing()
    
    generator = torch.Generator(device=device)
    if seed is not None:
        generator.manual_seed(seed)
    else:
        seed = generator.seed()
    
    result = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        width=width,
        height=height,
        num_inference_steps=35,
        guidance_scale=12.0,
        generator=generator
    )
    
    image_b64 = pil_to_base64(result.images[0])
    
    return {
        "image_base64": image_b64,
        "seed": seed,
        "generation_time": time.time() - start_time
    }
