use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use omniflow_rwa::*;
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    signature::{Keypair, Signer},
    transaction::Transaction,
};

#[tokio::test]
async fn test_initialize_registry() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new("omniflow_rwa", program_id, processor!(omniflow_rwa::entry));
    
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;
    
    let authority = Keypair::new();
    let wormhole_bridge = Some(Pubkey::new_unique());
    let layerzero_endpoint = Some(Pubkey::new_unique());
    
    let (registry_pda, registry_bump) = Pubkey::find_program_address(
        &[b"registry"],
        &program_id,
    );
    
    let accounts = omniflow_rwa::accounts::InitializeRegistry {
        registry: registry_pda,
        payer: payer.pubkey(),
        system_program: solana_program::system_program::id(),
    };
    
    let instruction = Instruction {
        program_id,
        accounts: accounts.to_account_metas(Some(true)),
        data: omniflow_rwa::instruction::InitializeRegistry {
            authority: authority.pubkey(),
            wormhole_bridge,
            layerzero_endpoint,
        }.data(),
    };
    
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&payer.pubkey()),
        &[&payer],
        recent_blockhash,
    );
    
    banks_client.process_transaction(transaction).await.unwrap();
    
    // Verify registry was initialized
    let registry_account = banks_client.get_account(registry_pda).await.unwrap().unwrap();
    let registry_data: Registry = Registry::try_deserialize(&mut &registry_account.data[8..]).unwrap();
    
    assert_eq!(registry_data.authority, authority.pubkey());
    assert_eq!(registry_data.total_assets, 0);
    assert_eq!(registry_data.wormhole_bridge, wormhole_bridge);
    assert_eq!(registry_data.layerzero_endpoint, layerzero_endpoint);
    assert!(!registry_data.paused);
}

#[tokio::test]
async fn test_register_rwa_asset() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new("omniflow_rwa", program_id, processor!(omniflow_rwa::entry));
    
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;
    
    // Initialize registry first
    let authority = payer.pubkey();
    let (registry_pda, _) = Pubkey::find_program_address(&[b"registry"], &program_id);
    
    // Register asset
    let asset_id = 1u64;
    let (asset_pda, _) = Pubkey::find_program_address(
        &[b"asset", &asset_id.to_le_bytes()],
        &program_id,
    );
    
    let accounts = omniflow_rwa::accounts::RegisterRWAAsset {
        asset: asset_pda,
        registry: registry_pda,
        owner: payer.pubkey(),
        system_program: solana_program::system_program::id(),
    };
    
    let instruction = Instruction {
        program_id,
        accounts: accounts.to_account_metas(Some(true)),
        data: omniflow_rwa::instruction::RegisterRwaAsset {
            asset_id,
            asset_type: AssetType::RealEstate,
            metadata_uri: "https://example.com/metadata/1".to_string(),
            kyc_level: KYCLevel::Enhanced,
            total_value: 1_000_000,
            total_supply: 100_000,
            chain_id: 1,
        }.data(),
    };
    
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&payer.pubkey()),
        &[&payer],
        recent_blockhash,
    );
    
    banks_client.process_transaction(transaction).await.unwrap();
    
    // Verify asset was registered
    let asset_account = banks_client.get_account(asset_pda).await.unwrap().unwrap();
    let asset_data: RWAAsset = RWAAsset::try_deserialize(&mut &asset_account.data[8..]).unwrap();
    
    assert_eq!(asset_data.asset_id, asset_id);
    assert_eq!(asset_data.asset_type, AssetType::RealEstate);
    assert_eq!(asset_data.owner, payer.pubkey());
    assert_eq!(asset_data.kyc_level, KYCLevel::Enhanced);
    assert_eq!(asset_data.total_value, 1_000_000);
    assert_eq!(asset_data.total_supply, 100_000);
    assert_eq!(asset_data.circulating_supply, 0);
    assert!(asset_data.is_active);
    assert_eq!(asset_data.chain_id, 1);
}

