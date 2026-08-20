import json
import os
import re
from datetime import datetime
from pathlib import Path

import feedparser
from openai import OpenAI


ARXIV_QUERY = "cat:hep-lat"
MAX_RESULTS = 50

BASE_DIR = Path(__file__).resolve().parent
REPORT_DIR = BASE_DIR / "reports"
DATA_DIR = BASE_DIR / "data"
SEEN_FILE = DATA_DIR / "seen_ids.json"


client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)


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
        json.dump(
            sorted(seen_ids),
            f,
            ensure_ascii=False,
            indent=2
        )


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

        papers.append(
            {
                "id": arxiv_id,
                "title": clean_text(entry.title),
                "abstract": clean_text(entry.summary),
                "authors": [
                    a.name
                    for a in getattr(entry, "authors", [])
                ],
                "published": getattr(
                    entry,
                    "published",
                    ""
                ),
                "url": entry.id,
            }
        )

    return papers


def ai_summary(title, abstract):

    prompt = f"""
你是一名专业 lattice field theory 研究助手。

请分析下面这篇论文。

标题：
{title}

摘要：
{abstract}


请用中文输出：

## 一句话结论

## 研究问题
作者想解决什么问题？

## 方法
使用了什么 lattice 方法、模型、算法或数值技术？

## 主要结果
总结最重要发现。

## 为什么值得关注
解释它对 lattice/QCD/理论物理社区的重要性。

## 方向标签
选择几个标签，例如：
Lattice QCD
BSM
Quantum simulation
Machine Learning
Tensor network
Finite temperature

## 阅读优先级
给 1-5 星，并解释原因。
"""

    try:

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "system",
                    "content":
                    "你是熟悉格点场论和量子场论的研究助理。"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        return response.choices[0].message.content


    except Exception as e:

        return (
            "DeepSeek 总结失败\n"
            f"错误信息: {e}\n\n"
            f"原摘要:\n{abstract}"
        )


def write_report(papers):

    REPORT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    today = datetime.utcnow().strftime(
        "%Y-%m-%d"
    )

    report = REPORT_DIR / f"{today}.md"


    lines = []

    lines.append(
        f"# Lattice arXiv Daily — {today}"
    )

    lines.append("")

    lines.append(
        "自动来源：arXiv hep-lat"
    )

    lines.append("")


    for i, paper in enumerate(
        papers,
        start=1
    ):

        lines.append(
            f"# {i}. {paper['title']}"
        )

        lines.append("")

        lines.append(
            "**作者:** "
            +
            ", ".join(
                paper["authors"]
            )
        )

        lines.append("")

        lines.append(
            f"**arXiv:** {paper['url']}"
        )

        lines.append("")

        lines.append(
            ai_summary(
                paper["title"],
                paper["abstract"]
            )
        )

        lines.append("")
        lines.append("---")
        lines.append("")


    with open(
        report,
        "w",
        encoding="utf-8"
    ) as f:

        f.write(
            "\n".join(lines)
        )


def main():

    papers = fetch_arxiv()

    if not papers:
        raise RuntimeError(
            "No papers found"
        )


    seen = load_seen()

    first_run = not SEEN_FILE.exists()


    if first_run:

        new_papers = papers[:10]

    else:

        new_papers = [
            p
            for p in papers
            if p["id"] not in seen
        ]


    write_report(
        new_papers
    )


    for p in papers:

        seen.add(
            p["id"]
        )


    save_seen(
        seen
    )


    print(
        "Done:",
        len(new_papers),
        "papers"
    )


if __name__ == "__main__":

    main()
