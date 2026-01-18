import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ControlPanel from "@/components/sorting-algorithms/ControlPanel";
import Visualization from "@/components/sorting-algorithms/Visualization";
import SortInfo from "@/components/sorting-algorithms/SortInfo";
import Ranking from "@/components/sorting-algorithms/Ranking";
import { generators, parseCsv, AlgoKey } from "@/components/sorting-algorithms/utils";
import api from "@/services/api";

export default function SortingAlgorithmVisualizer() {
  const [inputValue, setInputValue] = useState("");
  const [arr, setArr] = useState<number[]>([]);
  const [algo, setAlgo] = useState<AlgoKey>("" as AlgoKey);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const frames = useMemo(() => {
    if (!algo || !generators[algo]) return [{ array: arr }];
    return generators[algo](arr);
  }, [arr, algo]);

  useEffect(() => { 
    setIdx(0); 
    setIsPlaying(false); 
  }, [frames.length]);

  useEffect(() => {
    if (!isPlaying) { 
      if (timerRef.current) { 
        window.clearInterval(timerRef.current); 
        timerRef.current = null; 
      } 
      return; 
    }
    const interval = Math.max(150, 600 / speed);
    timerRef.current = window.setInterval(() => {
      setIdx((i) => { 
        if (i + 1 >= frames.length) { 
          setIsPlaying(false); 
          return i; 
        } 
        return i + 1; 
      });
    }, interval);
    return () => { 
      if (timerRef.current) { 
        window.clearInterval(timerRef.current); 
        timerRef.current = null; 
      } 
    };
  }, [isPlaying, speed, frames.length]);

  function handleAddArrayList() {
    const parsed = parseCsv(inputValue);
    setArr(parsed);
    setInputValue("");
  }
  
  function clearArray() { 
    setArr([]); 
    setIdx(0); 
    setIsPlaying(false); 
  }
  
  function restart() { 
    setIdx(0); 
    setIsPlaying(false); 
  }

  // Optional: Send data to backend when array is set and algo is selected
  useEffect(() => {
    if (arr.length > 0 && algo) {
      sendToBackend(arr, algo);
    }
  }, [arr, algo]);

  async function sendToBackend(array: number[], algorithm: AlgoKey) {
    try {
      setLoading(true);
      const algoMap: Record<AlgoKey, string> = {
        bubble: "bubble-sort",
        selection: "selection-sort",
        insertion: "insertion-sort",
        merge: "merge-sort",
        quick: "quick-sort",
      };
      
      const response = await api.post(`/sorting-algorithms/${algoMap[algorithm]}`, {
        array: array,
      });
      
      console.log("Backend response:", response.data);
      // Data is saved on the backend for tracking
    } catch (error) {
      console.warn("Backend call failed, using local implementation", error);
      // Silently fall back to local implementation
    } finally {
      setLoading(false);
    }
  }

  const frame = frames[idx] ?? { array: arr };

  return (
    <div className="min-h-screen bg-cover bg-top bg-no-repeat" style={{ backgroundImage: `url('/background/home-page.png')` }}>
      <Header />
      <main className="pt-32 md:pt-40 pb-12 px-6">
        <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-12">
          <span className="text-white">SORTING ALGORITHM </span>
          <span className="text-[#f181b6]">VISUALIZER</span>
        </h1>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="space-y-6">
              <ControlPanel
                inputValue={inputValue}
                setInputValue={setInputValue}
                algo={algo}
                setAlgo={setAlgo}
                onAddArrayList={handleAddArrayList}
                clearArray={clearArray}
                hasArray={arr.length > 0}
              />
              <div className={`transition-opacity ${arr.length === 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <SortInfo algo={algo} />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Visualization
                frame={frame}
                framesCount={frames.length}
                idx={idx}
                setIdx={setIdx}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                speed={speed}
                setSpeed={setSpeed}
                restart={restart}
              />
              <div className={`transition-opacity ${arr.length === 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <Ranking arr={arr} algo={algo} speed={speed} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
