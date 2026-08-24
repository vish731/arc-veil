"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import Sidebar from "../components/Sidebar";

export default function Onboarding() {
  const { isConnected } = useAccount();
  const [steps, setSteps] = useState({
    wallet: false,
    employee: false,
    payment: false,
    auditor: false,
  });

  useEffect(() => {
    setSteps((prev) => ({ ...prev, wallet: isConnected }));
  }, [isConnected]);

  const checklist = [
    { key: "wallet" as const, label: "Connect your wallet", desc: "Link your wallet to start managing payroll.", href: "/dashboard" },
    { key: "employee" as const, label: "Add your first employee", desc: "Add an employee with their wallet and salary.", href: "/dashboard" },
    { key: "payment" as const, label: "Run your first payment", desc: "Pay an employee in USDC on Arc.", href: "/dashboard" },
    { key: "auditor" as const, label: "Grant an auditor", desc: "Give someone verification access.", href: "/settings" },
  ];

  const completedCount = Object.values(steps).filter(Boolean).length;
  const progress = (completedCount / checklist.length) * 100;

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            Getting started
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Welcome to arc-veil</h1>
          <p className="text-ink/60 text-sm">Complete these steps to get your confidential payroll running.</p>
        </motion.div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-6 mb-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-xs text-ink/50">{completedCount} of {checklist.length} complete</p>
            <p className="font-mono text-xs text-emerald">{Math.round(progress)}%</p>
          </div>
          <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: progress + "%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-emerald"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {checklist.map((item, i) => (
            <motion.a
              key={item.key}
              href={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface border-2 border-ink rounded-2xl p-5 flex items-center gap-4 shadow-[3px_3px_0px_0px_rgba(15,27,43,1)] hover:border-emerald transition-colors"
            >
              <div
                className={
                  "w-7 h-7 rounded-full border-2 border-ink flex items-center justify-center shrink-0 " +
                  (steps[item.key] ? "bg-emerald text-paper" : "bg-surface")
                }
              >
                {steps[item.key] ? "✓" : ""}
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm">{item.label}</p>
                <p className="text-ink/50 text-xs mt-0.5">{item.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
