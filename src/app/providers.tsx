"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../lib/theme";
import dynamic from 'next/dynamic';

// Completely client-only wallet wrapper - prevents any server-side wallet code execution
const ClientOnlyWalletWrapper = dynamic(() => import('./ClientOnlyWalletWrapper'), { 
  ssr: false,
  loading: () => <div style={{ visibility: 'hidden' }}>Loading...</div>
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <ClientOnlyWalletWrapper>
        {children}
      </ClientOnlyWalletWrapper>
    </ChakraProvider>
  );
}
