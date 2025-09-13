const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Solana RWA Bridge System", function () {
  async function deployBridgeSystemFixture() {
    const [owner, user1, user2, bridgeOperator] = await ethers.getSigners();

    // Deploy RWA Registry
    const RWARegistry = await ethers.getContractFactory("RWARegistry");
    const rwaRegistry = await RWARegistry.deploy();

    // Mock bridge protocol addresses
    const mockWormholeCore = ethers.Wallet.createRandom().address;
    const mockLayerZeroEndpoint = ethers.Wallet.createRandom().address;

    // Deploy Solana RWA Bridge
    const SolanaRWABridge = await ethers.getContractFactory("SolanaRWABridge");
    const solanaRWABridge = await SolanaRWABridge.deploy(
      rwaRegistry.address,
      mockWormholeCore,
      mockLayerZeroEndpoint
    );

    // Deploy Cross-Chain Event Listener
    const CrossChainEventListener = await ethers.getContractFactory("CrossChainEventListener");
    const eventListener = await CrossChainEventListener.deploy(
      solanaRWABridge.address,
      mockWormholeCore,
      mockLayerZeroEndpoint
    );

    return {
      rwaRegistry,
      solanaRWABridge,
      eventListener,
      owner,
      user1,
      user2,
      bridgeOperator,
      mockWormholeCore,
      mockLayerZeroEndpoint,
    };
  }

  describe("Deployment", function () {
    it("Should deploy all contracts successfully", async function () {
      const { rwaRegistry, solanaRWABridge, eventListener } = await loadFixture(deployBridgeSystemFixture);

      expect(await rwaRegistry.address).to.be.properAddress;
      expect(await solanaRWABridge.address).to.be.properAddress;
      expect(await eventListener.address).to.be.properAddress;
    });

    it("Should set correct initial values", async function () {
      const { solanaRWABridge, rwaRegistry, mockWormholeCore, mockLayerZeroEndpoint } = await loadFixture(deployBridgeSystemFixture);

      expect(await solanaRWABridge.rwaRegistry()).to.equal(rwaRegistry.address);
      expect(await solanaRWABridge.wormholeCore()).to.equal(mockWormholeCore);
      expect(await solanaRWABridge.layerZeroEndpoint()).to.equal(mockLayerZeroEndpoint);
      expect(await solanaRWABridge.SOLANA_CHAIN_ID()).to.equal(1);
    });
  });

  describe("Solana Asset Registration", function () {
    it("Should register Solana asset successfully", async function () {
      const { solanaRWABridge, owner } = await loadFixture(deployBridgeSystemFixture);

      const assetId = 1;
      const assetType = 0; // RealEstate
      const metadataUri = "https://example.com/metadata/1";
      const kycLevel = 2; // Enhanced
      const totalValue = ethers.utils.parseEther("1000000");
      const totalSupply = ethers.utils.parseEther("100000");
      const proof = "0x1234"; // Mock proof

      await expect(
        solanaRWABridge.processSolanaAssetRegistration(
          assetId,
          owner.address,
          assetType,
          metadataUri,
          kycLevel,
          totalValue,
          totalSupply,
          proof
        )
      ).to.emit(solanaRWABridge, "SolanaAssetRegistered")
        .withArgs(assetId, owner.address, assetType, metadataUri, kycLevel, totalValue, totalSupply);

      const asset = await solanaRWABridge.getSolanaAsset(assetId);
      expect(asset.assetId).to.equal(assetId);
      expect(asset.owner).to.equal(owner.address);
      expect(asset.isActive).to.be.true;
    });

    it("Should not register duplicate asset", async function () {
      const { solanaRWABridge, owner } = await loadFixture(deployBridgeSystemFixture);

      const assetId = 1;
      const assetType = 0;
      const metadataUri = "https://example.com/metadata/1";
      const kycLevel = 2;
      const totalValue = ethers.utils.parseEther("1000000");
      const totalSupply = ethers.utils.parseEther("100000");
      const proof = "0x1234";

      // Register first time
      await solanaRWABridge.processSolanaAssetRegistration(
        assetId,
        owner.address,
        assetType,
        metadataUri,
        kycLevel,
        totalValue,
        totalSupply,
        proof
      );

      // Try to register again
      await expect(
        solanaRWABridge.processSolanaAssetRegistration(
          assetId,
          owner.address,
          assetType,
          metadataUri,
          kycLevel,
          totalValue,
          totalSupply,
          proof
        )
      ).to.be.revertedWith("Asset already registered");
    });
  });

  describe("Cross-Chain Transfers", function () {
    beforeEach(async function () {
      const { solanaRWABridge, owner } = await loadFixture(deployBridgeSystemFixture);
      
      // Register an asset first
      await solanaRWABridge.processSolanaAssetRegistration(
        1, // assetId
        owner.address,
        0, // RealEstate
        "https://example.com/metadata/1",
        2, // Enhanced KYC
        ethers.utils.parseEther("1000000"),
        ethers.utils.parseEther("100000"),
        "0x1234"
      );
    });

    it("Should initiate transfer to Solana", async function () {
      const { solanaRWABridge, user1 } = await loadFixture(deployBridgeSystemFixture);

      const assetId = 1;
      const amount = ethers.utils.parseEther("100");
      const solanaRecipient = "0x" + "1".repeat(64); // Mock Solana address

      // First, we need to mint some tokens to the user
      // This would normally be done through the bridge's mint function
      // For testing, we'll assume tokens exist

      await expect(
        solanaRWABridge.connect(user1).initiateTransferToSolana(
          assetId,
          amount,
          solanaRecipient
        )
      ).to.emit(solanaRWABridge, "CrossChainTransferInitiated");
    });

    it("Should complete transfer from Solana", async function () {
      const { solanaRWABridge, user1, owner } = await loadFixture(deployBridgeSystemFixture);

      const transferId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-transfer"));
      const assetId = 1;
      const amount = ethers.utils.parseEther("100");
      const proof = "0x1234";

      await expect(
        solanaRWABridge.completeTransferFromSolana(
          transferId,
          assetId,
          amount,
          user1.address,
          proof
        )
      ).to.emit(solanaRWABridge, "CrossChainTransferCompleted")
        .withArgs(transferId, assetId, amount, 1, user1.address);

      expect(await solanaRWABridge.isTransferProcessed(transferId)).to.be.true;
    });

    it("Should not process duplicate transfer", async function () {
      const { solanaRWABridge, user1, owner } = await loadFixture(deployBridgeSystemFixture);

      const transferId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-transfer"));
      const assetId = 1;
      const amount = ethers.utils.parseEther("100");
      const proof = "0x1234";

      // Process first time
      await solanaRWABridge.completeTransferFromSolana(
        transferId,
        assetId,
        amount,
        user1.address,
        proof
      );

      // Try to process again
      await expect(
        solanaRWABridge.completeTransferFromSolana(
          transferId,
          assetId,
          amount,
          user1.address,
          proof
        )
      ).to.be.revertedWith("Transfer already processed");
    });
  });

  describe("Event Listener", function () {
    it("Should add trusted sources", async function () {
      const { eventListener, owner } = await loadFixture(deployBridgeSystemFixture);

      const chainId = 1;
      const sourceAddress = "0x" + "1".repeat(64);

      await expect(
        eventListener.addTrustedSource(chainId, sourceAddress)
      ).to.emit(eventListener, "TrustedSourceAdded")
        .withArgs(chainId, sourceAddress);

      expect(await eventListener.trustedSources(chainId)).to.equal(sourceAddress);
    });

    it("Should add trusted remotes", async function () {
      const { eventListener, owner } = await loadFixture(deployBridgeSystemFixture);

      const chainId = 1;
      const remoteAddress = "0x01";

      await expect(
        eventListener.addTrustedRemote(chainId, remoteAddress)
      ).to.emit(eventListener, "TrustedRemoteAdded")
        .withArgs(chainId, remoteAddress);
    });

    it("Should process manual events", async function () {
      const { eventListener, owner } = await loadFixture(deployBridgeSystemFixture);

      const messageType = 1; // Asset registration
      const payload = ethers.utils.defaultAbiCoder.encode(
        ["uint64", "address", "uint8", "string", "uint8", "uint256", "uint256"],
        [1, owner.address, 0, "https://example.com/metadata/1", 2, ethers.utils.parseEther("1000000"), ethers.utils.parseEther("100000")]
      );
      const proof = "0x1234";

      await expect(
        eventListener.processManualEvent(messageType, payload, proof)
      ).to.emit(eventListener, "CrossChainMessageProcessed");
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to register assets", async function () {
      const { solanaRWABridge, user1 } = await loadFixture(deployBridgeSystemFixture);

      await expect(
        solanaRWABridge.connect(user1).processSolanaAssetRegistration(
          1,
          user1.address,
          0,
          "https://example.com/metadata/1",
          2,
          ethers.utils.parseEther("1000000"),
          ethers.utils.parseEther("100000"),
          "0x1234"
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should only allow owner to complete transfers", async function () {
      const { solanaRWABridge, user1 } = await loadFixture(deployBridgeSystemFixture);

      const transferId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-transfer"));

      await expect(
        solanaRWABridge.connect(user1).completeTransferFromSolana(
          transferId,
          1,
          ethers.utils.parseEther("100"),
          user1.address,
          "0x1234"
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Pause Functionality", function () {
    it("Should pause and unpause bridge", async function () {
      const { solanaRWABridge, owner } = await loadFixture(deployBridgeSystemFixture);

      await solanaRWABridge.pause();
      
      await expect(
        solanaRWABridge.processSolanaAssetRegistration(
          1,
          owner.address,
          0,
          "https://example.com/metadata/1",
          2,
          ethers.utils.parseEther("1000000"),
          ethers.utils.parseEther("100000"),
          "0x1234"
        )
      ).to.be.revertedWith("Pausable: paused");

      await solanaRWABridge.unpause();

      await expect(
        solanaRWABridge.processSolanaAssetRegistration(
          1,
          owner.address,
          0,
          "https://example.com/metadata/1",
          2,
          ethers.utils.parseEther("1000000"),
          ethers.utils.parseEther("100000"),
          "0x1234"
        )
      ).to.not.be.reverted;
    });
  });
});
