"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ThirdwebProvider } from "thirdweb/react";
import { ethereum, polygon, bsc } from "thirdweb/chains";
import { defineChain } from "thirdweb/chains";

// OneChain network configurations
const oneChainTestnet = defineChain({
  id: 1001,
  name: "OneChain Testnet",
  rpc: "https://rpc-testnet.onelabs.cc:443",
  nativeCurrency: {
    name: "OneChain Token",
    symbol: "OCT",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "OneChain Explorer",
      url: "https://explorer-testnet.onelabs.cc",
    },
  ],
  testnet: true,
});

const oneChainMainnet = defineChain({
  id: 1000,
  name: "OneChain Mainnet",
  rpc: "https://rpc.mainnet.onelabs.cc:443",
  nativeCurrency: {
    name: "OneChain Token",
    symbol: "OCT",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "OneChain Explorer",
      url: "https://explorer.mainnet.onelabs.cc",
    },
  ],
  testnet: false,
});

// Custom theme for OmniFlow
const theme = extendTheme({
  colors: {
    brand: {
      50: "#f0f4ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Badge: {
      baseStyle: {
        fontWeight: "semibold",
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </ThirdwebProvider>
  );
}
