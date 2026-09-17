from pathlib import Path
from zipfile import ZipFile
from PIL import Image, ImageOps

asset_dir = Path(r"S:\Shlokalva.com\public\assets")
asset_dir.mkdir(parents=True, exist_ok=True)

assets = {
    "little-helper-cad.jpg": Path(r"S:\LittleHelper\Littlehelper3.PNG"),
    "little-helper-front.jpg": Path(r"S:\LittleHelper\Littlehelper7.PNG"),
    "little-helper-wiring.jpg": Path(r"S:\LittleHelper\Littlehelper12.PNG"),
    "little-helper-real.jpg": Path(r"S:\LittleHelper\WhatsApp Image 2026-08-17 at 5.44.37 PM.jpeg"),
    "team-dinoco-group.jpg": Path(r"S:\Team Dinoco\group photo 4.png"),
    "team-dinoco-logo.jpg": Path(r"S:\Team Dinoco\Logo.jfif"),
    "team-dinoco-journey.jpg": Path(r"S:\Team Dinoco\Journey.png"),
    "team-dinoco-build-1.jpg": Path(r"S:\Team Dinoco\2.PNG"),
    "team-dinoco-build-2.jpg": Path(r"S:\Team Dinoco\3.PNG"),
    "cern-group.jpg": Path(r"E:\Cern Photos\WhatsApp Image 2026-05-10 at 7.36.39 PM (1).jpeg"),
    "cern-landscape.jpg": Path(r"E:\Cern Photos\IMG20260508093828.jpg"),
    "cern-campus.jpg": Path(r"E:\Cern Photos\GOPR0302.JPG"),
    "dwello-turbofan-1.jpg": Path(r"C:\Users\Shlok Alva\Downloads\Turbofan Can Type Shlok Dwello.png"),
    "dwello-turbofan-2.jpg": Path(r"C:\Users\Shlok Alva\Downloads\Turbofan Can Type Shlok Dwello2.png"),
    "dwello-turbofan-3.jpg": Path(r"C:\Users\Shlok Alva\Downloads\Turbofan Can Type Shlok Dwello3.png"),
    "trinetra-cad-1.jpg": Path(r"S:\Trinetra\Trinetra_2026-Aug-23_05-20-11PM-000_CustomizedView3681501829.png"),
    "trinetra-cad-2.jpg": Path(r"S:\Trinetra\Trinetra_2026-Aug-23_10-29-24AM-000_CustomizedView714529508.png"),
    "trinetra-cad-3.jpg": Path(r"S:\Trinetra\3475e0db69843f00.png"),
    "cyber-podium.jpg": Path(r"S:\Cyber Club\WhatsApp Image 2026-09-17 at 8.08.12 PM.jpeg"),
    "rc-plane.jpg": Path(r"S:\Team Dinoco\WhatsApp Image 2026-09-17 at 8.11.24 PM.jpeg"),
    "nrl-event.jpg": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-a4a3e0e7-41bd-4790-907f-8681ae5ca6b5.jpg"),
    "hku-ai-challenge.jpg": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-ac960b6c-0872-47da-aca7-9f2cbca689ec.jpg"),
    "black-shirt-cohorts.png": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-c9e105c5-3d14-4f09-a480-82450fcf4054.png"),
    "hackclub-2026.png": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-b12bdf0c-be83-4d89-9d98-7dd2f2f7ade4.png"),
    "pc-building.png": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-257dd78a-0ff7-495a-b25c-56671fb00558.png"),
    "nrl-discussion.png": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-721d9cdd-db6d-4cdf-b9a2-4454df0ed98d.png"),
    "concorde-photo.png": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-a5b7a09f-f657-463e-bb8c-dd4bb424033c.png"),
    "cern-geneva.jpg": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-ef4b5d9c-90c7-4f7a-8fdb-1f07cd4a2f1c.jpg"),
    "cern-lab.jpg": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-c8c5cacc-06c8-4113-8036-d90a0164700b.jpg"),
    "cern-chamonix.jpg": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-349f3bbb-bd34-4f58-abc7-9c75cf433004.jpg"),
    "cern-atrium.jpg": Path(r"C:\Users\SHLOKA~1\AppData\Local\Temp\codex-clipboard-99f978e7-fc18-4b24-acbc-c3fe32c3fe84.jpg"),
}

for output_name, source in assets.items():
    if not source.exists():
        print(f"missing: {source}")
        continue
    image = Image.open(source)
    image = ImageOps.exif_transpose(image).convert("RGB")
    image.thumbnail((1600, 1050), Image.Resampling.LANCZOS)
    image.save(asset_dir / output_name, quality=84, optimize=True)
    print(asset_dir / output_name)

zip_assets = {
    "cyber-lab-1.jpg": (
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.12.54 PM.zip"),
        "WhatsApp Image 2026-09-17 at 8.08.01 PM.jpeg",
    ),
    "cyber-lab-2.jpg": (
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.12.54 PM.zip"),
        "WhatsApp Image 2026-09-17 at 8.08.02 PM.jpeg",
    ),
    "cyber-robotics-1.jpg": (
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.13.09 PM.zip"),
        "WhatsApp Image 2026-09-17 at 8.11.23 PM.jpeg",
    ),
    "cyber-robotics-2.jpg": (
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.13.09 PM.zip"),
        "WhatsApp Image 2026-09-17 at 8.11.24 PM (2).jpeg",
    ),
    "teaching-screenshot.jpg": (
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.54.54 PM.zip"),
        "WhatsApp Image 2026-09-17 at 8.54.54 PM.jpeg",
    ),
    "teaching-screenshot-2.jpg": (
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.54.54 PM.zip"),
        "WhatsApp Image 2026-09-17 at 8.54.54 PM (1).jpeg",
    ),
    "nrl-badges.jpg": (
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.54.54 PM.zip"),
        "WhatsApp Image 2026-09-17 at 8.54.55 PM.jpeg",
    ),
}

for output_name, (zip_path, member) in zip_assets.items():
    if not zip_path.exists():
        print(f"missing: {zip_path}")
        continue
    with ZipFile(zip_path) as archive:
        image = Image.open(archive.open(member))
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((1600, 1050), Image.Resampling.LANCZOS)
        image.save(asset_dir / output_name, quality=84, optimize=True)
        print(asset_dir / output_name)

video_assets = {
    "cyber-robotics-clip-1.mp4": (
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.13.09 PM.zip"),
        "WhatsApp Video 2026-09-17 at 8.11.29 PM.mp4",
    ),
    "cyber-robotics-clip-2.mp4": (
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.13.09 PM.zip"),
        "WhatsApp Video 2026-09-17 at 8.11.31 PM.mp4",
    ),
}

for output_name, (zip_path, member) in video_assets.items():
    if not zip_path.exists():
        print(f"missing: {zip_path}")
        continue
    with ZipFile(zip_path) as archive:
        (asset_dir / output_name).write_bytes(archive.read(member))
        print(asset_dir / output_name)
