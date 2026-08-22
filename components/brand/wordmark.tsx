import { cn } from "@/lib/utils";

const LETTERS = ["B", "R", "A", "N", "D"];

export function Wordmark() {
  return (
    <span
      className={cn(
        "inline-flex",
        "gap-1.25",
        "font-serif",
        "text-[12px]",
        "font-normal",
        "text-neutral-700"
      )}
    >
      {LETTERS.map((char) => (
        <span key={char}>{char}</span>
      ))}
    </span>
  );
}