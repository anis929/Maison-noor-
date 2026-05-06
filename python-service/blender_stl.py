"""
STL generation via Blender headless (Phase 2).

Workflow:
  1. Download the GLTF frame model from Supabase Storage
  2. Download the heightmap PNG
  3. Call blender --background --python blender_script.py -- <args>
  4. Blender script:
       - Imports GLTF
       - Selects sub-meshes named 'engraving_zone_*'
       - Applies Displace modifier with the heightmap
       - Applies the modifier (bakes displacement into geometry)
       - Exports the full frame as binary STL
  5. Upload STL to Supabase Storage
  6. Return the public URL
"""

import asyncio
import os
import subprocess
import tempfile
import httpx


BLENDER_BIN = os.getenv("BLENDER_BIN", "/usr/bin/blender")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")


# Blender Python script template (executed headless inside Blender)
BLENDER_SCRIPT = """
import bpy
import sys
import os

argv = sys.argv
args_start = argv.index("--") + 1
gltf_path     = argv[args_start]
heightmap_path = argv[args_start + 1]
stl_path       = argv[args_start + 2]
disp_scale     = float(argv[args_start + 3])
disp_mid       = float(argv[args_start + 4])  # 0.5 → symmetric

# Clear scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Import GLTF
bpy.ops.import_scene.gltf(filepath=gltf_path)

# Apply displacement to engraving zones
for obj in bpy.context.scene.objects:
    if not obj.name.startswith("engraving_zone"):
        continue
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    # Load heightmap as image texture
    img = bpy.data.images.load(heightmap_path)
    tex = bpy.data.textures.new("HeightMap", type="IMAGE")
    tex.image = img

    # Subdivide mesh for detail
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.subdivide(number_cuts=4)
    bpy.ops.object.mode_set(mode="OBJECT")

    # Add Displace modifier
    mod = obj.modifiers.new("Displace", "DISPLACE")
    mod.texture       = tex
    mod.strength      = disp_scale
    mod.mid_level     = disp_mid
    mod.texture_coords = "UV"

    # Apply modifier
    bpy.ops.object.modifier_apply(modifier="Displace")
    obj.select_set(False)

# Select all, export STL
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_mesh.stl(filepath=stl_path, use_selection=True, global_scale=10.0)
print(f"STL exported: {stl_path}")
"""


async def generate_frame_stl(spec: dict) -> str:
    """
    Phase 2 implementation.
    Returns the Supabase Storage URL of the generated STL.
    """
    async with httpx.AsyncClient(timeout=300) as client:
        # 1. Download heightmap
        hm_resp = await client.get(spec["heightmap_url"])
        hm_resp.raise_for_status()

        with tempfile.TemporaryDirectory() as tmpdir:
            hm_path  = os.path.join(tmpdir, "heightmap.png")
            stl_path = os.path.join(tmpdir, "frame.stl")

            # GLTF path — swap with real Supabase URL when models are uploaded
            gltf_url  = f"{SUPABASE_URL}/storage/v1/object/public/frames/{spec['frame_model']}.glb"
            gltf_resp = await client.get(gltf_url)
            gltf_path = os.path.join(tmpdir, "frame.glb")

            with open(hm_path,  "wb") as f: f.write(hm_resp.content)
            with open(gltf_path, "wb") as f: f.write(gltf_resp.content)

            # Write Blender script
            script_path = os.path.join(tmpdir, "blender_script.py")
            with open(script_path, "w") as f: f.write(BLENDER_SCRIPT)

            disp_scale = spec["displacement_scale"] * 0.18  # map 0-1 → 0-1.8mm
            disp_mid   = 0.5  # centered displacement

            cmd = [
                BLENDER_BIN, "--background",
                "--python", script_path, "--",
                gltf_path, hm_path, stl_path,
                str(disp_scale), str(disp_mid),
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
            if result.returncode != 0:
                raise RuntimeError(f"Blender failed:\n{result.stderr}")

            # 2. Upload STL to Supabase Storage
            with open(stl_path, "rb") as f:
                stl_bytes = f.read()

            filename  = f"{spec['order_id']}.stl"
            upload_url = f"{SUPABASE_URL}/storage/v1/object/stl-files/{filename}"
            up_resp = await client.post(
                upload_url,
                content=stl_bytes,
                headers={
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type":  "model/stl",
                },
            )
            up_resp.raise_for_status()

            return f"{SUPABASE_URL}/storage/v1/object/public/stl-files/{filename}"
