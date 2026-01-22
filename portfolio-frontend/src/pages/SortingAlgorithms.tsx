import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ControlPanel from "@/components/sorting-algorithms/ControlPanel";
import Visualization from "@/components/sorting-algorithms/Visualization";
import SortInfo from "@/components/sorting-algorithms/SortInfo";
import { parseCsv, AlgoKey, Frame } from "@/components/sorting-algorithms/utils";
import api from "@/services/api";

export default function SortingAlgorithmVisualizer() {
  const [inputValue, setInputValue] = useState("");
  const [arr, setArr] = useState<number[]>([]);
  const [algo, setAlgo] = useState<AlgoKey>("" as AlgoKey);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [frames, setFrames] = useState<Frame[]>([]);
  const timerRef = useRef<number | null>(null);

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
    setFrames([]);
    setIdx(0);
    setIsPlaying(false);
  }

  function restart() {
    setIdx(0);
    setIsPlaying(false);
  }

  useEffect(() => {
    if (arr.length > 0 && algo) {
      sortWithBackend(arr, algo);
    }
  }, [arr, algo]);

  async function sortWithBackend(array: number[], algorithm: AlgoKey) {
    try {
      setLoading(true);
      const algoMap: Record<AlgoKey, string> = {
        bubble: "bubble-sort",
        selection: "selection-sort",
        insertion: "insertion-sort",
        merge: "merge-sort",
        quick: "quick-sort",
      };

      console.log(`Making request to /sorting-algorithms/${algoMap[algorithm]}`);
      const response = await api.post(`/sorting-algorithms/${algoMap[algorithm]}`, {
        array,
      });
      
      console.log("Full response:", response);
      console.log("API Response data:", response.data);
      
      // Check different possible response structures
      let framesData = null;
      if (response.data?.steps && Array.isArray(response.data.steps)) {
        framesData = response.data.steps;
        console.log("Using response.data.steps");
      } else if (Array.isArray(response.data)) {
        framesData = response.data;
        console.log("Using response.data directly");
      } else {
        console.log("Response data structure:", Object.keys(response.data || {}));
      }

      if (framesData && framesData.length > 0) {
        console.log(`Setting ${framesData.length} frames`);
        setFrames(framesData);
      } else {
        console.log("No frame data found, using fallback");
        setFrames([{ array }]);
      }
    } catch (error) {
      console.error("Backend sorting failed:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      setFrames([{ array }]);
    } finally {
      setLoading(false);
    }
  }

  const frame = frames[idx] ?? { array: arr };

  return (
    <div
      className="min-h-screen bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: `url('/background/home-page.png')` }}
    >
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

              <div
                className={`transition-opacity ${
                  arr.length === 0
                    ? "opacity-40 pointer-events-none"
                    : "opacity-100"
                }`}
              >
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}