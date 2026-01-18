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
      <h2 className="text-white font-header text-4xl mb-4">Sorting Algorithm Visualization</h2>
      <div className="relative rounded-[22px] border-[3px] border-[#ffcaef] bg-[#1f1131] h-[380px] overflow-hidden flex items-end justify-center">
        {/* Decorative right scrollbar track (vertical) */}
        <div className="absolute right-3 top-6 bottom-6 w-2 rounded-full bg-white/10">
          <div className="w-2 rounded-full bg-[#ffcaef]" style={{ height: frame.array.length ? `${Math.max(18, 60 / (frame.array.length || 1))}%` : "28%", marginTop: frame.array.length ? `${progress * 100}%` : "0%" }} />
        </div>
        <div className="absolute left-6 right-6 bottom-3 h-2 rounded-full bg-white/10">
          <div 
            className="h-2 rounded-full bg-[#ffcaef]" 
            style={{ 
              width: '20%',
              marginLeft: `${progress * 100}%`
            }} 
          />
        </div>
        {frame.array.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-white font-semibold text-lg">No Array List Yet</p>
            <p className="text-[#f181b6] text-sm">Add List of Numbers</p>
          </div>
        ) : (
          <div className="flex items-end justify-center gap-1 w-full max-w-4xl h-full pb-16">
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
                <div key={i} className="m-0 p-0">
                  <div 
                    style={{ 
                      height, 
                      width: barWidth
                    }} 
                    className={`relative flex items-center justify-center rounded-2xl border-4 border-white/30 shadow-lg transition-all ${barColorClass}`}
                    title={`index ${i}: ${val}`} 
                  >
                    <span className="text-white font-semibold text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">{val}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="absolute left-1/2 bottom-6 transform -translate-x-1/2 w-[260px] h-[22px] rounded-full bg-[#1b0f2b]/70 border border-white/15 flex items-center justify-between px-2">
          <button 
            className="text-[#f181b6] hover:text-[#f181b6] transition text-sm"
            onClick={() => setIdx((i: number) => Math.max(0, i - 1))}
          >
            ◀
          </button>
          
          <div className="flex-1 mx-2 h-2 bg-white/10 rounded-full relative">
            <div 
              className="h-2 w-14 bg-[#f181b6] rounded-full shadow-lg transition-all"
              style={{ 
                marginLeft: framesCount > 1 
                  ? `calc(${(idx / (framesCount - 1)) * 100}% - 28px)`
                  : '0'
              }}
            />
          </div>
          
          <button 
            className="text-[#f181b6] hover:text-[#f181b6] transition text-sm"
            onClick={() => setIdx((i: number) => Math.min(framesCount - 1, i + 1))}
          >
            ▶
          </button>
        </div>
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
      <span className="text-[#ffcaef] font-body text-sm">{label}</span>
    </div>
  );
}