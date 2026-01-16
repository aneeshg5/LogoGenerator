from typing import List
from app.core.config import SAM_MODEL_PATH

def segment_image(
    image_base64: str,
    points: List[List[int]],
    labels: List[int]
) -> str:
    import torch
    import numpy as np
    from PIL import Image
    from segment_anything import sam_model_registry, SamPredictor
    from app.utils.image import base64_to_pil, pil_to_base64
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    sam = sam_model_registry["vit_b"](checkpoint=SAM_MODEL_PATH)
    sam.to(device=device)
    predictor = SamPredictor(sam)
    
    image = base64_to_pil(image_base64).convert("RGB")
    image_np = np.array(image)
    
    predictor.set_image(image_np)
    point_coords = np.array(points)
    point_labels = np.array(labels)
    
    masks, scores, _ = predictor.predict(
        point_coords=point_coords,
        point_labels=point_labels,
        multimask_output=True
    )
    
    best_mask = masks[scores.argmax()]
    mask_image = Image.fromarray((best_mask * 255).astype(np.uint8), mode='L')
    
    return pil_to_base64(mask_image)
