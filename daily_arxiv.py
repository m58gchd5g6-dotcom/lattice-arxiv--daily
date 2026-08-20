import json
import os
import re
from datetime import datetime
from pathlib import Path

import feedparser


ARXIV_QUERY = "cat:hep-lat"
MAX_RESULTS = 50

BASE_DIR = Path(__file__).resolve().parent
REPORT_DIR = BASE_DIR / "reports"
DATA_DIR = BASE_DIR / "data"
SEEN_FILE = DATA_DIR / "seen_ids.json"


def clean_text(text):
    return re.sub(r"\s+", " ", text or "").strip()


def load_seen():
    if not SEEN_FILE.exists():
        return set()

    try:
        with open(SEEN_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    except Exception:
        return set()


def save_seen(seen_ids):
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    with open(SEEN_FILE, "w", encoding="utf-8") as f:
        json.dump(sorted(seen_ids), f, ensure_ascii=False, indent=2)


def fetch_arxiv():
    url = (
        "https://export.arxiv.org/api/query"
        f"?search_query={ARXIV_QUERY}"
        "&start=0"
        f"&max_results={MAX_RESULTS}"
        "&sortBy=submittedDate"
        "&sortOrder=descending"
    )

    feed = feedparser.parse(url)

    papers = []

    for entry in feed.entries:
        arxiv_id = entry.id.split("/abs/")[-1]

        title = clean_text(entry.title)
        abstract = clean_text(entry.summary)

        authors = []
        for author in getattr(entry, "authors", []):
            authors.append(author.name)

        pdf_url = ""
        for link in getattr(entry, "links", []):
            if getattr(link, "type", "") == "application/pdf":
                pdf_url = link.href
                break

        papers.append(
            {
                "id": arxiv_id,
                "title": title,
                "abstract": abstract,
                "authors": authors,
                "published": getattr(entry, "published", ""),
                "url": entry.id,
                "pdf": pdf_url,
            }
        )

    return papers


def short_summary(abstract):
    """
    简单从摘要前两句生成“快速概览”。
    不需要 OpenAI API，因此 GitHub Actions 可以免费直接运行。
    """
    text = clean_text(abstract)

    sentences = re.split(r"(?<=[.!?])\s+", text)

    if len(sentences) >= 2:
        return sentences[0] + " " + sentences[1]

    return text


def write_report(new_papers):
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    today = datetime.utcnow().strftime("%Y-%m-%d")
    report_file = REPORT_DIR / f"{today}.md"

    lines = []

    lines.append(f"# Lattice arXiv Daily — {today}")
    lines.append("")
    lines.append("自动检索来源：arXiv `hep-lat`")
    lines.append("")

    if not new_papers:
        lines.append("## 今日没有发现新的 lattice / hep-lat 论文")
        lines.append("")
        lines.append("下一次自动任务会继续检查。")

    else:
        lines.append(f"今天发现 **{len(new_papers)} 篇**此前未记录的新论文。")
        lines.append("")

        for i, paper in enumerate(new_papers, start=1):
            lines.append(f"## {i}. {paper['title']}")
            lines.append("")

            if paper["authors"]:
                lines.append(
                    "**作者：** " + ", ".join(paper["authors"])
                )
                lines.append("")

            lines.append(f"**arXiv：** [{paper['id']}]({paper['url']})")

            if paper["pdf"]:
                lines.append(f"**PDF：** [打开论文]({paper['pdf']})")

            lines.append("")
            lines.append("### 快速概览")
            lines.append("")
            lines.append(short_summary(paper["abstract"]))
            lines.append("")
            lines.append("### Abstract")
            lines.append("")
            lines.append(paper["abstract"])
            lines.append("")
            lines.append("---")
            lines.append("")

    with open(report_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Report written to: {report_file}")


def main():
    print("Fetching latest hep-lat papers from arXiv...")

    papers = fetch_arxiv()

    if not papers:
        raise RuntimeError("No papers returned from arXiv.")

    seen_ids = load_seen()

    first_run = not SEEN_FILE.exists()

    if first_run:
        # 第一次运行只生成最近 20 篇，避免报告太长
        new_papers = papers[:20]
    else:
        new_papers = [
            paper
            for paper in papers
            if paper["id"] not in seen_ids
        ]

    write_report(new_papers)

    # 当前抓到的论文全部记入 seen
    for paper in papers:
        seen_ids.add(paper["id"])

    save_seen(seen_ids)

    print(f"Done. New papers: {len(new_papers)}")


if __name__ == "__main__":
    main()
