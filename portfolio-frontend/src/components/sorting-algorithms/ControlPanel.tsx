import React from "react";
import type { AlgoKey } from "./utils";

type Props = {
  inputValue: string;
  setInputValue: (v: string) => void;
  algo: AlgoKey;
  setAlgo: (k: AlgoKey) => void;
  onAddArrayList: () => void;
  clearArray: () => void;
  hasArray: boolean;
};

export default function ControlPanel({ inputValue, setInputValue, algo, setAlgo, onAddArrayList, clearArray, hasArray }: Props) {
  return (
    <>
      {/* Header */}
      <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
        <h3 className="text-[#f181b6] font-header text-4xl mb-2">Control Panel</h3>
        <p className="text-[#ffcaef] font-body text-m">Manage your Array List</p>
      </div>

      <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] mt-6">
        <h4 className="text-white font-body text-3xl mb-4">Add Array List</h4>
        <p className="text-[#ffcaef] font-body text-sm mb-2">List of Numbers <span className="text-white font-semibold">e.g. 5, 6, 1, 4, 9</span></p>
        <input
          className="w-full bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body mb-4"
          placeholder="Enter Integer value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && inputValue) {
              onAddArrayList();
            }
          }}
        />
        <button
          className="w-full bg-[#f181b6] text-white border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
          onClick={onAddArrayList}
        >
          + Add Array List
        </button>

        <div className={`mt-6 transition-opacity ${!hasArray ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <p className="text-[#ffcaef] font-body text-sm mb-2">Select Sorting Algorithm</p>
          <select
            className="w-full bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body mb-4"
            value={algo}
            onChange={(e) => setAlgo(e.target.value as AlgoKey)}
            disabled={!hasArray}
          >
            <option value="" disabled>Select Sorting Algorithm</option>
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>

          <button
            className={`w-full border-[4px] border-[#ffcaef] px-6 py-3 rounded-[44px] font-body font-semibold transition-all ${
              !hasArray 
                ? "bg-transparent text-[#ffcaef]/40 cursor-not-allowed" 
                : "bg-transparent text-[#ffcaef] hover:bg-[#ffcaef]/10"
            }`}
            onClick={clearArray}
            disabled={!hasArray}
          >
            Clear Array List
          </button>
        </div>
      </div>
    </>
  );
}