"use client";

import { useState } from "react";
import PaperCard from "../../components/PaperCard";
import { getPapers } from "../../lib/papers";
import SearchFilter from "../../components/SearchFilter";

export default function Library() {
  const papers = getPapers();
  const [query, setQuery] = useState("");

  const filtered = papers.filter((paper) =>
    paper.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main>
      <h1>Lattice Library</h1>
      <p>{papers.length} papers collected</p>
      <SearchFilter onChange={setQuery} />
      <section>
        {filtered.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </section>
    </main>
  );
}
