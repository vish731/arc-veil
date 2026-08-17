"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const checks = [
  { label: "Wallet screening", desc: "Every employee and vendor wallet can be checked against sanctions lists before onboarding.", status: "available" },
  { label: "On-chain audit trail", desc: "Every payroll and vendor transaction is permanently recorded on Arc, timestamped and verifiable.", status: "active" },
  { label: "Selective disclosure", desc: "Auditors can verify specific amounts without seeing the full payroll ledger.", status: "active" },
  { label: "KYC integration", desc: "Connect a KYC provider to verify employee identity before wallet onboarding.", status: "planned" },
];

const statusStyles: Record<string, string> = {
  active: "bg-emerald/10 text-emerald-dark border-emerald/30",
  available: "bg-gold/10 text-ink border-gold/40",
  planned: "bg-ink/5 text-ink/40 border-ink/10",
};

export default function Compliance() {
  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-xs bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold">
            Compliance
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Compliance &amp; audit readiness</h1>
          <p className="text-ink/60 text-sm">
            arc-veil is designed so confidentiality never comes at the cost of accountability.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {checks.map((check, i) => (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-semibold">{check.label}</h3>
                <span className={"text-xs font-mono px-3 py-1 rounded-full border capitalize " + statusStyles[check.status]}>
                  {check.status}
                </span>
              </div>
              <p className="text-ink/60 text-sm leading-relaxed">{check.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
