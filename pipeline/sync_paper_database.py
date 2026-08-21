"""
Build the Lattice Daily paper database from the existing arXiv pipeline.

This is intentionally separated from daily_arxiv.py so the stable report
workflow can evolve without a risky rewrite.
"""

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from daily_arxiv import fetch_arxiv, ai_summary
from normalize_paper import normalize_paper
from update_papers_db import upsert_paper



def main():
    papers = fetch_arxiv()

    for paper in papers:
        normalized = normalize_paper(
            paper,
            ai_summary(
                paper["title"],
                paper["abstract"]
            )
        )
        upsert_paper(normalized)

    print(f"Synced {len(papers)} papers into Lattice Daily database")


if __name__ == "__main__":
    main()
