import Link from "next/link";
import StatusBadge from "./StatusBadge";

type Paper = {
  id: string;
  title: string;
  authors?: string[];
  summary?: {
    one_sentence?: string;
    raw?: string;
  };
  metadata?: {
    score?: number;
    topics?: string[];
    status?: string;
  };
};

export default function PaperCard({ paper }: { paper: Paper }) {
  return (
    <article className="paper-card">
      <Link href={`/paper/${paper.id}`}>
        <h2>{paper.title}</h2>
      </Link>
      <StatusBadge status={paper.metadata?.status ?? "unread"} />
      <p>{paper.authors?.join(", ")}</p>
      <p>{paper.summary?.one_sentence ?? paper.summary?.raw ?? "No summary yet"}</p>
      <p>Score: {paper.metadata?.score ?? "-"} / 5</p>
      <p>{paper.metadata?.topics?.join(" · ")}</p>
    </article>
  );
}
