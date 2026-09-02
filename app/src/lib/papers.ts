import "server-only";

import papersData from "../../../data/papers.json";
import { preparePapers } from "./paper-utils";

import type { Paper } from "./paper-utils";

export type { Paper } from "./paper-utils";

export function getPapers(): Paper[] {
  return preparePapers(papersData as unknown as Paper[]);
}
