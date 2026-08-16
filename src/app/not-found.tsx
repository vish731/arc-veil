"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <p className="font-mono text-emerald text-sm mb-4">404</p>
        <h1 className="font-display font-bold text-3xl mb-4">
          This page doesn&apos;t exist.
        </h1>
        <p className="text-ink/60 text-sm mb-8">
          The page you&apos;re looking for isn&apos;t part of arc-veil, or may
          have moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-ink text-paper px-6 py-3 rounded-full font-medium text-sm hover:bg-emerald transition-colors"
        >
          Back to home
        </Link>
      </motion.div>
    </main>
  );
}
