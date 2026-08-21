import json
from pathlib import Path
from datetime import datetime


BASE_DIR = Path(__file__).resolve().parent.parent
PAPER_DB = BASE_DIR / "data" / "papers.json"


def normalize_paper(paper, summary=""):
    return {
        "id": paper.get("id"),
        "title": paper.get("title", ""),
        "authors": paper.get("authors", []),
        "arxiv_url": paper.get("url", ""),
        "published": paper.get("published", ""),
        "abstract": paper.get("abstract", ""),
        "summary": {
            "raw": summary
        },
        "topics": [],
        "score": None,
        "status": "unread",
        "notes": [],
        "created_at": datetime.utcnow().isoformat()
    }


def append_papers(papers):
    PAPER_DB.parent.mkdir(parents=True, exist_ok=True)

    if PAPER_DB.exists():
        data = json.loads(PAPER_DB.read_text(encoding="utf-8"))
    else:
        data = []

    existing = {p.get("id") for p in data}

    for paper in papers:
        if paper.get("id") not in existing:
            data.append(paper)

    PAPER_DB.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
