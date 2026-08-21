import fs from "fs";
import path from "path";

function getNotes() {
  const dir = path.join(process.cwd(), "notes", "papers");

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
}

export default function NotesPage() {
  const notes = getNotes();

  return (
    <main>
      <h1>My Notes</h1>
      {notes.length === 0 ? (
        <p>No markdown notes yet.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
