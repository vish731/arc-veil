"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import { useAccount, useDisconnect } from "wagmi";
import WalletModal from "./components/WalletModal";
import ThemeToggle from "./components/ThemeToggle";

function RedactedAmount({ value, label }: { value: string; label: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      className="flex items-center justify-between py-3 border-b border-ink/10 cursor-pointer group"
    >
      <span className="font-mono text-sm text-ink/60 flex items-center gap-2">
        <span className="text-xs">{revealed ? "🔓" : "🔒"}</span>
        {label}
      </span>
      <motion.span className="font-mono text-base font-medium relative">
        {revealed ? (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-emerald"
          >
            {value}
          </motion.span>
        ) : (
          <motion.span
            className="inline-block w-24 h-4 bg-ink rounded-sm"
            whileHover={{ scaleX: 0.95 }}
          />
        )}
      </motion.span>
    </div>
  );
}

function Counter({ from, to, prefix = "", suffix = "" }: { from: number; to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (v) => setValue(v),
      });
      return () => controls.stop();
    }
  }, [isInView, from, to]);

  return (
    <div ref={ref} className="text-2xl font-semibold">
      {prefix}
      {value.toFixed(to % 1 !== 0 ? 1 : 0)}
      {suffix}
    </div>
  );
}

const navLinks = [
  { href: "/dashboard", label: "Payroll" },
  { href: "/vendors", label: "Vendors" },
  { href: "/analytics", label: "Analytics" },
  { href: "/auditor", label: "Auditor" },
  { href: "/employee", label: "My records" },
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-paper text-ink overflow-hidden">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-10">
        <div className="font-display font-bold text-xl tracking-tight">
          arc<span className="text-emerald">-veil</span>
        </div>

        <div className="hidden md:flex items-center gap-6 font-body text-sm">
          {navLinks.map((link) => (
            
              key={link.href}
              href={link.href}
              className="hover:text-emerald transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="relative">
            {isConnected ? (
              <button
                onClick={() => disconnect()}
                className="bg-emerald text-paper px-4 md:px-5 py-2 md:py-2.5 rounded-full font-medium text-xs md:text-sm border-2 border-emerald hover:bg-emerald-dark transition-colors font-mono"
              >
                {address ? address.slice(0, 6) : ""}...{address ? address.slice(-4) : ""}
              </button>
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
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-b-2 border-ink/10 relative z-10 max-w-7xl mx-auto"
          >
            <div className="px-8 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl p-3 bg-surface border-2 border-ink/10 font-mono text-sm hover:border-emerald transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative max-w-7xl mx-auto px-8 pt-16 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald/10 border border-emerald/30 rounded-full px-4 py-1.5 text-sm font-medium text-emerald-dark mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            Live on Arc Testnet
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6"
          >
            Payroll that stays{" "}
            <span className="relative inline-block">
              private
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                <motion.path
                  d="M0 4 Q 50 0, 100 4 T 200 4"
                  stroke="#F4B740"
                  strokeWidth="4"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </svg>
            </span>{" "}
            — until it needs to talk.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg text-ink/70 mb-8 max-w-md"
          >
            Pay salaries and vendors instantly in USDC on Arc. Amounts stay confidential onchain, and selectively auditable for whoever you grant access to.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 mb-12"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/dashboard"
              className="bg-emerald text-paper px-6 py-3 rounded-full font-medium border-2 border-emerald hover:bg-emerald-dark hover:border-emerald-dark transition-colors"
            >
              Run your first payroll
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/vendors"
              className="px-6 py-3 rounded-full font-medium border-2 border-ink hover:bg-ink hover:text-paper transition-colors"
            >
              View vendors
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-10 font-mono"
          >
            <div>
              <Counter from={0} to={2.4} prefix="$" suffix="M+" />
              <div className="text-xs text-ink/50 mt-1">Processed</div>
            </div>
            <div>
              <Counter from={0} to={120} suffix="+" />
              <div className="text-xs text-ink/50 mt-1">Companies</div>
            </div>
            <div>
              <Counter from={0} to={1.8} suffix="s" />
              <div className="text-xs text-ink/50 mt-1">Avg settlement</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="relative z-10 bg-surface border-2 border-ink rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)] transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-semibold">October Payroll</span>
            <span className="text-xs font-mono bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold">
              Hover to reveal
            </span>
          </div>
          <RedactedAmount label="Engineering Team" value="$84,200.00" />
          <RedactedAmount label="Design Team" value="$31,500.00" />
          <RedactedAmount label="Vendor — Cloud Infra" value="$12,900.00" />
          <RedactedAmount label="Vendor — Legal" value="$4,750.00" />
          <div className="flex items-center justify-between pt-4 mt-2">
            <span className="font-mono text-sm text-ink/60">Total (visible to auditor only)</span>
            <span className="font-mono font-semibold text-emerald">$133,350.00</span>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-24 border-t-2 border-ink/10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display font-bold text-3xl md:text-4xl mb-12 text-center"
        >
          Three steps. Zero exposure.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Fund in USDC", desc: "Deposit stablecoins into your company vault on Arc. Gas is paid in USDC too — no surprise costs." },
            { step: "02", title: "Run payroll", desc: "Add employees and vendors, set amounts, and settle instantly with deterministic finality." },
            { step: "03", title: "Reveal selectively", desc: "Grant a disclosure key to your auditor or tax authority. Everyone else sees nothing." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]"
            >
              <span className="font-mono text-sm text-emerald font-semibold">{item.step}</span>
              <h3 className="font-display font-semibold text-xl mt-3 mb-2">{item.title}</h3>
              <p className="text-ink/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-24 border-t-2 border-ink/10">
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-12 text-center">
          Explore the product
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { href: "/dashboard", title: "Payroll Dashboard", desc: "Add employees, run payroll, and settle instantly in USDC." },
            { href: "/vendors", title: "Vendor Settlement", desc: "Manage and pay vendor invoices on-chain, confidentially." },
            { href: "/analytics", title: "Analytics", desc: "Track payroll volume and spend trends over time." },
            { href: "/auditor", title: "Auditor Access", desc: "Verify specific payroll amounts with a shared secret." },
            { href: "/employee", title: "Employee View", desc: "Employees see only their own on-chain records." },
          ].map((item) => (
           <a 
              key={item.href}
              href={item.href}
              className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)] hover:-translate-y-1 transition-transform block"
            >
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-ink/60 text-sm leading-relaxed">{item.desc}</p>
              <span className="text-emerald text-sm font-mono mt-4 inline-block">Open &rarr;</span>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-ink text-paper rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-64 h-64 bg-emerald/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-gold/20 rounded-full blur-3xl"
          />
          <div className="relative">
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
              Ready to pay without exposing?
            </h2>
            <p className="text-paper/70 text-lg mb-8 max-w-xl mx-auto">
              Deploy your first confidential payroll run on Arc testnet in under five minutes.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/dashboard"
              className="inline-block bg-emerald text-ink px-8 py-4 rounded-full font-semibold border-2 border-emerald hover:bg-gold hover:border-gold transition-colors"
            >
              Launch app
            </motion.a>
          </div>
        </motion.div>
      </section>

      <footer className="max-w-7xl mx-auto px-8 py-10 flex items-center justify-between border-t-2 border-ink/10">
        <div className="font-display font-bold">
          arc<span className="text-emerald">-veil</span>
        </div>
        <p className="text-sm text-ink/50 font-mono">
          Built on Arc · Confidential by design
        </p>
      </footer>
    </main>
  );
}
