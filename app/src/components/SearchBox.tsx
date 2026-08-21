"use client";

export default function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      placeholder="Search papers..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
