"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const activities = [
  { type: "payroll", label: "Payroll run completed", detail: "4 employees paid", time: "2 hours ago" },
  { type: "employee", label: "New employee added", detail: "Wallet ending in ...4f2a", time: "5 hours ago" },
  { type: "vendor", label: "Vendor invoice settled", detail: "Cloud Infra Co — $12,900", time: "1 day ago" },
  { type: "auditor", label: "Auditor access granted", detail: "Wallet ending in ...8b1c", time: "2 days ago" },
  { type: "employee", label: "Employee status updated", detail: "Marked inactive", time: "3 days ago" },
];

const typeStyles: Record<string, string> = {
  payroll: "bg-emerald/10 text-emerald-dark border-emerald/30",
  employee: "bg-gold/10 text-ink border-gold/40",
  vendor: "bg-ink/5 text-ink/70 border-ink/20",
  auditor: "bg-emerald/10 text-emerald-dark border-emerald/30",
};

export default function Activity() {
  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="font-mono text-xs bg-ink/5 text-ink/70 px-3 py-1 rounded-full border border-ink/20">
            Activity log
          </span>
          <h1 className="font-display font-bold text-3xl mt-4">Recent activity</h1>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-ink/10" />
          <div className="flex flex-col gap-6">
            {activities.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 relative"
              >
                <div className="w-8 h-8 rounded-full bg-surface border-2 border-ink flex items-center justify-center shrink-0 z-10 font-mono text-xs">
                  {i + 1}
                </div>
                <div className="bg-surface border-2 border-ink rounded-2xl p-4 flex-1 shadow-[3px_3px_0px_0px_rgba(15,27,43,1)]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-display font-semibold text-sm">{a.label}</p>
                    <span
                      className={
                        "text-[10px] font-mono px-2 py-0.5 rounded-full border " +
                        typeStyles[a.type]
                      }
                    >
                      {a.type}
                    </span>
                  </div>
                  <p className="text-ink/60 text-sm">{a.detail}</p>
                  <p className="font-mono text-xs text-ink/40 mt-2">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
