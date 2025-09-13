const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("RWAYieldVault", function () {
  let yieldVault;
  let mockRWAToken;
  let aYieldToken;
  let owner;
  let user1;
  let user2;
  let treasury;

  const BASE_APY = 500; // 5% APY
  const INITIAL_SUPPLY = ethers.utils.parseEther("1000000");
  const DEPOSIT_AMOUNT = ethers.utils.parseEther("1000");

  beforeEach(async function () {
    [owner, user1, user2, treasury] = await ethers.getSigners();

    // Deploy Mock RWA Token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockRWAToken = await MockERC20.deploy(
      "Real Estate Token",
      "RET",
      INITIAL_SUPPLY
    );

    // Deploy RWA Yield Vault
    const RWAYieldVault = await ethers.getContractFactory("RWAYieldVault");
    yieldVault = await RWAYieldVault.deploy(
      mockRWAToken.address,
      "aYield Real Estate Token",
      "aRET",
      treasury.address,
      BASE_APY
    );

    // Deploy aYield Token
    const aYieldTokenContract = await ethers.getContractFactory("aYieldToken");
    aYieldToken = await aYieldTokenContract.deploy(
      "aYield Real Estate Token",
      "aRET",
      mockRWAToken.address,
      yieldVault.address,
      BASE_APY
    );

    // Mint tokens to users
    await mockRWAToken.mint(user1.address, DEPOSIT_AMOUNT.mul(10));
    await mockRWAToken.mint(user2.address, DEPOSIT_AMOUNT.mul(10));

    // Approve vault to spend tokens
    await mockRWAToken.connect(user1).approve(yieldVault.address, DEPOSIT_AMOUNT.mul(10));
    await mockRWAToken.connect(user2).approve(yieldVault.address, DEPOSIT_AMOUNT.mul(10));
  });

  describe("Deployment", function () {
    it("Should set the correct initial parameters", async function () {
      const vaultConfig = await yieldVault.vaultConfig();
      expect(vaultConfig.asset).to.equal(mockRWAToken.address);
      expect(vaultConfig.baseAPY).to.equal(BASE_APY);
      expect(await yieldVault.treasury()).to.equal(treasury.address);
    });

    it("Should have zero initial deposits", async function () {
      const totalAssets = await yieldVault.totalAssets();
      expect(totalAssets).to.equal(0);
    });
  });

  describe("Deposits", function () {
    it("Should allow users to deposit RWA tokens", async function () {
      const initialBalance = await mockRWAToken.balanceOf(user1.address);
      
      await expect(yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT))
        .to.emit(yieldVault, "Deposit")
        .withArgs(user1.address, DEPOSIT_AMOUNT, DEPOSIT_AMOUNT, await time.latest() + 1);

      const finalBalance = await mockRWAToken.balanceOf(user1.address);
      expect(initialBalance.sub(finalBalance)).to.equal(DEPOSIT_AMOUNT);

      const userShares = await yieldVault.balanceOf(user1.address);
      expect(userShares).to.equal(DEPOSIT_AMOUNT);

      const totalAssets = await yieldVault.totalAssets();
      expect(totalAssets).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should reject deposits below minimum", async function () {
      const minDeposit = ethers.utils.parseEther("0.5");
      
      await expect(yieldVault.connect(user1).deposit(minDeposit))
        .to.be.revertedWith("Below minimum deposit");
    });

    it("Should calculate correct shares for subsequent deposits", async function () {
      // First deposit
      await yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT);
      
      // Second deposit (should get same amount of shares since no yield yet)
      await yieldVault.connect(user2).deposit(DEPOSIT_AMOUNT);
      
      const user1Shares = await yieldVault.balanceOf(user1.address);
      const user2Shares = await yieldVault.balanceOf(user2.address);
      
      expect(user1Shares).to.equal(user2Shares);
    });
  });

  describe("Yield Calculation", function () {
    beforeEach(async function () {
      await yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT);
    });

    it("Should calculate yield correctly over time", async function () {
      // Fast forward 1 year
      await time.increase(365 * 24 * 60 * 60);
      
      const pendingYield = await yieldVault.getPendingYield(user1.address);
      const expectedYield = DEPOSIT_AMOUNT.mul(BASE_APY).div(10000); // 5% of deposit
      
      // Allow for small rounding differences
      expect(pendingYield).to.be.closeTo(expectedYield, ethers.utils.parseEther("1"));
    });

    it("Should calculate proportional yield for partial time", async function () {
      // Fast forward 6 months
      await time.increase(182 * 24 * 60 * 60);
      
      const pendingYield = await yieldVault.getPendingYield(user1.address);
      const expectedYield = DEPOSIT_AMOUNT.mul(BASE_APY).div(10000).div(2); // ~2.5% of deposit
      
      expect(pendingYield).to.be.closeTo(expectedYield, ethers.utils.parseEther("0.5"));
    });

    it("Should reset yield calculation after claim", async function () {
      // Fast forward and claim yield
      await time.increase(365 * 24 * 60 * 60);
      await yieldVault.connect(user1).claimYield();
      
      // Check that pending yield is now zero
      const pendingYield = await yieldVault.getPendingYield(user1.address);
      expect(pendingYield).to.equal(0);
    });
  });

  describe("Yield Claiming", function () {
    beforeEach(async function () {
      await yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT);
      await time.increase(365 * 24 * 60 * 60); // 1 year
    });

    it("Should allow users to claim yield", async function () {
      const initialBalance = await mockRWAToken.balanceOf(user1.address);
      const pendingYield = await yieldVault.getPendingYield(user1.address);
      
      await expect(yieldVault.connect(user1).claimYield())
        .to.emit(yieldVault, "YieldClaimed")
        .withArgs(user1.address, pendingYield, await time.latest() + 1);

      const finalBalance = await mockRWAToken.balanceOf(user1.address);
      expect(finalBalance.sub(initialBalance)).to.equal(pendingYield);
    });

    it("Should not allow claiming when no yield available", async function () {
      await yieldVault.connect(user1).claimYield(); // Claim all yield
      
      await expect(yieldVault.connect(user1).claimYield())
        .to.be.revertedWith("No yield to claim");
    });
  });

  describe("Compounding", function () {
    beforeEach(async function () {
      await yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT);
      await time.increase(365 * 24 * 60 * 60); // 1 year
    });

    it("Should allow users to compound yield", async function () {
      const initialShares = await yieldVault.balanceOf(user1.address);
      const pendingYield = await yieldVault.getPendingYield(user1.address);
      
      await yieldVault.connect(user1).compoundYield();
      
      const finalShares = await yieldVault.balanceOf(user1.address);
      const expectedNewShares = await yieldVault.convertToShares(pendingYield);
      
      expect(finalShares.sub(initialShares)).to.equal(expectedNewShares);
    });

    it("Should increase user's position after compounding", async function () {
      const initialAssets = await yieldVault.getUserAssets(user1.address);
      
      await yieldVault.connect(user1).compoundYield();
      
      const finalAssets = await yieldVault.getUserAssets(user1.address);
      expect(finalAssets).to.be.gt(initialAssets);
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      await yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT);
    });

    it("Should allow users to withdraw their deposits", async function () {
      const userShares = await yieldVault.balanceOf(user1.address);
      const initialBalance = await mockRWAToken.balanceOf(user1.address);
      
      await expect(yieldVault.connect(user1).withdraw(userShares))
        .to.emit(yieldVault, "Withdraw");

      const finalBalance = await mockRWAToken.balanceOf(user1.address);
      const finalShares = await yieldVault.balanceOf(user1.address);
      
      expect(finalShares).to.equal(0);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should apply withdrawal fees", async function () {
      const userShares = await yieldVault.balanceOf(user1.address);
      const expectedAssets = await yieldVault.convertToAssets(userShares);
      const vaultConfig = await yieldVault.vaultConfig();
      const withdrawalFee = expectedAssets.mul(vaultConfig.withdrawalFee).div(10000);
      
      const initialBalance = await mockRWAToken.balanceOf(user1.address);
      await yieldVault.connect(user1).withdraw(userShares);
      const finalBalance = await mockRWAToken.balanceOf(user1.address);
      
      const actualReceived = finalBalance.sub(initialBalance);
      const expectedReceived = expectedAssets.sub(withdrawalFee);
      
      expect(actualReceived).to.equal(expectedReceived);
    });

    it("Should not allow withdrawing more shares than owned", async function () {
      const userShares = await yieldVault.balanceOf(user1.address);
      const excessShares = userShares.add(ethers.utils.parseEther("1"));
      
      await expect(yieldVault.connect(user1).withdraw(excessShares))
        .to.be.revertedWith("Insufficient shares");
    });
  });

  describe("Price Per Share", function () {
    it("Should start at 1:1 ratio", async function () {
      const pricePerShare = await yieldVault.pricePerShare();
      expect(pricePerShare).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should increase as yield accrues", async function () {
      await yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT);
      
      const initialPrice = await yieldVault.pricePerShare();
      
      // Fast forward to accrue yield
      await time.increase(365 * 24 * 60 * 60);
      
      // Trigger yield update
      await yieldVault.connect(user1).getPendingYield(user1.address);
      
      const finalPrice = await yieldVault.pricePerShare();
      expect(finalPrice).to.be.gte(initialPrice);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update vault config", async function () {
      const newAPY = 750; // 7.5%
      const newPerformanceFee = 1500; // 15%
      const newManagementFee = 300; // 3%
      const newWithdrawalFee = 75; // 0.75%
      
      await expect(yieldVault.updateVaultConfig(newAPY, newPerformanceFee, newManagementFee, newWithdrawalFee))
        .to.emit(yieldVault, "VaultConfigUpdated")
        .withArgs(newAPY, newPerformanceFee, newManagementFee);

      const vaultConfig = await yieldVault.vaultConfig();
      expect(vaultConfig.baseAPY).to.equal(newAPY);
      expect(vaultConfig.performanceFee).to.equal(newPerformanceFee);
      expect(vaultConfig.managementFee).to.equal(newManagementFee);
      expect(vaultConfig.withdrawalFee).to.equal(newWithdrawalFee);
    });

    it("Should allow owner to set treasury", async function () {
      const newTreasury = user2.address;
      
      await yieldVault.setTreasury(newTreasury);
      
      const currentTreasury = await yieldVault.treasury();
      expect(currentTreasury).to.equal(newTreasury);
    });

    it("Should allow owner to pause/unpause", async function () {
      await yieldVault.pause();
      
      await expect(yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT))
        .to.be.revertedWith("Pausable: paused");
      
      await yieldVault.unpause();
      
      await expect(yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT))
        .to.not.be.reverted;
    });

    it("Should not allow non-owner to update config", async function () {
      await expect(yieldVault.connect(user1).updateVaultConfig(600, 1000, 200, 50))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Emergency Functions", function () {
    beforeEach(async function () {
      await yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT);
    });

    it("Should allow owner to emergency shutdown", async function () {
      await yieldVault.emergencyShutdown();
      
      const vaultConfig = await yieldVault.vaultConfig();
      expect(vaultConfig.emergencyShutdown).to.be.true;
      
      await expect(yieldVault.connect(user2).deposit(DEPOSIT_AMOUNT))
        .to.be.revertedWith("Vault shutdown");
    });

    it("Should allow emergency withdrawal by owner", async function () {
      const vaultBalance = await mockRWAToken.balanceOf(yieldVault.address);
      const ownerInitialBalance = await mockRWAToken.balanceOf(owner.address);
      
      await yieldVault.emergencyWithdraw(mockRWAToken.address, vaultBalance);
      
      const ownerFinalBalance = await mockRWAToken.balanceOf(owner.address);
      expect(ownerFinalBalance.sub(ownerInitialBalance)).to.equal(vaultBalance);
    });
  });

  describe("Vault Statistics", function () {
    beforeEach(async function () {
      await yieldVault.connect(user1).deposit(DEPOSIT_AMOUNT);
      await yieldVault.connect(user2).deposit(DEPOSIT_AMOUNT.mul(2));
    });

    it("Should return correct vault statistics", async function () {
      const stats = await yieldVault.getVaultStats();
      
      expect(stats[0]).to.equal(DEPOSIT_AMOUNT.mul(3)); // totalDeposits
      expect(stats[1]).to.equal(DEPOSIT_AMOUNT.mul(3)); // totalSharesOutstanding
      expect(stats[2]).to.equal(BASE_APY); // currentAPY
      expect(stats[4]).to.equal(ethers.utils.parseEther("1")); // sharePrice (initially 1:1)
    });

    it("Should track user assets correctly", async function () {
      const user1Assets = await yieldVault.getUserAssets(user1.address);
      const user2Assets = await yieldVault.getUserAssets(user2.address);
      
      expect(user1Assets).to.equal(DEPOSIT_AMOUNT);
      expect(user2Assets).to.equal(DEPOSIT_AMOUNT.mul(2));
    });
  });
});
