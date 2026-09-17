from pathlib import Path
from PIL import Image, ImageDraw

sets = {
    "littlehelper": [
        Path(r"S:\LittleHelper") / name
        for name in [
            "Littlehelper.PNG",
            "Littlehelper3.PNG",
            "Littlehelper5.PNG",
            "Littlehelper7.PNG",
            "Littlehelper11.PNG",
            "Littlehelper12.PNG",
            "WhatsApp Image 2026-08-17 at 5.44.32 (1).jpeg",
            "WhatsApp Image 2026-08-17 at 5.44.36 (1).jpeg",
            "WhatsApp Image 2026-08-17 at 5.44.37 PM.jpeg",
        ]
    ],
    "dinoco": [
        Path(r"S:\Team Dinoco") / name
        for name in [
            "group photo 4.png",
            "group photo 3.png",
            "group photo.png",
            "Journey.png",
            "Strategy.png",
            "Capture.PNG",
            "Logo.jfif",
            "output-onlinepngtools (3).png",
        ]
    ],
    "cern": [
        Path(r"E:\Cern Photos") / name
        for name in [
            "WhatsApp Image 2026-05-10 at 7.36.39 PM (1).jpeg",
            "WhatsApp Image 2026-05-10 at 11.00.42 AM.jpeg",
            "WhatsApp Image 2026-05-10 at 11.00.42 AM (1).jpeg",
            "WhatsApp Image 2026-05-10 at 9.18.37 PM.jpeg",
            "IMG20260508093828.jpg",
            "IMG20260508102002.jpg",
            "GOPR0302.JPG",
        ]
    ],
    "dwello": [
        Path(r"C:\Users\Shlok Alva\Downloads") / name
        for name in [
            "Turbofan Can Type Shlok Dwello.png",
            "Turbofan Can Type Shlok Dwello2.png",
            "Turbofan Can Type Shlok Dwello3.png",
        ]
    ],
}

outdir = Path(r"S:\Shlokalva.com\.asset-review")
outdir.mkdir(exist_ok=True)

for name, paths in sets.items():
    thumbs = []
    for path in paths:
        if not path.exists() or path.suffix.lower() not in [".png", ".jpg", ".jpeg", ".jfif"]:
            continue
        image = Image.open(path).convert("RGB")
        image.thumbnail((240, 160))
        canvas = Image.new("RGB", (260, 205), (20, 20, 24))
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
    output = outdir / f"{name}.jpg"
    sheet.save(output, quality=90)
    print(output)
