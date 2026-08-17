"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const phases = [
  {
    label: "Phase 1 — Foundation",
    status: "done",
    items: ["Payroll smart contract", "Arc testnet deployment", "Wallet connect"],
  },
  {
    label: "Phase 2 — Core product",
    status: "done",
    items: ["HR dashboard", "Vendor settlement", "Auditor verification", "Analytics"],
  },
  {
    label: "Phase 3 — Polish",
    status: "active",
    items: ["Dark mode", "CSV import/export", "Search & filters", "Error handling"],
  },
  {
    label: "Phase 4 — Scale",
    status: "planned",
    items: ["Recurring payroll schedules", "Multi-token support", "Mainnet deployment", "Native Arc privacy integration"],
  },
];

const statusStyles: Record<string, string> = {
  done: "bg-emerald/10 text-emerald-dark border-emerald/30",
  active: "bg-gold/10 text-ink border-gold/40",
  planned: "bg-ink/5 text-ink/40 border-ink/10",
};

export default function Roadmap() {
  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-xs bg-ink/5 text-ink/70 px-3 py-1 rounded-full border border-ink/20">
            Roadmap
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Where arc-veil is headed</h1>
          <p className="text-ink/60 text-sm">Built in public — this is what&apos;s done and what&apos;s next.</p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg">{phase.label}</h3>
                <span
                  className={
                    "text-xs font-mono px-3 py-1 rounded-full border capitalize " +
                    statusStyles[phase.status]
                  }
                >
                  {phase.status}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-ink/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink/30" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
