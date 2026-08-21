"use client";

import { useState } from "react";

export default function SearchFilter({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <input
      value={value}
      placeholder="Search papers..."
      onChange={(event) => {
        const next = event.target.value;
        setValue(next);
        onChange(next);
      }}
    />
  );
}
