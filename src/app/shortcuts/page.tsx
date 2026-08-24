"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const shortcuts = [
  { keys: ["Ctrl", "K"], desc: "Open global search" },
  { keys: ["Esc"], desc: "Close any open modal" },
];

export default function Shortcuts() {
  return (
    <Sidebar>
      <div className="max-w-xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-ink/5 text-ink/70 px-3 py-1 rounded-full border border-ink/20">
            Productivity
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Keyboard shortcuts</h1>
          <p className="text-ink/60 text-sm">Move around arc-veil faster.</p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {shortcuts.map((s, i) => (
            <motion.div
              key={s.desc}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface border-2 border-ink rounded-2xl p-4 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(15,27,43,1)]"
            >
              <p className="text-sm">{s.desc}</p>
              <div className="flex gap-1">
                {s.keys.map((k) => (
                  <span
                    key={k}
                    className="font-mono text-xs bg-ink text-paper px-2 py-1 rounded-md"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
