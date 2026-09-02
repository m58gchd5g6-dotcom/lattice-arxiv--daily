"use client";

import { useState } from "react";

import { filterPapers } from "../lib/paper-utils";
import PaperCard from "./PaperCard";
import SearchFilter from "./SearchFilter";

import type { Paper } from "../lib/papers";

export default function LibraryClient({ papers }: { papers: Paper[] }) {
  const [query, setQuery] = useState("");
  const filtered = filterPapers(papers, query);

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
