import { getPapers } from "../../lib/papers";

export default function Library() {
  const papers = getPapers();

  return (
    <main>
      <h1>Library</h1>
      {papers.map((paper) => (
        <article key={paper.id}>
          <h2>{paper.title}</h2>
          <p>{paper.metadata?.topics?.join(", ")}</p>
        </article>
      ))}
    </main>
  );
}
