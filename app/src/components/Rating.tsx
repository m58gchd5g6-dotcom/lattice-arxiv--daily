export default function Rating({ score }: { score?: number | null }) {
  if (!score) return <span>No rating</span>;

  return <span>{"★".repeat(score)}{"☆".repeat(5 - score)}</span>;
}
