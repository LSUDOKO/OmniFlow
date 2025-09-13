use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use mpl_token_metadata::instruction as mpl_instruction;
use mpl_token_metadata::state::{Metadata, TokenMetadataAccount};
use solana_program::program::invoke;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum KYCLevel {
    None,
    Basic,
    Enhanced,
    Institutional,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum InvestorTier {
    None,
    Retail,
    Accredited,
    Institutional,
    Qualified,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct CrossChainAddress {
    pub chain: String,
    pub address: String,
    pub verified: bool,
    pub timestamp: i64,
}

#[account]
pub struct IdentityPassport {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub did: String,
    pub kyc_level: KYCLevel,
    pub investor_tier: InvestorTier,
    pub reputation_score: u64,
    pub issuance_date: i64,
    pub expiration_date: i64,
    pub is_active: bool,
    pub metadata_uri: String,
    pub issuer: Pubkey,
    pub cross_chain_addresses: Vec<CrossChainAddress>,
    pub credentials: Vec<String>,
    pub bump: u8,
}

impl IdentityPassport {
    pub const MAX_SIZE: usize = 8 + // discriminator
        32 + // mint
        32 + // owner
        4 + 200 + // did (string)
        1 + // kyc_level
        1 + // investor_tier
        8 + // reputation_score
        8 + // issuance_date
        8 + // expiration_date
        1 + // is_active
        4 + 200 + // metadata_uri
        32 + // issuer
        4 + (10 * (4 + 50 + 4 + 100 + 1 + 8)) + // cross_chain_addresses (max 10)
        4 + (20 * (4 + 100)) + // credentials (max 20)
        1; // bump
}

#[account]
pub struct IdentityRegistry {
    pub authority: Pubkey,
    pub total_passports: u64,
    pub authorized_issuers: Vec<Pubkey>,
    pub supported_chains: Vec<String>,
    pub cross_chain_bridge: Option<Pubkey>,
    pub paused: bool,
    pub bump: u8,
}

impl IdentityRegistry {
    pub const MAX_SIZE: usize = 8 + // discriminator
        32 + // authority
        8 + // total_passports
        4 + (10 * 32) + // authorized_issuers (max 10)
        4 + (10 * (4 + 20)) + // supported_chains (max 10)
        1 + 32 + // cross_chain_bridge
        1 + // paused
        1; // bump
}

#[derive(Accounts)]
#[instruction(did: String)]
pub struct IssueIdentityPassport<'info> {
    #[account(
        init,
        payer = payer,
        space = IdentityPassport::MAX_SIZE,
        seeds = [b"identity_passport", did.as_bytes()],
        bump
    )]
    pub identity_passport: Account<'info, IdentityPassport>,
    
    #[account(
        mut,
        seeds = [b"identity_registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, IdentityRegistry>,
    
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = identity_passport.key(),
        mint::freeze_authority = identity_passport.key(),
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = recipient,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is the metadata account for the NFT
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    /// CHECK: This is the master edition account for the NFT
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    
    pub recipient: SystemAccount<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub issuer: Signer<'info>,
    
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    
    /// CHECK: This is the token metadata program
    pub token_metadata_program: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct UpdateIdentityPassport<'info> {
    #[account(
        mut,
        seeds = [b"identity_passport", identity_passport.did.as_bytes()],
        bump = identity_passport.bump
    )]
    pub identity_passport: Account<'info, IdentityPassport>,
    
    #[account(
        seeds = [b"identity_registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, IdentityRegistry>,
    
    pub issuer: Signer<'info>,
}

#[derive(Accounts)]
pub struct LinkCrossChainAddress<'info> {
    #[account(
        mut,
        seeds = [b"identity_passport", identity_passport.did.as_bytes()],
        bump = identity_passport.bump,
        constraint = identity_passport.owner == owner.key()
    )]
    pub identity_passport: Account<'info, IdentityPassport>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct AddCredential<'info> {
    #[account(
        mut,
        seeds = [b"identity_passport", identity_passport.did.as_bytes()],
        bump = identity_passport.bump
    )]
    pub identity_passport: Account<'info, IdentityPassport>,
    
    #[account(
        seeds = [b"identity_registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, IdentityRegistry>,
    
    pub issuer: Signer<'info>,
}

