"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";

const events = [
  "payroll.completed",
  "employee.added",
  "vendor.paid",
  "auditor.granted",
];

export default function Webhooks() {
  const { showToast } = useToast();
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [webhooks, setWebhooks] = useState<{ id: number; url: string; events: string[] }[]>([]);

  function toggleEvent(event: string) {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  }

  function addWebhook() {
    if (!url || selectedEvents.length === 0) {
      showToast("Enter a URL and select at least one event.", "error");
      return;
    }
    setWebhooks([...webhooks, { id: Date.now(), url, events: selectedEvents }]);
    setUrl("");
    setSelectedEvents([]);
    showToast("Webhook added.", "success");
  }

  function removeWebhook(id: number) {
    setWebhooks(webhooks.filter((w) => w.id !== id));
    showToast("Webhook removed.", "info");
  }

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-ink/5 text-ink/70 px-3 py-1 rounded-full border border-ink/20">
            Developer
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Webhooks</h1>
          <p className="text-ink/60 text-sm">Get notified in real time when payroll events happen.</p>
        </motion.div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)] mb-6">
          <label className="font-mono text-xs text-ink/50 block mb-1">Endpoint URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border-2 border-ink/20 rounded-xl px-3 py-2 text-sm focus:border-emerald outline-none font-mono mb-4"
            placeholder="https://your-app.com/webhook"
          />

          <label className="font-mono text-xs text-ink/50 block mb-2">Events</label>
          <div className="flex flex-wrap gap-2 mb-6">
            {events.map((event) => (
              <button
                key={event}
                onClick={() => toggleEvent(event)}
                className={
                  "px-3 py-1.5 rounded-full text-xs font-mono border-2 transition-colors " +
                  (selectedEvents.includes(event)
                    ? "bg-ink text-paper border-ink"
                    : "border-ink/20 text-ink/60 hover:border-emerald")
                }
              >
                {event}
              </button>
            ))}
          </div>

          <button
            onClick={addWebhook}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium text-sm hover:bg-emerald transition-colors"
          >
            Add webhook
          </button>
        </div>

        {webhooks.length > 0 && (
          <div className="flex flex-col gap-3">
            {webhooks.map((w) => (
              <div
                key={w.id}
                className="bg-surface border-2 border-ink rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm truncate">{w.url}</p>
                  <p className="text-xs text-ink/40 mt-1">{w.events.join(", ")}</p>
                </div>
                <button
                  onClick={() => removeWebhook(w.id)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
