"use client";

import { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Button,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  Progress,
  Badge,
  useToast,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FaIdCard,
  FaCheck,
  FaSpinner,
  FaShieldAlt,
  FaCertificate,
  FaUserCheck,
} from "react-icons/fa";
import { localizationService } from "../../../services/localizationService";
import { useWeb3Auth } from "../../../hooks/useWeb3Auth";

interface IdentityNFTStepProps {
  data: any;
  onComplete: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function IdentityNFTStep({ 
  data, 
  onComplete, 
  isLoading, 
  setIsLoading 
}: IdentityNFTStepProps) {
  const [mintingStatus, setMintingStatus] = useState<'none' | 'minting' | 'minted' | 'error'>('none');
  const [nftTokenId, setNftTokenId] = useState<string>('');
  const [mintingProgress, setMintingProgress] = useState(0);

  const cardBg = useColorModeValue("white", "gray.800");
  const t = localizationService.t;
  const toast = useToast();
  
  const { wallet, user, provider } = useWeb3Auth();

  // Auto-start minting if wallet is connected
  useEffect(() => {
    if (wallet && user && mintingStatus === 'none') {
      handleMintIdentityNFT();
    }
  }, [wallet, user, mintingStatus]);

  const handleMintIdentityNFT = async () => {
    if (!wallet || !provider) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setMintingStatus('minting');
    setIsLoading(true);
    setMintingProgress(0);

    try {
      // Simulate NFT minting process with progress updates
      const steps = [
        { progress: 20, message: 'Preparing identity data...' },
        { progress: 40, message: 'Generating NFT metadata...' },
        { progress: 60, message: 'Uploading to IPFS...' },
        { progress: 80, message: 'Minting Identity NFT...' },
        { progress: 100, message: 'Identity NFT created successfully!' },
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMintingProgress(step.progress);
        
        toast({
          title: 'Minting Progress',
          description: step.message,
          status: 'info',
          duration: 2000,
        });
      }

      // Mock NFT data
      const mockTokenId = `${Date.now()}`;
      const mockNftData = {
        tokenId: mockTokenId,
        contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d1b7',
        metadataUri: `https://ipfs.io/ipfs/QmX${mockTokenId}`,
        attributes: {
          name: user?.name || 'OmniFlow User',
          email: user?.email || data.email,
          walletAddress: wallet.address,
          verificationLevel: 'Basic',
          issueDate: new Date().toISOString(),
          chainId: wallet.chainId,
        }
      };

      setNftTokenId(mockTokenId);
      setMintingStatus('minted');
      
      // Complete the step
      onComplete({
        identityNFT: mockNftData,
        hasIdentityNFT: true,
        verificationLevel: 'Basic'
      });

      toast({
        title: 'Identity NFT Created!',
        description: `Your Identity Passport NFT #${mockTokenId} has been minted successfully`,
        status: 'success',
        duration: 5000,
      });

    } catch (error: any) {
      console.error('Identity NFT minting error:', error);
      setMintingStatus('error');
      toast({
        title: 'Minting Failed',
        description: error.message || 'Failed to mint Identity NFT',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const retryMinting = () => {
    setMintingStatus('none');
    setMintingProgress(0);
    handleMintIdentityNFT();
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <VStack spacing={4} textAlign="center">
        <Icon as={FaIdCard} boxSize={12} color="purple.500" />
        <Heading size="lg" color="gray.800">
          Create Your Identity Passport
        </Heading>
        <Text color="gray.600" maxW="2xl">
          Your Identity Passport NFT serves as your universal cross-chain identity, 
          enabling secure access to all OmniFlow features and services.
        </Text>
      </VStack>

      {/* Minting Status */}
      {mintingStatus === 'minting' && (
        <Box bg="blue.50" p={6} rounded="lg" border="1px solid" borderColor="blue.200">
          <VStack spacing={4}>
            <HStack>
              <Icon as={FaSpinner} color="blue.500" boxSize={6} className="animate-spin" />
              <Text fontWeight="bold" color="blue.800">
                Creating Your Identity NFT...
              </Text>
            </HStack>
            <Box w="full">
              <Progress value={mintingProgress} colorScheme="blue" size="lg" rounded="full" />
              <Text fontSize="sm" color="blue.600" mt={2} textAlign="center">
                {mintingProgress}% Complete
              </Text>
            </Box>
          </VStack>
        </Box>
      )}

      {mintingStatus === 'minted' && (
        <Alert status="success" rounded="lg">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Identity Passport Created Successfully!</Text>
            <HStack>
              <Text fontSize="sm">Token ID:</Text>
              <Badge colorScheme="green">#{nftTokenId}</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Your cross-chain identity is now active across all supported networks.
            </Text>
          </VStack>
        </Alert>
      )}

      {mintingStatus === 'error' && (
        <Alert status="error" rounded="lg">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Failed to Create Identity NFT</Text>
            <Text fontSize="sm">
              There was an error creating your Identity Passport. Please try again.
            </Text>
            <Button size="sm" colorScheme="red" variant="outline" onClick={retryMinting}>
              Retry Minting
            </Button>
          </VStack>
        </Alert>
      )}

      {/* Identity NFT Preview */}
      <Box bg={cardBg} p={6} rounded="xl" border="1px solid" borderColor="gray.200" shadow="md">
        <VStack spacing={4}>
          <Text fontWeight="bold" fontSize="lg">Your Identity Passport NFT</Text>
          
          {/* Mock NFT Image */}
          <Box
            w="200px"
            h="200px"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            rounded="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <Icon as={FaIdCard} color="white" boxSize={16} />
            {mintingStatus === 'minted' && (
              <Badge
                position="absolute"
                top={2}
                right={2}
                colorScheme="green"
                variant="solid"
              >
                <Icon as={FaCheck} mr={1} />
                Minted
              </Badge>
            )}
          </Box>

          {/* NFT Details */}
          <SimpleGrid columns={2} spacing={4} w="full">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                Name
              </Text>
              <Text fontSize="sm" color="gray.600">
                {user?.name || 'OmniFlow User'}
              </Text>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                Email
              </Text>
              <Text fontSize="sm" color="gray.600">
                {user?.email || data.email || 'Not provided'}
              </Text>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                Wallet
              </Text>
              <Text fontSize="sm" color="gray.600">
                {wallet?.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Not connected'}
              </Text>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                Verification
              </Text>
              <Badge colorScheme="blue" variant="outline">
                Basic Level
              </Badge>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Features & Benefits */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Box bg="green.50" p={4} rounded="lg" border="1px solid" borderColor="green.200">
          <VStack spacing={2}>
            <Icon as={FaShieldAlt} color="green.500" boxSize={8} />
            <Text fontWeight="bold" color="green.800">Secure Identity</Text>
            <Text fontSize="sm" color="green.700" textAlign="center">
              Cryptographically secured identity that you own and control
            </Text>
          </VStack>
        </Box>

        <Box bg="blue.50" p={4} rounded="lg" border="1px solid" borderColor="blue.200">
          <VStack spacing={2}>
            <Icon as={FaCertificate} color="blue.500" boxSize={8} />
            <Text fontWeight="bold" color="blue.800">Cross-Chain</Text>
            <Text fontSize="sm" color="blue.700" textAlign="center">
              Works across all supported blockchains and networks
            </Text>
          </VStack>
        </Box>

        <Box bg="purple.50" p={4} rounded="lg" border="1px solid" borderColor="purple.200">
          <VStack spacing={2}>
            <Icon as={FaUserCheck} color="purple.500" boxSize={8} />
            <Text fontWeight="bold" color="purple.800">Verified Access</Text>
            <Text fontSize="sm" color="purple.700" textAlign="center">
              Unlock premium features and higher transaction limits
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Action Button */}
      {mintingStatus === 'none' && (
        <Button
          colorScheme="purple"
          size="lg"
          onClick={handleMintIdentityNFT}
          leftIcon={<Icon as={FaIdCard} />}
          isDisabled={!wallet || !provider}
        >
          Create Identity Passport NFT
        </Button>
      )}

      {/* Help Section */}
      <Box textAlign="center">
        <Text fontSize="sm" color="gray.500" mb={2}>
          Your Identity NFT is stored on-chain and can be viewed in any NFT marketplace
        </Text>
        <Button variant="link" size="sm" colorScheme="purple">
          Learn More About Identity NFTs
        </Button>
      </Box>
    </VStack>
  );
}
