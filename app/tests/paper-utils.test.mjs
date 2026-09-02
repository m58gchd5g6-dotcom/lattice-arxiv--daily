import assert from "node:assert/strict";
import test from "node:test";

import {
  filterPapers,
  preparePapers,
  toPaperPreviews,
} from "../src/lib/paper-utils.ts";

const olderPaper = {
  id: "2608.00001v1",
  title: "Older lattice paper",
  authors: ["Alice Example"],
  published: "2026-08-20T00:00:00Z",
  summary: {
    raw: `## 一句话结论

这是旧论文的一句话摘要。

## 方向标签

选择几个标签，例如：
- Lattice QCD
- **Tensor network**

## 阅读优先级

★★★★☆（4/5）
`,
  },
  topics: [],
  score: null,
  status: "unread",
};

const newerPaper = {
  id: "2608.00002v1",
  title: "New quantum simulation result",
  authors: ["Bob Researcher"],
  published: "2026-08-28T00:00:00Z",
  summary: { raw: "## 一句话结论\n\n新论文。" },
  topics: ["Quantum simulation"],
  score: 5,
  status: "reading",
};

test("preparePapers sorts newest first and derives missing summary metadata", () => {
  const result = preparePapers([olderPaper, newerPaper]);

  assert.deepEqual(result.map((paper) => paper.id), [
    "2608.00002v1",
    "2608.00001v1",
  ]);
  assert.equal(
    result[1].summary?.one_sentence,
    "这是旧论文的一句话摘要。",
  );
  assert.deepEqual(result[1].topics, ["Lattice QCD", "Tensor network"]);
  assert.equal(result[1].score, 4);
});

test("filterPapers searches title, authors, and topics case-insensitively", () => {
  const papers = preparePapers([olderPaper, newerPaper]);

  assert.deepEqual(
    filterPapers(papers, "alice").map((paper) => paper.id),
    ["2608.00001v1"],
  );
  assert.deepEqual(
    filterPapers(papers, "TENSOR").map((paper) => paper.id),
    ["2608.00001v1"],
  );
  assert.deepEqual(filterPapers(papers, "  "), papers);
});

test("toPaperPreviews omits full abstracts and raw summaries", () => {
  const [preview] = toPaperPreviews(preparePapers([olderPaper]));

  assert.equal("abstract" in preview, false);
  assert.deepEqual(preview.summary, {
    one_sentence: "这是旧论文的一句话摘要。",
  });
});
