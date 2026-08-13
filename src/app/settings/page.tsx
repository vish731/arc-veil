"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";

export default function Settings() {
  const { address, isConnected } = useAccount();
  const { showToast } = useToast();
  const [auditorAddr, setAuditorAddr] = useState("");
  const [checkAddr, setCheckAddr] = useState("");

  const { data: ownerAddr } = useReadContract({
    address: PAYROLL_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: "owner",
  });

  const isOwner =
    address && ownerAddr && address.toLowerCase() === (ownerAddr as string).toLowerCase();

  const { data: isAuditor, refetch: refetchAuditorStatus } = useReadContract({
    address: PAYROLL_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: "auditors",
    args: checkAddr ? [checkAddr as `0x${string}`] : undefined,
    query: { enabled: !!checkAddr },
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  function grant() {
    if (!auditorAddr) {
      showToast("Enter an address first.", "error");
      return;
    }
    writeContract({
      address: PAYROLL_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: "grantAuditor",
      args: [auditorAddr as `0x${string}`],
    });
  }

  function revoke() {
    if (!auditorAddr) {
      showToast("Enter an address first.", "error");
      return;
    }
    writeContract({
      address: PAYROLL_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: "revokeAuditor",
      args: [auditorAddr as `0x${string}`],
    });
  }

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold">
            Access control
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Manage auditors</h1>
          <p className="text-ink/60 text-sm">
            Grant or revoke auditor access on your Payroll contract. Only the
            contract owner can make these changes.
          </p>
        </motion.div>

        {!isConnected && (
          <div className="bg-gold/10 border-2 border-gold rounded-2xl p-4 mb-6 font-mono text-sm">
            Connect your wallet to manage auditor access.
          </div>
        )}

        {isConnected && !isOwner && (
          <div className="bg-gold/10 border-2 border-gold rounded-2xl p-4 mb-6 font-mono text-sm">
            Only the contract owner can grant or revoke auditors. You are not
            the owner of this contract.
          </div>
        )}

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)] mb-6">
          <label className="font-mono text-xs text-ink/50 block mb-1">Auditor wallet address</label>
          <input
            value={auditorAddr}
            onChange={(e) => setAuditorAddr(e.target.value)}
            className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none font-mono mb-4"
            placeholder="0x..."
          />
          <div className="flex gap-3">
            <button
              onClick={grant}
              disabled={!isOwner || isPending || isConfirming}
              className="flex-1 bg-emerald text-paper py-3 rounded-xl font-medium text-sm hover:bg-emerald-dark transition-colors disabled:opacity-40"
            >
              {isPending || isConfirming ? "Confirming..." : "Grant access"}
            </button>
            <button
              onClick={revoke}
              disabled={!isOwner || isPending || isConfirming}
              className="flex-1 border-2 border-ink py-3 rounded-xl font-medium text-sm hover:bg-ink hover:text-paper transition-colors disabled:opacity-40"
            >
              Revoke access
            </button>
          </div>
        </div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]">
          <label className="font-mono text-xs text-ink/50 block mb-1">Check auditor status</label>
          <div className="flex gap-2">
            <input
              value={checkAddr}
              onChange={(e) => setCheckAddr(e.target.value)}
              className="flex-1 border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none font-mono"
              placeholder="0x..."
            />
            <button
              onClick={() => refetchAuditorStatus()}
              className="px-5 py-2 rounded-xl border-2 border-ink text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
            >
              Check
            </button>
          </div>
          {checkAddr && isAuditor !== undefined && (
            <p
              className={
                "font-mono text-sm mt-4 " +
                (isAuditor ? "text-emerald" : "text-ink/50")
              }
            >
              {isAuditor ? "This address is a granted auditor." : "This address is not an auditor."}
            </p>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
