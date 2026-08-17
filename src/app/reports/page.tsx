"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";

const reportTypes = [
  { id: "payroll", label: "Payroll Summary", desc: "Monthly breakdown of all payroll runs and totals." },
  { id: "vendor", label: "Vendor Settlements", desc: "All vendor invoices and their payment status." },
  { id: "audit", label: "Audit Trail", desc: "Full on-chain transaction history with timestamps." },
  { id: "tax", label: "Tax Summary", desc: "Aggregated figures formatted for tax filing." },
];

export default function Reports() {
  const { showToast } = useToast();
  const [selectedType, setSelectedType] = useState("payroll");
  const [dateRange, setDateRange] = useState("last-30");
  const [generating, setGenerating] = useState(false);

  function generateReport() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      showToast("Report generated successfully.", "success");

      const rows = [
        ["Report type", reportTypes.find((r) => r.id === selectedType)?.label ?? ""],
        ["Date range", dateRange],
        ["Generated on", new Date().toLocaleString()],
        ["Network", "Arc Testnet"],
      ];
      const csvContent = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "arc-veil-" + selectedType + "-report.csv";
      link.click();
      URL.revokeObjectURL(url);
    }, 1200);
  }

  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            Reports
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Generate reports</h1>
          <p className="text-ink/60 text-sm">
            Export payroll, vendor, and audit data for record-keeping or filing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={
                "text-left rounded-3xl p-6 border-2 transition-colors shadow-[3px_3px_0px_0px_rgba(15,27,43,1)] " +
                (selectedType === type.id
                  ? "bg-ink text-paper border-ink"
                  : "bg-surface border-ink hover:border-emerald")
              }
            >
              <p className="font-display font-semibold mb-1">{type.label}</p>
              <p className={"text-xs " + (selectedType === type.id ? "text-paper/60" : "text-ink/50")}>
                {type.desc}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
          <label className="font-mono text-xs text-ink/50 block mb-1">Date range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none mb-6 bg-surface"
          >
            <option value="last-7">Last 7 days</option>
            <option value="last-30">Last 30 days</option>
            <option value="last-90">Last 90 days</option>
            <option value="all-time">All time</option>
          </select>

          <button
            onClick={generateReport}
            disabled={generating}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium text-sm hover:bg-emerald transition-colors disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate & download CSV"}
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
