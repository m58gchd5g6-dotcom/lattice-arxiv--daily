"use client";

import { useState } from "react";

export default function NoteEditor({ paperId }: { paperId: string }) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  function saveNote() {
    localStorage.setItem(`lattice-note-${paperId}`, note);
    setSaved(true);
  }

  return (
    <section>
      <h2>New Note</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your research notes here..."
        rows={8}
      />
      <button onClick={saveNote}>Save note</button>
      {saved && <p>Saved locally.</p>}
    </section>
  );
}
