const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Solana RWA Bridge System...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get network configuration
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId);

  // Deploy RWA Registry first (if not already deployed)
  let rwaRegistryAddress;
  try {
    const deployments = JSON.parse(
      fs.readFileSync(path.join(__dirname, `../deployments/${network.chainId}.json`), 'utf8')
    );
    rwaRegistryAddress = deployments.RWARegistry;
    console.log("✅ Using existing RWA Registry at:", rwaRegistryAddress);
  } catch (error) {
    console.log("📝 Deploying new RWA Registry...");
    const RWARegistry = await ethers.getContractFactory("RWARegistry");
    const rwaRegistry = await RWARegistry.deploy();
    await rwaRegistry.deployed();
    rwaRegistryAddress = rwaRegistry.address;
    console.log("✅ RWA Registry deployed to:", rwaRegistryAddress);
  }

  // Bridge protocol addresses (update these with actual addresses)
  const wormholeCore = process.env.WORMHOLE_CORE_ADDRESS || ethers.constants.AddressZero;
  const layerZeroEndpoint = process.env.LAYERZERO_ENDPOINT_ADDRESS || ethers.constants.AddressZero;

  console.log("🌉 Bridge Protocol Addresses:");
  console.log("  Wormhole Core:", wormholeCore);
  console.log("  LayerZero Endpoint:", layerZeroEndpoint);

  // Deploy Solana RWA Bridge
  console.log("📝 Deploying Solana RWA Bridge...");
  const SolanaRWABridge = await ethers.getContractFactory("SolanaRWABridge");
  const solanaRWABridge = await SolanaRWABridge.deploy(
    rwaRegistryAddress,
    wormholeCore,
    layerZeroEndpoint
  );
  await solanaRWABridge.deployed();
  console.log("✅ Solana RWA Bridge deployed to:", solanaRWABridge.address);

  // Deploy Cross-Chain Event Listener
  console.log("📝 Deploying Cross-Chain Event Listener...");
  const CrossChainEventListener = await ethers.getContractFactory("CrossChainEventListener");
  const eventListener = await CrossChainEventListener.deploy(
    solanaRWABridge.address,
    wormholeCore,
    layerZeroEndpoint
  );
  await eventListener.deployed();
  console.log("✅ Cross-Chain Event Listener deployed to:", eventListener.address);

  // Configure trusted sources (Solana chain ID = 1)
  if (wormholeCore !== ethers.constants.AddressZero) {
    console.log("🔧 Configuring Wormhole trusted sources...");
    const solanaWormholeAddress = process.env.SOLANA_WORMHOLE_ADDRESS || "0x0000000000000000000000000000000000000000000000000000000000000001";
    await eventListener.addTrustedSource(1, solanaWormholeAddress);
    console.log("✅ Added Solana as trusted Wormhole source");
  }

  if (layerZeroEndpoint !== ethers.constants.AddressZero) {
    console.log("🔧 Configuring LayerZero trusted remotes...");
    const solanaLayerZeroAddress = process.env.SOLANA_LAYERZERO_ADDRESS || "0x01";
    await eventListener.addTrustedRemote(1, solanaLayerZeroAddress);
    console.log("✅ Added Solana as trusted LayerZero remote");
  }

  // Save deployment addresses
  const deploymentData = {
    network: network.name,
    chainId: network.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      RWARegistry: rwaRegistryAddress,
      SolanaRWABridge: solanaRWABridge.address,
      CrossChainEventListener: eventListener.address,
    },
    bridgeProtocols: {
      wormholeCore,
      layerZeroEndpoint,
    },
    solanaProgram: {
      programId: "11111111111111111111111111111112", // Update with actual program ID
      network: "devnet", // or mainnet
    }
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `solana-bridge-${network.chainId}.json`),
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("\n🎉 Deployment Summary:");
  console.log("=" .repeat(50));
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);
  console.log("RWA Registry:", rwaRegistryAddress);
  console.log("Solana RWA Bridge:", solanaRWABridge.address);
  console.log("Event Listener:", eventListener.address);
  console.log("=" .repeat(50));

  // Verification commands
  console.log("\n📋 Verification Commands:");
  console.log(`npx hardhat verify --network ${network.name} ${solanaRWABridge.address} "${rwaRegistryAddress}" "${wormholeCore}" "${layerZeroEndpoint}"`);
  console.log(`npx hardhat verify --network ${network.name} ${eventListener.address} "${solanaRWABridge.address}" "${wormholeCore}" "${layerZeroEndpoint}"`);

  console.log("\n🔗 Next Steps:");
  console.log("1. Deploy the Solana program using: anchor deploy");
  console.log("2. Update the Solana program ID in the deployment file");
  console.log("3. Configure cross-chain message routing");
  console.log("4. Test cross-chain asset registration and transfers");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
