"""
Build orchestrator: renders every page from sitegen/content.py into the
develo/ folder, plus css/js and the SEO files (robots.txt, sitemap.xml,
llms.txt). Non-generated files (README.md, fix_indentation.md) are preserved.

Usage:  python3 -m sitegen.build
"""

import shutil
from pathlib import Path

from . import assets
from .content import PAGES
from .render import render_page

REPO_ROOT = Path(__file__).resolve().parent.parent
SITE_ROOT = REPO_ROOT / "develo"

# Files under develo/ that the generator does not produce — preserved as-is.
KEEP = ("README.md", "fix_indentation.md")
KEEP_DIRS = ("logo_casos_exito",)


def build() -> None:
    kept = {}
    kept_binary = {}
    if SITE_ROOT.exists():
        for name in KEEP:
            src = SITE_ROOT / name
            if src.exists():
                kept[name] = src.read_text(encoding="utf-8")
        for directory in KEEP_DIRS:
            source_dir = SITE_ROOT / directory
            if source_dir.exists():
                for source_file in source_dir.rglob("*"):
                    if source_file.is_file():
                        kept_binary[source_file.relative_to(SITE_ROOT)] = source_file.read_bytes()
        shutil.rmtree(SITE_ROOT)
    SITE_ROOT.mkdir(parents=True)

    for page in PAGES:
        out_dir = SITE_ROOT / page["path"].lstrip("/")
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "index.html").write_text(render_page(page), encoding="utf-8")

    (SITE_ROOT / "css").mkdir(parents=True, exist_ok=True)
    (SITE_ROOT / "css" / "style.css").write_text(assets.CSS, encoding="utf-8")
    (SITE_ROOT / "js").mkdir(parents=True, exist_ok=True)
    (SITE_ROOT / "js" / "main.js").write_text(assets.JS, encoding="utf-8")

    (SITE_ROOT / "assets").mkdir(parents=True, exist_ok=True)
    (SITE_ROOT / "assets" / "develo-mark.svg").write_text(
        assets.MARK_SVG, encoding="utf-8"
    )
    (SITE_ROOT / "assets" / "develo-social-card.svg").write_text(
        assets.SOCIAL_CARD_SVG, encoding="utf-8"
    )
    (SITE_ROOT / "404.html").write_text(assets.NOT_FOUND_HTML, encoding="utf-8")
    static_dir = REPO_ROOT / "sitegen" / "static"
    if static_dir.exists():
        for static_asset in static_dir.rglob("*"):
            if static_asset.is_file() and static_asset.suffix.lower() in {
                ".woff2", ".png", ".jpg", ".jpeg", ".webp"
            }:
                destination = SITE_ROOT / "assets" / static_asset.relative_to(static_dir)
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(static_asset, destination)

    (SITE_ROOT / "robots.txt").write_text(assets.ROBOTS, encoding="utf-8")
    (SITE_ROOT / "sitemap.xml").write_text(assets.sitemap_xml(), encoding="utf-8")
    (SITE_ROOT / "llms.txt").write_text(assets.LLMS_TXT, encoding="utf-8")

    for name, text in kept.items():
        (SITE_ROOT / name).write_text(text, encoding="utf-8")
    for relative_path, payload in kept_binary.items():
        destination = SITE_ROOT / relative_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(payload)

    print(f"Built {len(PAGES)} pages into {SITE_ROOT}")


if __name__ == "__main__":
    build()
