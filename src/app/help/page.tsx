"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const faqs = [
  {
    q: "How does confidentiality work on arc-veil?",
    a: "When you add an employee, the salary amount is hashed into a commitment (using keccak256) along with a secret. Only the commitment is stored on-chain — the actual amount is never visible to the public. To prove or verify an amount, you share the original amount and secret off-chain with an authorized party, who can then check it against the on-chain commitment.",
  },
  {
    q: "Who can see payroll amounts?",
    a: "By default, no one can see the actual amounts from the blockchain alone. The contract owner (usually HR/finance) knows the amounts because they set them. Auditors granted access via Settings can verify specific claimed amounts using the disclosure mechanism, but cannot browse all amounts freely.",
  },
  {
    q: "What network does arc-veil run on?",
    a: "arc-veil runs on Arc Testnet, an EVM-compatible chain where USDC is the native gas token. This means gas fees are paid directly in USDC, with no need for a separate gas token, and transactions settle in under 2 seconds.",
  },
  {
    q: "How do I pay an employee?",
    a: "Go to the Payroll Dashboard, find the employee in the table, enter the exact amount that matches what was set when they were added, and click Pay. The contract verifies the amount against the stored commitment before releasing funds.",
  },
  {
    q: "What happens if I enter the wrong amount when paying?",
    a: "The transaction will fail. This is intentional — it ensures that only the exact, pre-committed amount can be released to prevent accidental or unauthorized payouts.",
  },
  {
    q: "How do I grant someone auditor access?",
    a: "Go to Settings (only the contract owner can do this), enter the auditor's wallet address, and click Grant access. They can then use the Auditor page to verify specific amounts you share with them off-chain.",
  },
];

export default function Help() {
  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            Documentation
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">
            Help &amp; FAQ
          </h1>
          <p className="text-ink/60 text-sm">
            Everything you need to know about running confidential payroll on
            arc-veil.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]"
            >
              <h3 className="font-display font-semibold text-lg mb-2">
                {faq.q}
              </h3>
              <p className="text-ink/70 text-sm leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-ink text-paper rounded-3xl p-8 mt-8 text-center"
        >
          <h3 className="font-display font-semibold text-lg mb-2">
            Still have questions?
          </h3>
          <p className="text-paper/70 text-sm mb-4">
            Check out the contract directly on Arc&apos;s block explorer.
          </p>
          
            href="https://testnet.arcscan.app/address/0xDecf2FE5cF876C2D5d046F15484cA05d87A6FF05"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald text-ink px-6 py-2.5 rounded-full font-medium text-sm hover:bg-gold transition-colors"
          >
            View on ArcScan
          </a>
        </motion.div>
      </div>
    </Sidebar>
  );
}
