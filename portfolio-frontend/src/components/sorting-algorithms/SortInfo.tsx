import React from "react";
import { algoInfo, algoLabels, algoDescriptions, AlgoKey } from "./utils";

export default function SortInfo({ algo }: { algo: AlgoKey }) {
  const info = algoInfo[algo];
  const title = algoLabels[algo] ? `${algoLabels[algo]} Info` : "Sort Info";
  const description = algoDescriptions[algo];
  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
      <h3 className="text-[#ffcaef] font-body text-4xl mb-2">{title}</h3>
      <p className="text-white font-body text-m mb-4">Algorithm Complexity</p>
      <div className="space-y-3">
        <InfoRow label="Best Case" value={info?.best || "-"} />
        <InfoRow label="Average Case" value={info?.average || "-"} />
        <InfoRow label="Worst Case" value={info?.worst || "-"} />
        <InfoRow label="Space Complexity" value={info?.space || "-"} />
      </div>
      <p className="text-white font-body text-sm mt-4">{description}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[17px] border-[4px] border-[#9e7cc8]/30 bg-[#1f1131] px-4 py-3 flex items-center justify-between">
      <span className="text-[#ffcaef] font-body text-sm">{label}</span>
      <span className="text-white font-body font-semibold text-sm">{value}</span>
    </div>
  );
}