import PaperCard from "../components/PaperCard";
import { getPapers } from "../lib/papers";

export default function Home() {
  const papers = getPapers();

  return (
    <main>
      <h1>Lattice Daily</h1>
      <p>Daily lattice research reader.</p>

      {papers.length === 0 ? (
        <p>No papers loaded yet.</p>
      ) : (
        papers.slice(0, 10).map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))
      )}
    </main>
  );
}
