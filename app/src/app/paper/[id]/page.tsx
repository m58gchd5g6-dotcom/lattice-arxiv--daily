import { getPapers } from "../../../lib/papers";

export default async function PaperPage({ params }: { params: { id: string } }) {
  const papers = getPapers();
  const paper = papers.find((p) => p.id === params.id);

  if (!paper) {
    return <main>Paper not found</main>;
  }

  return (
    <main>
      <h1>{paper.title}</h1>
      <p>{paper.authors?.join(", ")}</p>
      <p>{paper.arxiv_url}</p>

      <h2>AI Summary</h2>
      <pre>{JSON.stringify(paper.summary, null, 2)}</pre>

      <h2>Topics</h2>
      <p>{paper.topics?.join(", ")}</p>

      <h2>My Notes</h2>
      <p>Markdown notes integration coming next.</p>
    </main>
  );
}
