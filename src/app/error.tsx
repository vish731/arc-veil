"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-red-500 text-sm mb-4">Something broke</p>
        <h1 className="font-display font-bold text-2xl mb-4">
          An unexpected error occurred.
        </h1>
        <p className="text-ink/60 text-sm mb-8">
          Try again, or head back to the homepage if the issue persists.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-ink text-paper px-6 py-3 rounded-full font-medium text-sm hover:bg-emerald transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="border-2 border-ink px-6 py-3 rounded-full font-medium text-sm hover:bg-ink hover:text-paper transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
