const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Identity Passport NFT System...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId);

  // Deploy Identity Passport NFT
  console.log("\n📋 Deploying IdentityPassportNFT...");
  const IdentityPassportNFT = await ethers.getContractFactory("IdentityPassportNFT");
  
  const passportName = "OmniFlow Identity Passport";
  const passportSymbol = "OFIP";
  const initialOwner = deployer.address;

  const identityPassport = await IdentityPassportNFT.deploy(
    passportName,
    passportSymbol,
    initialOwner
  );

  await identityPassport.deployed();
  console.log("✅ IdentityPassportNFT deployed to:", identityPassport.address);

  // Add deployer as authorized issuer
  console.log("\n🔐 Setting up authorized issuers...");
  await identityPassport.addAuthorizedIssuer(deployer.address);
  console.log("✅ Added deployer as authorized issuer");

  // Add supported chains
  console.log("\n🌐 Adding supported chains...");
  const supportedChains = ["ethereum", "polygon", "bsc", "arbitrum", "optimism", "solana"];
  
  for (const chain of supportedChains) {
    try {
      await identityPassport.addSupportedChain(chain);
      console.log(`✅ Added supported chain: ${chain}`);
    } catch (error) {
      console.log(`⚠️  Chain ${chain} already supported or error:`, error.message);
    }
  }

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  
  try {
    const name = await identityPassport.name();
    const symbol = await identityPassport.symbol();
    const owner = await identityPassport.owner();
    
    console.log("Contract name:", name);
    console.log("Contract symbol:", symbol);
    console.log("Contract owner:", owner);
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
      IdentityPassportNFT: {
        address: identityPassport.address,
        name: passportName,
        symbol: passportSymbol,
        owner: initialOwner,
      }
    },
    supportedChains,
    transactions: {
      deployment: identityPassport.deployTransaction.hash,
    }
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `identity-passport-${network.name}-${network.chainId}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  // Generate environment variables
  console.log("\n📝 Environment Variables:");
  console.log(`NEXT_PUBLIC_${network.name.toUpperCase()}_PASSPORT_CONTRACT=${identityPassport.address}`);
  
  // Generate verification commands
  console.log("\n🔍 Contract Verification Commands:");
  console.log(`npx hardhat verify --network ${network.name} ${identityPassport.address} "${passportName}" "${passportSymbol}" "${initialOwner}"`);

  // Example usage
  console.log("\n📖 Example Usage:");
  console.log("// Issue a passport");
  console.log(`await identityPassport.issuePassport(`);
  console.log(`  "${deployer.address}",`);
  console.log(`  "did:example:123456789abcdefghi",`);
  console.log(`  2, // Enhanced KYC`);
  console.log(`  2, // Accredited Investor`);
  console.log(`  "https://ipfs.io/ipfs/QmExample...",`);
  console.log(`  ${365 * 24 * 60 * 60} // 1 year validity`);
  console.log(`);`);

  console.log("\n🎉 Identity Passport NFT deployment completed successfully!");
  
  return {
    identityPassport: identityPassport.address,
    deployer: deployer.address,
    network: network.name,
    chainId: network.chainId,
  };
}

// Handle deployment errors
main()
  .then((result) => {
    console.log("\n✅ Deployment Summary:");
    console.log("Identity Passport NFT:", result.identityPassport);
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
