"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletModal from "./WalletModal";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/dashboard", label: "Payroll" },
  { href: "/vendors", label: "Vendors" },
  { href: "/analytics", label: "Analytics" },
  { href: "/auditor", label: "Auditor" },
  { href: "/activity", label: "Activity" },
  { href: "/reports", label: "Reports" },
  { href: "/employee", label: "My records" },
  { href: "/compliance", label: "Compliance" },
  { href: "/integrations", label: "Integrations" },
  { href: "/api-keys", label: "API keys" },
  { href: "/notifications", label: "Notifications" },
  { href: "/billing", label: "Billing" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/team", label: "Team" },
  { href: "/help", label: "Help" },
];
export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b-2 border-ink/10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display font-bold text-xl tracking-tight">
            arc<span className="text-emerald">-veil</span>
          </Link>
          <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-xs text-ink/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            Arc Testnet
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1 font-mono text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "px-3 py-2 rounded-full transition-colors " +
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
          <ThemeToggle />
          <div className="relative">
            {isConnected ? (
              <div className="bg-ink text-paper rounded-full px-4 py-2 font-mono text-xs">
                {address ? address.slice(0, 6) : ""}...{address ? address.slice(-4) : ""}
              </div>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="bg-ink text-paper px-4 md:px-5 py-2 rounded-full font-medium text-xs md:text-sm border-2 border-ink hover:bg-transparent hover:text-ink transition-colors"
              >
                Connect
              </button>
            )}
            <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center border-2 border-ink rounded-full"
            aria-label="Menu"
          >
            <span className="text-sm">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
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
                  onClick={() => setMenuOpen(false)}
                  className={
                    "rounded-2xl p-4 transition-colors " +
                    (pathname === link.href
                      ? "bg-ink text-paper"
                      : "bg-surface border-2 border-ink/10")
                  }
                >
                  <p className="font-display font-semibold text-sm">{link.label}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>{children}</main>
    </div>
  );
}
