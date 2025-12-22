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
  const [activeOperation, setActiveOperation] = React.useState<string | null>(null);

  const handleInsert = () => {
    const val = Number(searchValue);
    if (isNaN(val)) return alert("Please enter a valid number.");
    onInsertNode(val);
    setSearchValue("");
    setActiveOperation(null);
  };

  const handleDelete = () => {
    const val = Number(searchValue);
    if (isNaN(val)) return alert("Enter a number to delete.");
    onDeleteNode(val);
    setSearchValue("");
    setActiveOperation(null);
  };

  const handleSearch = () => {
    const val = Number(searchValue);
    if (isNaN(val)) return alert("Enter a number to search.");
    onSearchNode();
    setSearchValue("");
    setActiveOperation(null);
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
          + Add Root
        </button>
      </div>

      {/* Node Operations */}
      <div className={`bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] mt-6 transition-all duration-300 ${
        !root ? "opacity-20 pointer-events-none" : "opacity-100"
      }`}>
        <h4 className="text-white font-header text-2xl mb-4">2. Node Operations</h4>
        
        {/* Input field with inline search button */}
        <div className="mb-4">
          <label className="text-[#ffcaef] font-body text-sm mb-2 block">Enter Node Value</label>
          <div className="flex gap-2 items-center mb-4">
            <input
              className="flex-1 p-3 rounded-[17px] font-body border-[4px] border-[#ffcaef] bg-[#1f1131] text-white"
              placeholder="Enter value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && searchValue) {
                  handleSearch();
                }
              }}
            />
            <button
              className={`p-3 rounded-[17px] border-[4px] border-white transition-all ${
                !searchValue 
                  ? "bg-[#f181b6] text-white opacity-30 cursor-not-allowed" 
                  : "bg-[#f181b6] text-white hover:opacity-90"
              }`}
              onClick={() => {
                if (searchValue) {
                  handleSearch();
                }
              }}
              disabled={!searchValue}
              title="Search Node"
            >
              🔎︎
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            className={`w-full border-[4px] border-white px-4 py-3 rounded-[44px] font-body font-semibold transition-all ${
              !searchValue 
                ? "bg-[#f181b6] text-white opacity-30 cursor-not-allowed" 
                : "bg-[#f181b6] text-white hover:opacity-90"
            }`}
            onClick={() => {
              if (searchValue) {
                handleInsert();
              }
            }}
            disabled={!searchValue}
          >
            Insert Node
          </button>
          <button
            className={`w-full border-[4px] border-white px-4 py-3 rounded-[44px] font-body font-semibold transition-all ${
              !searchValue 
                ? "bg-[#f181b6] text-white opacity-30 cursor-not-allowed" 
                : "bg-[#f181b6] text-white hover:opacity-90"
            }`}
            onClick={() => {
              if (searchValue) {
                handleDelete();
              }
            }}
            disabled={!searchValue}
          >
            Delete Node
          </button>
        </div>
      </div>

      {/* Tree Operations */}
      <div className={`bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] mt-6 transition-all duration-300 ${
        !root ? "opacity-20 pointer-events-none" : "opacity-100"
      }`}>
        <h4 className="text-white font-header text-2xl mb-4">3. Tree Operations</h4>
        
        {/* Get Max Value */}
        <div className="mb-4">
          <p className="text-[#ffcaef] font-body text-sm mb-2">• Get Maximum Value</p>
          <button
            className="w-full bg-[#f181b6] text-white border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
            onClick={onGetMax}
          >
            Get Max
          </button>
        </div>

        {/* Get Height of a Node */}
        <div className="mb-4">
          <p className="text-[#ffcaef] font-body text-sm mb-2">• Height of a Node</p>
          
          <div className="flex gap-2 items-center">
            <input
              className="flex-1 p-3 rounded-[17px] font-body border-[4px] border-[#ffcaef] bg-[#1f1131] text-white"
              placeholder="Enter node value"
              value={newNodeValue}
              onChange={(e) => setNewNodeValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newNodeValue) {
                  onGetHeight();
                }
              }}
            />
            <button
              className={`px-6 py-3 rounded-[17px] border-[4px] border-white font-body font-semibold transition-all whitespace-nowrap ${
                !newNodeValue 
                  ? "bg-[#f181b6] text-white opacity-30 cursor-not-allowed" 
                  : "bg-[#f181b6] text-white hover:opacity-90"
              }`}
              onClick={() => {
                if (newNodeValue) {
                  onGetHeight();
                }
              }}
              disabled={!newNodeValue}
            >
              Get Height
            </button>
          </div>
        </div>

        {/* Clear Tree */}
        <div>
          <p className="text-[#ffcaef] font-body text-sm mb-2">• Clear Tree</p>
          <button
            className="w-full bg-[#f181b6] text-white border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:opacity-90"
            onClick={onClearTree}
          >
            Clear Entire Tree
          </button>
        </div>
      </div>
    </>
  );
}