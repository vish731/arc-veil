"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { PAYROLL_ADDRESS } from "../../lib/contract";

const contracts = [
  {
    name: "Payroll",
    address: PAYROLL_ADDRESS,
    desc: "Core contract handling employee commitments, payments, and auditor access.",
  },
];

export default function Contracts() {
  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-xs bg-ink/5 text-ink/70 px-3 py-1 rounded-full border border-ink/20">
            Contracts
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Deployed contracts</h1>
          <p className="text-ink/60 text-sm">All smart contracts powering arc-veil on Arc Testnet.</p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {contracts.map((c, i) => (
            <motion.div
              key={c.address}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-semibold">{c.name}</h3>
                <span className="text-xs font-mono px-3 py-1 rounded-full border bg-emerald/10 text-emerald-dark border-emerald/30">
                  verified
                </span>
              </div>
              <p className="text-ink/60 text-sm mb-4">{c.desc}</p>
              
                href={"https://testnet.arcscan.app/address/" + c.address}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-emerald hover:underline break-all"
              >
                {c.address}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
