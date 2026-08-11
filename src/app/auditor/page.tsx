"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useReadContract } from "wagmi";
import { keccak256, encodePacked, parseUnits } from "viem";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";
import Sidebar from "../components/Sidebar";

export default function Auditor() {
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
    args:
      checkId !== null && checkAmount !== null && checkSecret !== null
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
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold">
            Auditor access
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">
            Verify a payroll amount
          </h1>
          <p className="text-ink/60 text-sm">
            Enter the employee ID, the claimed amount, and the secret phrase
            shared with you off-chain to verify it matches the on-chain
            commitment.
          </p>
        </motion.div>

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
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium hover:bg-emerald transition-colors"
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
                ? "Verified: this amount matches the on-chain commitment."
                : "Does not match: this amount or secret is incorrect."}
            </motion.div>
          )}
        </motion.div>
      </div>
    </Sidebar>
  );
}
