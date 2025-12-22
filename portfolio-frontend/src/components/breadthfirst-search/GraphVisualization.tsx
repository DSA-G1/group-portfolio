import React, { useEffect, useRef, useState } from "react";
import stations from "@/data/stations.json";

const COLORS = {
  bg: "#12091f",
  text: "#f3e8ff",
  lrt1: "#c9ff1a",
  lrt2: "#7fd1ff",
  mrt3: "#ff5fa2",
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
          stroke={COLORS.pathHighlight}
          strokeWidth="6"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${COLORS.pathGlow}) drop-shadow(0 0 16px ${COLORS.pathGlow})`
          }}
        />
      );
    });
  };

  return (
    <div className="bg-[#12091f] rounded-[40px] p-6 border-[4px] border-[#ff5fa2] relative">
      {/* TITLE */}
      <h3 className="text-[#f181b6] font-header text-4xl mb-2 text-left">
        MRT AND LRT STATIONS MAP
      </h3>

      <div className="flex justify-center items-center relative">
        <svg width="1080" height="880" viewBox="0 0 960 820">
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

            let textX = isLRT1 ? x - 12 : x + 8;
            let textY = y + 4;
            let anchor: "start" | "end" | "middle" = isLRT1 ? "end" : "start";

            // Adjusted labels for Balintawak and Roosevelt
            if (name === "Balintawak") {
              textX = x + 25;
              textY = y - 10;
              anchor = "middle";
            }
            if (name === "Roosevelt") {
              textX = x;
              textY = y - 20;
              anchor = "middle";
            }

            if (
              ["Anonas","Katipunan","Santolan","Marikina-Pasig","Antipolo"].includes(name)
            ) {
              textX = x;
              textY = y - 12;
              anchor = "middle";
            }

            if (["Legarda","Pureza","Recto","Taft","Magallanes"].includes(name)) {
              textX = x;
              textY = y + 18;
              anchor = "middle";
            }

            if (["North Avenue","Quezon Avenue","Kamuning"].includes(name)) {
              textX = x - 12;
              textY = y + 12;
              anchor = "end";
            }

            if (name === "Betty Go-Belmonte") {
              textX = x - 12;
              anchor = "end";
            }

            // Determine station color and size
            let stationFill = "#fff";
            let stationRadius = 4;
            let stationStroke = "none";
            let stationStrokeWidth = 0;
            let glowFilter = "";

            if (isStart) {
              stationFill = "#00ff00"; // Green for start
              stationRadius = 8;
              stationStroke = "#fff";
              stationStrokeWidth = 3;
              glowFilter = "drop-shadow(0 0 10px rgba(0, 255, 0, 0.8))";
            } else if (isEnd) {
              stationFill = "#ff0000"; // Red for end
              stationRadius = 8;
              stationStroke = "#fff";
              stationStrokeWidth = 3;
              glowFilter = "drop-shadow(0 0 10px rgba(255, 0, 0, 0.8))";
            } else if (inPath) {
              stationFill = COLORS.pathHighlight; // Neon green for path
              stationRadius = 7;
              stationStroke = "#fff";
              stationStrokeWidth = 2;
              glowFilter = `drop-shadow(0 0 8px ${COLORS.pathGlow})`;
            }

            return (
              <g key={name}>
                {isTransfer && !inPath && (
                  <circle cx={x} cy={y} r={9} fill="none" stroke="#fff" strokeWidth="2" />
                )}
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
                  fill={inPath ? COLORS.pathHighlight : COLORS.text}
                  textAnchor={anchor}
                  fontWeight={inPath ? "bold" : "normal"}
                  style={{
                    textShadow: inPath ? `0 0 8px ${COLORS.pathGlow}` : "none"
                  }}
                >
                  {name.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* LEGEND - positioned at lower right of graph */}
        <div
          className="absolute bottom-6 right-6 rounded-2xl p-6 text-base text-white space-y-3"
          style={{
            background: "#1a0f2f",
            border: `3px solid ${COLORS.neon}`,
            boxShadow: `
              0 0 12px ${COLORS.neon},
              0 0 28px rgba(255,95,162,0.8),
              inset 0 0 14px rgba(255,95,162,0.4)
            `
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-1 rounded" style={{ background: COLORS.lrt1 }} />
            <span>LRT-1 LINE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-1 rounded" style={{ background: COLORS.lrt2 }} />
            <span>LRT-2 LINE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-1 rounded" style={{ background: COLORS.mrt3 }} />
            <span>MRT-3 LINE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-white" />
            <span>STATION</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-10 border-t-2 border-dashed border-white" />
            <span>WALK TRANSFER</span>
          </div>
          {pathResult && (
            <>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ background: COLORS.pathHighlight }} />
                <span>PATH STATIONS</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span>START</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span>END</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* PATH RESULT - HORIZONTAL LAYOUT */}
      <div className="mt-4">
        {pathResult ? (
          <div
            ref={pathContainerRef}
            className="rounded-2xl p-6 space-y-6"
            style={{
              background: "#1a0f2f",
              border: `3px solid ${COLORS.neon}`
            }}
          >
            <h3 className="text-white font-header text-3xl mb-4">Path Found</h3>
            <div className="flex items-center justify-start gap-4 overflow-x-auto custom-scrollbar pb-4">
              {pathResult.path.map((station, index) => (
                <React.Fragment key={index}>
                  <div className={`flex flex-col items-center gap-2 flex-shrink-0 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}
                    style={{
                      animationDelay: isVisible ? `${index * 0.1}s` : '0s',
                      animationFillMode: 'both'
                    }}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white border-4 transition-all duration-300 hover:scale-110 ${
                        index === 0
                          ? 'bg-green-500 border-green-300 animate-pulse'
                          : index === pathResult.path.length - 1
                          ? 'bg-red-500 border-red-300 animate-pulse'
                          : 'bg-[#00ff88] border-[#00ff88]/50'
                      }`}
                      style={{
                        boxShadow: index === 0 
                          ? '0 0 20px rgba(34,197,94,0.8), 0 0 40px rgba(34,197,94,0.5), inset 0 0 20px rgba(34,197,94,0.3)'
                          : index === pathResult.path.length - 1
                          ? '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.5), inset 0 0 20px rgba(239,68,68,0.3)'
                          : '0 0 20px rgba(0,255,136,0.8), 0 0 40px rgba(0,255,136,0.5), inset 0 0 20px rgba(0,255,136,0.3)'
                      }}
                    >
                      <span className="text-lg">{index + 1}</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg text-center font-body text-sm min-w-[120px] transition-all duration-300 ${
                        index === 0
                          ? 'bg-green-500/20 text-green-300 border border-green-500'
                          : index === pathResult.path.length - 1
                          ? 'bg-red-500/20 text-red-300 border border-red-500'
                          : 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]'
                      }`}
                    >
                      <div className="font-bold">{station}</div>
                      {index === 0 && <div className="text-xs mt-1">START</div>}
                      {index === pathResult.path.length - 1 && <div className="text-xs mt-1">END</div>}
                    </div>
                  </div>
                  {index < pathResult.path.length - 1 && (
                    <div 
                      className={`text-[#f181b6] text-4xl font-bold flex-shrink-0 pb-12 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}
                      style={{
                        animationDelay: isVisible ? `${index * 0.1 + 0.05}s` : '0s',
                        animationFillMode: 'both'
                      }}
                    >→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-white font-body text-xl mb-2">
              Enter start and destination to find the shortest route
            </p>
            <p className="text-[#ffcaef] font-body text-lg">
              Using Breadth-First Search (BFS) Algorithm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
