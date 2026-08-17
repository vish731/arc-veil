"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useBalance } from "wagmi";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";
import { PAYROLL_ADDRESS } from "../../lib/contract";

export default function Profile() {
  const { address, isConnected } = useAccount();
  const { showToast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const { data: contractBalance } = useBalance({
    address: PAYROLL_ADDRESS,
  });

  const { data: walletBalance } = useBalance({
    address: address,
  });

  function saveProfile() {
    if (!companyName) {
      showToast("Company name is required.", "error");
      return;
    }
    localStorage.setItem("arc-veil-company", JSON.stringify({ companyName, companyEmail }));
    setSaved(true);
    showToast("Company profile saved.", "success");
  }

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            Company profile
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Your vault</h1>
          <p className="text-ink/60 text-sm">
            Manage your company details and view your treasury balance on Arc.
          </p>
        </motion.div>

        {!isConnected && (
          <div className="bg-gold/10 border-2 border-gold rounded-2xl p-4 mb-6 font-mono text-sm">
            Connect your wallet to view balances.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]">
            <p className="font-mono text-xs text-ink/50 mb-1">Your wallet balance</p>
            <p className="font-display font-bold text-2xl">
              {walletBalance
                ? Number(walletBalance.formatted).toFixed(4) + " " + walletBalance.symbol
                : "—"}
            </p>
          </div>
          <div className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]">
            <p className="font-mono text-xs text-ink/50 mb-1">Payroll contract balance</p>
            <p className="font-display font-bold text-2xl">
              {contractBalance
                ? Number(contractBalance.formatted).toFixed(4) + " " + contractBalance.symbol
                : "—"}
            </p>
          </div>
        </div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
          <h2 className="font-display font-semibold text-lg mb-6">Company details</h2>
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="font-mono text-xs text-ink/50 block mb-1">Company name</label>
              <input
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  setSaved(false);
                }}
                className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className="font-mono text-xs text-ink/50 block mb-1">Contact email</label>
              <input
                value={companyEmail}
                onChange={(e) => {
                  setCompanyEmail(e.target.value);
                  setSaved(false);
                }}
                className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                placeholder="finance@acme.com"
              />
            </div>
          </div>
          <button
            onClick={saveProfile}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium text-sm hover:bg-emerald transition-colors"
          >
            {saved ? "Saved ✓" : "Save profile"}
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
