'use client';

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../lib/theme";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import wallet components to prevent SSR issues
const WagmiProvider = dynamic(
  () => import('wagmi').then(mod => ({ default: mod.WagmiProvider })),
  { ssr: false }
);

const QueryClientProvider = dynamic(
  () => import('@tanstack/react-query').then(mod => ({ default: mod.QueryClientProvider })),
  { ssr: false }
);

const RainbowKitProvider = dynamic(
  () => import('@rainbow-me/rainbowkit').then(mod => ({ default: mod.RainbowKitProvider })),
  { ssr: false }
);

// Dynamic import for config to prevent server-side execution
const getWagmiConfig = dynamic(
  () => import('../lib/wagmi').then(mod => mod.config),
  { ssr: false }
);

import { QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function WalletProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Load wagmi config only on client side
    import('../lib/wagmi').then(({ config }) => {
      setConfig(config);
    });
  }, []);

  // Show loading state until wallet components are ready
  if (!mounted || !config) {
    return (
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  );
}
