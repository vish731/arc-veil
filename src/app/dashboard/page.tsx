"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { keccak256, encodePacked, parseUnits } from "viem";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";
import WalletModal from "../components/WalletModal";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [amount, setAmount] = useState("");

  const { data: employeeCount, refetch: refetchCount } = useReadContract({
    address: PAYROLL_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: "employeeCount",
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess) refetchCount();
  }, [isSuccess, refetchCount]);

  function addEmployee() {
    if (!name || !walletAddr || !amount) return;

    const secret = keccak256(encodePacked(["string"], [name]));
    const amountWei = parseUnits(amount, 18);
    const commitment = keccak256(
      encodePacked(["uint256", "bytes32"], [amountWei, secret])
    );

    writeContract({
      address: PAYROLL_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: "addEmployee",
      args: [walletAddr as `0x${string}`, commitment],
    });

    setName("");
    setWalletAddr("");
    setAmount("");
    setShowForm(false);
  }

  const contractShort =
    PAYROLL_ADDRESS.slice(0, 10) + "..." + PAYROLL_ADDRESS.slice(-8);
  const explorerUrl = "https://testnet.arcscan.app/address/" + PAYROLL_ADDRESS;
  const txExplorerBase = "https://testnet.arcscan.app/tx/";

  return (
    <main className="min-h-screen bg-paper text-ink">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <a href="/" className="font-display font-bold text-xl tracking-tight">
          arc<span className="text-emerald">-veil</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm bg-emerald/10 text-emerald-dark px-4 py-1.5 rounded-full border border-emerald/30">
            HR Dashboard
          </span>
          <div className="relative">
            {isConnected ? (
              <span className="font-mono text-sm bg-ink text-paper px-4 py-1.5 rounded-full">
                {address ? address.slice(0, 6) : ""}...
                {address ? address.slice(-4) : ""}
              </span>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="bg-ink text-paper px-5 py-2.5 rounded-full font-medium text-sm border-2 border-ink hover:bg-transparent hover:text-ink transition-colors"
              >
                Connect Wallet
              </button>
            )}
            <WalletModal
              open={walletModalOpen}
              onClose={() => setWalletModalOpen(false)}
            />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 pb-24">
        {!isConnected && (
          <div className="bg-gold/10 border-2 border-gold rounded-2xl p-4 mb-8 font-mono text-sm">
            Connect your wallet to add employees and run payroll on Arc testnet.
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]">
            <p className="font-mono text-xs text-ink/50 mb-1">
              Total employees (on-chain)
            </p>
            <p className="font-display font-bold text-3xl">
              {employeeCount !== undefined ? Number(employeeCount) : "-"}
            </p>
          </div>

          <div className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]">
            <p className="font-mono text-xs text-ink/50 mb-1">Contract</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-emerald hover:underline break-all"
            >
              {contractShort}
            </a>
          </div>

          <div className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]">
            <p className="font-mono text-xs text-ink/50 mb-1">Network</p>
            <p className="font-display font-bold text-3xl text-emerald">
              Arc Testnet
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl">On-chain Employees</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!isConnected}
            className="px-5 py-2.5 rounded-full font-medium text-sm border-2 border-ink hover:bg-ink hover:text-paper transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Add employee
          </button>
        </div>

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
                  <label className="font-mono text-xs text-ink/50 block mb-1">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-ink/50 block mb-1">
                    Wallet address
                  </label>
                  <input
                    value={walletAddr}
                    onChange={(e) => setWalletAddr(e.target.value)}
                    className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none font-mono"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-ink/50 block mb-1">
                    Amount (USDC)
                  </label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                    placeholder="5000"
                  />
                </div>
                <button
                  onClick={addEmployee}
                  disabled={isPending || isConfirming}
                  className="bg-ink text-paper px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald transition-colors disabled:opacity-50"
                >
                  {isPending || isConfirming ? "Confirming..." : "Add on-chain"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {txHash && (
          <div className="bg-emerald/10 border-2 border-emerald/30 rounded-2xl p-4 mb-6 font-mono text-xs break-all">
            {isConfirming ? "Confirming transaction..." : "Confirmed: "}
            <a
              href={txExplorerBase + txHash}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald hover:underline"
            >
              {txHash}
            </a>
          </div>
        )}

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 text-center shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
          <p className="font-mono text-sm text-ink/50">
            Employee
            <p className="font-mono text-sm text-ink/50">
            Employee amounts are stored as commitments on-chain. The hover-to-reveal
            UI connects once amounts are read back from your saved records.
          </p>
        </div>
      </div>
    </main>
  );
}
