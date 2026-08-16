export default function Loading() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-ink/10 border-t-emerald rounded-full animate-spin" />
        <p className="font-mono text-sm text-ink/50">Loading arc-veil...</p>
      </div>
    </main>
  );
}
