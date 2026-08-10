"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { keccak256, encodePacked, parseUnits } from "viem";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";
import WalletModal from "../components/WalletModal";

type Invoice = {
  id: number;
  vendor: string;
  description: string;
  amount: string;
  status: "pending" | "paid";
};

const initialInvoices: Invoice[] = [
  { id: 1, vendor: "Cloud Infra Co", description: "Server hosting - October", amount: "12,900.00", status: "pending" },
  { id: 2, vendor: "Legal Partners LLP", description: "Contract review", amount: "4,750.00", status: "pending" },
];

export default function Vendors() {
  const { address, isConnected } = useAccount();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showForm, setShowForm] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  function addInvoice() {
    if (!vendorName || !description || !amount) return;
    setInvoices([
      ...invoices,
      {
        id: Date.now(),
        vendor: vendorName,
        description,
        amount,
        status: "pending",
      },
    ]);
    setVendorName("");
    setDescription("");
    setAmount("");
    setShowForm(false);
  }

  function payInvoice(id: number, invoiceAmount: string) {
    const secret = keccak256(encodePacked(["string"], ["vendor-" + id]));
    const amountWei = parseUnits(invoiceAmount.replace(/,/g, ""), 18);

    writeContract({
      address: PAYROLL_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: "payEmployee",
      args: [BigInt(0), amountWei, secret],
    });

    setInvoices(
      invoices.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <a href="/" className="font-display font-bold text-xl tracking-tight">
          arc<span className="text-emerald">-veil</span>
        </a>
        <div className="flex items-center gap-4 font-mono text-sm">
          <a href="/dashboard" className="text-ink/60 hover:text-emerald transition-colors">Payroll</a>
          <a href="/analytics" className="text-ink/60 hover:text-emerald transition-colors">Analytics</a>
          <a href="/auditor" className="text-ink/60 hover:text-emerald transition-colors">Auditor</a>
          <div className="relative">
            {isConnected ? (
              <span className="bg-ink text-paper px-4 py-1.5 rounded-full">
                {address ? address.slice(0, 6) : ""}...{address ? address.slice(-4) : ""}
              </span>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="bg-ink text-paper px-5 py-2.5 rounded-full font-medium border-2 border-ink hover:bg-transparent hover:text-ink transition-colors"
              >
                Connect Wallet
              </button>
            )}
            <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 pb-24">
        <div className="flex items-center justify-between mb-8 pt-4">
          <div>
            <span className="font-mono text-xs bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold">
              Vendor settlement
            </span>
            <h1 className="font-display font-bold text-3xl mt-3">Vendor invoices</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 rounded-full font-medium text-sm border-2 border-ink hover:bg-ink hover:text-paper transition-colors"
          >
            + New invoice
          </button>
        </div>

        {!isConnected && (
          <div className="bg-gold/10 border-2 border-gold rounded-2xl p-4 mb-8 font-mono text-sm">
            Connect your wallet to settle vendor invoices on-chain.
          </div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-surface border-2 border-ink rounded-3xl p-6 grid md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="font-mono text-xs text-ink/50 block mb-1">Vendor name</label>
                  <input
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                    placeholder="Acme Supplies"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-ink/50 block mb-1">Description</label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                    placeholder="Office supplies - Q4"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-ink/50 block mb-1">Amount (USDC)</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                    placeholder="2500"
                  />
                </div>
                <button
                  onClick={addInvoice}
                  className="bg-ink text-paper px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald transition-colors"
                >
                  Add invoice
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {txHash && (
          <div className="bg-emerald/10 border-2 border-emerald/30 rounded-2xl p-4 mb-6 font-mono text-xs break-all">
            {isConfirming ? "Confirming transaction..." : "Confirmed: "}
            <a
              href={"https://testnet.arcscan.app/tx/" + txHash}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald hover:underline"
            >
              {txHash}
            </a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {invoices.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)] flex items-center justify-between"
            >
              <div>
                <p className="font-display font-semibold">{inv.vendor}</p>
                <p className="text-sm text-ink/60">{inv.description}</p>
                <p className="font-mono text-sm mt-1 text-emerald">${inv.amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={
                    inv.status === "paid"
                      ? "text-xs font-mono px-3 py-1 rounded-full border bg-emerald/10 text-emerald-dark border-emerald/30"
                      : "text-xs font-mono px-3 py-1 rounded-full border bg-gold/10 text-ink border-gold/40"
                  }
                >
                  {inv.status}
                </span>
                {inv.status === "pending" && (
                  <button
                    onClick={() => payInvoice(inv.id, inv.amount)}
                    disabled={!isConnected || isPending || isConfirming}
                    className="bg-emerald text-paper px-4 py-2 rounded-xl text-xs font-medium hover:bg-emerald-dark transition-colors disabled:opacity-40"
                  >
                    Settle now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
