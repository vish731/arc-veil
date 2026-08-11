"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletModal from "./WalletModal";

const links = [
  { href: "/dashboard", label: "Payroll" },
  { href: "/vendors", label: "Vendors" },
  { href: "/analytics", label: "Analytics" },
  { href: "/auditor", label: "Auditor" },
  { href: "/employee", label: "My records" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b-2 border-ink/10 mb-2">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight">
          arc<span className="text-emerald">-veil</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 font-mono text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "px-4 py-2 rounded-full transition-colors " +
                (pathname === link.href
                  ? "bg-ink text-paper"
                  : "text-ink/60 hover:text-emerald")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            {isConnected ? (
              <span className="bg-ink text-paper px-3 md:px-4 py-1.5 rounded-full font-mono text-xs md:text-sm">
                {address ? address.slice(0, 6) : ""}...{address ? address.slice(-4) : ""}
              </span>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="bg-ink text-paper px-4 md:px-5 py-2 md:py-2.5 rounded-full font-medium text-xs md:text-sm border-2 border-ink hover:bg-transparent hover:text-ink transition-colors"
              >
                Connect
              </button>
            )}
            <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center border-2 border-ink rounded-full"
            aria-label="Menu"
          >
            <span className="text-sm">{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t-2 border-ink/10"
          >
            <div className="px-6 py-4 flex flex-col gap-1 font-mono text-sm">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={
                    "px-4 py-3 rounded-xl transition-colors " +
                    (pathname === link.href
                      ? "bg-ink text-paper"
                      : "text-ink/60 hover:bg-emerald/10")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
