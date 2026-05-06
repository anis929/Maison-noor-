# ── Phase 1: FastAPI only (no Blender/GPU) ───────────────────────────────────
# For Phase 2 (Blender + Depth Anything V2), switch to the commented base image.

# Phase 1 base
FROM python:3.11-slim

# Phase 2 base (Blender + CUDA) — uncomment and remove the above:
# FROM linuxserver/blender:latest
# RUN apt-get update && apt-get install -y python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
