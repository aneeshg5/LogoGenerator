import modal
from typing import Dict

app = modal.App("logo-generator-ml")

image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("git", "curl")
    .pip_install("fastapi[standard]")
    .pip_install_from_requirements("requirements.txt")
    .pip_install("git+https://github.com/facebookresearch/segment-anything.git")
    .run_commands(
        "mkdir -p /root/models",
        "cd /root/models && curl -O https://dl.fbaipublicfiles.com/segment_anything/sam_vit_b_01ec64.pth"
    )
)

model_volume = modal.Volume.from_name("logo-models", create_if_missing=True)

GPU_CONFIG_A10G: Dict[str, any] = {
    "gpu": "A10G",
    "image": image,
    "volumes": {"/models": model_volume},
    "timeout": 600,
    "scaledown_window": 120,
}

GPU_CONFIG_T4: Dict[str, any] = {
    "gpu": "T4",
    "image": image,
    "timeout": 300,
    "scaledown_window": 120,
}

SAM_MODEL_PATH = "/root/models/sam_vit_b_01ec64.pth"
HUGGINGFACE_CACHE_DIR = "/models/huggingface"

SDXL_BASE_MODEL = "stabilityai/stable-diffusion-xl-base-1.0"
SDXL_INPAINT_MODEL = "diffusers/stable-diffusion-xl-1.0-inpainting-0.1"
LOGO_LORA = "artificialguybr/LogoRedmond-LogoLoraForSDXL"
