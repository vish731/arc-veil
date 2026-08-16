"use client";

import { motion } from "framer-motion";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 0.9, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      className={"bg-ink/10 rounded-xl " + className}
    />
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-surface border-2 border-ink rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,27,43,1)]">
      <div className="p-6 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface border-2 border-ink rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,27,43,1)]">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}