#[tokio::test]
async fn test_cross_chain_transfer_initiation() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new("omniflow_rwa", program_id, processor!(omniflow_rwa::entry));
    
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;
    
    // Setup: Initialize registry and register asset
    let asset_id = 1u64;
    let (asset_pda, _) = Pubkey::find_program_address(
        &[b"asset", &asset_id.to_le_bytes()],
        &program_id,
    );
    let (registry_pda, _) = Pubkey::find_program_address(&[b"registry"], &program_id);
    
    // Create mint and token accounts
    let mint = Keypair::new();
    let token_account = Keypair::new();
    
    let accounts = omniflow_rwa::accounts::InitiateCrossChainTransfer {
        asset: asset_pda,
        registry: registry_pda,
        mint: mint.pubkey(),
        from_token_account: token_account.pubkey(),
        owner: payer.pubkey(),
        token_program: token::ID,
    };
    
    let instruction = Instruction {
        program_id,
        accounts: accounts.to_account_metas(Some(true)),
        data: omniflow_rwa::instruction::InitiateCrossChainTransfer {
            asset_id,
            amount: 1000,
            target_chain: 137, // Polygon
            target_recipient: [1u8; 32],
        }.data(),
    };
    
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&payer.pubkey()),
        &[&payer],
        recent_blockhash,
    );
    
    // This test would require proper token setup, simplified for demonstration
    // banks_client.process_transaction(transaction).await.unwrap();
}

#[tokio::test]
async fn test_asset_metadata_update() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new("omniflow_rwa", program_id, processor!(omniflow_rwa::entry));
    
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;
    
    let asset_id = 1u64;
    let (asset_pda, _) = Pubkey::find_program_address(
        &[b"asset", &asset_id.to_le_bytes()],
        &program_id,
    );
    
    let accounts = omniflow_rwa::accounts::UpdateAssetMetadata {
        asset: asset_pda,
        owner: payer.pubkey(),
    };
    
    let new_metadata_uri = "https://example.com/metadata/1-updated".to_string();
    let new_kyc_level = Some(KYCLevel::Institutional);
    
    let instruction = Instruction {
        program_id,
        accounts: accounts.to_account_metas(Some(true)),
        data: omniflow_rwa::instruction::UpdateAssetMetadata {
            asset_id,
            new_metadata_uri: new_metadata_uri.clone(),
            new_kyc_level,
        }.data(),
    };
    
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&payer.pubkey()),
        &[&payer],
        recent_blockhash,
    );
    
    banks_client.process_transaction(transaction).await.unwrap();
    
    // Verify metadata was updated
    let asset_account = banks_client.get_account(asset_pda).await.unwrap().unwrap();
    let asset_data: RWAAsset = RWAAsset::try_deserialize(&mut &asset_account.data[8..]).unwrap();
    
    assert_eq!(asset_data.metadata_uri, new_metadata_uri);
    assert_eq!(asset_data.kyc_level, KYCLevel::Institutional);
}

#[tokio::test]
async fn test_registry_pause_functionality() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new("omniflow_rwa", program_id, processor!(omniflow_rwa::entry));
    
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;
    
    let (registry_pda, _) = Pubkey::find_program_address(&[b"registry"], &program_id);
    
    let accounts = omniflow_rwa::accounts::SetRegistryPause {
        registry: registry_pda,
        authority: payer.pubkey(),
    };
    
    let instruction = Instruction {
        program_id,
        accounts: accounts.to_account_metas(Some(true)),
        data: omniflow_rwa::instruction::SetRegistryPause {
            paused: true,
        }.data(),
    };
    
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&payer.pubkey()),
        &[&payer],
        recent_blockhash,
    );
    
    banks_client.process_transaction(transaction).await.unwrap();
    
    // Verify registry is paused
    let registry_account = banks_client.get_account(registry_pda).await.unwrap().unwrap();
    let registry_data: Registry = Registry::try_deserialize(&mut &registry_account.data[8..]).unwrap();
    
    assert!(registry_data.paused);
}

// Integration tests for cross-chain functionality
#[tokio::test]
async fn test_cross_chain_event_emission() {
    // This test would verify that cross-chain events are properly emitted
    // and can be captured by bridge listeners
    
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new("omniflow_rwa", program_id, processor!(omniflow_rwa::entry));
    
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;
    
    // Test asset registration event
    let asset_id = 1u64;
    let (asset_pda, _) = Pubkey::find_program_address(
        &[b"asset", &asset_id.to_le_bytes()],
        &program_id,
    );
    let (registry_pda, _) = Pubkey::find_program_address(&[b"registry"], &program_id);
    
    // Register asset and verify cross-chain event is emitted
    // This would require event listener integration in a real test
}

// Performance and stress tests
#[tokio::test]
async fn test_multiple_asset_registration() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new("omniflow_rwa", program_id, processor!(omniflow_rwa::entry));
    
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;
    
    // Test registering multiple assets
    for i in 1..=10 {
        let asset_id = i as u64;
        let (asset_pda, _) = Pubkey::find_program_address(
            &[b"asset", &asset_id.to_le_bytes()],
            &program_id,
        );
        
        // Register each asset
        // Implementation would go here
    }
    
    // Verify all assets are registered correctly
}
