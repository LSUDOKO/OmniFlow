# OmniFlow - Cross-Chain RWA Marketplace

![OmniFlow Logo](https://via.placeholder.com/800x200/6366f1/ffffff?text=OmniFlow+RWA+Marketplace)

## 🌟 Overview

**OmniFlow** is a production-ready cross-chain marketplace for Real World Assets (RWA) that enables users to tokenize, buy, sell, and fractionalize real-world assets across multiple blockchain networks. Built with institutional-grade security and compliance features.

### 🎯 Key Features

- **Cross-Chain Compatibility**: Ethereum, Polygon, BSC, OneChain, and SUI support
- **Multi-Asset Support**: Real estate, carbon credits, precious metals, commodities, and more
- **Fractional Ownership**: Split high-value assets into affordable fractions
- **Advanced Marketplace**: Fixed price sales, auctions, and fractional trading
- **Compliance Ready**: Built-in KYC/AML compliance and regulatory frameworks
- **Upgradeable Contracts**: UUPS proxy pattern for future enhancements
- **Multi-Wallet Support**: MetaMask, WalletConnect, OneChain wallet integration

## 🏗️ Architecture

### Smart Contracts

```
contracts/
├── core/
│   └── RWARegistry.sol          # Central asset registry
├── tokens/
│   ├── RWAToken.sol             # ERC721 RWA NFTs
│   └── RWAFractional.sol        # ERC20 fractional tokens
├── bridge/
│   └── CrossChainBridge.sol     # Cross-chain asset transfers
├── marketplace/
│   └── RWAMarketplace.sol       # Trading marketplace
└── interfaces/
    └── IRWARegistry.sol         # Registry interface
```

### Frontend

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── marketplace/
│   │   └── page.tsx             # Marketplace interface
│   ├── layout.tsx               # Root layout
│   └── providers.tsx            # Web3 providers
└── config/
    └── contracts-*.json         # Contract configurations
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/omniflow/rwa-marketplace.git
cd rwa-marketplace
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Compile contracts**
```bash
npm run compile
```

5. **Deploy contracts**
```bash
# Deploy to OneChain Testnet
npm run deploy:onechain

# Deploy to other networks
npm run deploy:ethereum
npm run deploy:polygon
npm run deploy:bsc
```

6. **Start the frontend**
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🔧 Configuration

### Environment Variables

```env
# Deployment
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_api_key

# OneChain Configuration
ONECHAIN_RPC_TESTNET=https://rpc-testnet.onelabs.cc:443
ONECHAIN_RPC_MAINNET=https://rpc.mainnet.onelabs.cc:443

# Frontend
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Supported Networks

| Network | Chain ID | RPC Endpoint | Native Token |
|---------|----------|--------------|--------------|
| Ethereum | 1 | Infura | ETH |
| Polygon | 137 | Infura | MATIC |
| BSC | 56 | Public RPC | BNB |
| OneChain Testnet | 1001 | https://rpc-testnet.onelabs.cc:443 | OCT |
| OneChain Mainnet | 1000 | https://rpc.mainnet.onelabs.cc:443 | OCT |

## 📋 Asset Types Supported

### 🏠 Real Estate
- Residential properties
- Commercial buildings
- Land parcels
- REITs

### 🌱 Carbon Credits
- Forest conservation
- Renewable energy certificates
- Carbon offset projects
- Environmental credits

### 💎 Precious Metals
- Gold reserves
- Silver holdings
- Platinum investments
- Rare metals

### ⚡ Commodities
- Oil and gas
- Agricultural products
- Industrial materials
- Energy resources

## 🔐 Security Features

### Smart Contract Security
- **Upgradeable Contracts**: UUPS proxy pattern
- **Access Control**: Role-based permissions
- **Reentrancy Protection**: OpenZeppelin guards
- **Pause Mechanism**: Emergency stop functionality

### Compliance Features
- **KYC Integration**: User verification system
- **AML Compliance**: Transaction monitoring
- **Regulatory Framework**: Configurable compliance levels
- **Audit Trail**: Complete transaction history

## 🌉 Cross-Chain Bridge

### Supported Operations
- NFT transfers between chains
- Fractional token bridging
- Asset metadata synchronization
- Cross-chain marketplace listings

### Bridge Process
1. Lock asset on source chain
2. Generate bridge transaction
3. Relayer validates and processes
4. Mint equivalent asset on target chain

## 🏪 Marketplace Features

### Trading Options
- **Fixed Price Sales**: Instant purchase
- **Auctions**: Time-based bidding
- **Fractional Trading**: Buy/sell fractions
- **Cross-Chain Listings**: Multi-network visibility

### Payment Methods
- Native tokens (ETH, MATIC, BNB, OCT)
- Stablecoins (USDC, USDT, DAI)
- Custom ERC20 tokens

## 🧪 Testing

### Run Tests
```bash
# Compile contracts
npm run compile

# Run all tests
npm test

# Run specific test file
npx hardhat test test/RWARegistry.test.js
```

### Test Coverage
- Unit tests for all contracts
- Integration tests for cross-chain functionality
- Frontend component tests
- End-to-end marketplace tests

## 📚 API Documentation

### Contract Interactions

#### Register Asset
```solidity
function registerAsset(
    AssetType assetType,
    address tokenContract,
    uint256 chainId,
    string memory metadataURI,
    uint256 totalValue,
    uint256 totalSupply,
    ComplianceLevel requiredCompliance
) external returns (uint256 assetId)
```

#### Mint RWA Token
```solidity
function mint(
    address to,
    uint256 assetId,
    string memory tokenURI
) external returns (uint256 tokenId)
```

#### Bridge Asset
```solidity
function bridgeNFT(
    address tokenContract,
    uint256 tokenId,
    address recipient,
    uint256 targetChainId
) external payable
```

## 🚀 Deployment Guide

### OneChain Deployment

1. **Get OCT tokens from faucet**
```bash
# Visit: https://faucet-testnet.onelabs.cc:443
```

2. **Deploy to OneChain Testnet**
```bash
npm run deploy:onechain
```

3. **Verify deployment**
```bash
# Check deployment file
cat deployments/1001.json
```

### Multi-Chain Deployment

```bash
# Deploy to all supported chains
npm run deploy:all

# Or deploy individually
npm run deploy:ethereum
npm run deploy:polygon
npm run deploy:bsc
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines
- Follow Solidity best practices
- Write comprehensive tests
- Document all functions
- Use consistent code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: https://omniflow.io
- **Documentation**: https://docs.omniflow.io
- **Discord**: https://discord.gg/omniflow
- **Twitter**: https://twitter.com/omniflow_rwa

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@omniflow.io

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core smart contracts
- ✅ Cross-chain bridge
- ✅ Basic marketplace
- ✅ OneChain integration

### Phase 2 (Q1 2024)
- 🔄 SUI blockchain integration
- 🔄 Advanced governance features
- 🔄 Institutional dashboard
- 🔄 Mobile application

### Phase 3 (Q2 2024)
- 📋 Additional asset types
- 📋 DeFi integrations
- 📋 Yield farming
- 📋 Insurance protocols

---

**Built with ❤️ by the OmniFlow Team**
