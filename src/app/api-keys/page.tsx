"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";

function generateKey() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "av_live_";
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

export default function ApiKeys() {
  const { showToast } = useToast();
  const [keys, setKeys] = useState<{ id: number; key: string; created: string }[]>([]);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  function createKey() {
    const newKey = { id: Date.now(), key: generateKey(), created: new Date().toLocaleDateString() };
    setKeys([newKey, ...keys]);
    showToast("New API key generated.", "success");
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    showToast("Copied to clipboard.", "success");
  }

  function revokeKey(id: number) {
    setKeys(keys.filter((k) => k.id !== id));
    showToast("API key revoked.", "info");
  }

  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs bg-ink/5 text-ink/70 px-3 py-1 rounded-full border border-ink/20">
              Developer
            </span>
            <h1 className="font-display font-bold text-3xl mt-4 mb-2">API keys</h1>
            <p className="text-ink/60 text-sm">Generate keys to integrate arc-veil with your own systems.</p>
          </div>
          <button
            onClick={createKey}
            className="bg-ink text-paper px-5 py-2.5 rounded-full font-medium text-sm hover:bg-emerald transition-colors"
          >
            + New key
          </button>
        </motion.div>

        {keys.length === 0 ? (
          <div className="bg-surface border-2 border-ink rounded-3xl p-8 text-center shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
            <p className="font-mono text-sm text-ink/50">No API keys yet. Generate one to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {keys.map((k) => (
              <div
                key={k.id}
                className="bg-surface border-2 border-ink rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(15,27,43,1)] flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm truncate">
                    {revealed[k.id] ? k.key : k.key.slice(0, 8) + "••••••••••••••••••••••••"}
                  </p>
                  <p className="text-xs text-ink/40 mt-1">Created {k.created}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setRevealed({ ...revealed, [k.id]: !revealed[k.id] })}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border-2 border-ink/20 hover:border-emerald transition-colors"
                  >
                    {revealed[k.id] ? "Hide" : "Reveal"}
                  </button>
                  <button
                    onClick={() => copyKey(k.key)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border-2 border-ink/20 hover:border-emerald transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => revokeKey(k.id)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
