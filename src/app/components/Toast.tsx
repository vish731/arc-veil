"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type Toast = { id: number; message: string; type: "success" | "error" | "info" };

const ToastContext = createContext<{
  showToast: (message: string, type?: Toast["type"]) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
            <AnimatePresence>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className={
                    "px-5 py-3 rounded-2xl font-mono text-sm shadow-[4px_4px_0px_0px_rgba(15,27,43,1)] border-2 border-ink max-w-xs " +
                    (toast.type === "success"
                      ? "bg-emerald text-paper"
                      : toast.type === "error"
                      ? "bg-red-500 text-white"
                      : "bg-surface text-ink")
                  }
                >
                  {toast.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
