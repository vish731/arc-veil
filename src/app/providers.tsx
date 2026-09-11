"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../lib/wagmi";
import { ReactNode } from "react";
import { ToastProvider } from "./components/Toast";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
