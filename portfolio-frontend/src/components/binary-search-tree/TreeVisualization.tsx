import React from "react";

interface TreeVisualizationProps {
  root: any;
  svgHeight: number;
  renderLines: (node: any) => JSX.Element[];
  renderNodes: (node: any) => JSX.Element | null;
}

export default function TreeVisualization({ root, svgHeight, renderLines, renderNodes }: TreeVisualizationProps) {
  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
      <h3 className="text-white font-header text-4xl mb-4">Binary Tree Visualization</h3>
      <div className="w-full max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar rounded-[20px]">
        <svg width={900} height={svgHeight} viewBox={`0 0 900 ${svgHeight}`} className="min-w-[900px]">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x={0} y={0} width={900} height={svgHeight} rx={20} fill="#a93579" />
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
  );
}

