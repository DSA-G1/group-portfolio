import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import ControlPanel from "@/components/breadthfirst-search/ControlPanel";
import { Network } from 'react-vis-network';
import stations from '@/data/stations.json';


const BreadthFirstSearch = () => {
    const [currentNode, setCurrentNode] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [startValue, setStartValue] = useState("");
    const networkRef = useRef<any>(null);

    const handleSearch = () => {
        if (networkRef.current && searchValue && startValue) {
            const network = networkRef.current;
            const path = network.getShortestPath(startValue, searchValue);
            if (path) {
                setCurrentNode(searchValue);
                console.log('Shortest path:', path);
                // Highlight path (you can update node/edge colors here)
            }
        }
    };

    // Sample MRT/LRT graph data CHANGE THIS LATERRRR
    const graphData = {
        nodes: stations.map((station: any) => {
            const stationName = station.title.split(' - ')[0].replace(' Station', '');
            return {
                id: stationName,
                label: stationName,
                color: '#f181b6',
                font: { color: '#fff' }
            };
        }),
        edges: [
            // For demo, connect first 5 stations in sequence
            { from: 'Taft', to: 'Magallanes' },
            { from: 'Magallanes', to: 'Ayala' },
            { from: 'Ayala', to: 'Buendia' },
            { from: 'Buendia', to: 'Guadalupe' },
            // Add more connections as needed
        ]
    };

    const options = {
        layout: { hierarchical: false },
        physics: { enabled: true, stabilization: { iterations: 100 } },
        nodes: { 
            shape: 'circle',
            size: 25,
            borderWidth: 2,
            borderColor: '#ffcaef'
        },
        edges: { 
            arrows: 'to',
            color: '#ffcaef',
            width: 2
        },
        interaction: { hover: true },
        height: '400px'
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
                    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
                        <h3 className="text-[#f181b6] font-header text-4xl mb-4">MRT and LRT Stations Map</h3>
                        <div className="w-full bg-[#1f1131] rounded-[20px] overflow-hidden">
                            <Network 
                                data={graphData} 
                                options={options}
                                getNetwork={(network) => networkRef.current = network}
                            />
                        </div>
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
