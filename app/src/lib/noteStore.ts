export function getSavedNote(paperId: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(`lattice-note-${paperId}`) || "";
}

export function saveNote(paperId: string, content: string) {
  localStorage.setItem(`lattice-note-${paperId}`, content);
}
