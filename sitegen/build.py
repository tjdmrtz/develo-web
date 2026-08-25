"""
Build orchestrator: renders every page from sitegen/content.py into the
develo/ folder, plus css/js and the SEO files (robots.txt, sitemap.xml,
llms.txt). Non-generated files (README.md, fix_indentation.md) are preserved.

Usage:  python3 -m sitegen.build
"""

import shutil
import tempfile
from pathlib import Path

from . import assets
from .content import PAGES
from .render import render_page

REPO_ROOT = Path(__file__).resolve().parent.parent
SITE_ROOT = REPO_ROOT / "develo"

# Files/dirs under develo/ that the generator does not produce — preserved as-is.
KEEP = ("README.md", "fix_indentation.md")
PRESERVE_DIRS = ("llm-viz", "js/llm-visualization")


def build() -> None:
    kept = {}
    preserved = {}
    if SITE_ROOT.exists():
        for name in KEEP:
            src = SITE_ROOT / name
            if src.exists():
                kept[name] = src.read_text(encoding="utf-8")
        for name in PRESERVE_DIRS:
            src = SITE_ROOT / name
            if src.exists():
                preserved[name] = Path(tempfile.mkdtemp()) / name
                shutil.copytree(src, preserved[name])
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

    (SITE_ROOT / "robots.txt").write_text(assets.ROBOTS, encoding="utf-8")
    (SITE_ROOT / "sitemap.xml").write_text(assets.sitemap_xml(), encoding="utf-8")
    (SITE_ROOT / "llms.txt").write_text(assets.LLMS_TXT, encoding="utf-8")

    for name, text in kept.items():
        (SITE_ROOT / name).write_text(text, encoding="utf-8")

    for name, src in preserved.items():
        dest = SITE_ROOT / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists():
            shutil.rmtree(dest)
        shutil.copytree(src, dest)
        shutil.rmtree(src.parent, ignore_errors=True)

    print(f"Built {len(PAGES)} pages into {SITE_ROOT}")


if __name__ == "__main__":
    build()
