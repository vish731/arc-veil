"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const searchablePages = [
  { href: "/dashboard", label: "Payroll Dashboard", keywords: "employees add pay" },
  { href: "/vendors", label: "Vendor Settlement", keywords: "invoices vendors pay" },
  { href: "/analytics", label: "Analytics", keywords: "charts stats reports" },
  { href: "/auditor", label: "Auditor Access", keywords: "verify amount secret" },
  { href: "/activity", label: "Activity Log", keywords: "history timeline" },
  { href: "/reports", label: "Reports", keywords: "csv export download" },
  { href: "/employee", label: "My Records", keywords: "employee own records" },
  { href: "/compliance", label: "Compliance", keywords: "audit kyc sanctions" },
  { href: "/integrations", label: "Integrations", keywords: "wallet connect slack" },
  { href: "/contracts", label: "Contracts", keywords: "smart contract address" },
  { href: "/settings", label: "Settings", keywords: "auditor grant revoke" },
  { href: "/billing", label: "Billing", keywords: "plans pricing upgrade" },
  { href: "/help", label: "Help & FAQ", keywords: "questions support docs" },
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = searchablePages.filter(
    (p) =>
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.keywords.toLowerCase().includes(query.toLowerCase())
  );

  function go(href: string) {
    router.push(href);
    setOpen(false);
    setQuery("");
  }

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-ink/20 text-xs font-mono text-ink/50 hover:border-emerald transition-colors"
      >
        Search
        <span className="bg-ink/10 px-1.5 py-0.5 rounded text-[10px]">⌘K</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[9998]"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-surface border-2 border-ink rounded-3xl w-full max-w-lg mx-4 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)] overflow-hidden"
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages..."
                className="w-full px-6 py-4 text-sm outline-none bg-transparent border-b-2 border-ink/10"
              />
              <div className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 ? (
                  <p className="text-center text-sm text-ink/40 py-6 font-mono">No results.</p>
                ) : (
                  results.map((r) => (
                    <button
                      key={r.href}
                      onClick={() => go(r.href)}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald/10 transition-colors text-sm font-medium"
                    >
                      {r.label}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
