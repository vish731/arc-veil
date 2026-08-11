"use client";

import { motion } from "framer-motion";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { PAYROLL_ADDRESS, PAYROLL_ABI } from "../../lib/contract";
import Sidebar from "../components/Sidebar";

export default function EmployeeView() {
  const { address, isConnected } = useAccount();

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

  const myRecords = employeesData
    ?.map((emp, i) => {
      const result = emp.result as readonly [string, `0x${string}`, boolean] | undefined;
      if (!result) return null;
      const [wallet, , active] = result;
      return { id: i, wallet, active };
    })
    .filter((r) => r && address && r.wallet.toLowerCase() === address.toLowerCase());

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            Employee view
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">My records</h1>
          <p className="text-ink/60 text-sm">
            Connect your wallet to see only your own on-chain payroll records.
          </p>
        </motion.div>

        {!isConnected && (
          <div className="bg-gold/10 border-2 border-gold rounded-2xl p-4 mb-8 font-mono text-sm">
            Connect your wallet to view your records.
          </div>
        )}

        {isConnected && (
          <>
            {!myRecords || myRecords.length === 0 ? (
              <div className="bg-surface border-2 border-ink rounded-3xl p-8 text-center shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
                <p className="font-mono text-sm text-ink/50">
                  No records found for this wallet on arc-veil yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {myRecords.map(
                  (rec) =>
                    rec && (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)] flex items-center justify-between"
                      >
                        <div>
                          <p className="font-mono text-xs text-ink/50 mb-1">
                            Employee ID {rec.id}
                          </p>
                          <p className="font-mono text-sm">{rec.wallet}</p>
                        </div>
                        <span
                          className={
                            rec.active
                              ? "text-xs font-mono px-3 py-1 rounded-full border bg-emerald/10 text-emerald-dark border-emerald/30"
                              : "text-xs font-mono px-3 py-1 rounded-full border bg-ink/5 text-ink/40 border-ink/10"
                          }
                        >
                          {rec.active ? "active" : "inactive"}
                        </span>
                      </motion.div>
                    )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Sidebar>
  );
}
