"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const integrations = [
  { name: "Arc Explorer", desc: "View every transaction on ArcScan, directly linked from your dashboard.", connected: true },
  { name: "Rabby Wallet", desc: "Sign transactions securely with Rabby's built-in security checks.", connected: true },
  { name: "MetaMask", desc: "Standard EVM wallet support for signing and connecting.", connected: true },
  { name: "Slack notifications", desc: "Get notified in Slack when payroll runs complete.", connected: false },
  { name: "QuickBooks sync", desc: "Sync payroll records with your accounting software.", connected: false },
];

export default function Integrations() {
  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            Integrations
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Connected tools</h1>
          <p className="text-ink/60 text-sm">Everything arc-veil connects to, today and coming soon.</p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {integrations.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-surface border-2 border-ink rounded-3xl p-5 shadow-[3px_3px_0px_0px_rgba(15,27,43,1)] flex items-center justify-between"
            >
              <div>
                <p className="font-display font-semibold text-sm">{tool.name}</p>
                <p className="text-ink/60 text-xs mt-1">{tool.desc}</p>
              </div>
              <span
                className={
                  "text-xs font-mono px-3 py-1 rounded-full border shrink-0 " +
                  (tool.connected
                    ? "bg-emerald/10 text-emerald-dark border-emerald/30"
                    : "bg-ink/5 text-ink/40 border-ink/10")
                }
              >
                {tool.connected ? "connected" : "coming soon"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
