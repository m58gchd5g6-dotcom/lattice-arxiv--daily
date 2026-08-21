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
    <article>
      <h2>{paper.title}</h2>
      <p>{paper.summary?.one_sentence ?? paper.summary?.raw ?? "No summary yet"}</p>
      <p>Score: {paper.metadata?.score ?? "-"}</p>
    </article>
  );
}
