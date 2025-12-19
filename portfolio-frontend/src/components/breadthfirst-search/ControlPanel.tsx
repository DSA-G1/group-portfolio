interface ControlPanelProps {
    currentNode: any;
    setCurrentNode: (v: any) => void;

    searchValue: any;
    setSearchValue: (v: any) => void;
}

export default function ControlPanel({
    currentNode,
    setCurrentNode,
    searchValue,
    setSearchValue,
}: ControlPanelProps) {

    return (
        <>
            {/* Header */}
            <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]"> 
                <h3 className="text-[#f181b6] font-header text-4xl mb-2">Control Panel</h3>
                <p className="text-[#ffcaef] font-body text-m">Select your Destination</p>
                
                {/* Search Input */}
                <div className="mt-4">
                    <label htmlFor="search-input" className="block text-[#ffcaef] font-body text-sm mb-2">
                        Enter value to search:
                    </label>
                    <input
                        id="search-input"
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2a1a3a] border border-[#ffcaef] rounded-lg text-[#ffcaef] font-body placeholder-[#ffcaef]/50 focus:outline-none focus:ring-2 focus:ring-[#f181b6]"
                        placeholder="e.g., 5"
                    />
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-3">
                    <button
                        className="flex-1 bg-[#f181b6] hover:bg-[#e06ba0] text-[#1f1131] font-header py-2 px-4 rounded-lg transition-colors"
                    >
                        Start BFS
                    </button>
                    <button
                        className="flex-1 bg-[#2a1a3a] hover:bg-[#3a2a4a] border border-[#ffcaef] text-[#ffcaef] font-header py-2 px-4 rounded-lg transition-colors"
                    >
                        Reset
                    </button>
                </div>

                {/* Current Node Display */}
                {currentNode && (
                    <div className="mt-4 p-3 bg-[#2a1a3a] border border-[#ffcaef] rounded-lg">
                        <p className="text-[#ffcaef] font-body text-sm">
                            Current Node: <span className="font-header text-[#f181b6]">{currentNode}</span>
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}