export type Frame = {
  array: number[];
  highlight?: { type: "compare" | "swap"; indices: number[] };
  sortedRange?: [number, number];
  sortedUntil?: number;
};

export type AlgoKey = "bubble" | "selection" | "insertion" | "merge" | "quick";

export function parseCsv(input: string): number[] {
  return input
    .split(/[\,\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => Number(t))
    .filter((n) => !Number.isNaN(n));
}