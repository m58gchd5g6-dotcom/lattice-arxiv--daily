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
    <section className="notes-box">
      <h2>My Notes</h2>
      <p>Markdown supported: headings, lists, equations, and research thoughts.</p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="# Main idea\n\n## Questions\n\n- ..."
        rows={16}
      />
      <button onClick={saveNote}>Save note</button>
      {saved && <p>Saved.</p>}
    </section>
  );
}
