"""
Depth estimation using Depth Anything V2 (small variant).
Phase 2: uncomment the model loading and inference code.

Requirements: see requirements.txt
Inference time: ~5–15s on CPU per image.
"""

import io
import numpy as np
from PIL import Image


def generate_depth_map(image_bytes: bytes, output_size: int = 512) -> bytes:
    """
    Accepts raw image bytes, returns a 512×512 grayscale PNG depth map.
    Bright pixels = close to camera, dark = far.

    Phase 2 implementation:
    """
    # ── Phase 2: real Depth Anything V2 ──────────────────────────────────────
    # from transformers import pipeline
    # import torch
    #
    # pipe = pipeline(
    #     task="depth-estimation",
    #     model="depth-anything/Depth-Anything-V2-Small-hf",
    #     device="cpu",  # set to 0 for GPU
    # )
    # input_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # result = pipe(input_img)
    # depth_img = result["depth"]  # PIL Image, mode 'I' (int32)
    #
    # # Normalize to 0-255
    # arr = np.array(depth_img, dtype=np.float32)
    # arr = (arr - arr.min()) / (arr.max() - arr.min() + 1e-8) * 255
    # depth_u8 = Image.fromarray(arr.astype(np.uint8), mode='L')
    # depth_u8 = depth_u8.resize((output_size, output_size), Image.LANCZOS)
    #
    # buf = io.BytesIO()
    # depth_u8.save(buf, format="PNG")
    # return buf.getvalue()

    # ── Phase 1 stub: return a simple gradient ────────────────────────────────
    import math
    SIZE = output_size
    img  = Image.new("L", (SIZE, SIZE))
    cx, cy = SIZE // 2, SIZE // 2
    pixels = []
    for y in range(SIZE):
        for x in range(SIZE):
            dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            v = max(0, 255 - int(dist * 400 / SIZE))
            pixels.append(v)
    img.putdata(pixels)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
