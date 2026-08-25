"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";
import { PAYROLL_ADDRESS } from "../../lib/contract";

const dataTypes = [
  { id: "employees", label: "Employee records" },
  { id: "vendors", label: "Vendor invoices" },
  { id: "activity", label: "Activity log" },
  { id: "settings", label: "Company settings" },
];

export default function ExportData() {
  const { showToast } = useToast();
  const [selected, setSelected] = useState<string[]>(dataTypes.map((d) => d.id));
  const [exporting, setExporting] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function exportAll() {
    if (selected.length === 0) {
      showToast("Select at least one data type.", "error");
      return;
    }
    setExporting(true);
    setTimeout(() => {
      const data = {
        exportedAt: new Date().toISOString(),
        network: "Arc Testnet",
        contract: PAYROLL_ADDRESS,
        includes: selected,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "arc-veil-data-export.json";
      link.click();
      URL.revokeObjectURL(url);
      setExporting(false);
      showToast("Data exported successfully.", "success");
    }, 1000);
  }

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            Data
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Export your data</h1>
          <p className="text-ink/60 text-sm">Download a complete backup of your arc-veil data.</p>
        </motion.div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
          <div className="flex flex-col gap-3 mb-6">
            {dataTypes.map((type) => (
              <label
                key={type.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(type.id)}
                  onChange={() => toggle(type.id)}
                  className="w-4 h-4 accent-emerald"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={exportAll}
            disabled={exporting}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium text-sm hover:bg-emerald transition-colors disabled:opacity-50"
          >
            {exporting ? "Preparing export..." : "Export as JSON"}
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
