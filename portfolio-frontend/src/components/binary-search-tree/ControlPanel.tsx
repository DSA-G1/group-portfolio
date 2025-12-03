import React from "react";

interface ControlPanelProps {
  root: any;
  rootValue: string;
  setRootValue: (v: string) => void;

  newNodeValue: string;
  setNewNodeValue: (v: string) => void;

  searchValue: string;
  setSearchValue: (v: string) => void;

  onCreateRoot: () => void;
  onInsertNode: (value: number) => void;
  onDeleteNode: (value: number) => void;
  onSearchNode: () => void;
  onGetHeight: () => void; // height of the entire tree
  onGetMax: () => void; // max value of the tree
  onClearTree: () => void;
}

export default function ControlPanel({
  root,
  rootValue,
  setRootValue,
  newNodeValue,
  setNewNodeValue,
  searchValue,
  setSearchValue,
  onCreateRoot,
  onInsertNode,
  onDeleteNode,
  onSearchNode,
  onGetHeight,
  onGetMax,
  onClearTree,
}: ControlPanelProps) {
  const handleInsert = () => {
    const val = Number(newNodeValue);
    if (isNaN(val)) return alert("Please enter a valid number.");
    onInsertNode(val);
  };

  const handleDelete = () => {
    const val = Number(newNodeValue);
    if (isNaN(val)) return alert("Enter a number to delete.");
    onDeleteNode(val);
  };

  const handleSearch = () => {
    const val = Number(searchValue);
    if (isNaN(val)) return alert("Enter a number to search.");
    onSearchNode();
  };

  return (
    <>
      {/* Header */}
      <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
        <h3 className="text-[#f181b6] font-header text-4xl mb-2">Control Panel</h3>
        <p className="text-[#ffcaef] font-body text-m">Manage your Binary Search Tree</p>
      </div>

      {/* Add Root */}
      <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] mt-6">
        <h4 className="text-white font-header text-2xl mb-4">1. Add Root Node</h4>
        <input
          className="w-full bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body mb-4"
          placeholder="Enter root value"
          value={rootValue}
          onChange={(e) => setRootValue(e.target.value)}
        />
        <button
          className="w-full bg-[#f181b6] text-black border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
          onClick={onCreateRoot}
        >
          + Create Root
        </button>
      </div>

      {/* Insert/Delete Node */}
      <div className={`bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] mt-6 ${!root ? "opacity-40 pointer-events-none" : ""}`}>
        <h4 className="text-white font-header text-2xl mb-4">2. Insert/Delete Node</h4>
        <input
          className="w-full bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body mb-4"
          placeholder="Enter value"
          value={newNodeValue}
          onChange={(e) => setNewNodeValue(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="flex-1 bg-[#f181b6] text-black border-[4px] border-white px-4 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
            onClick={handleInsert}
          >
            + Insert Node
          </button>
          <button
            className="flex-1 bg-[#de4545] text-white border-[4px] border-white px-4 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
            onClick={handleDelete}
          >
            🗙 Delete Node
          </button>
        </div>
      </div>

      {/* Search Node */}
      <div className={`bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] mt-6 ${!root ? "opacity-40 pointer-events-none" : ""}`}>
        <h4 className="text-white font-header text-2xl mb-4">3. Search Node</h4>
        <input
          className="w-full bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body mb-4"
          placeholder="Enter value to search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          className="w-full bg-[#6aa0ff] text-white border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
          onClick={handleSearch}
        >
          🔍 Search
        </button>
      </div>

      {/* Get Height */}
      <div className={`bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] mt-6 ${!root ? "opacity-40 pointer-events-none" : ""}`}>
        <h4 className="text-white font-header text-2xl mb-4">4. Get Height of Tree</h4>
        <button
          className="w-full bg-[#9b59b6] text-white border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
          onClick={onGetHeight}
        >
          📏 Get Height
        </button>
      </div>

      {/* Get Max Value */}
      <div className={`bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] mt-6 ${!root ? "opacity-40 pointer-events-none" : ""}`}>
        <h4 className="text-white font-header text-2xl mb-4">5. Get Max Value</h4>
        <button
          className="w-full bg-[#fbbf24] text-black border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
          onClick={onGetMax}
        >
          ⬆ Get Max Value
        </button>
      </div>

      {/* Clear Tree */}
      <div className={`bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] mt-6 ${!root ? "opacity-40 pointer-events-none" : ""}`}>
        <h4 className="text-white font-header text-2xl mb-4">6. Clear Tree</h4>
        <button
          className="w-full bg-[#f181b6] text-black border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
          onClick={onClearTree}
        >
          ↻ Clear Tree
        </button>
      </div>
    </>
  );
}