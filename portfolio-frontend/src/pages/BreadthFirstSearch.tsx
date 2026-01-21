import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

import ControlPanel from "@/components/breadthfirst-search/ControlPanel";
import GraphVisualization from "@/components/breadthfirst-search/GraphVisualization";

const BreadthFirstSearch = () => {
    const WALK_SEGMENTS = new Set([
      "Doroteo Jose|Recto",
      "Recto|Doroteo Jose",
      "EDSA|Taft",
      "Taft|EDSA",
      "Roosevelt|North Avenue",
      "North Avenue|Roosevelt",
      "Araneta Center Cubao (LRT2)|Araneta Center Cubao (MRT)",
      "Araneta Center Cubao (MRT)|Araneta Center Cubao (LRT2)"
    ]);
    const { toast } = useToast();
    const [currentNode, setCurrentNode] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [startValue, setStartValue] = useState("");
    const [pathResult, setPathResult] = useState(null);
    // NEW: animated index for station highlight
    const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);

    // NEW: loop through stations when a path exists
    useEffect(() => {
      if (!pathResult?.path?.length) {
        setAnimatedIndex(null);
        return;
      }
      let i = 0;
      setAnimatedIndex(0);
      const ANIMATION_MS = 700; // speed per station
      const interval = setInterval(() => {
        i = (i + 1) % pathResult.path.length;
        setAnimatedIndex(i);
      }, ANIMATION_MS);
      return () => clearInterval(interval);
    }, [pathResult]);

    const handleSearch = async () => {
        if (!startValue || !searchValue) {
            toast({
                title: "Error",
                description: "Please enter both start and end stations",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await api.post('/bfs/search', {
                start: startValue,
                end: searchValue,
            });
            
            setPathResult(response.data);
            setCurrentNode(startValue);
            
            toast({
                title: "Path Found!",
                description: `Found path with ${response.data.path.length} stations`,
            });
        } catch (error: any) {
            const isNetwork = !error.response;
            toast({
                title: isNetwork ? "Backend Unreachable" : "Error",
                description: isNetwork ? "Cannot reach API. Is the backend running on :5000?" : (error.response?.data?.error || "Failed to find path"),
                variant: "destructive",
            });
            setPathResult(null);
        }
    };

    const handleReset = async () => {
        try {
            await api.post('/bfs/reset');
            setPathResult(null);
            setStartValue("");
            setSearchValue("");
            setCurrentNode(null);
            
            toast({
                title: "Reset",
                description: "Path cleared successfully",
            });
        } catch (error) {
            console.error("Reset failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/background/lab4-bg.png')` }}>
            <Header />
            <main className="pt-32 md:pt-40 pb-12 px-6">
                <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-12">
                    <span className="text-white">SHORTEST PATH </span>
                    <span className="text-[#f181b6]">VISUALIZER</span>
                </h1>

                <div className="max-w-6xl mx-auto space-y-4">
                    <ControlPanel 
                        currentNode={currentNode}
                        setCurrentNode={setCurrentNode}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        startValue={startValue}
                        setStartValue={setStartValue}
                        onSearch={handleSearch}
                        onReset={handleReset}
                    />
                    
                    <div className="bg-[#1f1131] rounded-2xl md:rounded-[40px] p-4 md:p-6 overflow-hidden border-[4px] border-[#ffcaef]">
                        <GraphVisualization 
                            start={startValue} 
                            end={searchValue} 
                            currentNode={currentNode}
                            pathResult={pathResult}
                        />
                    </div>

                    {/* LRT / MRT STATION ROUTE CARD - Always visible */}
                    <div 
                      className="bg-[#1f1131] rounded-2xl md:rounded-[40px] p-4 md:p-6 overflow-hidden border-[4px] border-[#ffcaef]"
                    >
                      {/* NEW: pulse keyframes for glow ring */}
                      <style>
                        {`
                          @keyframes routePulse {
                            0% { transform: scale(1); opacity: 0.9; }
                            60% { transform: scale(1.6); opacity: 0; }
                            100% { transform: scale(1.6); opacity: 0; }
                          }
                        `}
                      </style>

                      <h3 className="text-white font-body text-xl md:text-2xl">LRT/MRT STATION ROUTE</h3>
                      <p className="text-[#ffcaef] font-body text-sm md:text-md md:mb-6">Current Station ⟶ Destination</p>
                      {pathResult ? (
                        <div className="overflow-x-auto custom-scrollbar pb-4">
                          <svg 
                            width={Math.max(pathResult.path.length * 140 + 140, 800)} 
                            height="140" 
                            style={{ minWidth: '100%' }}
                          >
                            <defs>
                              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#cdffd8", stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: "#94b9ff", stopOpacity: 1 }} />
                              </linearGradient>
                            </defs>
                            {pathResult.path.map((station, index) => {
                              const isStart = index === 0;
                              const isEnd = index === pathResult.path.length - 1;
                              const nextStation = pathResult.path[index + 1];
                              const prevStation = pathResult.path[index - 1];
                              const isWalk = nextStation ? WALK_SEGMENTS.has(`${station}|${nextStation}`) : false;
                              const isAfterWalk = prevStation ? WALK_SEGMENTS.has(`${prevStation}|${station}`) : false;

                              // NEW: whether this station is currently highlighted
                              const isAnimated = animatedIndex === index;
                              
                              const spacing = 140;
                              const x = 70 + (index * spacing);
                              const y = 50;
                              
                              let stationFill = "none";
                              let stationRadius = 13;
                              let stationStroke = "#ffcaef";
                              let stationStrokeWidth = 7;
                              let glowFilter = "";

                              // Base fill logic: start, end, before/after walk
                              if (isStart || isEnd || isWalk || isAfterWalk) {
                                stationFill = "#ffcaef";
                                stationStrokeWidth = 3;
                              }

                              // End station glow
                              if (isEnd) {
                                glowFilter = "drop-shadow(0 0 10px rgba(255, 202, 239, 0.9)) drop-shadow(0 0 18px rgba(255, 202, 239, 0.7))";
                              }

                              // NEW: temporary highlight & glow while animated
                              if (isAnimated) {
                                stationFill = "#ffcaef";
                                stationStrokeWidth = 3;
                                glowFilter = "drop-shadow(0 0 12px rgba(255, 202, 239, 0.95)) drop-shadow(0 0 22px rgba(255, 202, 239, 0.75))";
                              }

                              // Split long station names
                              const stationName = station.toUpperCase();
                              const words = stationName.split(' ');
                              const lines: string[] = [];
                              let currentLine = '';
                              
                              words.forEach((word, i) => {
                                const testLine = currentLine ? `${currentLine} ${word}` : word;
                                if (testLine.length > 12 && currentLine) {
                                  lines.push(currentLine);
                                  currentLine = word;
                                } else {
                                  currentLine = testLine;
                                }
                                if (i === words.length - 1) {
                                  lines.push(currentLine);
                                }
                              });

                              return (
                                <g key={station}>
                                  {/* Connection line to next station */}
                                  {index < pathResult.path.length - 1 && (
                                    <line
                                      x1={x}
                                      y1={y}
                                      x2={x + spacing}
                                      y2={y}
                                      stroke={isWalk ? "#ffffff" : "#ffcaef"}
                                      strokeWidth="7"
                                      strokeDasharray={isWalk ? "10 10" : "0"}
                                      strokeLinecap="round"
                                    />
                                  )}
                                  
                                  {/* Background circle to hide the line */}
                                  <circle 
                                    cx={x} 
                                    cy={y} 
                                    r={stationRadius + 3} 
                                    fill="#1f1131"
                                  />

                                  {/* NEW: pulse ring when highlighted */}
                                  {isAnimated && (
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r={stationRadius + 6}
                                      fill="none"
                                      stroke="#ffcaef"
                                      strokeWidth="7"
                                      style={{
                                        filter: "drop-shadow(0 0 14px rgba(255, 202, 239, 0.85))",
                                        animation: "routePulse 1.4s ease-out infinite",
                                        transformBox: "fill-box",
                                        transformOrigin: "center"
                                      }}
                                    />
                                  )}
                                  
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
                                  
                                  {/* Station label */}
                                  <text
                                    x={x}
                                    y={y + 35}
                                    fontSize="12"
                                    fill="#f3e8ff"
                                    textAnchor="middle"
                                    fontWeight="600"
                                  >
                                    {lines.map((line, i) => (
                                      <tspan key={i} x={x} dy={i === 0 ? 0 : 14}>
                                        {line}
                                      </tspan>
                                    ))}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      ) : (
                        <div className="h-24"></div>
                      )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BreadthFirstSearch;
