"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletModal from "./WalletModal";

const links = [
  { href: "/dashboard", label: "Payroll Dashboard", desc: "Add employees, run payroll" },
  { href: "/vendors", label: "Vendor Settlement", desc: "Pay vendor invoices" },
  { href: "/analytics", label: "Analytics", desc: "Spend trends over time" },
  { href: "/auditor", label: "Auditor Access", desc: "Verify payroll amounts" },
  { href: "/employee", label: "Employee View", desc: "Your own records" },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink md:flex">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-5 border-b-2 border-ink/10">
        <Link href="/" className="font-display font-bold text-xl tracking-tight">
          arc<span className="text-emerald">-veil</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex items-center justify-center border-2 border-ink rounded-full"
        >
          <span className="text-sm">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile dropdown sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-b-2 border-ink/10"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    "rounded-2xl p-4 transition-colors " +
                    (pathname === link.href
                      ? "bg-ink text-paper"
                      : "bg-surface border-2 border-ink/10")
                  }
                >
                  <p className="font-display font-semibold text-sm">{link.label}</p>
                  <p
                    className={
                      "text-xs mt-0.5 " +
                      (pathname === link.href ? "text-paper/60" : "text-ink/50")
                    }
                  >
                    {link.desc}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 border-r-2 border-ink/10 flex-col justify-between min-h-screen sticky top-0">
        <div>
          <div className="px-6 py-6 border-b-2 border-ink/10">
            <Link href="/" className="font-display font-bold text-xl tracking-tight">
              arc<span className="text-emerald">-veil</span>
            </Link>
          </div>
          <nav className="p-4 flex flex-col gap-1.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "rounded-2xl p-3.5 transition-colors block " +
                  (pathname === link.href
                    ? "bg-ink text-paper"
                    : "hover:bg-emerald/10")
                }
              >
                <p className="font-display font-semibold text-sm">{link.label}</p>
                <p
                  className={
                    "text-xs mt-0.5 " +
                    (pathname === link.href ? "text-paper/60" : "text-ink/50")
                  }
                >
                  {link.desc}
                </p>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <div className="relative">
            {isConnected ? (
              <div className="bg-ink text-paper rounded-2xl px-4 py-3 font-mono text-xs">
                {address ? address.slice(0, 6) : ""}...{address ? address.slice(-4) : ""}
              </div>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="w-full bg-ink text-paper py-3 rounded-2xl font-medium text-sm border-2 border-ink hover:bg-transparent hover:text-ink transition-colors"
              >
                Connect Wallet
              </button>
            )}
            <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
          </div>
        </div>
      </aside>

      {/* Mobile wallet button (below top bar) */}
      <div className="md:hidden px-6 py-4 border-b-2 border-ink/10">
        <div className="relative">
          {isConnected ? (
            <div className="bg-ink text-paper rounded-full px-4 py-2 font-mono text-xs inline-block">
              {address ? address.slice(0, 6) : ""}...{address ? address.slice(-4) : ""}
            </div>
          ) : (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="bg-ink text-paper px-5 py-2 rounded-full font-medium text-sm border-2 border-ink"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
