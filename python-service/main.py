"""
Maison Noor — Python microservice
Handles: depth map generation (Depth Anything V2) + STL generation (Blender headless)

Phase 1: stubs returning mock responses
Phase 2: wire depth_estimation.py and blender_stl.py
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import os
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

API_KEY = os.getenv("API_KEY", "dev-key")

app = FastAPI(
    title="Maison Noor 3D Service",
    description="Depth estimation + STL generation for the eyewear configurator",
    version="1.0.0",
)


def verify_key(x_api_key: Optional[str]) -> None:
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "maison-noor-3d"}


# ── Depth estimation ──────────────────────────────────────────────────────────
@app.post("/depth")
async def depth(
    file: UploadFile = File(...),
    x_api_key: Optional[str] = Header(default=None),
):
    """
    Accepts an image upload, returns a 512×512 grayscale PNG depth map.

    Phase 1: returns a mock gradient PNG.
    Phase 2: uncomment the depth_estimation import and call generate_depth_map().
    """
    verify_key(x_api_key)

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()
    log.info(f"Received image: {file.filename} ({len(image_bytes)} bytes)")

    # ── Phase 2: real depth estimation ────────────────────────────────────────
    # from depth_estimation import generate_depth_map
    # depth_png = generate_depth_map(image_bytes)
    # return Response(content=depth_png, media_type="image/png")

    # ── Phase 1 mock: return a grey gradient PNG ───────────────────────────────
    try:
        from PIL import Image, ImageDraw
        import io
        import math

        SIZE = 512
        img = Image.new("L", (SIZE, SIZE))
        draw = ImageDraw.Draw(img)

        # Radial gradient: bright center, dark edges — simulates typical depth map
        cx, cy = SIZE // 2, SIZE // 2
        for y in range(SIZE):
            for x in range(SIZE):
                dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
                v = max(0, 255 - int(dist * 255 / (SIZE * 0.6)))
                img.putpixel((x, y), v)

        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return Response(content=buf.getvalue(), media_type="image/png")

    except ImportError:
        # Pillow not installed — return a 1×1 grey PNG
        grey_1px = bytes([
            137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
            0, 0, 0, 1, 0, 0, 0, 1, 8, 0, 0, 0, 0, 58, 126, 155, 85, 0,
            0, 0, 10, 73, 68, 65, 84, 120, 156, 98, 128, 0, 0, 0, 2, 0,
            1, 226, 33, 188, 51, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
        ])
        return Response(content=grey_1px, media_type="image/png")


# ── STL generation ────────────────────────────────────────────────────────────
class FrameSpec(BaseModel):
    order_id:              str
    frame_model:           str   # 'round' | 'square' | 'aviator'
    material:              str
    size:                  str   # 'S' | 'M' | 'L'
    heightmap_url:         str
    displacement_scale:    float
    displacement_rotation: float
    displacement_inverted: bool


@app.post("/stl")
async def stl(
    spec: FrameSpec,
    x_api_key: Optional[str] = Header(default=None),
):
    """
    Generates a production-ready STL from the frame spec.

    Phase 1: returns a mock response.
    Phase 2: uncomment blender_stl import and call generate_frame_stl().
    """
    verify_key(x_api_key)
    log.info(f"STL requested for order {spec.order_id}: {spec.frame_model} / {spec.material}")

    # ── Phase 2: real STL generation via Blender headless ─────────────────────
    # from blender_stl import generate_frame_stl
    # stl_url = await generate_frame_stl(spec.dict())
    # return {"status": "complete", "stl_url": stl_url, "order_id": spec.order_id}

    # ── Phase 1 mock ──────────────────────────────────────────────────────────
    return {
        "status":    "mock",
        "stl_url":   None,
        "order_id":  spec.order_id,
        "message":   "STL generation is stubbed. Wire Blender headless in blender_stl.py (Phase 2).",
    }
