"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { keccak256, encodePacked, parseUnits } from "viem";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";
import { TableSkeleton, CardSkeleton } from "../components/Skeleton";

export default function Dashboard() {
  const { isConnected } = useAccount();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [payAmount, setPayAmount] = useState<Record<number, string>>({});
  const [lastAction, setLastAction] = useState<"add" | "pay" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvQueue, setCsvQueue] = useState<{ name: string; wallet: string; amount: string }[]>([]);

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

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess) {
      refetchCount();
      refetchEmployees();
      if (lastAction === "add") {
        showToast("Employee added on-chain successfully!", "success");
      } else if (lastAction === "pay") {
        showToast("Payment confirmed on Arc testnet!", "success");
      }
      setLastAction(null);
    }
  }, [isSuccess, refetchCount, refetchEmployees, lastAction, showToast]);

  useEffect(() => {
    if (writeError) {
      showToast("Transaction failed. Please try again.", "error");
    }
  }, [writeError, showToast]);

  function addEmployee() {
    if (!name || !walletAddr || !amount) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    const secret = keccak256(encodePacked(["string"], [name]));
    const amountWei = parseUnits(amount, 18);
    const commitment = keccak256(
      encodePacked(["uint256", "bytes32"], [amountWei, secret])
    );

    setLastAction("add");
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
    if (!amt) {
      showToast("Enter an amount first.", "error");
      return;
    }

    const secret = keccak256(encodePacked(["string"], [amt + "-secret-" + id]));
    const amountWei = parseUnits(amt, 18);

    setLastAction("pay");
    writeContract({
      address: PAYROLL_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: "payEmployee",
      args: [BigInt(id), amountWei, secret],
    });
  }

  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.trim().split("\n");
      const parsed = lines
        .slice(lines[0].toLowerCase().includes("name") ? 1 : 0)
        .map((line) => {
          const [n, w, a] = line.split(",").map((s) => s.trim());
          return { name: n, wallet: w, amount: a };
        })
        .filter((row) => row.name && row.wallet && row.amount);

      if (parsed.length === 0) {
        showToast("No valid rows found. Format: name,wallet,amount", "error");
        return;
      }
      setCsvQueue(parsed);
      showToast(parsed.length + " employees ready to add.", "success");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function addNextFromQueue() {
    if (csvQueue.length === 0) return;
    const next = csvQueue[0];
    const secret = keccak256(encodePacked(["string"], [next.name]));
    const amountWei = parseUnits(next.amount, 18);
    const commitment = keccak256(
      encodePacked(["uint256", "bytes32"], [amountWei, secret])
    );

    setLastAction("add");
    writeContract({
      address: PAYROLL_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: "addEmployee",
      args: [next.wallet as `0x${string}`, commitment],
    });

    setCsvQueue((prev) => prev.slice(1));
  }

  const contractShort =
    PAYROLL_ADDRESS.slice(0, 10) + "..." + PAYROLL_ADDRESS.slice(-8);
  const explorerUrl = "https://testnet.arcscan.app/address/" + PAYROLL_ADDRESS;
  const txExplorerBase = "https://testnet.arcscan.app/tx/";

  const filteredEmployees = employeesData
    ?.map((emp, i) => {
      const result = emp.result as readonly [string, `0x${string}`, boolean] | undefined;
      if (!result) return null;
      const [wallet, , active] = result;
      return { id: i, wallet, active };
    })
    .filter((e) => e !== null)
    .filter((e) => e!.wallet.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((e) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return e!.active;
      return !e!.active;
    });

  const isLoading = employeeCount === undefined;

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        {!isConnected && (
          <div className="bg-gold/10 border-2 border-gold rounded-2xl p-4 mb-8 font-mono text-sm">
            Connect your wallet to add employees and run payroll on Arc testnet.
          </div>
        )}

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
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
        )}

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-display font-bold text-2xl">On-chain Employees</h1>
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!isConnected}
              className="px-5 py-2.5 rounded-full font-medium text-sm border-2 border-ink hover:bg-ink hover:text-paper transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Import CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
            />
            <button
              onClick={() => setShowForm(!showForm)}
              disabled={!isConnected}
              className="px-5 py-2.5 rounded-full font-medium text-sm border-2 border-ink hover:bg-ink hover:text-paper transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Add employee
            </button>
          </div>
        </div>

        {csvQueue.length > 0 && (
          <div className="bg-gold/10 border-2 border-gold rounded-2xl p-4 mb-6">
            <p className="font-mono text-sm mb-3">
              {csvQueue.length} employee(s) queued from CSV. Add them one at a
              time (each requires wallet confirmation).
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={addNextFromQueue}
                disabled={isPending || isConfirming}
                className="bg-ink text-paper px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald transition-colors disabled:opacity-50"
              >
                {isPending || isConfirming ? "Confirming..." : "Add next: " + csvQueue[0].name}
              </button>
              <button
                onClick={() => setCsvQueue([])}
                className="text-sm font-mono text-ink/50 hover:text-ink"
              >
                Clear queue
              </button>
            </div>
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

        {count > 0 && !isLoading && (
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by wallet address..."
              className="flex-1 border-2 border-ink/20 rounded-xl px-4 py-2.5 text-sm focus:border-emerald outline-none font-mono"
            />
            <div className="flex gap-2">
              {(["all", "active", "inactive"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={
                    "px-4 py-2 rounded-xl text-xs font-mono border-2 transition-colors capitalize " +
                    (statusFilter === f
                      ? "bg-ink text-paper border-ink"
                      : "border-ink/20 text-ink/60 hover:border-emerald")
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <TableSkeleton />
        ) : count === 0 ? (
          <div className="bg-surface border-2 border-ink rounded-3xl p-8 text-center shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
            <p className="font-mono text-sm text-ink/50">
              No employees on-chain yet. Add your first employee above.
            </p>
          </div>
        ) : filteredEmployees && filteredEmployees.length === 0 ? (
          <div className="bg-surface border-2 border-ink rounded-3xl p-8 text-center shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
            <p className="font-mono text-sm text-ink/50">
              No employees match your search or filter.
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
                {filteredEmployees?.map((e) => (
                  <tr key={e!.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-6 py-4 font-mono text-sm">{e!.id}</td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {e!.wallet.slice(0, 8)}...{e!.wallet.slice(-6)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          e!.active
                            ? "text-xs font-mono px-3 py-1 rounded-full border bg-emerald/10 text-emerald-dark border-emerald/30"
                            : "text-xs font-mono px-3 py-1 rounded-full border bg-ink/5 text-ink/40 border-ink/10"
                        }
                      >
                        {e!.active ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <input
                          value={payAmount[e!.id] ?? ""}
                          onChange={(ev) =>
                            setPayAmount({ ...payAmount, [e!.id]: ev.target.value })
                          }
                          placeholder="amount"
                          className="w-24 border-2 border-ink/20 rounded-lg px-2 py-1 text-xs focus:border-emerald outline-none font-mono"
                        />
                        <button
                          onClick={() => payEmployee(e!.id)}
                          disabled={!isConnected || isPending || isConfirming}
                          className="bg-emerald text-paper px-3 py-1 rounded-lg text-xs font-medium hover:bg-emerald-dark transition-colors disabled:opacity-40"
                        >
                          Pay
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
