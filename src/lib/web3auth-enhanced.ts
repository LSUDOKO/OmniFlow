import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletConnectV2Adapter } from "@web3auth/wallet-connect-v2-adapter";
import { MetaMaskSDK } from "@metamask/sdk";

// Enhanced chain configurations with more networks
const chainConfigs = {
  ethereum: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
    displayName: "Ethereum Mainnet",
    blockExplorer: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  polygon: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x89",
    rpcTarget: "https://rpc.ankr.com/polygon",
    displayName: "Polygon Mainnet",
    blockExplorer: "https://polygonscan.com",
    ticker: "MATIC",
    tickerName: "Polygon",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  bsc: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x38",
    rpcTarget: "https://bsc-dataseed.binance.org/",
    displayName: "BNB Smart Chain",
    blockExplorer: "https://bscscan.com",
    ticker: "BNB",
    tickerName: "BNB",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  },
  solana: {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: "0x1",
    rpcTarget: "https://api.mainnet-beta.solana.com",
    displayName: "Solana Mainnet",
    blockExplorer: "https://explorer.solana.com",
    ticker: "SOL",
    tickerName: "Solana",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
};

export interface UserInfo {
  email?: string;
  name?: string;
  profileImage?: string;
  aggregateVerifier?: string;
  verifier?: string;
  verifierId?: string;
  typeOfLogin?: string;
  dappShare?: string;
  oAuthIdToken?: string;
  oAuthAccessToken?: string;
  appState?: string;
  touchIDPreference?: string;
  isMfaEnabled?: boolean;
}

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: string;
  network: string;
}

class EnhancedWeb3AuthService {
  private web3auth: Web3Auth | null = null;
  private provider: IProvider | null = null;
  private metamaskSDK: MetaMaskSDK | null = null;
  private currentChain: string = "ethereum";
  private isInitialized: boolean = false;

