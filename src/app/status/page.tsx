"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const services = [
  { name: "Payroll Contract", status: "operational" },
  { name: "Arc Testnet RPC", status: "operational" },
  { name: "Wallet Connect", status: "operational" },
  { name: "ArcScan Explorer", status: "operational" },
  { name: "CSV Export", status: "operational" },
];

export default function Status() {
  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            System status
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">All systems operational</h1>
          <p className="text-ink/60 text-sm">Live status of arc-veil&apos;s core services.</p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-surface border-2 border-ink rounded-2xl p-4 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(15,27,43,1)]"
            >
              <p className="text-sm font-medium">{s.name}</p>
              <span className="flex items-center gap-2 text-xs font-mono text-emerald-dark">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                Operational
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