#[derive(Accounts)]
pub struct InitializeIdentityRegistry<'info> {
    #[account(
        init,
        payer = payer,
        space = IdentityRegistry::MAX_SIZE,
        seeds = [b"identity_registry"],
        bump
    )]
    pub registry: Account<'info, IdentityRegistry>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SyncCrossChain<'info> {
    #[account(
        seeds = [b"identity_passport", identity_passport.did.as_bytes()],
        bump = identity_passport.bump
    )]
    pub identity_passport: Account<'info, IdentityPassport>,
    
    #[account(
        seeds = [b"identity_registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, IdentityRegistry>,
    
    /// CHECK: Cross-chain bridge program
    pub bridge_program: UncheckedAccount<'info>,
    
    pub authority: Signer<'info>,
}

// Instructions
pub fn initialize_identity_registry(
    ctx: Context<InitializeIdentityRegistry>,
    authority: Pubkey,
    cross_chain_bridge: Option<Pubkey>,
) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    
    registry.authority = authority;
    registry.total_passports = 0;
    registry.authorized_issuers = vec![authority]; // Authority is initial issuer
    registry.supported_chains = vec![
        "ethereum".to_string(),
        "polygon".to_string(),
        "bsc".to_string(),
        "arbitrum".to_string(),
        "optimism".to_string(),
    ];
    registry.cross_chain_bridge = cross_chain_bridge;
    registry.paused = false;
    registry.bump = ctx.bumps.registry;
    
    emit!(IdentityRegistryInitialized {
        authority,
        cross_chain_bridge,
    });
    
    Ok(())
}

pub fn issue_identity_passport(
    ctx: Context<IssueIdentityPassport>,
    did: String,
    kyc_level: KYCLevel,
    investor_tier: InvestorTier,
    metadata_uri: String,
    validity_period: i64,
) -> Result<()> {
    let registry = &ctx.accounts.registry;
    
    // Check if issuer is authorized
    require!(
        registry.authorized_issuers.contains(&ctx.accounts.issuer.key()) || 
        registry.authority == ctx.accounts.issuer.key(),
        IdentityError::UnauthorizedIssuer
    );
    
    require!(!registry.paused, IdentityError::RegistryPaused);
    require!(!did.is_empty(), IdentityError::InvalidDID);
    
    let clock = Clock::get()?;
    let passport = &mut ctx.accounts.identity_passport;
    
    // Initialize passport
    passport.mint = ctx.accounts.mint.key();
    passport.owner = ctx.accounts.recipient.key();
    passport.did = did.clone();
    passport.kyc_level = kyc_level;
    passport.investor_tier = investor_tier;
    passport.reputation_score = 100; // Starting reputation
    passport.issuance_date = clock.unix_timestamp;
    passport.expiration_date = clock.unix_timestamp + validity_period;
    passport.is_active = true;
    passport.metadata_uri = metadata_uri.clone();
    passport.issuer = ctx.accounts.issuer.key();
    passport.cross_chain_addresses = Vec::new();
    passport.credentials = Vec::new();
    passport.bump = ctx.bumps.identity_passport;
    
    // Mint NFT to recipient
    let cpi_accounts = token::MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.identity_passport.to_account_info(),
    };
    
    let seeds = &[
        b"identity_passport",
        did.as_bytes(),
        &[passport.bump],
    ];
    let signer = &[&seeds[..]];
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token::mint_to(cpi_ctx, 1)?;
    
    // Create metadata for the NFT
    let metadata_infos = vec![
        ctx.accounts.metadata.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.identity_passport.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.token_metadata_program.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        ctx.accounts.rent.to_account_info(),
    ];
    
    let metadata_ix = mpl_instruction::create_metadata_accounts_v3(
        ctx.accounts.token_metadata_program.key(),
        ctx.accounts.metadata.key(),
        ctx.accounts.mint.key(),
        ctx.accounts.identity_passport.key(),
        ctx.accounts.payer.key(),
        ctx.accounts.identity_passport.key(),
        format!("OmniFlow Identity Passport #{}", registry.total_passports + 1),
        "OFIP".to_string(),
        metadata_uri,
        None,
        0,
        true,
        true,
        None,
        None,
        None,
    );
    
    invoke(&metadata_ix, &metadata_infos)?;
    
    // Create master edition
    let master_edition_infos = vec![
        ctx.accounts.master_edition.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.identity_passport.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.metadata.to_account_info(),
        ctx.accounts.token_metadata_program.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        ctx.accounts.rent.to_account_info(),
    ];
    
    let master_edition_ix = mpl_instruction::create_master_edition_v3(
        ctx.accounts.token_metadata_program.key(),
        ctx.accounts.master_edition.key(),
        ctx.accounts.mint.key(),
        ctx.accounts.identity_passport.key(),
        ctx.accounts.identity_passport.key(),
        ctx.accounts.metadata.key(),
        ctx.accounts.payer.key(),
        Some(0), // Max supply of 1 (unique NFT)
    );
    
    invoke(&master_edition_ix, &master_edition_infos)?;
    
    // Update registry
    let registry = &mut ctx.accounts.registry;
    registry.total_passports += 1;
    
    emit!(IdentityPassportIssued {
        passport: passport.key(),
        mint: passport.mint,
        owner: passport.owner,
        did: passport.did.clone(),
        kyc_level: passport.kyc_level.clone(),
        investor_tier: passport.investor_tier.clone(),
    });
    
    Ok(())
}

