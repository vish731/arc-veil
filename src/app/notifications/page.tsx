"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";

export default function Notifications() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    payrollRuns: true,
    newEmployees: true,
    vendorInvoices: false,
    auditorActivity: true,
  });

  function toggle(key: keyof typeof settings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function save() {
    localStorage.setItem("arc-veil-notifications", JSON.stringify(settings));
    showToast("Notification preferences saved.", "success");
  }

  const labels: Record<keyof typeof settings, string> = {
    payrollRuns: "Payroll run completions",
    newEmployees: "New employees added",
    vendorInvoices: "Vendor invoice settlements",
    auditorActivity: "Auditor access changes",
  };

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs bg-emerald/10 text-emerald-dark px-3 py-1 rounded-full border border-emerald/30">
            Preferences
          </span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">Notifications</h1>
          <p className="text-ink/60 text-sm">Choose what you want to be notified about.</p>
        </motion.div>

        <div className="bg-surface border-2 border-ink rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
          <div className="flex flex-col gap-4 mb-6">
            {(Object.keys(settings) as Array<keyof typeof settings>).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <p className="text-sm font-medium">{labels[key]}</p>
                <button
                  onClick={() => toggle(key)}
                  className={
                    "w-12 h-7 rounded-full border-2 border-ink relative transition-colors " +
                    (settings[key] ? "bg-emerald" : "bg-surface")
                  }
                >
                  <span
                    className={
                      "absolute top-0.5 w-4.5 h-4.5 rounded-full bg-ink transition-transform " +
                      (settings[key] ? "translate-x-6" : "translate-x-0.5")
                    }
                    style={{ width: "18px", height: "18px" }}
                  />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={save}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium text-sm hover:bg-emerald transition-colors"
          >
            Save preferences
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
