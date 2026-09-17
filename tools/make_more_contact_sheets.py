from pathlib import Path
from zipfile import ZipFile
from PIL import Image, ImageOps, ImageDraw
import tempfile

root = Path(r"S:\Shlokalva.com\.asset-review")
root.mkdir(exist_ok=True)

sets = {
    "trinetra": [p for p in Path(r"S:\Trinetra").glob("*") if p.suffix.lower() in [".png", ".jpg", ".jpeg"]],
    "cyber": [Path(r"S:\Cyber Club\WhatsApp Image 2026-09-17 at 8.08.12 PM.jpeg")],
    "team_bot": [
        Path(r"S:\Team Dinoco") / name
        for name in [
            "2.PNG",
            "3.PNG",
            "output-onlinepngtools (1).png",
            "output-onlinepngtools (3).png",
            "output-onlinepngtools (6).png",
            "a6ae2607c64ca6bd7eddcc254c961123.png",
            "0525f85a-f066-436e-81af-4027a775df49.png",
            "Capture.PNG",
        ]
    ],
}

with tempfile.TemporaryDirectory() as tmp:
    tmp_path = Path(tmp)
    for zip_path in [
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.12.54 PM.zip"),
        Path(r"S:\Cyber Club\WhatsApp Unknown 2026-09-17 at 8.13.09 PM.zip"),
    ]:
        if zip_path.exists():
            with ZipFile(zip_path) as archive:
                for member in archive.namelist():
                    if member.lower().endswith((".png", ".jpg", ".jpeg")):
                        target = tmp_path / Path(member).name
                        target.write_bytes(archive.read(member))
                        sets["cyber"].append(target)

    for name, paths in sets.items():
        thumbs = []
        for path in paths:
            if not path.exists():
                continue
            try:
                image = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
            except Exception:
                continue
            image.thumbnail((240, 160))
            canvas = Image.new("RGB", (260, 205), (16, 18, 22))
            canvas.paste(image, ((260 - image.width) // 2, 8))
            draw = ImageDraw.Draw(canvas)
            draw.text((8, 174), path.name[:34], fill=(255, 220, 190))
            thumbs.append(canvas)

        if not thumbs:
            continue
        cols = 3
        rows = (len(thumbs) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * 260, rows * 205), (8, 9, 12))
        for index, thumb in enumerate(thumbs):
            sheet.paste(thumb, ((index % cols) * 260, (index // cols) * 205))
        output = root / f"{name}.jpg"
        sheet.save(output, quality=90)
        print(output)
