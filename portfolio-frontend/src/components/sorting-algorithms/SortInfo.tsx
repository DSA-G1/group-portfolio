import React, { useEffect, useState } from "react";
import { AlgoKey } from "./utils";
import api from "@/services/api";

type AlgoInfo = {
  best: string;
  average: string;
  worst: string;
  space: string;
};

export default function SortInfo({ algo }: { algo: AlgoKey }) {
  const [info, setInfo] = useState<AlgoInfo | null>(null);
  const [labels, setLabels] = useState<Record<AlgoKey, string>>({} as any);
  const [descriptions, setDescriptions] = useState<Record<AlgoKey, string>>({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labelsRes, infoRes, descRes] = await Promise.all([
          api.get("/sorting-algorithms/metadata/labels"),
          api.get("/sorting-algorithms/metadata/info"),
          api.get("/sorting-algorithms/metadata/descriptions"),
        ]);
        setLabels(labelsRes.data);
        setDescriptions(descRes.data);
        if (algo && infoRes.data[algo]) {
          setInfo(infoRes.data[algo]);
        }
      } catch (error) {
        console.error("Failed to fetch algorithm info:", error);
      } finally {
        setLoading(false);
      }
    };
    if (algo) {
      fetchData();
    }
  }, [algo]);

  const title = labels[algo] ? `${labels[algo]} Info` : "Sort Info";
  const description = descriptions[algo];

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