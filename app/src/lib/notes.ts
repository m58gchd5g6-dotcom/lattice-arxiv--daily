import fs from "fs";
import path from "path";

export function getNoteFiles() {
  const dir = path.join(process.cwd(), "notes", "papers");

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
}

export function getNoteContent(file: string) {
  const notePath = path.join(process.cwd(), "notes", "papers", file);

  if (!fs.existsSync(notePath)) {
    return "";
  }

  return fs.readFileSync(notePath, "utf8");
}
