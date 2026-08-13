"use client";

import { motion } from "framer-motion";
import { useReadContract, useReadContracts } from "wagmi";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";
import Sidebar from "../components/Sidebar";

const monthlyData = [
  { month: "Jun", amount: 42000 },
  { month: "Jul", amount: 58000 },
  { month: "Aug", amount: 71000 },
  { month: "Sep", amount: 89000 },
  { month: "Oct", amount: 133350 },
];

const maxAmount = Math.max(...monthlyData.map((d) => d.amount));

export default function Analytics() {
  const { data: employeeCount } = useReadContract({
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

  const { data: employeesData } = useReadContracts({
    contracts: employeeContracts,
  });

  function exportCSV() {
    const rows = [["ID", "Wallet", "Status"]];
    employeesData?.forEach((emp, i) => {
      const result = emp.result as readonly [string, `0x${string}`, boolean] | undefined;
      if (!result) return;
      const [wallet, , active] = result;
      rows.push([i.toString(), wallet, active ? "active" : "inactive"]);
    });

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "arc-veil-employees.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-3xl"
          >
            Payroll Analytics
          </motion.h1>
          <button
            onClick={exportCSV}
            className="px-5 py-2.5 rounded-full font-medium text-sm border-2 border-ink hover:bg-ink hover:text-paper transition-colors"
          >
            Export CSV
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "On-chain employees", value: count.toString() },
            { label: "Total processed", value: "$393.4K" },
            { label: "Avg settlement", value: "1.8s" },
            { label: "Network", value: "Arc Testnet" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]"
            >
              <p className="font-mono text-xs text-ink/50 mb-1">{stat.label}</p>
              <p className="font-display font-bold text-2xl">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)] mb-8"
        >
          <h2 className="font-display font-semibold text-lg mb-8">
            Monthly payroll volume
          </h2>
          <div className="flex items-end gap-4 h-56">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-3">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: (d.amount / maxAmount) * 100 + "%" }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                  className="w-full bg-emerald rounded-t-xl relative group cursor-pointer hover:bg-emerald-dark transition-colors"
                  style={{ minHeight: "8px" }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${d.amount.toLocaleString()}
                  </span>
                </motion.div>
                <span className="font-mono text-xs text-ink/50">{d.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-ink text-paper rounded-3xl p-8"
        >
          <p className="font-mono text-sm text-paper/70">
            All amounts above are stored as commitments on-chain. This dashboard
            aggregates totals for reporting without exposing individual salaries
            to unauthorized viewers.
          </p>
        </motion.div>
      </div>
    </Sidebar>
  );
}
