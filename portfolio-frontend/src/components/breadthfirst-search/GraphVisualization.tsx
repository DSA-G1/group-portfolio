import React, { useEffect, useRef, useState } from "react";
import stations from "@/data/stations.json";

const COLORS = {
  bg: "#1f1131",
  text: "#f3e8ff",
  lrt1: "#8a910a",
  lrt2: "#4050be",
  mrt3: "#902d67",
  walk: "#ffffff",
  neon: "#ff5fa2",
  pathHighlight: "#00ff88",
  pathGlow: "rgba(0, 255, 136, 0.8)"
};

/* ===============================
   STATION POSITIONS
================================ */
const POS: Record<string, [number, number]> = {
  // LRT-1
  Baclaran: [140, 740],
  EDSA: [140, 705],
  Libertad: [140, 670],
  "Gil Puyat": [140, 635],
  "Vito Cruz": [140, 600],
  Quirino: [140, 565],
  "Pedro Gil": [140, 530],
  "United Nations": [140, 495],
  Central: [140, 460],
  Carriedo: [140, 425],
  "Doroteo Jose": [140, 390],
  Bambang: [140, 355],
  Tayuman: [140, 320],
  Blumentritt: [140, 285],
  "Abad Santos": [140, 250],
  "R. Papa": [140, 215],
  "5th Avenue": [140, 180],
  Monumento: [140, 135],
  Balintawak: [210, 120],
  Roosevelt: [320, 120],

  // LRT-2
  Recto: [180, 390],
  Legarda: [240, 390],
  Pureza: [300, 390],
  "V. Mapa": [360, 380],
  "J. Ruiz": [420, 340],
  Gilmore: [460, 300],
  "Betty Go-Belmonte": [520, 250],
  "Araneta Center Cubao (LRT2)": [585, 210],
  Anonas: [620, 185],
  Katipunan: [680, 185],
  Santolan: [740, 185],
  "Marikina-Pasig": [820, 185],
  Antipolo: [905, 185],

  // MRT-3
  "North Avenue": [460, 130],
  "Quezon Avenue": [510, 160],
  Kamuning: [540, 190],
  "Araneta Center Cubao (MRT)": [585, 255],
  "Santolan-Annapolis": [610, 315],
  Ortigas: [620, 362],  
  "Shaw Boulevard": [600, 430],
  Boni: [580, 495],
  Guadalupe: [540, 565],
  Buendia: [450, 640],
  Ayala: [360, 690],
  Magallanes: [270, 705],
  Taft: [190, 705]
};

/* ===============================
   BUILD LINES
================================ */
const LRT1: string[] = [];
const LRT2: string[] = [];
const MRT3: string[] = [];

stations.forEach((s) => {
  const [name, line] = s.title.replace(" Station", "").split(" - ");
  if (!POS[name]) return;
  if (line === "LRT 1") LRT1.push(name);
  if (line === "LRT 2") LRT2.push(name);
  if (line === "MRT 3") MRT3.push(name);
});

const WALK: [string, string][] = [
  ["Doroteo Jose", "Recto"],
  ["EDSA", "Taft"],
  ["Roosevelt", "North Avenue"],
  ["Araneta Center Cubao (LRT2)", "Araneta Center Cubao (MRT)"]
];

const poly = (arr: string[]) =>
  arr.map((s) => POS[s].join(",")).join(" ");

interface GraphVisualizationProps {
    start: string;
    end: string;
    currentNode: string | null;
    pathResult: { path: string[]; segments: { from: string; to: string }[] } | null;
}

