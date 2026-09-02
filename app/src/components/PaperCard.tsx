import Link from "next/link";
import StatusBadge from "./StatusBadge";

import type { Paper } from "../lib/papers";

export default function PaperCard({ paper }: { paper: Paper }) {
  return (
    <article className="paper-card">
      <Link href={`/paper/${encodeURIComponent(paper.id)}`}>
        <h2>{paper.title}</h2>
      </Link>
      <StatusBadge status={paper.status ?? "unread"} />
      <p>{paper.authors?.join(", ") || "Unknown authors"}</p>
      <p>{paper.summary?.one_sentence ?? "No summary yet"}</p>
      <p>Score: {paper.score ?? "-"} / 5</p>
      <p>{paper.topics?.join(" · ") || "No topics"}</p>
    </article>
  );
}
