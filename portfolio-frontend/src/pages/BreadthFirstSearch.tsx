import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import ControlPanel from "@/components/breadthfirst-search/ControlPanel";
import GraphVisualization from "@/components/breadthfirst-search/GraphVisualization";
import stations from '@/data/stations.json';


const BreadthFirstSearch = () => {
    const [currentNode, setCurrentNode] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [startValue, setStartValue] = useState("");

    const handleSearch = () => {
        // The GraphVisualization component handles the BFS internally
        console.log('Finding path from', startValue, 'to', searchValue);
    };

    return (
        <div className="min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/background/lab4-bg.png')` }}>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { height: 12px; width: 12px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffcaef; border-radius: 999px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #493463ff; border-radius: 999px; }
            `}</style>
            <Header />
            <main className="pt-24 pb-12 px-6">
                <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-12">
                    <span className="text-white">SHORTEST PATH </span>
                    <span className="text-[#f181b6]">VISUALIZER</span>
                </h1>

                <div className="max-w-[1400px] mx-auto space-y-6">
                    <ControlPanel 
                        currentNode={currentNode}
                        setCurrentNode={setCurrentNode}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        startValue={startValue}
                        setStartValue={setStartValue}
                        onSearch={handleSearch}
                    />
                    
                    {/* Graph Visualization */}
                    <div className="bg-[#1f1131]">
                        <GraphVisualization 
                            start={startValue} 
                            end={searchValue} 
                            currentNode={currentNode} 
                        />
                    </div>

                    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
                        <h3 className="text-white font-header text-4xl mb-4">LRT/MRT STATION ROUTE</h3>
                        <p className="text-[#ffcaef] font-body text-m">Current Station → Destination</p>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BreadthFirstSearch;