  async init(): Promise<Web3Auth> {
    if (this.isInitialized && this.web3auth) {
      return this.web3auth;
    }

    try {
      const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
      if (!clientId) {
        throw new Error("Web3Auth Client ID not found. Please set NEXT_PUBLIC_WEB3AUTH_CLIENT_ID in your environment variables.");
      }

      // Initialize MetaMask SDK for embedded wallet
      this.metamaskSDK = new MetaMaskSDK({
        dappMetadata: {
          name: "SolanaFlow - Universal Cross-Chain RWA Router",
          url: typeof window !== "undefined" ? window.location.origin : "https://omniflow.io",
          iconUrl: "https://omniflow.io/logo.svg",
        },
        infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
        // Enable embedded wallet features
        preferDesktop: false,
        openDeeplink: (link: string) => {
          // Custom deeplink handling for embedded wallet
          if (typeof window !== "undefined") {
            window.open(link, "_blank");
          }
        },
        useDeeplink: true,
        checkInstallationImmediately: false,
        i18nOptions: {
          enabled: true,
        },
      });

      // Initialize private key providers
      const ethereumProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig: chainConfigs.ethereum },
      });

      const solanaProvider = new SolanaPrivateKeyProvider({
        config: { chainConfig: chainConfigs.solana },
      });

      // Initialize Web3Auth with enhanced configuration
      this.web3auth = new Web3Auth({
        clientId,
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        chainConfig: chainConfigs.ethereum,
        privateKeyProvider: ethereumProvider,
        enableLogging: process.env.NODE_ENV === "development",
        uiConfig: {
          appName: "SolanaFlow",
          appUrl: typeof window !== "undefined" ? window.location.origin : "https://omniflow.io",
          logoLight: "https://omniflow.io/logo-light.svg",
          logoDark: "https://omniflow.io/logo-dark.svg",
          defaultLanguage: "en",
          mode: "dark",
          theme: {
            primary: "#8B5CF6",
          },
          loginMethodsOrder: ["google", "facebook", "twitter", "discord", "apple"],
          uxMode: "popup",
        },
      });

      // Configure MetaMask Adapter with embedded wallet support
      const metamaskAdapter = new MetamaskAdapter({
        clientId,
        sessionTime: 3600 * 24 * 7, // 7 days
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        chainConfig: chainConfigs.ethereum,
      });

      // Configure OpenLogin Adapter for seamless social logins
      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          // mfaLevel removed as not supported in this context
        },
        adapterSettings: {
          uxMode: "popup",
          whiteLabel: {
            appName: "SolanaFlow - Universal Cross-Chain RWA Router",
            appUrl: typeof window !== "undefined" ? window.location.origin : "https://omniflow.io",
            logoLight: "https://omniflow.io/logo-light.svg",
            logoDark: "https://omniflow.io/logo-dark.svg",
            defaultLanguage: "en",
            mode: "dark",
            theme: {
              primary: "#8B5CF6",
              onPrimary: "#ffffff",
            },
          },
          loginConfig: {
            // Enhanced social login configurations
            google: {
              verifier: "omniflow-google",
              typeOfLogin: "google",
              clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
            },
            facebook: {
              verifier: "omniflow-facebook", 
              typeOfLogin: "facebook",
              clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "",
            },
            twitter: {
              verifier: "omniflow-twitter",
              typeOfLogin: "twitter",
              clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || "",
            },
            discord: {
              verifier: "omniflow-discord",
              typeOfLogin: "discord",
              clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "",
            },
            apple: {
              verifier: "omniflow-apple",
              typeOfLogin: "apple",
              clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
            },
            // Email passwordless login
            email_passwordless: {
              verifier: "omniflow-email-passwordless",
              typeOfLogin: "email_password",
            },
            // SMS passwordless login
            sms_passwordless: {
              verifier: "omniflow-sms-passwordless", 
              typeOfLogin: "passwordless",
            },
          },
        },
      });

      // Configure WalletConnect V2 Adapter
      const walletConnectV2Adapter = new WalletConnectV2Adapter({
        adapterSettings: {
          qrcodeModal: null,
          walletConnectInitOptions: {
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
            metadata: {
              name: "SolanaFlow",
              description: "Universal Cross-Chain RWA + Identity Router",
              url: typeof window !== "undefined" ? window.location.origin : "https://omniflow.io",
              icons: ["https://omniflow.io/logo.svg"],
            },
          },
        },
        loginSettings: {
          // mfaLevel removed as not supported in ConnectParams
        },
        chainConfig: chainConfigs.ethereum,
      });

      // Configure adapters
      this.web3auth.configureAdapter(metamaskAdapter);
      this.web3auth.configureAdapter(openloginAdapter);
      this.web3auth.configureAdapter(walletConnectV2Adapter);

      // Initialize Web3Auth modal
      await this.web3auth.initModal();
      
      // Check if already connected and restore session
      if (this.web3auth.connected) {
        this.provider = this.web3auth.provider;
        console.log("✅ Web3Auth session restored");
      }

      this.isInitialized = true;
      console.log("✅ Enhanced Web3Auth initialized successfully");
      return this.web3auth;
    } catch (error) {
      console.error("❌ Error initializing Enhanced Web3Auth:", error);
      throw error;
    }
  }

  // Seamless login with auto-detection of best method
  async login(loginProvider?: string): Promise<IProvider> {
    if (!this.web3auth) {
      throw new Error("Web3Auth not initialized. Call init() first.");
    }

    try {
      console.log("🔐 Starting seamless login...");
      
      // If no provider specified, use social login with Google as default
      const provider = loginProvider || "google";
      
      const web3authProvider = await this.web3auth.connect();
      this.provider = web3authProvider;
      
      console.log("✅ Login successful");
      return web3authProvider;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  }

  // Enhanced logout with cleanup
  async logout(): Promise<void> {
    if (!this.web3auth) {
      throw new Error("Web3Auth not initialized");
    }

    try {
      await this.web3auth.logout();
      this.provider = null;
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      throw error;
    }
  }

  // Get comprehensive user information
  async getUserInfo(): Promise<UserInfo> {
    if (!this.web3auth) {
      throw new Error("Web3Auth not initialized");
    }

    try {
      const user = await this.web3auth.getUserInfo();
      return user as UserInfo;
    } catch (error) {
      console.error("❌ Error getting user info:", error);
      throw error;
    }
  }

  // Get wallet information with enhanced details
  async getWalletInfo(): Promise<WalletInfo> {
    if (!this.provider) {
      throw new Error("Provider not available");
    }

    try {
      const accounts = await this.provider.request({
        method: "eth_accounts",
      }) as string[];

      const balance = await this.provider.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      }) as string;

      const chainId = await this.provider.request({
        method: "eth_chainId",
      }) as string;

      return {
        address: accounts[0],
        balance,
        chainId,
        network: this.getNetworkName(chainId),
      };
    } catch (error) {
      console.error("❌ Error getting wallet info:", error);
      throw error;
    }
  }

  // Enhanced chain switching with validation
  async switchChain(chainKey: keyof typeof chainConfigs): Promise<void> {
    if (!this.provider) {
      throw new Error("Provider not available");
    }

    const chainConfig = chainConfigs[chainKey];
    if (!chainConfig) {
      throw new Error(`Unsupported chain: ${chainKey}`);
    }

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainConfig.chainId }],
      });
      this.currentChain = chainKey;
      console.log(`✅ Switched to ${chainConfig.displayName}`);
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        await this.addChain(chainKey);
      } else {
        console.error("❌ Error switching chain:", error);
        throw error;
      }
    }
  }

  // Add new chain to wallet
  async addChain(chainKey: keyof typeof chainConfigs): Promise<void> {
    if (!this.provider) {
      throw new Error("Provider not available");
    }

    const chainConfig = chainConfigs[chainKey];
    if (!chainConfig) {
      throw new Error(`Unsupported chain: ${chainKey}`);
    }

    try {
      await this.provider.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: chainConfig.chainId,
          chainName: chainConfig.displayName,
          nativeCurrency: {
            name: chainConfig.tickerName,
            symbol: chainConfig.ticker,
            decimals: 18,
          },
          rpcUrls: [chainConfig.rpcTarget],
          blockExplorerUrls: [chainConfig.blockExplorer],
        }],
      });
      this.currentChain = chainKey;
      console.log(`✅ Added and switched to ${chainConfig.displayName}`);
    } catch (error) {
      console.error("❌ Error adding chain:", error);
      throw error;
    }
  }

  // Get network name from chain ID
  private getNetworkName(chainId: string): string {
    const networks: Record<string, string> = {
      "0x1": "Ethereum",
      "0x89": "Polygon", 
      "0x38": "BSC",
      "0xa4b1": "Arbitrum",
      "0xa": "Optimism",
    };
    return networks[chainId] || "Unknown";
  }

  // Utility methods
  getProvider(): IProvider | null {
    return this.provider;
  }

  isConnected(): boolean {
    return this.web3auth?.connected || false;
  }

  getCurrentChain(): string {
    return this.currentChain;
  }

  getSupportedChains(): typeof chainConfigs {
    return chainConfigs;
  }

  getMetaMaskSDK(): MetaMaskSDK | null {
    return this.metamaskSDK;
  }
}

// Export singleton instance
export const enhancedWeb3AuthService = new EnhancedWeb3AuthService();

// Export types and configurations
export { chainConfigs };
export type { IProvider };
