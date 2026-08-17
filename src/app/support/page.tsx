"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";

export default function Support() {
  const { showToast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function submit() {
    if (!subject || !message) {
      showToast("Please fill in both fields.", "error");
      return;
    }
    showToast("Message sent. We'll get back to you soon.", "success");
    setSubject("");
    setMessage("");
  }

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            Support
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Contact support</h1>
          <p className="text-ink/60 text-sm">Have an issue or question? Send us a message.</p>
        </motion.div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="font-mono text-xs text-ink/50 block mb-1">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
                placeholder="Issue with payroll transaction"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-ink/50 block mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none resize-none"
                placeholder="Describe your issue..."
              />
            </div>
          </div>
          <button
            onClick={submit}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium text-sm hover:bg-emerald transition-colors"
          >
            Send message
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
