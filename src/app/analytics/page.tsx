"use client";

import { motion } from "framer-motion";
import { useReadContract } from "wagmi";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";

const monthlyData = [
  { month: "Jun", amount: 42000 },
  { month: "Jul", amount: 58000 },
  { month: "Aug", amount: 71000 },
  { month: "Sep", amount: 89000 },
  { month: "Oct", amount: 133350 },
];

const maxAmount = Math.max(...monthlyData.map((d) => d.amount));

export default function Analytics() {
  const { data: employeeCount } = useReadContract({
    address: PAYROLL_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: "employeeCount",
  });

  const count = employeeCount !== undefined ? Number(employeeCount) : 0;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <a href="/" className="font-display font-bold text-xl tracking-tight">
          arc<span className="text-emerald">-veil</span>
        </a>
        <div className="flex items-center gap-4 font-mono text-sm">
          <a href="/dashboard" className="text-ink/60 hover:text-emerald transition-colors">
            Dashboard
          </a>
          <span className="bg-emerald/10 text-emerald-dark px-4 py-1.5 rounded-full border border-emerald/30">
            Analytics
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-3xl mb-10"
        >
          Payroll Analytics
        </motion.h1>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "On-chain employees", value: count.toString() },
            { label: "Total processed", value: "$393.4K" },
            { label: "Avg settlement", value: "1.8s" },
            { label: "Network", value: "Arc Testnet" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]"
            >
              <p className="font-mono text-xs text-ink/50 mb-1">{stat.label}</p>
              <p className="font-display font-bold text-2xl">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)] mb-8"
        >
          <h2 className="font-display font-semibold text-lg mb-8">
            Monthly payroll volume
          </h2>
          <div className="flex items-end gap-4 h-56">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-3">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.amount / maxAmount) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                  className="w-full bg-emerald rounded-t-xl relative group cursor-pointer hover:bg-emerald-dark transition-colors"
                  style={{ minHeight: "8px" }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${d.amount.toLocaleString()}
                  </span>
                </motion.div>
                <span className="font-mono text-xs text-ink/50">{d.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-ink text-paper rounded-3xl p-8"
        >
          <p className="font-mono text-sm text-paper/70">
            All amounts above are stored as commitments on-chain. This dashboard
            aggregates totals for reporting without exposing individual salaries
            to unauthorized viewers.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
