"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const plans = [
  { name: "Starter", price: "Free", desc: "Up to 5 employees, testnet only.", current: true },
  { name: "Growth", price: "$49/mo", desc: "Up to 50 employees, priority support." },
  { name: "Enterprise", price: "Custom", desc: "Unlimited employees, dedicated auditor tools, SLA." },
];

export default function Billing() {
  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-xs bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold">
            Billing
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Plans &amp; billing</h1>
          <p className="text-ink/60 text-sm">You&apos;re currently on the Starter plan, running on Arc Testnet.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={
                "rounded-3xl p-6 border-2 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)] " +
                (plan.current ? "bg-ink text-paper border-ink" : "bg-surface border-ink")
              }
            >
              <h3 className="font-display font-semibold text-lg mb-1">{plan.name}</h3>
              <p className="font-mono text-2xl font-bold mb-3">{plan.price}</p>
              <p className={"text-sm mb-6 " + (plan.current ? "text-paper/70" : "text-ink/60")}>
                {plan.desc}
              </p>
              {plan.current ? (
                <span className="inline-block bg-emerald text-ink text-xs font-mono px-3 py-1.5 rounded-full">
                  Current plan
                </span>
              ) : (
                <button className="w-full border-2 border-ink py-2.5 rounded-xl text-sm font-medium hover:bg-ink hover:text-paper transition-colors">
                  Upgrade
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
