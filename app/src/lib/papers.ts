import fs from "fs";
import path from "path";

export type Paper = {
  id: string;
  title: string;
  authors?: string[];
  arxiv_url?: string;
  summary?: Record<string, unknown>;
  topics?: string[];
  score?: number | null;
  status?: string;
};

export function getPapers(): Paper[] {
  const file = path.join(process.cwd(), "data", "papers.json");

  if (!fs.existsSync(file)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(file, "utf8"));
}
