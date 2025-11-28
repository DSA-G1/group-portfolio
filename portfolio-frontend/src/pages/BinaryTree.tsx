import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type TreeNode = {
  id: number;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

let nextId = 1;
const makeNode = (value: number): TreeNode => ({ id: nextId++, value, left: null, right: null });

export default function BinaryTree() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [rootValue, setRootValue] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [newNodeValue, setNewNodeValue] = useState("");
  const [direction, setDirection] = useState<"left" | "right" | "">("");
  const [foundNodeId, setFoundNodeId] = useState<number | null>(null);
  const [postOrderSeq, setPostOrderSeq] = useState<number[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});

  function findNodeAndParent(value: number, node: TreeNode | null, parent: TreeNode | null = null): { node: TreeNode | null; parent: TreeNode | null } {
    if (!node) return { node: null, parent: null };
    if (node.value === value) return { node, parent };
    const leftSearch = findNodeAndParent(value, node.left, node);
    if (leftSearch.node) return leftSearch;
    return findNodeAndParent(value, node.right, node);
  }

  function handleCreateRoot() {
    const v = Number(rootValue);
    if (Number.isNaN(v)) return;
    setRoot(makeNode(v));
    setRootValue("");
    setFoundNodeId(null);
  }

  function handleInsertNode() {
    if (!root || !foundNodeId) return;
    const v = Number(newNodeValue);
    if (Number.isNaN(v)) return;
    
    const clone = (n: TreeNode | null): TreeNode | null => {
      if (!n) return null;
      return { id: n.id, value: n.value, left: clone(n.left), right: clone(n.right) };
    };
    const newRoot = clone(root)!;
    
    function findById(id: number, node: TreeNode | null): TreeNode | null {
      if (!node) return null;
      if (node.id === id) return node;
      return findById(id, node.left) || findById(id, node.right);
    }
    
    const target = findById(foundNodeId, newRoot);
    if (!target) return;
    
    if (direction === "left") {
      if (target.left) { alert("Left child already occupied"); return; }
      target.left = makeNode(v);
    } else if (direction === "right") {
      if (target.right) { alert("Right child already occupied"); return; }
      target.right = makeNode(v);
    } else {
      alert("Choose a direction"); return;
    }
    
    setRoot(newRoot);
    setNewNodeValue("");
    setTimeout(() => updatePostOrder(newRoot), 50);
  }

  function handleSearchParent() {
    if (!root) return;
    const v = Number(parentSearch);
    if (Number.isNaN(v)) return;
    const res = findNodeAndParent(v, root);
    if (res.node) {
      setFoundNodeId(res.node.id);
    } else {
      setFoundNodeId(null);
      alert("Node not found");
    }
  }

  function handleDeleteNode() {
    if (!root || foundNodeId == null) return;
    
    if (root.id === foundNodeId) {
      setRoot(null);
      setFoundNodeId(null);
      setPostOrderSeq([]);
      return;
    }
    
    const clone = (n: TreeNode | null): TreeNode | null => {
      if (!n) return null;
      return { id: n.id, value: n.value, left: clone(n.left), right: clone(n.right) };
    };
    const newRoot = clone(root)!;
    
    function removeById(id: number, node: TreeNode | null): boolean {
      if (!node) return false;
      if (node.left && node.left.id === id) { node.left = null; return true; }
      if (node.right && node.right.id === id) { node.right = null; return true; }
      return removeById(id, node.left) || removeById(id, node.right);
    }
    
    removeById(foundNodeId, newRoot);
    setRoot(newRoot);
    setFoundNodeId(null);
    setTimeout(() => updatePostOrder(newRoot), 50);
  }

  function handleClearTree() {
    setRoot(null);
    setFoundNodeId(null);
    setPostOrderSeq([]);
  }

  function computePostOrder(n: TreeNode | null, out: number[]) {
    if (!n) return;
    computePostOrder(n.left, out);
    computePostOrder(n.right, out);
    out.push(n.value);
  }

  function updatePostOrder(currRoot: TreeNode | null = root) {
    const out: number[] = [];
    computePostOrder(currRoot, out);
    setPostOrderSeq(out);
  }

  function computeLayout(n: TreeNode | null, xMin: number, xMax: number, depth = 0, acc: Record<number, { x: number; y: number }> = {}) {
    if (!n) return acc;
    const x = (xMin + xMax) / 2;
    const y = 100 + depth * 120;
    acc[n.id] = { x, y };
    if (n.left) computeLayout(n.left, xMin, x - 30, depth + 1, acc);
    if (n.right) computeLayout(n.right, x + 30, xMax, depth + 1, acc);
    return acc;
  }

  useEffect(() => {
    setPositions(computeLayout(root, 80, 820, 0, {}));
    updatePostOrder(root);
  }, [root]);

  function renderLines(n: TreeNode | null): JSX.Element[] {
    if (!n) return [];
    const pos = positions[n.id];
    if (!pos) return [];
    const items: JSX.Element[] = [];
    
    if (n.left) {
      const p2 = positions[n.left.id];
      if (p2) {
        const midX = (pos.x + p2.x) / 2;
        const midY = (pos.y + p2.y) / 2;
        const controlX = midX - 30;
        const path = `M ${pos.x} ${pos.y} Q ${controlX} ${midY} ${p2.x} ${p2.y}`;
        items.push(
          <path key={`${n.id}-${n.left.id}`} d={path} stroke="#ffffff" strokeWidth={4} fill="none" />
        );
      }
      items.push(...renderLines(n.left));
    }
    if (n.right) {
      const p2 = positions[n.right.id];
      if (p2) {
        const midX = (pos.x + p2.x) / 2;
        const midY = (pos.y + p2.y) / 2;
        const controlX = midX + 30;
        const path = `M ${pos.x} ${pos.y} Q ${controlX} ${midY} ${p2.x} ${p2.y}`;
        items.push(
          <path key={`${n.id}-${n.right.id}`} d={path} stroke="#ffffff" strokeWidth={4} fill="none" />
        );
      }
      items.push(...renderLines(n.right));
    }
    return items;
  }

  function renderNodes(n: TreeNode | null): JSX.Element | null {
    if (!n) return null;
    const pos = positions[n.id];
    if (!pos) return null;
    const isFound = foundNodeId === n.id;
    const circleFill = isFound ? "#cdd58b" : "#51aee2";
    
    return (
      <React.Fragment key={n.id}>
        <g filter={isFound ? "url(#glow)" : undefined}>
          <circle cx={pos.x} cy={pos.y} r={40} fill={circleFill} stroke="#ffffff" strokeWidth={5} />
          <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill="#fff" fontSize={24} fontWeight="bold" className="font-body">
            {n.value}
          </text>
        </g>
        {n.left && renderNodes(n.left)}
        {n.right && renderNodes(n.right)}
      </React.Fragment>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/background/home-page.png')` }}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 12px; width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffcaef; border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #493463ff; border-radius: 999px; }
      `}</style>
      
      <Header />

      <main className="pt-24 pb-12 px-6">
        <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-12">
          <span className="text-white">BINARY TREE </span>
          <span className="text-[#f181b6]">VISUALIZER</span>
        </h1>

        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6 lg:order-1">
              {/* 1. Control Panel */}
              <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
                <h3 className="text-[#f181b6] font-header text-4xl mb-2">Control Panel</h3>
                <p className="text-[#ffcaef] font-body text-m">Manage your binary tree</p>
              </div>

              {/* 3. Add Root Node */}
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
                  onClick={handleCreateRoot}
                >
                  + Create Root
                </button>
              </div>

              {/* 4. Insert Node */}
              <div className={`bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef] ${!root ? 'opacity-40 pointer-events-none' : ''}`}>
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
                    onClick={handleSearchParent}
                  >
                    🔎︎
                  </button>
                </div>
                <small className="text-[#ffcaef] font-body text-xs block mb-8"> Enter a value to verify it exists.</small>

                <label className="text-white font-body text-xl block mb-2">New Node Value</label>
                <input 
                  className="w-full bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body text-xl placeholder:text-gray-400 mb-4"
                  placeholder="New Value" 
                  value={newNodeValue} 
                  onChange={(e) => setNewNodeValue(e.target.value)} 
                />

                <label className="text-white font-body text-xl block mb-2">Direction</label>
                <select 
                  className="w-full bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body mb-4"
                  value={direction} 
                  onChange={(e) => setDirection(e.target.value as any)}
                >
                  <option value="">Select direction</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>

                <div className="flex gap-2">
                  <button 
                    className="flex-1 bg-[#f181b6] text-primary-foreground border-[4px] border-white px-4 py-3 rounded-[44px] font-body font-semibold hover:bg-accent hover:text-accent-foreground"
                    onClick={handleInsertNode}
                  >
                    + Insert Node
                  </button>
                  <button 
                    className="flex-1 bg-[#de4545] text-white border-[4px] border-white px-4 py-3 rounded-[44px] font-body font-semibold hover:opacity-90 transition-opacity"
                    onClick={handleDeleteNode}
                  >
                    🗙 Delete Node
                  </button>
                </div>
              </div>

              {/* 6. Operations */}
              <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
                <h4 className="text-white font-header text-2xl mb-4">3. Operations</h4>
                <button 
                  className="w-full bg-[#f181b6] text-primary-foreground border-[4px] border-white px-6 py-3 rounded-[44px] font-body font-semibold hover:bg-accent hover:text-accent-foreground"
                  onClick={handleClearTree}
                >
                  ↻ Clear Tree
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6 lg:order-2">
              {/* 2. Quick Guide */}
              <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
                <h3 className="text-[#f181b6] font-header text-4xl mb-4">Quick Guide</h3>
                <div className="text-white font-body text-xl space-y-3 leading-relaxed">
                  <p><strong>1. Create Root</strong> - Enter a number and click "Create Root" to start your tree.</p>
                  <p><strong>2. Add Nodes</strong> - Enter a parent node value and click search ( 🔎︎ ) to find it. Once highlighted, enter the new value, choose Left or Right direction, then click "Insert Node".</p>
                  <p><strong>3. Delete Nodes</strong> - Search for the node you want to remove. When it's highlighted in blue, click "Delete Node".</p>
                  <p><strong>4. Post-Order Traversal</strong> - The sequence below the tree updates automatically, showing the Left → Right → Root traversal order.</p>
                </div>
              </div>

              {/* 5. Binary Tree Visualization */}
              <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
                <h3 className="text-white font-header text-4xl mb-4">Binary Tree Visualization</h3>
                <div className="w-full overflow-auto custom-scrollbar rounded-[20px]">
                  <svg ref={svgRef} width={900} height={600} viewBox="0 0 900 600" className="min-w-[900px]">
                    <defs>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <rect x={0} y={0} width={900} height={600} rx={20} fill="#a93579" />
                    {root && renderLines(root)}
                    {root && renderNodes(root)}
                    {!root && (
                      <text x={450} y={300} textAnchor="middle" fill="#fff" fontSize={24} fontWeight="bold" className="font-body">
                        <tspan x={450} dy={0}>No Tree Yet</tspan>
                        <tspan x={450} dy={35}>Create a root node to get started</tspan>
                      </text>
                    )}
                  </svg>
                </div>
              </div>

              {/* 7. Post Order Sequence */}
              <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
                <h3 className="text-white font-header text-2xl mb-2">Post Order Sequence</h3>
                <p className="text-[#ffcaef] font-body text-sm mb-4">Left → Right → Root</p>
                <div className="flex gap-3 overflow-auto custom-scrollbar py-2">
                  {postOrderSeq.length === 0 && (
                    <div className="text-white font-body text-center w-full py-8">
                      <div className="text-lg">No Sequence Yet</div>
                      <div className="text-sm mt-2">Create a root node to get started</div>
                    </div>
                  )}
                  {postOrderSeq.map((v, i) => (
                    <div 
                      key={i} 
                      className="min-w-[90px] h-[90px] rounded-full flex items-center justify-center font-body text-white text-2xl font-bold shadow-xl flex-shrink-0 border-[4px] border-white"
                      style={{ background: 'linear-gradient(135deg, #5170ff 0%, #ff66c4 100%)' }}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}