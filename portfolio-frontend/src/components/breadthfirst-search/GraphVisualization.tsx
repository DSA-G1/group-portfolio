import React from "react";
import stations from '@/data/stations.json';

const COLORS = {
  bg: "#140b26",
  panel: "#1f123a",
  border: "#f3b4ff",
  text: "#e9d8ff",
  lrt1: "#c9ff1a",
  lrt2: "#9ad0ff",
  mrt3: "#ff5aa5",
  walk: "#ffffff"
};

// Approximate pixel positions from the map
const POS: Record<string, [number, number]> = {
  // LRT-1
  Baclaran: [80, 720],
  EDSA: [80, 685],
  Libertad: [80, 650],
  "Gil Puyat": [80, 615],
  "Vito Cruz": [80, 580],
  Quirino: [80, 545],
  "Pedro Gil": [80, 510],
  "United Nations": [80, 475],
  Central: [80, 440],
  Carriedo: [80, 405],
  "Doroteo Jose": [80, 370],
  Bambang: [80, 335],
  Tayuman: [80, 300],
  Blumentritt: [80, 265],
  "Abad Santos": [80, 230],
  "R. Papa": [80, 195],
  "5th Avenue": [80, 160],
  Monumento: [80, 70],
  Balintawak: [140, 70],
  Roosevelt: [240, 70],

  // LRT-2
  Recto: [120, 385],
  Legarda: [180, 385],
  Pureza: [240, 385],
  "V. Mapa": [300, 375],
  "J. Ruiz": [360, 335],
  Gilmore: [400, 295],
  "Betty Go-Belmonte": [460, 245],
  "Araneta Center-Cubao LRT": [495, 218],
  Anonas: [520, 180],
  Katipunan: [565, 180],
  Santolan: [610, 180],
  "Marikina": [655, 180],
  Antipolo: [700, 180],

  // MRT-3
  "North Avenue": [380, 90],
  "Quezon Avenue": [440, 125],
  Kamuning: [500, 185],
  "Araneta Center-Cubao MRT": [530, 240],
  "Santolan-Annapolis": [555, 300],
  Ortigas: [570, 375],
  "Shaw Boulevard": [570, 410],
  Boni: [550, 480],
  Guadalupe: [510, 550],
  Buendia: [420, 625],
  Ayala: [330, 675],
  Magallanes: [240, 685],
  Taft: [150, 685]
};

// Build lines from stations.json
const stationMap: Record<string, string[]> = {};
stations.forEach(station => {
  const parts = station.title.split(' - ');
  const name = parts[0].replace(' Station', '');
  const line = parts[1];
  if (!stationMap[line]) stationMap[line] = [];
  stationMap[line].push(name);
});

const LRT1 = stationMap['LRT 1'] || [];
const LRT2 = stationMap['LRT 2'] || [];
const MRT3 = stationMap['MRT 3'] || [];

// Walk transfers (only one declaration)
const WALK: [string, string][] = [
  ["Doroteo Jose", "Recto"],
  ["EDSA", "Taft"],
  ["North Avenue", "Roosevelt"],
  ["Araneta Center-Cubao LRT", "Araneta Center-Cubao MRT"]
];

// Build GRAPH
const GRAPH: Record<string, string[]> = {};
function connect(line: string[]) {
  line.forEach((s, i) => {
    GRAPH[s] ??= [];
    if (line[i - 1]) GRAPH[s].push(line[i - 1]);
    if (line[i + 1]) GRAPH[s].push(line[i + 1]);
  });
}

connect(LRT1);
connect(LRT2);
connect(MRT3);
WALK.forEach(([a, b]) => {
  GRAPH[a] ??= [];
  GRAPH[b] ??= [];
  GRAPH[a].push(b);
  GRAPH[b].push(a);
});

// BFS route finder
function findRoute(start: string, end: string): string[] {
  const q = [[start]];
  const seen = new Set<string>();
  while (q.length) {
    const path = q.shift()!;
    const last = path[path.length - 1];
    if (last === end) return path;
    if (seen.has(last)) continue;
    seen.add(last);
    GRAPH[last]?.forEach(n => q.push([...path, n]));
  }
  return [];
}

interface GraphVisualizationProps {
  start: string;
  end: string;
  currentNode?: string;
}

