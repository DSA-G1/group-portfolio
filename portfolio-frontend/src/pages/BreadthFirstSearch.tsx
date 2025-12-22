import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

import ControlPanel from "@/components/breadthfirst-search/ControlPanel";
import GraphVisualization from "@/components/breadthfirst-search/GraphVisualization";

const BreadthFirstSearch = () => {
    const { toast } = useToast();
    const [currentNode, setCurrentNode] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [startValue, setStartValue] = useState("");
    const [pathResult, setPathResult] = useState(null);

    const handleSearch = async () => {
        if (!startValue || !searchValue) {
            toast({
                title: "Error",
                description: "Please enter both start and end stations",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await api.post('/bfs/search', {
                start: startValue,
                end: searchValue,
            });
            
            setPathResult(response.data);
            setCurrentNode(startValue);
            
            toast({
                title: "Path Found!",
                description: `Found path with ${response.data.path.length} stations`,
            });
        } catch (error: any) {
            const isNetwork = !error.response;
            toast({
                title: isNetwork ? "Backend Unreachable" : "Error",
                description: isNetwork ? "Cannot reach API. Is the backend running on :5000?" : (error.response?.data?.error || "Failed to find path"),
                variant: "destructive",
            });
            setPathResult(null);
        }
    };

    const handleReset = async () => {
        try {
            await api.post('/bfs/reset');
            setPathResult(null);
            setStartValue("");
            setSearchValue("");
            setCurrentNode(null);
            
            toast({
                title: "Reset",
                description: "Path cleared successfully",
            });
        } catch (error) {
            console.error("Reset failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/background/lab4-bg.png')` }}>
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
                        onReset={handleReset}
                    />
                    
                    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
                        <GraphVisualization 
                            start={startValue} 
                            end={searchValue} 
                            currentNode={currentNode}
                            pathResult={pathResult}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BreadthFirstSearch;
