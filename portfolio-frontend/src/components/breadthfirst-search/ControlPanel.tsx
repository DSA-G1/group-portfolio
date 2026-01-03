import { useState, useEffect } from "react";
import api from "@/services/api";
import stationsData from "@/data/stations_data.json";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    const [stationsByLine, setStationsByLine] = useState<{
        lrt1: string[];
        lrt2: string[];
        mrt3: string[];
    }>({ lrt1: [], lrt2: [], mrt3: [] });

    useEffect(() => {
        const buildFromLocal = () => {
            const byLine = { lrt1: [] as string[], lrt2: [] as string[], mrt3: [] as string[] };
            (Object.entries(stationsData) as [string, { segments?: { from: string; to: string }[] }][])?.forEach(([line, data]) => {
                const set = new Set<string>();
                (data.segments ?? []).forEach(seg => {
                    set.add(seg.from);
                    set.add(seg.to);
                });
                if (line === "lrt1") byLine.lrt1 = Array.from(set).sort();
                if (line === "lrt2") byLine.lrt2 = Array.from(set).sort();
                if (line === "mrt3") byLine.mrt3 = Array.from(set).sort();
            });
            setStationsByLine(byLine);
        };

        const fetchStations = async () => {
            try {
                const response = await api.get('/bfs/stations');
                if (response.data.by_line) {
                    setStationsByLine(response.data.by_line);
                    return;
                }
                buildFromLocal();
            } catch (error) {
                console.error("Failed to load stations, using local data:", error);
                buildFromLocal();
            }
        };
        fetchStations();
    }, []);

    const allStations = [...stationsByLine.lrt1, ...stationsByLine.lrt2, ...stationsByLine.mrt3];

    return (
        <div className="bg-[#1f1131] rounded-2xl md:rounded-[40px] p-4 md:p-6 border-2 md:border-[4px] border-[#ffcaef]">
            <h3 className="text-white font-header text-2xl md:text-4xl">ROUTE FINDER</h3>
            <p className="text-[#ffcaef] font-body text-sm md:text-md md:mb-6">Select your start and destination stations</p>
            
            <div className="space-y-4 md:space-y-6">
                <div>
                    <label className="text-white font-body text-m md:text-xl block mb-2">Start Station</label>
                    <Select value={startValue} onValueChange={setStartValue}>
                        <SelectTrigger className="w-full bg-[#1f1131] text-white text-m md:text-lg border-2 md:border-[3px] border-[#ffcaef] rounded-lg md:rounded-[20px] px-3 md:px-4 py-2 md:py-3 font-body h-auto">
                            <SelectValue placeholder="Select a starting station" />
                        </SelectTrigger>
                        <SelectContent 
                            className="bg-[#1f1131] border-2 md:border-[2px] border-[#ffcaef] max-h-[300px] overflow-y-auto z-[100]"
                            position="popper"
                            sideOffset={5}
                        >
                            <SelectGroup>
                                <SelectLabel className="text-white font-bold text-xs md:text-sm px-2 py-2 bg-[#8a910a]/50 sticky top-0 z-10">
                                    LRT-1 LINE
                                </SelectLabel>
                                {stationsByLine.lrt1.map((station) => (
                                    <SelectItem 
                                        key={`start-lrt1-${station}`} 
                                        value={station}
                                        className="text-white hover:bg-[#493463] cursor-pointer pl-8 py-2 font-body text-xs md:text-base data-[highlighted]:bg-[#493463] data-[highlighted]:text-white"
                                    >
                                        {station}
                                    </SelectItem>
                                ))}
                            </SelectGroup>

                            <SelectGroup>
                                <SelectLabel className="text-white font-bold text-xs md:text-sm px-2 py-2 bg-[#4050be]/50 mt-2 sticky top-0 z-10">
                                    LRT-2 LINE
                                </SelectLabel>
                                {stationsByLine.lrt2.map((station) => (
                                    <SelectItem 
                                        key={`start-lrt2-${station}`} 
                                        value={station}
                                        className="text-white hover:bg-[#493463] cursor-pointer pl-8 py-2 font-body text-xs md:text-base data-[highlighted]:bg-[#493463] data-[highlighted]:text-white"
                                    >
                                        {station}
                                    </SelectItem>
                                ))}
                            </SelectGroup>

                            <SelectGroup>
                                <SelectLabel className="text-white font-bold text-xs md:text-sm px-2 py-2 bg-[#902d67]/50 mt-2 sticky top-0 z-10">
                                    MRT-3 LINE
                                </SelectLabel>
                                {stationsByLine.mrt3.map((station) => (
                                    <SelectItem 
                                        key={`start-mrt3-${station}`} 
                                        value={station}
                                        className="text-white hover:bg-[#493463] cursor-pointer pl-8 py-2 font-body text-xs md:text-base data-[highlighted]:bg-[#493463] data-[highlighted]:text-white"
                                    >
                                        {station}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-white font-body text-m md:text-xl block mb-2">Destination Station</label>
                    <Select value={searchValue} onValueChange={setSearchValue}>
                        <SelectTrigger className="w-full bg-[#1f1131] text-white text-m md:text-lg border-2 md:border-[3px] border-[#ffcaef] rounded-lg md:rounded-[20px] px-3 md:px-4 py-2 md:py-3 font-body h-auto">
                            <SelectValue placeholder="Select destination station" />
                        </SelectTrigger>
                        <SelectContent 
                            className="bg-[#1f1131] border-2 md:border-[2px] border-[#ffcaef] max-h-[300px] overflow-y-auto z-[100]"
                            position="popper"
                            sideOffset={5}
                        >
                            <SelectGroup>
                                <SelectLabel className="text-white font-bold text-xs md:text-sm px-2 py-2 bg-[#8a910a]/50 sticky top-0 z-10">
                                    LRT-1 LINE
                                </SelectLabel>
                                {stationsByLine.lrt1.map((station) => (
                                    <SelectItem 
                                        key={`end-lrt1-${station}`} 
                                        value={station}
                                        className="text-white hover:bg-[#493463] cursor-pointer pl-8 py-2 font-body text-xs md:text-base data-[highlighted]:bg-[#493463] data-[highlighted]:text-white"
                                    >
                                        {station}
                                    </SelectItem>
                                ))}
                            </SelectGroup>

                            <SelectGroup>
                                <SelectLabel className="text-white font-bold text-xs md:text-sm px-2 py-2 bg-[#4050be]/50 mt-2 sticky top-0 z-10">
                                    LRT-2 LINE
                                </SelectLabel>
                                {stationsByLine.lrt2.map((station) => (
                                    <SelectItem 
                                        key={`end-lrt2-${station}`} 
                                        value={station}
                                        className="text-white hover:bg-[#493463] cursor-pointer pl-8 py-2 font-body text-xs md:text-base data-[highlighted]:bg-[#493463] data-[highlighted]:text-white"
                                    >
                                        {station}
                                    </SelectItem>
                                ))}
                            </SelectGroup>

                            <SelectGroup>
                                <SelectLabel className="text-white font-bold text-xs md:text-sm px-2 py-2 bg-[#902d67]/50 mt-2 sticky top-0 z-10">
                                    MRT-3 LINE
                                </SelectLabel>
                                {stationsByLine.mrt3.map((station) => (
                                    <SelectItem 
                                        key={`end-mrt3-${station}`} 
                                        value={station}
                                        className="text-white hover:bg-[#493463] cursor-pointer pl-8 py-2 font-body text-xs md:text-base data-[highlighted]:bg-[#493463] data-[highlighted]:text-white"
                                    >
                                        {station}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2 md:gap-3">
                    <button
                        onClick={onSearch}
                        disabled={!startValue || !searchValue}
                        className="flex-1 bg-[#f181b6] hover:bg-[#d16a9e] disabled:bg-[#493463] disabled:cursor-not-allowed text-white border-2 md:border-[4px] border-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-[50px] font-body text-sm md:text-lg transition-colors"
                    >
                        🔍︎ Find Route
                    </button>
                    <button
                        onClick={onReset}
                        className="bg-[#493463] text-white border-2 md:border-[4px] border-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-[50px] font-body text-sm md:text-lg hover:bg-[#5a4073] transition-colors"
                    >
                        Reset
                    </button>
                </div>

                <div className="pt-3 md:pt-4 border-t border-md:border-2 border-[#ffcaef]">
                    <p className="text-[#ffcaef] font-body text-xs md:text-lg">
                        Total Stations: <span className="text-white font-medium text-sm md:text-xl">{allStations.length}</span>
                    </p>
                    <div className="mt-2 space-y-1 text-xs md:text-sm text-white font-body">
                        <p>🟢 LRT-1: {stationsByLine.lrt1.length} stations</p>
                        <p>🔵 LRT-2: {stationsByLine.lrt2.length} stations</p>
                        <p>🔴 MRT-3: {stationsByLine.mrt3.length} stations</p>
                    </div>
                </div>
            </div>
        </div>
    );
}