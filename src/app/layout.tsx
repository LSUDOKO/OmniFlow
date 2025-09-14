import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";
import { WalletProvider } from "@/contexts/WalletContext";
import { Web3OnboardingProvider } from "@/contexts/Web3OnboardingContext";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: "SolanaFlow - Universal Cross-Chain RWA + Identity Router",
  description: "Production-ready universal cross-chain platform for Real World Assets tokenization with integrated decentralized identity, AI-powered due diligence, gamification, and comprehensive compliance.",
  keywords: "RWA, Real World Assets, Cross-chain, Web3Auth, MetaMask, Identity NFT, DeFi, Tokenization, Marketplace, Gamification, AI Due Diligence",
  authors: [{ name: "SolanaFlow Team" }],
  openGraph: {
    title: "SolanaFlow - Universal Cross-Chain RWA + Identity Router",
    description: "Create seedless wallets with email/social login and access the complete RWA ecosystem",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <WalletProvider>
          <Web3OnboardingProvider>
            <Providers>{children}</Providers>
          </Web3OnboardingProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
