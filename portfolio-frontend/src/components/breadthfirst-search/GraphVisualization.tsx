import React from 'react';

interface GraphVisualizationProps {
    currentNode: any;
    renderLines: (node: any) => JSX.Element[];
    renderNodes: (node: any) => JSX.Element | null;
}

export default function GraphVisualization({ currentNode, renderLines, renderNodes }: GraphVisualizationProps) {
    return (
        <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
            <h3 className="text-white font-header text-4xl mb-4">MRT and LRT stations map</h3>
            <div className="w-full max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar rounded-[20px]">
                <svg width={900} height={600} viewBox={`0 0 900 600`} className="min-w-[900px]">
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation={8} result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <rect x={0} y={0} width={900} height={600} rx={20} fill="#1f1131" />
                    {currentNode && renderLines(currentNode)}
                    {currentNode && renderNodes(currentNode)}
                    {!currentNode && (
                        <text x={450} y={300} textAnchor="middle" fill="#fff" fontSize={24} fontWeight="bold" className="font-body">
                            <tspan x={450} dy={0}>Insert MRT and LRT Graphs</tspan>
                        </text>
                    )}
                </svg>
            </div>
        </div>
    );
}