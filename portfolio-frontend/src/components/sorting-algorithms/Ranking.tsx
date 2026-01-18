import React, { useMemo } from "react";
import { algoLabels, generators, AlgoKey } from "./utils";

type Props = { arr: number[]; speed: number };

export default function Ranking({ arr, speed }: Props) {
  const ranking = useMemo(() => {
    const keys: AlgoKey[] = ["bubble", "selection", "insertion", "merge", "quick"];
    const stats = keys.map((k) => ({ key: k, frames: generators[k](arr).length }));
    return stats.sort((a, b) => a.frames - b.frames);
  }, [arr]);

  const speedMultiplier = Math.max(speed || 1, 0.01);

  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] min-h-[140px]">
      <h3 className="text-[#f181b6] font-header text-4xl mb-2">Speed Sort Ranking</h3>
      {arr.length > 0 && (
        <>
          <p className="text-[#ffcaef] font-body text-m mb-4">Time = frames / speed</p>
          <div className="grid grid-cols-5 gap-3 text-sm">
            {ranking.map((r, idx) => (
              <div
                key={r.key}
                className={`rounded-[17px] border-[3px] border-[#d4ff4f] bg-[#1f1131] p-3 flex items-center justify-center text-center ${idx === 0 ? 'shadow-[0_0_12px_4px_rgba(212,255,79,0.7)]' : ''}`}
              >
                <span className="text-white font-body">{algoLabels[r.key]}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-3 mt-2 text-xs text-[#ffcaef]">
            {ranking.map((r) => (
              <span key={r.key} className="text-center font-body">{(r.frames / speedMultiplier).toFixed(2)}s</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}