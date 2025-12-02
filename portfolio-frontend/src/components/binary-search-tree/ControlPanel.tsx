interface ControlPanelProps {
  root: any;
  rootValue: string;
  setRootValue: (v: string) => void;
  parentSearch: string;
  setParentSearch: (v: string) => void;
  newNodeValue: string;
  setNewNodeValue: (v: string) => void;
  onCreateRoot: () => void;
  onSearchParent: () => void;
  onInsertNode: (direction: "left" | "right") => void; // direction determined automatically
  onDeleteNode: () => void;
  onClearTree: () => void;
}

export default function ControlPanel({
  root,
  rootValue,
  setRootValue,
  parentSearch,
  setParentSearch,
  newNodeValue,
  setNewNodeValue,
  onCreateRoot,
  onSearchParent,
  onInsertNode,
  onDeleteNode,
  onClearTree,
}: ControlPanelProps) {

  // Automatically determine direction for insert
  const handleInsertNode = () => {
    if (!root || !parentSearch || !newNodeValue) return;

    const parentVal = Number(parentSearch);
    const newVal = Number(newNodeValue);

    if (isNaN(parentVal) || isNaN(newVal)) {
      alert("Please enter valid numeric values");
      return;
    }

    const direction: "left" | "right" = newVal < parentVal ? "left" : "right";

    onInsertNode(direction);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
        <h3 className="text-[#f181b6] font-header text-4xl mb-2">Control Panel</h3>
        <p className="text-[#ffcaef] font-body text-m">Manage your binary tree</p>
      </div>

      {/* Add Root */}
      <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
        <h4 className="text-white font-header text-2xl mb-4">1. Add Root Node</h4>
        <label className="text-[#ffcaef] font-body block mb-2">Root Value</label>
        <input
          className="w-full bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body placeholder:text-gray-400"
          placeholder="Enter root value"
          value={rootValue}
          onChange={(e) => setRootValue(e.target.value)}
        />
        <button
          className="mt-4 w-full bg-[#f181b6] text-primary-foreground border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:bg-accent hover:text-accent-foreground"
          onClick={onCreateRoot}
        >
          + Create Root
        </button>
      </div>

      {/* Insert Node */}
      <div className={`bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] ${!root ? "opacity-40 pointer-events-none" : ""}`}>
        <h4 className="text-white font-header text-2xl mb-4">2. Insert Node</h4>

        <label className="text-white font-body text-xl block mb-2">Parent Node Value</label>
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body text-xl placeholder:text-gray-400"
            placeholder="Enter parent value"
            value={parentSearch}
            onChange={(e) => setParentSearch(e.target.value)}
          />
          <button
            className="bg-[#f181b6] text-primary-foreground border-[4px] border-white px-5 rounded-[50px] font-body text-xl hover:bg-accent hover:text-accent-foreground"
            onClick={onSearchParent}
          >
            🔎︎
          </button>
        </div>
        <small className="text-[#ffcaef] font-body text-xs block mb-8">Enter a value to verify it exists.</small>

        <label className="text-white font-body text-xl block mb-2">New Node Value</label>
        <input
          className="w-full bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body text-xl placeholder:text-gray-400 mb-4"
          placeholder="New Value"
          value={newNodeValue}
          onChange={(e) => setNewNodeValue(e.target.value)}
        />

        {/* Insert Node Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 bg-[#f181b6] text-primary-foreground border-[4px] border-white px-4 py-3 rounded-[44px] font-body font-semibold hover:bg-accent hover:text-accent-foreground"
            onClick={handleInsertNode}
          >
            + Insert Node
          </button>
          <button
            className="flex-1 bg-[#de4545] text-white border-[4px] border-white px-4 py-3 rounded-[44px] font-body font-semibold hover:opacity-90 transition-opacity"
            onClick={onDeleteNode}
          >
            🗙 Delete Node
          </button>
        </div>
      </div>

      {/* Operations */}
      <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
        <h4 className="text-white font-header text-2xl mb-4">3. Operations</h4>
        <button
          className="w-full bg-[#f181b6] text-primary-foreground border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:bg-accent hover:text-accent-foreground"
          onClick={onClearTree}
        >
          ↻ Clear Tree
        </button>
      </div>
    </>
  );
}