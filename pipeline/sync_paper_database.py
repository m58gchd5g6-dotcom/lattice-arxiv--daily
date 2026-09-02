"""
Build the Lattice Daily paper database from the existing arXiv pipeline.

This is intentionally separated from daily_arxiv.py so the stable report
workflow can evolve without a risky rewrite.
"""

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from daily_arxiv import fetch_arxiv, ai_summary
from pipeline.normalize_paper import normalize_paper
from pipeline.sync_logic import append_new_papers
from pipeline.update_papers_db import load_database, save_database



def main():
    papers = fetch_arxiv()
    database = load_database()
    updated, added = append_new_papers(
        database,
        papers,
        summarize=lambda paper: ai_summary(
            paper["title"],
            paper["abstract"]
        ),
        normalize=normalize_paper,
    )

    if added:
        save_database(updated)

    print(
        f"Fetched {len(papers)} papers; "
        f"added {added} new papers to Lattice Daily database"
    )


if __name__ == "__main__":
    main()
