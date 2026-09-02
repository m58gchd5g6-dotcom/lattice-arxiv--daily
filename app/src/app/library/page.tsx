import LibraryClient from "../../components/LibraryClient";
import { toPaperPreviews } from "../../lib/paper-utils";
import { getPapers } from "../../lib/papers";

export default function LibraryPage() {
  return <LibraryClient papers={toPaperPreviews(getPapers())} />;
}
