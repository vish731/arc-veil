"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const entries = [
  { date: "This week", changes: ["Added CSV import for bulk employee onboarding", "Added dark mode toggle", "Added reports generation"] },
  { date: "Last week", changes: ["Launched auditor verification page", "Added vendor settlement module", "Added analytics dashboard"] },
  { date: "2 weeks ago", changes: ["Deployed Payroll contract to Arc Testnet", "Launched HR dashboard with wallet connect", "Initial landing page live"] },
];

export default function Changelog() {
  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-xs bg-ink/5 text-ink/70 px-3 py-1 rounded-full border border-ink/20">
            Changelog
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">What&apos;s new</h1>
          <p className="text-ink/60 text-sm">A running log of updates shipped to arc-veil.</p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.date}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-mono text-xs text-emerald mb-3">{entry.date}</p>
              <div className="flex flex-col gap-2">
                {entry.changes.map((change) => (
                  <div key={change} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink/30 shrink-0" />
                    {change}
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
