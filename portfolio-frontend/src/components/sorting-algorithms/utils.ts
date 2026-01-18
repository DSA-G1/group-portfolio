export type Frame = {
  array: number[];
  highlight?: { type: "compare" | "swap"; indices: number[] };
  sortedRange?: [number, number];
  sortedUntil?: number;
};

export type AlgoKey = "bubble" | "selection" | "insertion" | "merge" | "quick";

export const algoLabels: Record<AlgoKey, string> = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
};

export const algoInfo: Record<AlgoKey, { best: string; average: string; worst: string; space: string }> = {
  bubble: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  selection: { best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  insertion: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  merge: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  quick: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
};

export function bubbleSortFrames(input: number[]): Frame[] {
  const a = [...input];
  const frames: Frame[] = [{ array: [...a] }];
  const n = a.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      frames.push({ array: [...a], highlight: { type: "compare", indices: [j, j + 1] }, sortedUntil: n - 1 - i });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        frames.push({ array: [...a], highlight: { type: "swap", indices: [j, j + 1] }, sortedUntil: n - 1 - i });
      }
    }
    frames.push({ array: [...a], sortedUntil: n - 1 - i });
  }
  return frames;
}

export function selectionSortFrames(input: number[]): Frame[] {
  const a = [...input];
  const frames: Frame[] = [{ array: [...a] }];
  const n = a.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      frames.push({ array: [...a], highlight: { type: "compare", indices: [j, minIdx] }, sortedRange: [0, i - 1] });
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      frames.push({ array: [...a], highlight: { type: "swap", indices: [i, minIdx] }, sortedRange: [0, i] });
    } else {
      frames.push({ array: [...a], sortedRange: [0, i] });
    }
  }
  return frames;
}

export function insertionSortFrames(input: number[]): Frame[] {
  const a = [...input];
  const frames: Frame[] = [{ array: [...a] }];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    frames.push({ array: [...a], highlight: { type: "compare", indices: [j, i] }, sortedRange: [0, i - 1] });
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      frames.push({ array: [...a], highlight: { type: "swap", indices: [j, j + 1] }, sortedRange: [0, i - 1] });
      j--;
    }
    a[j + 1] = key;
    frames.push({ array: [...a], sortedRange: [0, i] });
  }
  return frames;
}

// --- Merge Sort ---
export function mergeSortFrames(input: number[]): Frame[] {
  const a = [...input];
  const frames: Frame[] = [{ array: [...a] }];

  function merge(l: number, m: number, r: number) {
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      // compare
      const li = l + i;
      const rj = m + 1 + j;
      frames.push({ array: [...a], highlight: { type: "compare", indices: [li, rj] }, sortedRange: [l, r] });
      if (left[i] <= right[j]) {
        a[k] = left[i];
        frames.push({ array: [...a], highlight: { type: "swap", indices: [k] }, sortedRange: [l, r] });
        i++; k++;
      } else {
        a[k] = right[j];
        frames.push({ array: [...a], highlight: { type: "swap", indices: [k] }, sortedRange: [l, r] });
        j++; k++;
      }
    }
    while (i < left.length) {
      a[k] = left[i];
      frames.push({ array: [...a], highlight: { type: "swap", indices: [k] }, sortedRange: [l, r] });
      i++; k++;
    }
    while (j < right.length) {
      a[k] = right[j];
      frames.push({ array: [...a], highlight: { type: "swap", indices: [k] }, sortedRange: [l, r] });
      j++; k++;
    }
  }

  function sort(l: number, r: number) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    sort(l, m);
    sort(m + 1, r);
    merge(l, m, r);
  }
  sort(0, a.length - 1);
  // final state
  frames.push({ array: [...a], sortedRange: [0, a.length - 1] });
  return frames;
}

// --- Quick Sort ---
export function quickSortFrames(input: number[]): Frame[] {
  const a = [...input];
  const frames: Frame[] = [{ array: [...a] }];

  function swap(i: number, j: number) {
    [a[i], a[j]] = [a[j], a[i]];
    frames.push({ array: [...a], highlight: { type: "swap", indices: [i, j] } });
  }

  function partition(l: number, r: number): number {
    const pivot = a[r];
    let i = l;
    for (let j = l; j < r; j++) {
      frames.push({ array: [...a], highlight: { type: "compare", indices: [j, r] } });
      if (a[j] <= pivot) {
        swap(i, j);
        i++;
      }
    }
    swap(i, r);
    return i;
  }

  function sort(l: number, r: number) {
    if (l >= r) return;
    const p = partition(l, r);
    // mark left/right partitions as progressively sorted ranges
    sort(l, p - 1);
    sort(p + 1, r);
  }
  sort(0, a.length - 1);
  frames.push({ array: [...a], sortedRange: [0, a.length - 1] });
  return frames;
}

export const generators: Record<AlgoKey, (input: number[]) => Frame[]> = {
  bubble: bubbleSortFrames,
  selection: selectionSortFrames,
  insertion: insertionSortFrames,
  merge: mergeSortFrames,
  quick: quickSortFrames,
};

export function parseCsv(input: string): number[] {
  return input
    .split(/[\,\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => Number(t))
    .filter((n) => !Number.isNaN(n));
}