import React from "react";
import stations from "@/data/stations.json";

const COLORS = {
  bg: "#12091f",
  text: "#f3e8ff",
  lrt1: "#c9ff1a",
  lrt2: "#7fd1ff",
  mrt3: "#ff5fa2",
  walk: "#ffffff",
  neon: "#ff5fa2"
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
  Cubao: [585, 210],         // moved slightly up
  Anonas: [620, 185],
  Katipunan: [680, 185],
  Santolan: [740, 185],
  "Marikina-Pasig": [820, 185],
  Antipolo: [905, 185],

  // MRT-3
  "North Avenue": [460, 130],
  "Quezon Avenue": [510, 160],
  Kamuning: [540, 190],
  "Araneta Center-Cubao": [585, 255],
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
  ["Cubao", "Araneta Center-Cubao"]
];

const poly = (arr: string[]) =>
  arr.map((s) => POS[s].join(",")).join(" ");

export default function GraphVisualization() {
  return (
    <div className="bg-[#12091f] rounded-[40px] p-6 border-[4px] border-[#ff5fa2] relative">
      {/* TITLE */}
      <h3 className="text-[#f181b6] font-header text-4xl mb-2 text-left">
        MRT AND LRT STATIONS MAP
      </h3>

      <div className="flex justify-center items-center">
        <svg width="1080" height="880" viewBox="0 0 960 820">
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

          {/* Stations */}
          {Object.entries(POS).map(([name, [x, y]]) => {
            const isTransfer = WALK.flat().includes(name);
            const isLRT1 = LRT1.includes(name);

            let textX = isLRT1 ? x - 12 : x + 8;
            let textY = y + 4;
            let anchor: "start" | "end" | "middle" = isLRT1 ? "end" : "start";

            if (
              ["Balintawak","Roosevelt","Anonas","Katipunan","Santolan","Marikina-Pasig","Antipolo"].includes(name)
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

            return (
              <g key={name}>
                {isTransfer && (
                  <circle cx={x} cy={y} r={9} fill="none" stroke="#fff" strokeWidth="2" />
                )}
                <circle cx={x} cy={y} r={4} fill="#fff" />
                <text
                  x={textX}
                  y={textY}
                  fontSize="11"
                  fill={COLORS.text}
                  textAnchor={anchor}
                >
                  {name.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* LEGEND */}
      <div
        className="absolute bottom-6 right-6 rounded-xl p-4 text-sm text-white space-y-2"
        style={{
          background: "#1a0f2f",
          border: `2px solid ${COLORS.neon}`,
          boxShadow: `
            0 0 8px ${COLORS.neon},
            0 0 18px rgba(255,95,162,0.7),
            inset 0 0 10px rgba(255,95,162,0.4)
          `
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-8 h-1 rounded bg-[#c9ff1a]" />
          <span>LRT-1</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-8 h-1 rounded bg-[#7fd1ff]" />
          <span>LRT-2</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-8 h-1 rounded bg-[#ff5fa2]" />
          <span>MRT-3</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-8 h-1 border-t-2 border-dashed border-white" />
          <span>WALK TRANSFER</span>
        </div>
      </div>
    </div>
  );
}
