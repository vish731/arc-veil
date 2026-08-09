"use client";

import { useConnect } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function WalletModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { connectors, connect } = useConnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-ink/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="fixed top-24 right-8 z-[9999] bg-surface border-2 border-ink rounded-2xl p-3 w-72 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)] max-h-[70vh] overflow-y-auto"
          >
            <p className="font-mono text-[11px] text-ink/50 px-2 pb-2 pt-1 uppercase tracking-wide">
              Connect a wallet
            </p>

            <div className="flex flex-col gap-1.5">
              {connectors.length === 0 && (
                <p className="text-sm text-ink/60 font-mono px-2 py-3">
                  No wallet extensions detected.
                </p>
              )}
              {connectors
                .filter((c) => c.name !== "Injected")
                .map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => {
                      connect({ connector });
                      onClose();
                    }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-emerald/10 transition-colors text-left group"
                  >
                    <span className="w-7 h-7 flex items-center justify-center rounded-lg overflow-hidden bg-paper border border-ink/10 shrink-0">
                      {connector.icon ? (
                        <Image
                          src={connector.icon}
                          alt={connector.name}
                          width={20}
                          height={20}
                        />
                      ) : (
                        <span className="text-sm">🔗</span>
                      )}
                    </span>
                    <span className="font-medium text-sm flex-1">{connector.name}</span>
                    <span className="text-ink/30 group-hover:text-emerald text-sm transition-colors">→</span>
                  </button>
                ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
