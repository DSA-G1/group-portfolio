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
  Anonas: [550, 180],
  Katipunan: [580, 180],
  Santolan: [610, 180],
  "Marikina-Pasig": [640, 180],
  Antipolo: [680, 180],

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
            <svg width="760" height="780" strokeLinecap="round">
                <polyline points={poly(LRT1)} stroke={COLORS.lrt1} strokeWidth="6" fill="none" />
                <polyline points={poly(LRT2)} stroke={COLORS.lrt2} strokeWidth="6" fill="none" />
                <polyline points={poly(MRT3)} stroke={COLORS.mrt3} strokeWidth="6" fill="none" />

                {/* Highlight the route if it exists */}
                {route.length > 1 && (
                <polyline points={poly(route)} stroke="#ffcaef" strokeWidth="8" fill="none" />
                )}

                {WALK.filter(([a, b]) => POS[a] && POS[b]).map(([a, b]) => (
                <line
                    key={a + b}
                    x1={POS[a][0]} y1={POS[a][1]}
                    x2={POS[b][0]} y2={POS[b][1]}
                    stroke={COLORS.walk}
                    strokeDasharray="5 5"
                    strokeWidth="2"
                />
                ))}

                {Object.entries(POS).map(([name, [x, y]]) => {
                const isTransfer = WALK.flat().includes(name) || name === "Araneta Center-Cubao";
                const isInRoute = route.includes(name);
                return (
                    <g key={name}>
                    {isTransfer && (
                        <circle cx={x} cy={y} r={7} fill="none" stroke="#fff" strokeWidth="2" />
                    )}
                    <circle cx={x} cy={y} r={isInRoute ? 6 : 4} fill={isInRoute ? "#ffcaef" : "#fff"} />
                    <text x={x + 8} y={y + 4} fontSize="10" fill={COLORS.text}>
                        {name}
                    </text>
                    </g>
                );
                })}
            </svg>
            </div>
        </div>
      </div>
  );
}