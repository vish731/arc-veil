"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { keccak256, encodePacked, parseUnits, formatUnits } from "viem";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";
import WalletModal from "../components/WalletModal";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [payAmount, setPayAmount] = useState<Record<number, string>>({});

  const { data: employeeCount, refetch: refetchCount } = useReadContract({
    address: PAYROLL_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: "employeeCount",
  });

  const count = employeeCount !== undefined ? Number(employeeCount) : 0;

  const employeeContracts = Array.from({ length: count }, (_, i) => ({
    address: PAYROLL_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: "employees" as const,
    args: [BigInt(i)] as const,
  }));

  const { data: employeesData, refetch: refetchEmployees } = useReadContracts({
    contracts: employeeContracts,
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess) {
      refetchCount();
      refetchEmployees();
    }
  }, [isSuccess, refetchCount, refetchEmployees]);

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

  function payEmployee(id: number) {
    const amt = payAmount[id];
    if (!amt) return;

    const secret = keccak256(encodePacked(["string"], [amt + "-secret-" + id]));
    const amountWei = parseUnits(amt, 18);

    writeContract({
      address: PAYROLL_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: "payEmployee",
      args: [BigInt(id), amountWei, secret],
    });
  }

  const contractShort = PAYROLL_ADDRESS.slice(0, 10) + "..." + PAYROLL_ADDRESS.slice(-8);
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
                {address ? address.slice(0, 6) : ""}...{address ? address.slice(-4) : ""}
              </span>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="bg-ink text-paper px-5 py-2.5 rounded-full font-medium text-sm border-2 border-ink hover:bg-transparent hover:text-ink transition-colors"
              >
                Connect Wallet
              </button>
            )}
            <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
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
            <p className="font-mono text-xs text-ink/50 mb-1">Total employees (on-chain)</p>
            <p className="font-display font-bold text-3xl">{count}</p>
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
            <p className="font-display font-bold text-3xl text-emerald">Arc Testnet</p>
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
                  <label className="font-mono text-xs text-ink/50 block mb-1">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-ink/50 block mb-1">Wallet address</label>
                  <input
                    value={walletAddr}
                    onChange={(e) => setWalletAddr(e.target.value)}
                    className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none font-mono"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-ink/50 block mb-1">Amount (USDC)</label>
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

        {count === 0 ? (
          <div className="bg-surface border-2 border-ink rounded-3xl p-8 text-center shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
            <p className="font-mono text-sm text-ink/50">
              No employees on-chain yet. Add your first employee above.
            </p>
          </div>
        ) : (
          <div className="bg-surface border-2 border-ink rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-ink/10 text-left">
                  <th className="font-mono text-xs text-ink/50 font-normal px-6 py-4">ID</th>
                  <th className="font-mono text-xs text-ink/50 font-normal px-6 py-4">Wallet</th>
                  <th className="font-mono text-xs text-ink/50 font-normal px-6 py-4">Status</th>
                  <th className="font-mono text-xs text-ink/50 font-normal px-6 py-4">Pay (USDC)</th>
                </tr>
              </thead>
              <tbody>
                {employeesData?.map((emp, i) => {
                  const result = emp.result as
                    | readonly [string, `0x${string}`, boolean]
                    | undefined;
                  if (!result) return null;
                  const [wallet, , active] = result;
                  return (
                    <tr key={i} className="border-b border-ink/5 last:border-0">
                      <td className="px-6 py-4 font-mono text-sm">{i}</td>
                      <td className="px-6 py-4 font-mono text-sm">
                        {wallet.slice(0, 8)}...{wallet.slice(-6)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            active
                              ? "text-xs font-mono px-3 py-1 rounded-full border bg-emerald/10 text-emerald-dark border-emerald/30"
                              : "text-xs font-mono px-3 py-1 rounded-full border bg-ink/5 text-ink/40 border-ink/10"
                          }
                        >
                          {active ? "active" : "inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <input
                            value={payAmount[i] ?? ""}
                            onChange={(e) =>
                              setPayAmount({ ...payAmount, [i]: e.target.value })
                            }
                            placeholder="amount"
                            className="w-24 border-2 border-ink/20 rounded-lg px-2 py-1 text-xs focus:border-emerald outline-none font-mono"
                          />
                          <button
                            onClick={() => payEmployee(i)}
                            disabled={!isConnected || isPending || isConfirming}
                            className="bg-emerald text-paper px-3 py-1 rounded-lg text-xs font-medium hover:bg-emerald-dark transition-colors disabled:opacity-40"
                          >
                            Pay
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
