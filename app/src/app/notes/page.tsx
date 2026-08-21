"use client";

import { useEffect, useState } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    const saved: string[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("lattice-note-")) {
        const value = localStorage.getItem(key);
        if (value) saved.push(value);
      }
    });
    setNotes(saved);
  }, []);

  return (
    <main>
      <h1>My Notes</h1>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        notes.map((note, index) => (
          <article key={index} className="paper-card">
            <pre>{note}</pre>
          </article>
        ))
      )}
    </main>
  );
}
