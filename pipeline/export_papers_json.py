"""
Lattice Daily data exporter.

Phase 1 bridge:
- Keep existing markdown reports unchanged.
- Export structured paper metadata for future Lattice Daily app.

This script is intentionally separate from daily_arxiv.py so the current
workflow remains stable while the data layer is introduced.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
REPORT_DIR = BASE_DIR / "reports"
DATA_DIR = BASE_DIR / "data"
OUTPUT = DATA_DIR / "papers.json"


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if not OUTPUT.exists():
        OUTPUT.write_text("[]", encoding="utf-8")

    print("papers.json ready:", OUTPUT)


if __name__ == "__main__":
    main()
