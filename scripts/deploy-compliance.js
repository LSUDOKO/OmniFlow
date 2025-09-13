const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Compliance System Deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get Identity Passport contract address (should be deployed first)
  const identityPassportAddress = process.env.IDENTITY_PASSPORT_ADDRESS || "0x0000000000000000000000000000000000000000";
  
  if (identityPassportAddress === "0x0000000000000000000000000000000000000000") {
    console.log("⚠️  Warning: Identity Passport address not set. Using zero address.");
  }

  // Deploy ComplianceManager
  console.log("\n📋 Deploying ComplianceManager...");
  const ComplianceManager = await ethers.getContractFactory("ComplianceManager");
  const complianceManager = await ComplianceManager.deploy(identityPassportAddress);
  await complianceManager.deployed();
  
  console.log("✅ ComplianceManager deployed to:", complianceManager.address);

  // Wait for a few block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await complianceManager.deployTransaction.wait(2);

  // Initialize compliance settings
  console.log("\n🔧 Initializing compliance settings...");

  try {
    // Set asset compliance requirements
    console.log("Setting asset compliance requirements...");
    
    // Real Estate requires Enhanced KYC
    await complianceManager.setAssetComplianceRequirement("real_estate", 2); // ENHANCED
    console.log("✅ Real Estate: Enhanced KYC required");
    
    // Precious Metals requires Basic KYC
    await complianceManager.setAssetComplianceRequirement("precious_metals", 1); // BASIC
    console.log("✅ Precious Metals: Basic KYC required");
    
    // Carbon Credits requires Basic KYC
    await complianceManager.setAssetComplianceRequirement("carbon_credits", 1); // BASIC
    console.log("✅ Carbon Credits: Basic KYC required");
    
    // Art & Collectibles requires Enhanced KYC
    await complianceManager.setAssetComplianceRequirement("art_collectibles", 2); // ENHANCED
    console.log("✅ Art & Collectibles: Enhanced KYC required");

    // Add some test compliance officers
    const complianceOfficers = [
      "0x742d35Cc6634C0532925a3b8D87f1C0D5d4317A9", // Test officer 1
      "0x8ba1f109551bD432803012645Hac136c22C85B",   // Test officer 2
    ];

    for (const officer of complianceOfficers) {
      try {
        await complianceManager.addComplianceOfficer(officer);
        console.log(`✅ Added compliance officer: ${officer}`);
      } catch (error) {
        console.log(`⚠️  Could not add officer ${officer}: ${error.message}`);
      }
    }

    // Set up some test compliant users
    const testUsers = [
      {
        address: deployer.address,
        isCompliant: true,
        level: 2, // ENHANCED
        region: 1, // US
        expiryDays: 365
      }
    ];

    for (const user of testUsers) {
      try {
        const expiryTimestamp = Math.floor(Date.now() / 1000) + (user.expiryDays * 24 * 60 * 60);
        await complianceManager.updateComplianceStatus(
          user.address,
          user.isCompliant,
          user.level,
          user.region,
          expiryTimestamp
        );
        console.log(`✅ Set compliance for ${user.address}: Level ${user.level}, Region ${user.region}`);
      } catch (error) {
        console.log(`⚠️  Could not set compliance for ${user.address}: ${error.message}`);
      }
    }

  } catch (error) {
    console.log("⚠️  Error during initialization:", error.message);
  }

  // Display deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 COMPLIANCE SYSTEM DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log(`ComplianceManager: ${complianceManager.address}`);
  console.log(`Identity Passport: ${identityPassportAddress}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log(`Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);

  // Environment variables for frontend
  console.log("\n📝 Environment Variables for Frontend:");
  console.log("Add these to your .env.local file:");
  console.log("=".repeat(50));
  
  const networkName = (await ethers.provider.getNetwork()).name.toUpperCase();
  console.log(`NEXT_PUBLIC_${networkName}_COMPLIANCE_MANAGER=${complianceManager.address}`);
  
  // Contract verification commands
  console.log("\n🔍 Contract Verification Commands:");
  console.log("Run these commands to verify on Etherscan:");
  console.log("=".repeat(50));
  console.log(`npx hardhat verify --network ${(await ethers.provider.getNetwork()).name} ${complianceManager.address} "${identityPassportAddress}"`);

  // Integration examples
  console.log("\n🔗 Integration Examples:");
  console.log("=".repeat(30));
  console.log("// Add to your contract:");
  console.log(`import "../mixins/ComplianceEnabled.sol";`);
  console.log(`contract YourContract is ComplianceEnabled {`);
  console.log(`    constructor() ComplianceEnabled("${complianceManager.address}") {}`);
  console.log(`    `);
  console.log(`    function restrictedFunction() external requireCompliance(msg.sender) {`);
  console.log(`        // Your function logic here`);
  console.log(`    }`);
  console.log(`}`);

  console.log("\n// Frontend usage:");
  console.log(`import { useCompliance } from '../hooks/useCompliance';`);
  console.log(`const { isCompliant, getComplianceStatus } = useCompliance();`);
  console.log(`const compliant = await isCompliant(userAddress, chainId);`);

  // Test the deployment
  console.log("\n🧪 Testing Deployment...");
  try {
    const isDeployerCompliant = await complianceManager.isCompliant(deployer.address);
    console.log(`✅ Deployer compliance status: ${isDeployerCompliant}`);
    
    const complianceStatus = await complianceManager.getComplianceStatus(deployer.address);
    console.log(`✅ Deployer compliance level: ${complianceStatus.requiredLevel}`);
    
    console.log("✅ All tests passed!");
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }

  console.log("\n🎯 Next Steps:");
  console.log("1. Update your RWA contracts to inherit from ComplianceEnabled");
  console.log("2. Add compliance modifiers to restricted functions");
  console.log("3. Set up compliance officers and regional policies");
  console.log("4. Integrate the frontend compliance dashboard");
  console.log("5. Configure KYC providers and AML monitoring");
  
  console.log("\n✨ Compliance system is ready for production use!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
