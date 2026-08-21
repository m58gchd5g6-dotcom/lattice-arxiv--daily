import PaperCard from "../components/PaperCard";

const demoPapers = [
  {
    id: "demo",
    title: "Lattice Daily is coming",
    summary: {
      one_sentence: "The reading interface is being built from the paper database."
    },
    metadata: {
      score: 5,
      topics: ["Lattice Field Theory"],
      status: "unread"
    }
  }
];

export default function Home() {
  return (
    <main>
      <h1>Lattice Daily</h1>
      <p>Daily lattice research reader.</p>
      {demoPapers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </main>
  );
}
