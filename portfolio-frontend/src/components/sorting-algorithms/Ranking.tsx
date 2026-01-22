import React, { useEffect, useState } from "react";
import { AlgoKey } from "./utils";
import api from "@/services/api";

type Props = { arr: number[]; speed: number };

interface AlgoMetadata {
  labels?: Record<AlgoKey, string>;
  info?: Record<AlgoKey, { best: string; average: string; worst: string; space: string }>;
  descriptions?: Record<AlgoKey, string>;
}

export default function Ranking({ arr, speed }: Props) {
  const [metadata, setMetadata] = useState<AlgoMetadata>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [labels, info, descriptions] = await Promise.all([
          api.get("/sorting-algorithms/metadata/labels"),
          api.get("/sorting-algorithms/metadata/info"),
          api.get("/sorting-algorithms/metadata/descriptions"),
        ]);
        setMetadata({
          labels: labels.data,
          info: info.data,
          descriptions: descriptions.data,
        });
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const ranking = arr.length > 0 && metadata.labels 
    ? (() => {
        const keys: AlgoKey[] = ["bubble", "selection", "insertion", "merge", "quick"];
        return keys.sort((a, b) => {
          // Approximate ranking based on complexity (simplified)
          const complexityRank: Record<AlgoKey, number> = {
            bubble: 5, selection: 4, insertion: 3, merge: 1, quick: 2
          };
          return complexityRank[a] - complexityRank[b];
        });
      })()
    : [];

  const speedMultiplier = Math.max(speed || 1, 0.01);

  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] min-h-[140px]">
      <h3 className="text-white font-body text-4xl mb-2">Speed Sort Ranking</h3>
      {arr.length > 0 && !loading && (
        <>
          <p className="text-[#ffcaef] font-body text-m mb-4">Algorithm Efficiency Order</p>
          <div className="grid grid-cols-5 gap-3 text-sm">
            {ranking.map((r, idx) => (
              <div
                key={r}
                className={`rounded-[17px] border-[3px] border-[#d4ff4f] bg-[#1f1131] p-3 flex items-center justify-center text-center ${idx === 0 ? 'shadow-[0_0_12px_4px_rgba(212,255,79,0.7)]' : ''}`}
              >
                <span className="text-white font-body">{metadata.labels?.[r] || r}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}