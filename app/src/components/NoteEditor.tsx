"use client";

import { useEffect, useState } from "react";

export default function NoteEditor({ paperId }: { paperId: string }) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(`lattice-note-${paperId}`);
    if (existing) setNote(existing);
  }, [paperId]);

  function saveNote() {
    localStorage.setItem(`lattice-note-${paperId}`, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <section>
      <h2>My Notes</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your research notes here..."
        rows={12}
      />
      <button onClick={saveNote}>Save note</button>
      {saved && <p>Saved.</p>}
    </section>
  );
}
