const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying RWA Yield Vault System...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId);

  // Configuration
  const baseAPY = 500; // 5% APY in basis points
  const treasury = deployer.address; // Use deployer as treasury for demo

  // Deploy mock RWA token for testing (if needed)
  console.log("\n📋 Deploying Mock RWA Token...");
  const MockRWAToken = await ethers.getContractFactory("MockERC20");
  const mockRWAToken = await MockRWAToken.deploy(
    "Real Estate Token",
    "RET",
    ethers.utils.parseEther("1000000") // 1M tokens
  );
  await mockRWAToken.deployed();
  console.log("✅ Mock RWA Token deployed to:", mockRWAToken.address);

  // Deploy RWA Yield Vault
  console.log("\n📋 Deploying RWAYieldVault...");
  const RWAYieldVault = await ethers.getContractFactory("RWAYieldVault");
  
  const yieldVault = await RWAYieldVault.deploy(
    mockRWAToken.address,
    "aYield Real Estate Token",
    "aRET",
    treasury,
    baseAPY
  );

  await yieldVault.deployed();
  console.log("✅ RWAYieldVault deployed to:", yieldVault.address);

  // Deploy aYield Token
  console.log("\n📋 Deploying aYieldToken...");
  const aYieldToken = await ethers.getContractFactory("aYieldToken");
  
  const ayToken = await aYieldToken.deploy(
    "aYield Real Estate Token",
    "aRET",
    mockRWAToken.address,
    yieldVault.address,
    baseAPY
  );

  await ayToken.deployed();
  console.log("✅ aYieldToken deployed to:", ayToken.address);

  // Setup initial configuration
  console.log("\n🔧 Setting up vault configuration...");
  
  // Set deposit limits
  await yieldVault.setDepositLimits(
    ethers.utils.parseEther("1"), // 1 token minimum
    ethers.utils.parseEther("100000") // 100k tokens maximum
  );
  console.log("✅ Deposit limits configured");

  // Mint some tokens to deployer for testing
  await mockRWAToken.mint(deployer.address, ethers.utils.parseEther("10000"));
  console.log("✅ Minted test tokens to deployer");

  // Approve vault to spend tokens
  await mockRWAToken.approve(yieldVault.address, ethers.utils.parseEther("10000"));
  console.log("✅ Approved vault to spend tokens");

  // Test deposit
  console.log("\n🧪 Testing vault functionality...");
  const depositAmount = ethers.utils.parseEther("100");
  const tx = await yieldVault.deposit(depositAmount);
  await tx.wait();
  console.log("✅ Test deposit successful");

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  
  try {
    const vaultStats = await yieldVault.getVaultStats();
    const userAssets = await yieldVault.getUserAssets(deployer.address);
    
    console.log("Vault total deposits:", ethers.utils.formatEther(vaultStats[0]));
    console.log("Vault total shares:", ethers.utils.formatEther(vaultStats[1]));
    console.log("Current APY:", vaultStats[2].toString(), "basis points");
    console.log("User assets:", ethers.utils.formatEther(userAssets));
    console.log("✅ Deployment verification successful");
  } catch (error) {
    console.error("❌ Deployment verification failed:", error);
  }

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      MockRWAToken: {
        address: mockRWAToken.address,
        name: "Real Estate Token",
        symbol: "RET",
      },
      RWAYieldVault: {
        address: yieldVault.address,
        name: "aYield Real Estate Token",
        symbol: "aRET",
        baseAPY: baseAPY,
        treasury: treasury,
      },
      aYieldToken: {
        address: ayToken.address,
        name: "aYield Real Estate Token",
        symbol: "aRET",
        underlyingAsset: mockRWAToken.address,
      }
    },
    configuration: {
      baseAPY: baseAPY,
      minDeposit: "1000000000000000000", // 1 ether
      maxDeposit: "100000000000000000000000", // 100k ether
      performanceFee: 1000, // 10%
      managementFee: 200, // 2%
      withdrawalFee: 50, // 0.5%
    },
    transactions: {
      mockRWATokenDeployment: mockRWAToken.deployTransaction.hash,
      yieldVaultDeployment: yieldVault.deployTransaction.hash,
      aYieldTokenDeployment: ayToken.deployTransaction.hash,
    }
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `yield-vault-${network.name}-${network.chainId}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  // Generate environment variables
  console.log("\n📝 Environment Variables:");
  console.log(`NEXT_PUBLIC_${network.name.toUpperCase()}_RWA_TOKEN=${mockRWAToken.address}`);
  console.log(`NEXT_PUBLIC_${network.name.toUpperCase()}_YIELD_VAULT=${yieldVault.address}`);
  console.log(`NEXT_PUBLIC_${network.name.toUpperCase()}_AYIELD_TOKEN=${ayToken.address}`);
  
  // Generate verification commands
  console.log("\n🔍 Contract Verification Commands:");
  console.log(`npx hardhat verify --network ${network.name} ${mockRWAToken.address} "Real Estate Token" "RET" "1000000000000000000000000"`);
  console.log(`npx hardhat verify --network ${network.name} ${yieldVault.address} "${mockRWAToken.address}" "aYield Real Estate Token" "aRET" "${treasury}" ${baseAPY}`);
  console.log(`npx hardhat verify --network ${network.name} ${ayToken.address} "aYield Real Estate Token" "aRET" "${mockRWAToken.address}" "${yieldVault.address}" ${baseAPY}`);

  // Usage examples
  console.log("\n📖 Usage Examples:");
  console.log("// Deposit RWA tokens");
  console.log(`await rwaToken.approve("${yieldVault.address}", depositAmount);`);
  console.log(`await yieldVault.deposit(depositAmount);`);
  console.log("");
  console.log("// Check pending yield");
  console.log(`const pendingYield = await yieldVault.getPendingYield(userAddress);`);
  console.log("");
  console.log("// Claim yield");
  console.log(`await yieldVault.claimYield();`);
  console.log("");
  console.log("// Compound yield");
  console.log(`await yieldVault.compoundYield();`);
  console.log("");
  console.log("// Withdraw");
  console.log(`await yieldVault.withdraw(sharesAmount);`);

  console.log("\n🎉 RWA Yield Vault deployment completed successfully!");
  
  return {
    mockRWAToken: mockRWAToken.address,
    yieldVault: yieldVault.address,
    aYieldToken: ayToken.address,
    deployer: deployer.address,
    network: network.name,
    chainId: network.chainId,
  };
}

// Handle deployment errors
main()
  .then((result) => {
    console.log("\n✅ Deployment Summary:");
    console.log("Mock RWA Token:", result.mockRWAToken);
    console.log("RWA Yield Vault:", result.yieldVault);
    console.log("aYield Token:", result.aYieldToken);
    console.log("Deployer:", result.deployer);
    console.log("Network:", result.network);
    console.log("Chain ID:", result.chainId);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
