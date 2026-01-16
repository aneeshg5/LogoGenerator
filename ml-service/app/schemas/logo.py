from pydantic import BaseModel, Field
from typing import Optional, List

class GenerateLogoRequest(BaseModel):
    description: str = Field(..., min_length=3, max_length=500)
    style: str = Field(default="minimalist")
    industry: Optional[str] = None
    colors: Optional[List[str]] = None
    width: int = Field(default=1024, ge=512, le=1536)
    height: int = Field(default=1024, ge=512, le=1536)
    additional_details: Optional[str] = None
    seed: Optional[int] = None

class GenerateLogoResponse(BaseModel):
    image_base64: str
    prompt_used: str
    seed: int
    generation_time_seconds: float

class SegmentRequest(BaseModel):
    image_base64: str
    points: List[List[int]]
    labels: List[int]

class SegmentResponse(BaseModel):
    mask_base64: str

class InpaintRequest(BaseModel):
    image_base64: str
    mask_base64: str
    edit_instruction: str
    seed: Optional[int] = None

class InpaintResponse(BaseModel):
    image_base64: str
    seed: int
    prompt_used: str
