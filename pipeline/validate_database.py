import json
from pathlib import Path


DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "papers.json"


def main():
    if not DATA_FILE.exists():
        raise SystemExit("papers.json missing")

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        papers = json.load(f)

    required = ["id", "title"]

    for paper in papers:
        for field in required:
            if field not in paper:
                raise SystemExit(f"Missing field: {field}")

    print(f"Database OK: {len(papers)} papers")


if __name__ == "__main__":
    main()
