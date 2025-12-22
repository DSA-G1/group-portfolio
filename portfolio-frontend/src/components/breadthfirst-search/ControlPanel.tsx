interface ControlPanelProps {
    currentNode: any;
    setCurrentNode: (v: any) => void;

    searchValue: any;
    setSearchValue: (v: any) => void;

    startValue: any;
    setStartValue: (v: any) => void;

    onSearch: () => void;
}

import stations from '@/data/stations.json';

export default function ControlPanel({
    currentNode,
    setCurrentNode,
    searchValue,
    setSearchValue,
    startValue,
    setStartValue,
    onSearch,
}: ControlPanelProps) {

    const handleSearch = () => {
        onSearch();
    };

    const handleReset = () => {
        setSearchValue("");
        setStartValue("");
        setCurrentNode(null);
    };

    return (
        <>
            {/* Header */}
            <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]"> 
                <h3 className="text-[#f181b6] font-header text-4xl mb-2">Control Panel</h3>
                <p className="text-[#ffcaef] font-body text-m">Select your Destination</p>
                
                {/* Search Inputs */}
                <div className="mt-4">
                    <div className="flex flex-row space-x-4 mb-4">
                        <div className="flex-1">
                            <label className="text-[#ffcaef] font-body block mb-2">Start Station</label>
                            <select 
                                value={startValue}
                                onChange={(e) => setStartValue(e.target.value)}
                                className="w-full px-3 py-2 bg-[#2a1a3a] border border-white rounded-lg text-white font-body focus:outline-none focus:ring-2 focus:ring-[#f181b6]"
                            >
                                <option value="" disabled>Select a station</option>
                                {stations.map((station: any) => {
                                    const stationName = station.title.split(' - ')[0].replace(' Station', '');
                                    return (
                                        <option key={station.id} value={stationName}>
                                            {station.title}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="text-[#ffcaef] font-body block mb-2">Destination Station</label>
                            <select 
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full px-3 py-2 bg-[#2a1a3a] border border-white rounded-lg text-white font-body focus:outline-none focus:ring-2 focus:ring-[#f181b6]"
                            >
                                <option value="" disabled>Select a station</option>
                                {stations.map((station: any) => {
                                    const stationName = station.title.split(' - ')[0].replace(' Station', '');
                                    return (
                                        <option key={station.id} value={stationName}>
                                            {station.title}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleSearch}
                            className="w-48 px-4 py-2 bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground font-body text-m border-4 border-white rounded-full"
                        >
                            Find Shortest Path
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-48 px-4 py-2 bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground font-body text-m border-4 border-white rounded-full"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}