"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const team = [
  { role: "Founder & Engineer", name: "You", desc: "Building arc-veil end to end — contracts, frontend, and product." },
];

const roadmapDone = [
  "Confidential payroll smart contract deployed on Arc Testnet",
  "Wallet connect with multi-wallet selector",
  "HR dashboard with on-chain employee management",
  "Vendor invoice settlement module",
  "Auditor verification flow",
  "Analytics dashboard with CSV export",
];

export default function Team() {
  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            About
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Team &amp; Progress</h1>
          <p className="text-ink/60 text-sm">Who&apos;s building arc-veil, and what&apos;s shipped so far.</p>
        </motion.div>

        <h2 className="font-display font-semibold text-lg mb-4">Team</h2>
        <div className="flex flex-col gap-3 mb-10">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]"
            >
              <p className="font-display font-semibold">{member.name}</p>
              <p className="font-mono text-xs text-emerald mb-2">{member.role}</p>
              <p className="text-ink/60 text-sm">{member.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display font-semibold text-lg mb-4">Shipped so far</h2>
        <div className="flex flex-col gap-2">
          {roadmapDone.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-surface border-2 border-ink/10 rounded-2xl px-4 py-3"
            >
              <span className="text-emerald text-sm">✓</span>
              <p className="text-sm">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
