import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

import ControlPanel from "@/components/binary-search-tree/ControlPanel";
import TreeVisualization from "@/components/binary-search-tree/TreeVisualization";
import QuickGuide from "@/components/binary-search-tree/QuickGuide";

type TreeNode = {
  id: number;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export default function BinarySearchTree() {
  const { toast } = useToast();

  const [root, setRoot] = useState<TreeNode | null>(null);
  const [rootValue, setRootValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [heightValue, setHeightValue] = useState("");
  const [foundNodeId, setFoundNodeId] = useState<number | null>(null);
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});

  useEffect(() => {
    fetchTree();
  }, []);

  useEffect(() => {
    const newPositions = computeLayout(root, 80, 820, 0, {});
    setPositions(newPositions);
  }, [root]);

  // ===================== API CALLS =====================
  async function fetchTree() {
    try {
      const res = await api.get("/binary-search-tree");
      setRoot(res.data.tree_data ? { ...res.data.tree_data } : null);
      // BST page does not use postorder endpoint
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Binary Search Tree.",
        variant: "destructive",
      });
    }
  }

  async function handleCreateRoot() {
    const v = Number(rootValue);
    if (isNaN(v)) {
      toast({ title: "Invalid Input", description: "Enter a valid number.", variant: "destructive" });
      return;
    }

    try {
      await api.post("/binary-search-tree/create-root", { value: v });
      setRootValue("");
      setFoundNodeId(null);
      await fetchTree();

      toast({ title: "Success", description: "Root created." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create root.",
        variant: "destructive",
      });
    }
  }

  async function handleSearchNode() {
    const v = Number(searchValue);
    if (isNaN(v)) {
      toast({ title: "Invalid Input", description: "Enter a valid number.", variant: "destructive" });
      return;
    }

    try {
      const res = await api.post("/binary-search-tree/search", { value: v });
      setFoundNodeId(res.data.node_id);

      toast({ title: "Node Found", description: `Node ${v} located.` });
    } catch {
      setFoundNodeId(null);
      toast({ title: "Not Found", description: "Node not found.", variant: "destructive" });
    }
  }

  async function handleInsertNode(value: number) {
    try {
      await api.post("/binary-search-tree/insert", { value });

      setSearchValue("");
      setFoundNodeId(null);

      await fetchTree();

      toast({ title: "Inserted", description: `Inserted ${value} into BST.` });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Insert failed.",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteNode(value: number) {
    try {
      await api.post("/binary-search-tree/delete", { value });
      setFoundNodeId(null);

      await fetchTree();

      toast({ title: "Deleted", description: `Node with value ${value} removed.` });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.error || "Failed to delete node.", 
        variant: "destructive" 
      });
    }
  }

  async function handleClearTree() {
    await api.post("/binary-search-tree/clear");
    setFoundNodeId(null);
    await fetchTree();
    toast({ title: "Cleared", description: "Tree reset." });
  }

  async function handleGetMax() {
    try {
      const res = await api.get("/binary-search-tree/max");
      const nodeId = res.data.node_id;
      setFoundNodeId(nodeId);
      toast({ title: "Max Value", description: `Max value is ${res.data.max_value}` });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.error || "Failed to get max.", variant: "destructive" });
    }
  }

  async function handleGetHeight() {
    try {
      const v = Number(heightValue);
      if (isNaN(v)) {
        toast({ title: "Invalid Input", description: "Enter a valid number.", variant: "destructive" });
        return;
      }

      // Search by value and get height in one call
      const res = await api.post("/binary-search-tree/height-by-value", { value: v });
      
      // Highlight the found node
      setFoundNodeId(res.data.node_id);
      
      // Show height result
      toast({ title: "Node Height", description: `Height of node ${v}: ${res.data.height}` });
    } catch (error: any) {
      toast({ 
        title: "Node Not Found", 
        description: error.response?.data?.error || "Failed to get height.", 
        variant: "destructive" 
      });
    } finally {
      setHeightValue("");
    }
  }

  // ===================== BST LAYOUT =====================
  function computeLayout(
    n: TreeNode | null,
    xMin: number,
    xMax: number,
    depth = 0,
    acc: Record<number, { x: number; y: number }> = {}
  ) {
    if (!n) return acc;

    const x = (xMin + xMax) / 2;
    const y = 100 + depth * 120;
    acc[n.id] = { x, y };

    if (n.left) computeLayout(n.left, xMin, x - 30, depth + 1, acc);
    if (n.right) computeLayout(n.right, x + 30, xMax, depth + 1, acc);

    return acc;
  }

  function renderLines(n: TreeNode | null): JSX.Element[] {
    if (!n) return [];
    const pos = positions[n.id];
    if (!pos) return [];
    const lines: JSX.Element[] = [];

    if (n.left) {
      const p2 = positions[n.left.id];
      if (p2)
        lines.push(
          <line
            key={`${n.id}-${n.left.id}`}
            x1={pos.x}
            y1={pos.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#ffffff"
            strokeWidth={4}
          />
        );
      lines.push(...renderLines(n.left));
    }

    if (n.right) {
      const p2 = positions[n.right.id];
      if (p2)
        lines.push(
          <line
            key={`${n.id}-${n.right.id}`}
            x1={pos.x}
            y1={pos.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#ffffff"
            strokeWidth={4}
          />
        );
      lines.push(...renderLines(n.right));
    }

    return lines;
  }

  function renderNodes(n: TreeNode | null): JSX.Element | null {
    if (!n) return null;
    const pos = positions[n.id];
    if (!pos) return null;

    const isFound = foundNodeId === n.id;
    const fill = isFound ? "#cdd58b" : "#51aee2";

    return (
      <React.Fragment key={n.id}>
        <g filter={isFound ? "url(#glow)" : undefined}>
          <circle cx={pos.x} cy={pos.y} r={40} fill={fill} stroke="#fff" strokeWidth={5} />
          <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill="#fff" fontSize={24} fontWeight="bold">
            {n.value}
          </text>
        </g>

        {renderNodes(n.left)}
        {renderNodes(n.right)}
      </React.Fragment>
    );
  }

  const svgHeight = Math.max(600, Math.max(...Object.values(positions).map((p) => p.y), 0) + 140);

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
          <span className="text-white">BINARY SEARCH TREE </span>
          <span className="text-[#f181b6]">VISUALIZER</span>
        </h1>

        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left – Control Panel */}
            <div className="space-y-6">
              <div className="block lg:hidden">
                <QuickGuide />
              </div>

              <ControlPanel
                root={root}
                rootValue={rootValue}
                setRootValue={setRootValue}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                newNodeValue={heightValue}
                setNewNodeValue={setHeightValue}
                onCreateRoot={handleCreateRoot}
                onSearchNode={handleSearchNode}
                onInsertNode={handleInsertNode}
                onDeleteNode={handleDeleteNode}
                onClearTree={handleClearTree}
                onGetMax={handleGetMax}
                onGetHeight={handleGetHeight}
              />
            </div>

            {/* Right – Visualization */}
            <div className="lg:col-span-2 space-y-6">
              <div className="hidden lg:block">
                <QuickGuide />
              </div>

              <TreeVisualization root={root} svgHeight={svgHeight} renderLines={renderLines} renderNodes={renderNodes} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}