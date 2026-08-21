import PaperCard from "../../components/PaperCard";
import { getPapers } from "../../lib/papers";

export default function Library() {
  const papers = getPapers();

  return (
    <main>
      <h1>Lattice Library</h1>
      <p>{papers.length} papers collected</p>
      <section>
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </section>
    </main>
  );
}
