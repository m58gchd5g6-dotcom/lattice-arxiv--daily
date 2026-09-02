export type Paper = {
  id: string;
  title: string;
  authors?: string[];
  arxiv_url?: string;
  published?: string;
  abstract?: string;
  summary?: {
    one_sentence?: string;
    raw?: string;
  };
  topics?: string[];
  score?: number | null;
  status?: string;
};

function extractSection(markdown: string, heading: string): string {
  const collected: string[] = [];
  let inSection = false;

  for (const line of markdown.split("\n")) {
    const match = line.match(/^##\s+(.+?)\s*$/);

    if (match) {
      if (inSection) break;
      inSection = match[1].includes(heading);
      continue;
    }

    if (inSection) collected.push(line);
  }

  return collected.join("\n").trim();
}

function extractOneSentence(raw: string): string | undefined {
  const section = extractSection(raw, "一句话结论");
  const paragraph = section
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .find(Boolean);

  return paragraph?.replace(/^[-*]\s+/, "").trim() || undefined;
}

function extractTopics(raw: string): string[] {
  return extractSection(raw, "方向标签")
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^[-*]\s+/, "")
        .replace(/^\d+\.\s+/, "")
        .replaceAll("**", "")
        .trim(),
    )
    .filter(
      (line) =>
        line.length > 0 &&
        line !== "---" &&
        !line.includes("选择几个标签"),
    );
}

function extractScore(raw: string): number | null {
  const section = extractSection(raw, "阅读优先级");
  const stars = section.match(/[★☆]{1,5}/)?.[0];

  if (stars) return [...stars].filter((star) => star === "★").length;

  const numeric = section.match(/([1-5])\s*(?:\/\s*5|星)/);
  return numeric ? Number(numeric[1]) : null;
}

function preparePaper(paper: Paper): Paper {
  const raw = paper.summary?.raw ?? "";
  const topics = paper.topics?.length ? paper.topics : extractTopics(raw);
  const score = paper.score ?? extractScore(raw);
  const oneSentence =
    paper.summary?.one_sentence?.trim() || extractOneSentence(raw);

  return {
    ...paper,
    summary: paper.summary
      ? { ...paper.summary, one_sentence: oneSentence }
      : undefined,
    topics,
    score,
  };
}

export function preparePapers(papers: readonly Paper[]): Paper[] {
  return papers
    .map(preparePaper)
    .sort((left, right) => {
      const leftTime = Date.parse(left.published ?? "") || 0;
      const rightTime = Date.parse(right.published ?? "") || 0;
      return rightTime - leftTime;
    });
}

export function filterPapers(papers: readonly Paper[], query: string): Paper[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [...papers];

  return papers.filter((paper) =>
    [paper.title, paper.authors?.join(" "), paper.topics?.join(" ")]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function toPaperPreviews(papers: readonly Paper[]): Paper[] {
  return papers.map(({ abstract: _abstract, summary, ...paper }) => ({
    ...paper,
    summary: summary?.one_sentence
      ? { one_sentence: summary.one_sentence }
      : undefined,
  }));
}