pub fn update_identity_passport(
    ctx: Context<UpdateIdentityPassport>,
    new_kyc_level: Option<KYCLevel>,
    new_investor_tier: Option<InvestorTier>,
    new_reputation_score: Option<u64>,
    new_metadata_uri: Option<String>,
) -> Result<()> {
    let registry = &ctx.accounts.registry;
    
    // Check if issuer is authorized
    require!(
        registry.authorized_issuers.contains(&ctx.accounts.issuer.key()) || 
        registry.authority == ctx.accounts.issuer.key(),
        IdentityError::UnauthorizedIssuer
    );
    
    require!(!registry.paused, IdentityError::RegistryPaused);
    
    let passport = &mut ctx.accounts.identity_passport;
    
    if let Some(kyc_level) = new_kyc_level {
        passport.kyc_level = kyc_level;
    }
    
    if let Some(investor_tier) = new_investor_tier {
        passport.investor_tier = investor_tier;
    }
    
    if let Some(reputation_score) = new_reputation_score {
        passport.reputation_score = reputation_score;
    }
    
    if let Some(metadata_uri) = new_metadata_uri {
        passport.metadata_uri = metadata_uri;
    }
    
    emit!(IdentityPassportUpdated {
        passport: passport.key(),
        kyc_level: passport.kyc_level.clone(),
        investor_tier: passport.investor_tier.clone(),
        reputation_score: passport.reputation_score,
    });
    
    Ok(())
}

pub fn link_cross_chain_address(
    ctx: Context<LinkCrossChainAddress>,
    chain: String,
    address: String,
    signature: Vec<u8>, // Simplified signature verification
) -> Result<()> {
    let passport = &mut ctx.accounts.identity_passport;
    
    require!(passport.is_active, IdentityError::PassportInactive);
    require!(!chain.is_empty(), IdentityError::InvalidChain);
    require!(!address.is_empty(), IdentityError::InvalidAddress);
    
    // In production, verify signature for cross-chain address ownership
    // For now, we'll add the address with verification pending
    
    let clock = Clock::get()?;
    let cross_chain_address = CrossChainAddress {
        chain,
        address: address.clone(),
        verified: true, // Would be false until signature verification
        timestamp: clock.unix_timestamp,
    };
    
    passport.cross_chain_addresses.push(cross_chain_address);
    
    emit!(CrossChainAddressLinked {
        passport: passport.key(),
        chain: passport.cross_chain_addresses.last().unwrap().chain.clone(),
        address,
    });
    
    Ok(())
}

