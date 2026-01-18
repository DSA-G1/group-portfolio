import React from "react";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, StepBack, StepForward, RefreshCw } from "lucide-react";
import type { Frame } from "./utils";

type Props = {
  frame: Frame;
  framesCount: number;
  idx: number;
  setIdx: (n: number | ((n: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (b: boolean | ((b: boolean) => boolean)) => void;
  speed: number;
  setSpeed: (n: number) => void;
  restart: () => void;
};

function colorForIndex(frame: Frame, i: number): string {
  const pink = "#f181b6";
  const yellow = "#f6d365";
  const green = "#2ee59d";
  const inHighlight = frame.highlight?.indices.includes(i);
  if (inHighlight) return yellow;
  if (frame.sortedUntil !== undefined && i > frame.sortedUntil) return pink;
  if (frame.sortedUntil !== undefined && i <= frame.sortedUntil) return green;
  if (frame.sortedRange) {
    const [s, e] = frame.sortedRange;
    if (s !== undefined && e !== undefined && i >= s && i <= e) return green;
  }
  return pink;
}

function getBarColorClass(frame: Frame, i: number): string {
  const color = colorForIndex(frame, i);
  if (color === "#f6d365") return "bg-[#f6d365]";
  if (color === "#2ee59d") return "bg-[#2ee59d]";
  return "bg-[#f181b6]";
}

export default function Visualization({ frame, framesCount, idx, setIdx, isPlaying, setIsPlaying, speed, setSpeed, restart }: Props) {
  const max = Math.max(1, ...frame.array);
  const progress = framesCount > 1 ? idx / (framesCount - 1) : 0;
  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
      <h2 className="text-white font-body text-4xl mb-4">Sorting Algorithm Visualization</h2>
      <style>{`
        .bars-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .bars-container::-webkit-scrollbar-track {
          background: transparent;
          margin-top: 16px;
          margin-bottom: 16px;
          margin-right: 12px;
        }
        .bars-container::-webkit-scrollbar-thumb {
          background: #ffcaef;
          border-radius: 4px;
          min-height: 40px;
        }
        .bars-container::-webkit-scrollbar-thumb:hover {
          background: #ffb3e6;
        }
        .bars-container::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
      <div className="bars-container rounded-[22px] border-[3px] border-[#ffcaef] bg-[#1f1131] h-[380px] overflow-auto">
        {frame.array.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <p className="text-white font-semibold text-lg">No Array List Yet</p>
            <p className="text-[#f181b6] text-sm">Add List of Numbers</p>
          </div>
        ) : (
          <div className="inline-flex items-end justify-center gap-1 h-full pb-6 px-4 py-4 min-h-full">
            {frame.array.map((val, i) => {
              const barColorClass = getBarColorClass(frame, i);
              // Responsive bar height based on value
              const maxBarHeight = 200;
              const normalizedHeight = (val / max) * maxBarHeight;
              const height = Math.max(12, Math.min(maxBarHeight, normalizedHeight));
              
              const containerWidth = 1024;
              const gap = 4;
              const totalGapWidth = gap * Math.max(0, frame.array.length - 1);
              const availableWidth = containerWidth - totalGapWidth;
              const baseBarWidth = availableWidth / Math.max(frame.array.length, 1);
              const barWidth = Math.max(16, Math.min(100, baseBarWidth));
              
              return (
                <div key={i} className="m-0 p-0 flex-shrink-0">
                  <div 
                    style={{ 
                      height, 
                      width: barWidth
                    }} 
                    className={`relative flex items-center justify-center rounded-2xl shadow-lg transition-all ${barColorClass}`}
                    title={`index ${i}: ${val}`} 
                  >
                    <span className="text-white font-semibold text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">{val}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
        <LegendChip label="Unsorted" color="#f181b6" />
        <LegendChip label="Swapping" color="#f6d365" />
        <LegendChip label="Sorted" color="#2ee59d" />
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <button className="bg-transparent border-[3px] border-[#f181b6] rounded-full p-3 hover:bg-[#f181b6]/10 transition" onClick={() => setIdx((i: number) => Math.max(0, i - 1))}>
            <StepBack className="text-[#f181b6]" size={20} />
          </button>
          <button className="bg-transparent border-[3px] border-[#f181b6] rounded-full p-4 hover:bg-[#f181b6]/10 transition" onClick={() => setIsPlaying((p: boolean) => !p)}>
            {isPlaying ? <Pause className="text-[#f181b6]" size={24} fill="#f181b6" /> : <Play className="text-[#f181b6]" size={24} fill="#f181b6" />}
          </button>
          <button className="bg-transparent border-[3px] border-[#f181b6] rounded-full p-3 hover:bg-[#f181b6]/10 transition" onClick={() => setIdx((i: number) => Math.min(framesCount - 1, i + 1))}>
            <StepForward className="text-[#f181b6]" size={20} />
          </button>
        </div>
        <div className="flex items-center gap-8 text-white text-xs">
          <span>Step Backward</span>
          <span>Play / Pause</span>
          <span>Step Forward</span>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
          <div className="w-full md:w-[60%]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-body text-sm font-semibold">Animation speed</p>
              <div className="px-3 py-1 rounded-full bg-[#2b1b3d] border-[2px] border-white/20 text-white text-xs font-semibold">{speed.toFixed(2)}x</div>
            </div>
            <Slider
              value={[speed]}
              min={0.25}
              max={2}
              step={0.25}
              onValueChange={(v) => setSpeed(v[0] as number)}
              className="
                [&>*:first-child]:bg-white/20
                [&>*:first-child>*]:bg-white
              "
            />
          </div>
          <button className="bg-[#f181b6] text-white border-[4px] border-white px-10 py-2.5 rounded-[44px] font-body font-semibold hover:opacity-90 whitespace-nowrap" onClick={restart}>
            Restart Animation
          </button>
        </div>
      </div>
    </div>
  );
}

function LegendChip({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-10 rounded-full" style={{ background: color }} />
      <span className="font-body text-sm" style={{ color }}>{label}</span>
    </div>
  );
}