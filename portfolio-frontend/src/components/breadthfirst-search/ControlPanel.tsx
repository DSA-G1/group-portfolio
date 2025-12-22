import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

interface ControlPanelProps {
    currentNode: any;
    setCurrentNode: (v: any) => void;

    searchValue: any;
    setSearchValue: (v: any) => void;

    startValue: any;
    setStartValue: (v: any) => void;

    onSearch: () => void;
    onReset: () => void;
}

export default function ControlPanel({
    currentNode,
    setCurrentNode,
    searchValue,
    setSearchValue,
    startValue,
    setStartValue,
    onSearch,
    onReset,
}: ControlPanelProps) {
    const [allStations, setAllStations] = useState<string[]>([]);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await api.get('/bfs/stations');
                setAllStations(response.data.stations || []);
            } catch (error) {
                console.error("Failed to load stations:", error);
            }
        };
        fetchStations();
    }, []);

    return (
        <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
            <h3 className="text-[#f181b6] font-header text-4xl mb-6">ROUTE FINDER</h3>
            
            <div className="space-y-6">
                <div>
                    <label className="text-white font-body text-xl block mb-2">Start Station</label>
                    <input
                        list="start-stations"
                        value={startValue}
                        onChange={(e) => setStartValue(e.target.value)}
                        placeholder="e.g., Taft"
                        className="w-full bg-[#493463] text-white border-[2px] border-white rounded-[20px] px-4 py-3 font-body text-lg"
                    />
                    <datalist id="start-stations">
                        {allStations.map((station) => (
                            <option key={station} value={station} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <label className="text-white font-body text-xl block mb-2">Destination Station</label>
                    <input
                        list="end-stations"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="e.g., Antipolo"
                        className="w-full bg-[#493463] text-white border-[2px] border-white rounded-[20px] px-4 py-3 font-body text-lg"
                    />
                    <datalist id="end-stations">
                        {allStations.map((station) => (
                            <option key={station} value={station} />
                        ))}
                    </datalist>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onSearch}
                        className="flex-1 bg-[#f181b6] hover:bg-[#d16a9e] text-white border-[4px] border-white px-6 py-3 rounded-[50px] font-body text-xl"
                    >
                        🔍 Find Route
                    </button>
                    <button
                        onClick={onReset}
                        className="bg-[#493463] text-white border-[4px] border-white px-6 py-3 rounded-[50px] font-body text-xl hover:bg-[#5a4073]"
                    >
                        Reset
                    </button>
                </div>

                <div className="pt-4 border-t-2 border-[#ffcaef]">
                    <p className="text-[#ffcaef] font-body text-lg">
                        Total Stations: <span className="text-white font-bold text-xl">{allStations.length}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}