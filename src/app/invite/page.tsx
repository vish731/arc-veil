"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";

export default function Invite() {
  const { address } = useAccount();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const inviteLink = address
    ? "arc-veil.vercel.app/join?ref=" + address.slice(2, 10)
    : "arc-veil.vercel.app/join";

  function copyLink() {
    navigator.clipboard.writeText(inviteLink);
    showToast("Invite link copied.", "success");
  }

  function sendInvite() {
    if (!email) {
      showToast("Enter an email address.", "error");
      return;
    }
    showToast("Invite sent to " + email, "success");
    setEmail("");
  }

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold">
            Invite
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Invite your team</h1>
          <p className="text-ink/60 text-sm">
            Bring HR, finance, or auditors onto arc-veil.
          </p>
        </motion.div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)] mb-6">
          <label className="font-mono text-xs text-ink/50 block mb-1">Your invite link</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={inviteLink}
              className="flex-1 border-2 border-ink/20 rounded-xl px-3 py-2 text-sm font-mono bg-ink/5"
            />
            <button
              onClick={copyLink}
              className="px-5 py-2 rounded-xl border-2 border-ink text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]">
          <label className="font-mono text-xs text-ink/50 block mb-1">Invite by email</label>
          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none"
              placeholder="teammate@company.com"
            />
            <button
              onClick={sendInvite}
              className="px-5 py-2 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-emerald transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