export default function GraphVisualization({ start, end, currentNode, pathResult }: GraphVisualizationProps) {
  const pathContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (pathContainerRef.current) {
      observer.observe(pathContainerRef.current);
    }

    return () => {
      if (pathContainerRef.current) {
        observer.unobserve(pathContainerRef.current);
      }
    };
  }, [pathResult]);

  useEffect(() => {
    if (pathResult) {
      setIsVisible(false);
    }
  }, [pathResult]);

  const isInPath = (station: string) => {
    return pathResult?.path.includes(station) ?? false;
  };

  const isSegmentInPath = (from: string, to: string) => {
    if (!pathResult?.segments) return false;
    return pathResult.segments.some(
      seg => (seg.from === from && seg.to === to) || (seg.from === to && seg.to === from)
    );
  };

  const renderPathSegments = () => {
    if (!pathResult?.segments) return null;
    
    return pathResult.segments.map((seg, idx) => {
      const fromPos = POS[seg.from];
      const toPos = POS[seg.to];
      if (!fromPos || !toPos) return null;
      
      return (
        <line
          key={`path-${idx}`}
          x1={fromPos[0]}
          y1={fromPos[1]}
          x2={toPos[0]}
          y2={toPos[1]}
          stroke="url(#pathGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px rgba(205, 255, 216, 0.8)) drop-shadow(0 0 16px rgba(148, 185, 255, 0.6))`
          }}
        />
      );
    });
  };

  return (
    <div className="rounded-[40px] p-6 relative">
      {/* TITLE */}
      <h3 className="text-white font-header text-2xl md:text-4xl">LRT AND MRT STATIONS MAP</h3>

      <div className="flex justify-center items-center relative">
        <svg width="1080" height="880" viewBox="0 0 960 820">
          {/* GRADIENT DEFINITION */}
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#cdffd8", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#94b9ff", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          {/* LINES */}
          <polyline points={poly(LRT1)} stroke={COLORS.lrt1} strokeWidth="4" fill="none" />
          <polyline points={poly(LRT2)} stroke={COLORS.lrt2} strokeWidth="4" fill="none" />
          <polyline points={poly(MRT3)} stroke={COLORS.mrt3} strokeWidth="4" fill="none" />

          {/* Walk Transfers */}
          {WALK.map(([a, b]) => (
            <line
              key={a + b}
              x1={POS[a][0]}
              y1={POS[a][1]}
              x2={POS[b][0]}
              y2={POS[b][1]}
              stroke={COLORS.walk}
              strokeDasharray="6 6"
              strokeWidth="2"
            />
          ))}

          {/* HIGHLIGHT PATH SEGMENTS (rendered on top) */}
          {renderPathSegments()}

          {/* Stations */}
          {Object.entries(POS).map(([name, [x, y]]) => {
            const isTransfer = WALK.flat().includes(name);
            const isLRT1 = LRT1.includes(name);
            const inPath = isInPath(name);
            const isStart = pathResult?.path[0] === name;
            const isEnd = pathResult?.path[pathResult.path.length - 1] === name;

            let textX = isLRT1 ? x - 20 : x + 16;
            let textY = y + 5;
            let anchor: "start" | "end" | "middle" = isLRT1 ? "end" : "start";

            // Adjusted labels for Balintawak and Roosevelt
            if (name === "Balintawak") {
              textX = x + 35;
              textY = y - 14;
              anchor = "middle";
            }
            if (name === "Roosevelt") {
              textX = x;
              textY = y - 28;
              anchor = "middle";
            }

            if (
              ["Anonas","Katipunan","Santolan","Marikina-Pasig","Antipolo"].includes(name)
            ) {
              textX = x;
              textY = y - 20;
              anchor = "middle";
            }

            if (["Legarda","Pureza","Recto","Taft","Magallanes"].includes(name)) {
              textX = x;
              textY = y + 26;
              anchor = "middle";
            }

            if (["North Avenue","Quezon Avenue","Kamuning"].includes(name)) {
              textX = x - 20;
              textY = y + 16;
              anchor = "end";
            }

            if (name === "Betty Go-Belmonte") {
              textX = x - 20;
              anchor = "end";
            }

            // Determine station line color
            let lineColor = "#fff";
            if (isLRT1) lineColor = COLORS.lrt1;
            else if (LRT2.includes(name)) lineColor = COLORS.lrt2;
            else if (MRT3.includes(name)) lineColor = COLORS.mrt3;

            // Determine station appearance
            let stationFill = "none";
            let stationRadius = 6;
            let stationStroke = lineColor;
            let stationStrokeWidth = 3;
            let glowFilter = "";

            if (isStart) {
              stationFill = "url(#pathGradient)";
              stationRadius = 7;
              stationStroke = "url(#pathGradient)";
              stationStrokeWidth = 2;
              glowFilter = "drop-shadow(0 0 8px rgba(205, 255, 216, 0.8)) drop-shadow(0 0 12px rgba(148, 185, 255, 0.6))";
            } else if (isEnd) {
              stationFill = "url(#pathGradient)";
              stationRadius = 7;
              stationStroke = "url(#pathGradient)";
              stationStrokeWidth = 2;
              glowFilter = "drop-shadow(0 0 8px rgba(205, 255, 216, 0.8)) drop-shadow(0 0 12px rgba(148, 185, 255, 0.6))";
            } else if (inPath) {
              stationFill = "url(#pathGradient)";
              stationRadius = 7;
              stationStroke = "url(#pathGradient)";
              stationStrokeWidth = 2;
              glowFilter = `drop-shadow(0 0 8px rgba(205, 255, 216, 0.8)) drop-shadow(0 0 12px rgba(148, 185, 255, 0.6))`;
            }

            return (
              <g key={name}>
                {/* Background circle to hide the line */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={stationRadius + 1} 
                  fill={COLORS.bg}
                />
                {/* Station circle */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={stationRadius} 
                  fill={stationFill}
                  stroke={stationStroke}
                  strokeWidth={stationStrokeWidth}
                  style={{
                    filter: glowFilter,
                    transition: "all 0.3s ease"
                  }}
                />
                <text
                  x={textX}
                  y={textY}
                  fontSize="11"
                  fill={COLORS.text}
                  textAnchor={anchor}
                  fontWeight="normal"
                >
                  {name.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* LEGEND - positioned at lower right of graph */}
        <div
          className="absolute bottom-2 right-2 md:bottom-4 lg:bottom-6 md:right-4 lg:right-6 rounded-lg md:rounded-xl lg:rounded-2xl p-2 md:p-3 lg:p-6 text-xs md:text-sm lg:text-base text-white space-y-1 md:space-y-2 lg:space-y-3"
          style={{
            background: "#1f1131",
            border: `3px solid #ffcaef`,
            boxShadow: `
              0 0 12px #ffcaef,
              0 0 28px rgba(255,202,239,0.8),
              inset 0 0 14px rgba(255,202,239,0.4)
            `
          }}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <span className="w-6 md:w-8 lg:w-10 h-1 rounded" style={{ background: COLORS.lrt1 }} />
            <span>LRT-1 LINE</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="w-6 md:w-8 lg:w-10 h-1 rounded" style={{ background: COLORS.lrt2 }} />
            <span>LRT-2 LINE</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="w-6 md:w-8 lg:w-10 h-1 rounded" style={{ background: COLORS.mrt3 }} />
            <span>MRT-3 LINE</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="w-6 md:w-8 lg:w-10 border-t-2 border-dashed border-white" />
            <span>WALK TRANSFER</span>
          </div>
        </div>
      </div>
    </div>
  );
}