export default function GraphVisualization({ start, end, currentNode }: GraphVisualizationProps) {
  const route = findRoute(start, end);
  const poly = (arr: string[]) => arr.filter(s => POS[s]).map(s => POS[s].join(",")).join(" ");

  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
        <h3 className="text-[#f181b6] font-header text-4xl mb-4">MRT and LRT Stations Map</h3>
        <div
        style={{
            minHeight: "100vh",
            color: COLORS.text,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}
        >
        <div>
            {/* MAP */}
            <div className="relative">
              <svg width="760" height="780" strokeLinecap="round">
                 <polyline points={poly(LRT1)} stroke={COLORS.lrt1} strokeWidth="2" fill="none" />
                 <polyline points={poly(LRT2)} stroke={COLORS.lrt2} strokeWidth="2" fill="none" />
                 <polyline points={poly(MRT3)} stroke={COLORS.mrt3} strokeWidth="2" fill="none" />

                {/* Highlight the route if it exists */}
                {route.length > 1 && (
                <polyline points={poly(route)} stroke="#ffcaef" strokeWidth="3" fill="none" />
                )}

                {/* Walk transfers (exclude Roosevelt↔North Avenue - render it with a horizontal+diagonal connector below) */}
                {WALK.filter(([a, b]) => POS[a] && POS[b] && !((a === "North Avenue" && b === "Roosevelt") || (a === "Roosevelt" && b === "North Avenue"))).map(([a, b]) => (
                <line
                    key={a + b}
                    x1={POS[a][0]} y1={POS[a][1]}
                    x2={POS[b][0]} y2={POS[b][1]}
                    stroke={COLORS.walk}
                    strokeDasharray="5 5"
                    strokeWidth="2"
                />
                ))}

                {POS["Roosevelt"] && POS["North Avenue"] && (() => {
                  const r = POS["Roosevelt"];
                  const n = POS["North Avenue"];
                  const midX = r[0] + Math.round((n[0] - r[0]) / 2);
                  return (
                    <polyline
                      points={`${r[0]},${r[1]} ${midX},${r[1]} ${n[0]},${n[1]}`}
                      stroke={COLORS.walk}        
                      strokeDasharray="5 5"      
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })()}

                {Object.entries(POS).map(([name, [x, y]]) => {
                const isTransfer = WALK.flat().includes(name) || name === "Araneta Center-Cubao";
                const isInRoute = route.includes(name);

                const isLRT1 = LRT1.includes(name);
                let textX = isLRT1 ? x - 12 : x + 8;
                let textY = y + 4;
                let textAnchor: "start" | "end" | "middle" = isLRT1 ? "end" : "start";

                const aboveStations = new Set([
                  "Balintawak",
                  "Roosevelt",
                  "Anonas",
                  "Katipunan",
                  "Santolan",
                  "Marikina",
                  "Antipolo"
                ]);
                if (aboveStations.has(name)) {
                  textX = x;
                  textY = y - 12;
                  textAnchor = "middle";
                }

                const belowStations = new Set([
                  "Legarda",
                  "Pureza",
                  "Recto",
                  "Taft",
                  "Magallanes"
                ]);
                if (belowStations.has(name)) {
                  textX = x;
                  textY = y + 18;
                  textAnchor = "middle";
                }
                
                const leftBelowStations = new Set([
                  "North Avenue",
                  "Quezon Avenue",
                  "Kamuning"
                ]);
                if (leftBelowStations.has(name)) {
                  textX = x - 12;
                  textY = y + 12;
                  textAnchor = "end";
                }

                const leftStations = new Set([
                  "Betty Go-Belmonte"
                ]);
                if (leftStations.has(name)) {
                  textX = x - 12;
                  textAnchor = "end";
                }
                
                return (
                    <g key={name}>
                    {isTransfer && (
                        <circle cx={x} cy={y} r={7} fill="none" stroke="#fff" strokeWidth="2" />
                    )}
                    <circle cx={x} cy={y} r={isInRoute ? 6 : 4} fill={isInRoute ? "#ffcaef" : "#fff"} />
                    <text x={textX} y={textY} fontSize="10" fill={COLORS.text} textAnchor={textAnchor}>
                        {name}
                    </text>
                    </g>
                );
                })}
              </svg>

              {/* Legend */}
              <div
                style={{
                  position: "absolute",
                  right: 4,
                  bottom: 16,
                  background: "rgba(31,17,49,0.85)",
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: "8px 12px",
                  color: COLORS.text,
                  minWidth: 160,
                  boxShadow: "0 10px 24px rgba(255, 51, 153, 0.5)"
                }}
                aria-hidden={false}
              >
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: COLORS.text }}>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 40, height: 4, background: COLORS.lrt1, display: "inline-block", borderRadius: 2 }} />
                    <span style={{ fontSize: 12 }}>LRT-1</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 40, height: 4, background: COLORS.lrt2, display: "inline-block", borderRadius: 2 }} />
                    <span style={{ fontSize: 12 }}>LRT-2</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 40, height: 4, background: COLORS.mrt3, display: "inline-block", borderRadius: 2 }} />
                    <span style={{ fontSize: 12 }}>MRT-3</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="36" height="12" viewBox="0 0 36 12" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <line x1="0" y1="6" x2="36" y2="6" stroke={COLORS.walk} strokeDasharray="5 5" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: 12 }}>Walk transfer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
         </div>
       </div>
   );
 }