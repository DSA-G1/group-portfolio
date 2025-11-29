import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import ControlPanel from "@/components/binary-tree/ControlPanel";
import TreeVisualization from "@/components/binary-tree/TreeVisualization";
import QuickGuide from "@/components/binary-tree/QuickGuide";
import PostOrderDisplay from "@/components/binary-tree/PostOrderDisplay";

type TreeNode = {
  id: number;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export default function BinaryTree() {
  const { toast } = useToast();
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [rootValue, setRootValue] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [newNodeValue, setNewNodeValue] = useState("");
  const [direction, setDirection] = useState<"left" | "right" | "">("");
  const [foundNodeId, setFoundNodeId] = useState<number | null>(null);
  const [postOrderSeq, setPostOrderSeq] = useState<number[]>([]);
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});

  useEffect(() => {
    fetchTree();
  }, []);

  // CRITICAL FIX: Recompute positions whenever root changes
  useEffect(() => {
    console.log("🔄 Root changed, recomputing layout:", root);
    const newPositions = computeLayout(root, 80, 820, 0, {});
    console.log("📍 New positions:", newPositions);
    setPositions(newPositions);
  }, [root]);

  async function fetchTree() {
    try {
      const res = await api.get("/binary-tree");
      console.log("✅ Fetched tree data:", JSON.stringify(res.data.tree_data, null, 2));
      
      // Force a new object reference to trigger React re-render
      setRoot(res.data.tree_data ? { ...res.data.tree_data } : null);
      
      await fetchPostOrder();
    } catch (error: any) {
      console.error("❌ Failed to fetch tree:", error);
      toast({ title: "Error", description: "Failed to fetch tree data", variant: "destructive" });
    }
  }

  async function fetchPostOrder() {
    try {
      const res = await api.get("/binary-tree/postorder");
      setPostOrderSeq(res.data.postorder || []);
    } catch (error) {
      console.error("Failed to fetch post-order:", error);
    }
  }

  async function handleCreateRoot() {
    const v = Number(rootValue);
    if (Number.isNaN(v)) {
      toast({ title: "Invalid Input", description: "Please enter a valid number", variant: "destructive" });
      return;
    }
    try {
      await api.post("/binary-tree/create-root", { value: v });
      setRootValue("");
      setFoundNodeId(null);
      await fetchTree();
      toast({ title: "Success", description: "Root node created" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.error || "Failed to create root", variant: "destructive" });
    }
  }

  async function handleSearchParent() {
    if (!root) return;
    const v = Number(parentSearch);
    if (Number.isNaN(v)) {
      toast({ title: "Invalid Input", description: "Please enter a valid number", variant: "destructive" });
      return;
    }
    try {
      const res = await api.post("/binary-tree/search", { value: v });
      setFoundNodeId(res.data.node_id);
      toast({ title: "Node Found", description: `Node with value ${v} is highlighted` });
    } catch (error: any) {
      setFoundNodeId(null);
      toast({ title: "Not Found", description: error.response?.data?.error || "Node not found", variant: "destructive" });
    }
  }

  async function handleInsertNode() {
    if (!root || foundNodeId == null) {
      toast({ title: "Error", description: "Please search for a parent node first", variant: "destructive" });
      return;
    }
    const v = Number(newNodeValue);
    if (Number.isNaN(v)) {
      toast({ title: "Invalid Input", description: "Please enter a valid number", variant: "destructive" });
      return;
    }
    if (!direction) {
      toast({ title: "Error", description: "Please select a direction", variant: "destructive" });
      return;
    }
    try {
      console.log("🔵 Inserting node:", { parent_id: foundNodeId, value: v, direction });
      const insertRes = await api.post("/binary-tree/insert", { parent_id: foundNodeId, value: v, direction });
      console.log("✅ Insert response:", insertRes.data);
      
      // Clear ALL input states
      setNewNodeValue("");
      setDirection("");
      setParentSearch("");
      setFoundNodeId(null);
      
      // Re-fetch the tree - this will trigger useEffect to update positions
      await fetchTree();
      
      toast({ title: "Success", description: `Node ${v} inserted successfully` });
    } catch (error: any) {
      console.error("❌ Insert error:", error);
      toast({ title: "Error", description: error.response?.data?.error || "Failed to insert node", variant: "destructive" });
    }
  }

  async function handleDeleteNode() {
    if (!root || foundNodeId == null) {
      toast({ title: "Error", description: "Please search for a node to delete", variant: "destructive" });
      return;
    }
    try {
      await api.post("/binary-tree/delete", { node_id: foundNodeId });
      setFoundNodeId(null);
      await fetchTree();
      toast({ title: "Success", description: "Node deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.error || "Failed to delete node", variant: "destructive" });
    }
  }

  async function handleClearTree() {
    try {
      await api.post("/binary-tree/clear");
      setFoundNodeId(null);
      await fetchTree();
      toast({ title: "Success", description: "Tree cleared successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to clear tree", variant: "destructive" });
    }
  }

  function computeLayout(n: TreeNode | null, xMin: number, xMax: number, depth = 0, acc: Record<number, { x: number; y: number }> = {}): Record<number, { x: number; y: number }> {
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
    const items: JSX.Element[] = [];
    if (n.left) {
      const p2 = positions[n.left.id];
      if (p2) {
        const midX = (pos.x + p2.x) / 2;
        const midY = (pos.y + p2.y) / 2;
        const controlX = midX - 30;
        const path = `M ${pos.x} ${pos.y} Q ${controlX} ${midY} ${p2.x} ${p2.y}`;
        items.push(<path key={`${n.id}-${n.left.id}`} d={path} stroke="#ffffff" strokeWidth={4} fill="none" />);
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
        items.push(<path key={`${n.id}-${n.right.id}`} d={path} stroke="#ffffff" strokeWidth={4} fill="none" />);
      }
      items.push(...renderLines(n.right));
    }
    return items;
  }

  function renderNodes(n: TreeNode | null): JSX.Element | null {
    if (!n) return null;
    const pos = positions[n.id];
    if (!pos) {
      console.warn(`⚠️ No position found for node ${n.id}`);
      return null;
    }
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

  const svgHeight = Math.max(600, Object.values(positions).reduce((max, p) => Math.max(max, p.y), 0) + 140);

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
            {/* Left Column - Control Panel */}
            <div className="space-y-6">
              {/* Quick Guide for Mobile (shows below control panel on mobile) */}
              <div className="block lg:hidden">
                <QuickGuide />
              </div>
              
              <ControlPanel
                root={root}
                rootValue={rootValue}
                setRootValue={setRootValue}
                parentSearch={parentSearch}
                setParentSearch={setParentSearch}
                newNodeValue={newNodeValue}
                setNewNodeValue={setNewNodeValue}
                direction={direction}
                setDirection={setDirection}
                onCreateRoot={handleCreateRoot}
                onSearchParent={handleSearchParent}
                onInsertNode={handleInsertNode}
                onDeleteNode={handleDeleteNode}
                onClearTree={handleClearTree}
              />
            </div>

            {/* Right Column - Visualization */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Guide for Desktop (shows at top on desktop) */}
              <div className="hidden lg:block">
                <QuickGuide />
              </div>
              
              <TreeVisualization root={root} svgHeight={svgHeight} renderLines={renderLines} renderNodes={renderNodes} />
              <PostOrderDisplay postOrderSeq={postOrderSeq} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}