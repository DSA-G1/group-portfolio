import React from "react";
import { algoInfo, AlgoKey } from "./utils";

export default function SortInfo({ algo }: { algo: AlgoKey }) {
  const info = algoInfo[algo];
  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
      <h3 className="text-[#f181b6] font-header text-4xl mb-2">Sort Info</h3>
      <p className="text-[#ffcaef] font-body text-m mb-4">Algorithm Complexity</p>
      <div className="space-y-3">
        <InfoRow label="Best Case" value={info?.best || "-"} />
        <InfoRow label="Average Case" value={info?.average || "-"} />
        <InfoRow label="Worst Case" value={info?.worst || "-"} />
        <InfoRow label="Space Complexity" value={info?.space || "-"} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[17px] border-[3px] border-[#ffcaef]/30 bg-[#1f1131] px-4 py-3 flex items-center justify-between">
      <span className="text-[#ffcaef] font-body text-sm">{label}</span>
      <span className="text-white font-body font-semibold text-sm">{value}</span>
    </div>
  );
}