"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { keccak256, encodePacked, parseUnits } from "viem";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";
import WalletModal from "../components/WalletModal";

export default function Auditor() {
  const { address, isConnected } = useAccount();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [secretPhrase, setSecretPhrase] = useState("");
  const [checkId, setCheckId] = useState<number | null>(null);
  const [checkAmount, setCheckAmount] = useState<bigint | null>(null);
  const [checkSecret, setCheckSecret] = useState<`0x${string}` | null>(null);

  const { data: isValid, isFetching } = useReadContract({
    address: PAYROLL_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: "verifyAmount",
    args: checkId !== null && checkAmount !== null && checkSecret !== null
      ? [BigInt(checkId), checkAmount, checkSecret]
      : undefined,
    query: {
      enabled: checkId !== null && checkAmount !== null && checkSecret !== null,
    },
  });

  function runVerify() {
    if (!employeeId || !amount || !secretPhrase) return;
    const secret = keccak256(encodePacked(["string"], [secretPhrase]));
    setCheckId(Number(employeeId));
    setCheckAmount(parseUnits(amount, 18));
    setCheckSecret(secret);
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <a href="/" className="font-display font-bold text-xl tracking-tight">
          arc<span className="text-emerald">-veil</span>
        </a>
        <div className="flex items-center gap-4 font-mono text-sm">
          <a href="/dashboard" className="text-ink/60 hover:text-emerald transition-colors">
            Dashboard
          </a>
          <a href="/analytics" className="text-ink/60 hover:text-emerald transition-colors">
            Analytics
          </a>
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

      <div className="max-w-2xl mx-auto px-8 pb-24 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="font-mono text-xs bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold">
            Auditor access
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">
            Verify a payroll amount
          </h1>
          <p className="text-ink/60 text-sm">
            Enter the employee ID, the claimed amount, and the secret phrase
            shared with you off-chain to verify it matches the on-chain
            commitment — without exposing it to anyone else.
          </p>
        </motion.div>

        {!isConnected && (
          <div className="bg-gold/10 border-2 border-gold rounded-2xl p-4 mb-8 font-mono text-sm">
            Connect your wallet to verify amounts (must be a granted auditor).
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]"
        >
          <div className="grid gap-4 mb-6">
            <div>
              <label className="font-mono text-xs text-ink/50 block mb-1">Employee ID</label>
              <input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none font-mono"
                placeholder="0"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-ink/50 block mb-1">Claimed amount (USDC)</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-ink/50 block mb-1">Secret phrase (shared off-chain)</label>
              <input
                value={secretPhrase}
                onChange={(e) => setSecretPhrase(e.target.value)}
                className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none font-mono"
                placeholder="shared secret"
              />
            </div>
          </div>

          <button
            onClick={runVerify}
            disabled={!isConnected}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium hover:bg-emerald transition-colors disabled:opacity-40"
          >
            Verify on-chain
          </button>

          {checkId !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                "mt-6 rounded-2xl p-4 font-mono text-sm border-2 " +
                (isFetching
                  ? "border-ink/20 bg-ink/5"
                  : isValid
                  ? "border-emerald bg-emerald/10 text-emerald-dark"
                  : "border-red-300 bg-red-50 text-red-600")
              }
            >
              {isFetching
                ? "Checking against on-chain commitment..."
                : isValid
                ? "✓ Verified — this amount matches the on-chain commitment."
                : "✗ Does not match — this amount or secret is incorrect."}
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
