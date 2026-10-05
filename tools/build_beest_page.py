"""Regenerate beest/index.html from beest/devlogs.json.

Usage (from the repo root):  python tools/build_beest_page.py

devlogs.json is a list of entries: part (1 or 2), n, title, tag, date, tracked,
recordings, content. Nothing here is invented: every field comes from Shlok's own
journal / Hack Club devlogs. Edit the JSON, then rerun this script.
"""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
entries = json.loads((ROOT / "beest" / "devlogs.json").read_text(encoding="utf-8"))

PARTS = {
    1: ("Part 1: Design", "May 31 to Jun 16, 2026", "CAD, electronics and documentation. Original journal dates and tracked time."),
    2: ("Part 2: Physical Build", "Aug 15 to Aug 19, 2026", "Printing, gluing, painting, wiring and debugging the real robot. Written up in batches, so the work time is in each title."),
}


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def paragraphs(text: str) -> str:
    blocks = [b.strip() for b in text.replace("\r\n", "\n").split("\n\n") if b.strip()]
    return "\n".join(f"<p>{esc(b).replace(chr(10), '<br>')}</p>" for b in blocks)


def entry_html(e: dict) -> str:
    meta = [e["date"]]
    if e.get("tracked"):
        meta.append(f"{esc(e['tracked'])} tracked")
    if e.get("recordings"):
        meta.append(f"{e['recordings']} recording{'s' if e['recordings'] != 1 else ''}")
    tag = f'<span class="tag">{esc(e["tag"])}</span>' if e.get("tag") else ""
    return (
        f'<details class="entry" id="log-{e["n"]}">'
        f'<summary><span class="num">#{e["n"]}</span>'
        f'<span class="etitle">{esc(e["title"])}</span>{tag}'
        f'<span class="meta">{" · ".join(meta)}</span></summary>'
        f'<div class="body">{paragraphs(e["content"])}</div></details>'
    )


sections = []
for part, (name, span, blurb) in PARTS.items():
    items = [e for e in entries if e["part"] == part]
    sections.append(
        f'<section class="part"><div class="part-head"><h2>{esc(name)}</h2>'
        f'<p class="part-sub">{esc(span)} · {len(items)} devlogs</p><p>{esc(blurb)}</p></div>'
        + "\n".join(entry_html(e) for e in items)
        + "</section>"
    )

first, last = entries[0]["date"], entries[-1]["date"]
page = (ROOT / "beest" / "template.html").read_text(encoding="utf-8")
page = (
    page.replace("{{COUNT}}", str(len(entries)))
    .replace("{{FIRST}}", esc(first))
    .replace("{{LAST}}", esc(last))
    .replace("{{SECTIONS}}", "\n".join(sections))
)
(ROOT / "beest" / "index.html").write_text(page, encoding="utf-8")
print(f"wrote beest/index.html with {len(entries)} entries")
