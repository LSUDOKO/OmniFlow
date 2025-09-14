/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.unsplash.com',
      'api.omniflow.io',
      'ipfs.io',
      'gateway.pinata.cloud',
      'cloudflare-ipfs.com'
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Aggressive fix for WalletConnect SSR issues - completely exclude from server builds
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Disable all WalletConnect and browser-only modules
        'idb-keyval': false,
        '@walletconnect/keyvaluestorage': false,
        '@walletconnect/ethereum-provider': false,
        '@walletconnect/core': false,
        '@walletconnect/sign-client': false,
        '@walletconnect/universal-provider': false,
        '@rainbow-me/rainbowkit': false,
        'wagmi': false,
        '@tanstack/react-query': false,
      };
    }
    
    // Optimize bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          wallet: {
            test: /[\\/]node_modules[\\/](@walletconnect|@rainbow-me|wagmi|@tanstack\/react-query)[\\/]/,
            name: 'wallet',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    };
    
    return config;
  },
  env: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
