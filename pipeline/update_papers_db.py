import json
from pathlib import Path


DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "papers.json"


def load_database():
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_database(papers):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(papers, f, ensure_ascii=False, indent=2)


def upsert_paper(paper):
    papers = load_database()

    existing = {p.get("id"): p for p in papers}

    if paper["id"] in existing:
        existing[paper["id"]].update(paper)
    else:
        existing[paper["id"]] = paper

    save_database(list(existing.values()))


if __name__ == "__main__":
    print("Paper database updater ready")