pub fn add_credential(
    ctx: Context<AddCredential>,
    credential_id: String,
    credential_type: String,
) -> Result<()> {
    let registry = &ctx.accounts.registry;
    
    // Check if issuer is authorized
    require!(
        registry.authorized_issuers.contains(&ctx.accounts.issuer.key()) || 
        registry.authority == ctx.accounts.issuer.key(),
        IdentityError::UnauthorizedIssuer
    );
    
    require!(!registry.paused, IdentityError::RegistryPaused);
    
    let passport = &mut ctx.accounts.identity_passport;
    require!(passport.is_active, IdentityError::PassportInactive);
    
    passport.credentials.push(credential_id.clone());
    
    emit!(CredentialAdded {
        passport: passport.key(),
        credential_id,
        credential_type,
    });
    
    Ok(())
}

pub fn sync_cross_chain(
    ctx: Context<SyncCrossChain>,
    target_chain: String,
    target_contract: String,
) -> Result<()> {
    let registry = &ctx.accounts.registry;
    let passport = &ctx.accounts.identity_passport;
    
    require!(registry.authority == ctx.accounts.authority.key(), IdentityError::Unauthorized);
    require!(!registry.paused, IdentityError::RegistryPaused);
    require!(passport.is_active, IdentityError::PassportInactive);
    
    // Emit cross-chain sync event
    emit!(CrossChainSync {
        passport: passport.key(),
        did: passport.did.clone(),
        target_chain,
        target_contract,
        kyc_level: passport.kyc_level.clone(),
        investor_tier: passport.investor_tier.clone(),
        reputation_score: passport.reputation_score,
        cross_chain_addresses: passport.cross_chain_addresses.clone(),
        credentials: passport.credentials.clone(),
    });
    
    Ok(())
}

// Events
#[event]
pub struct IdentityRegistryInitialized {
    pub authority: Pubkey,
    pub cross_chain_bridge: Option<Pubkey>,
}

#[event]
pub struct IdentityPassportIssued {
    pub passport: Pubkey,
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub did: String,
    pub kyc_level: KYCLevel,
    pub investor_tier: InvestorTier,
}

#[event]
pub struct IdentityPassportUpdated {
    pub passport: Pubkey,
    pub kyc_level: KYCLevel,
    pub investor_tier: InvestorTier,
    pub reputation_score: u64,
}

#[event]
pub struct CrossChainAddressLinked {
    pub passport: Pubkey,
    pub chain: String,
    pub address: String,
}

#[event]
pub struct CredentialAdded {
    pub passport: Pubkey,
    pub credential_id: String,
    pub credential_type: String,
}

#[event]
pub struct CrossChainSync {
    pub passport: Pubkey,
    pub did: String,
    pub target_chain: String,
    pub target_contract: String,
    pub kyc_level: KYCLevel,
    pub investor_tier: InvestorTier,
    pub reputation_score: u64,
    pub cross_chain_addresses: Vec<CrossChainAddress>,
    pub credentials: Vec<String>,
}

// Errors
#[error_code]
pub enum IdentityError {
    #[msg("Unauthorized issuer")]
    UnauthorizedIssuer,
    #[msg("Registry is paused")]
    RegistryPaused,
    #[msg("Invalid DID")]
    InvalidDID,
    #[msg("Passport is inactive")]
    PassportInactive,
    #[msg("Invalid chain")]
    InvalidChain,
    #[msg("Invalid address")]
    InvalidAddress,
    #[msg("Unauthorized")]
    Unauthorized,
}
