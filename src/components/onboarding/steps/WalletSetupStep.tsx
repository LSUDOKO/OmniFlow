"use client";

import React, { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Button,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Alert,
  AlertIcon,
  Code,
  Badge,
  Spinner,
  Input,
  FormControl,
  FormLabel,
  Divider,
  useToast,
} from "@chakra-ui/react";
import {
  FaWallet,
  FaShieldAlt,
  FaDownload,
  FaExternalLinkAlt,
  FaCheck,
  FaTimes,
  FaEnvelope,
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaDiscord,
  FaApple,
} from "react-icons/fa";
import { localizationService } from "../../../services/localizationService";
import { useWeb3Auth } from "../../../hooks/useWeb3Auth";

interface WalletSetupStepProps {
  data: any;
  onComplete: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function WalletSetupStep({ 
  data, 
  onComplete, 
  isLoading, 
  setIsLoading 
}: WalletSetupStepProps) {
  const [walletStatus, setWalletStatus] = useState<'none' | 'connecting' | 'connected' | 'error'>('none');
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [email, setEmail] = useState('');
  const [walletType, setWalletType] = useState<'social' | 'traditional'>('social');

  const cardBg = useColorModeValue("white", "gray.800");
  const t = localizationService.t;
  const toast = useToast();
  
  const {
    isInitialized,
    isConnected,
    user,
    wallet,
    login,
    loginWithEmail,
    error: web3AuthError
  } = useWeb3Auth();

  // Social login options with Web3Auth
  const socialLogins = [
    {
      id: 'google',
      name: 'Google',
      icon: FaGoogle,
      description: 'Sign in with your Google account',
      color: 'red.500',
      features: ['Instant Setup', 'Seedless Wallet', 'Auto-Backup']
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebook,
      description: 'Sign in with your Facebook account',
      color: 'blue.600',
      features: ['Social Recovery', 'Easy Access', 'Secure Login']
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: FaTwitter,
      description: 'Sign in with your Twitter account',
      color: 'twitter.500',
      features: ['Quick Setup', 'Social Proof', 'Web3 Native']
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: FaDiscord,
      description: 'Sign in with your Discord account',
      color: 'purple.600',
      features: ['Community Access', 'Gaming Ready', 'Instant Wallet']
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: FaApple,
      description: 'Sign in with your Apple ID',
      color: 'gray.800',
      features: ['Privacy First', 'Biometric Auth', 'Secure Enclave']
    }
  ];

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Most popular Ethereum wallet',
      downloadUrl: 'https://metamask.io/download/',
      isInstalled: typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
      features: ['Browser Extension', 'Mobile App', 'Hardware Wallet Support']
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect any mobile wallet',
      downloadUrl: 'https://walletconnect.com/',
      isInstalled: true, // Always available
      features: ['Mobile Wallets', 'QR Code', 'Cross-Platform']
    }
  ];

  // Handle social login with Web3Auth
  const handleSocialLogin = async (provider: string) => {
    if (!isInitialized) {
      toast({
        title: 'Initializing...',
        description: 'Please wait while we initialize the wallet system.',
        status: 'info',
        duration: 3000,
      });
      return;
    }

    setSelectedWallet(provider);
    setWalletStatus('connecting');
    setIsLoading(true);

    try {
      await login(provider);
      
      if (wallet) {
        setWalletAddress(wallet.address);
        setWalletStatus('connected');
        
        // Complete the step with Web3Auth data
        onComplete({
          walletAddress: wallet.address,
          walletType: 'web3auth',
          socialProvider: provider,
          userInfo: user,
          walletConnected: true,
          seedless: true
        });

        toast({
          title: 'Wallet Created Successfully!',
          description: `Your seedless wallet has been created with ${provider}`,
          status: 'success',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Social login error:', error);
      setWalletStatus('error');
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to create wallet with social login',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email login
  const handleEmailLogin = async () => {
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setSelectedWallet('email');
    setWalletStatus('connecting');
    setIsLoading(true);

    try {
      await loginWithEmail(email);
      
      if (wallet) {
        setWalletAddress(wallet.address);
        setWalletStatus('connected');
        
        // Complete the step with Web3Auth data
        onComplete({
          walletAddress: wallet.address,
          walletType: 'web3auth',
          socialProvider: 'email',
          email: email,
          userInfo: user,
          walletConnected: true,
          seedless: true
        });

        toast({
          title: 'Wallet Created Successfully!',
          description: `Your seedless wallet has been created with email: ${email}`,
          status: 'success',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Email login error:', error);
      setWalletStatus('error');
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to create wallet with email',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (walletId: string) => {
    setSelectedWallet(walletId);
    setWalletStatus('connecting');
    setIsLoading(true);

    try {
      let address = '';
      switch (walletId) {
        case 'metamask':
          if ((window as any).ethereum?.isMetaMask) {
            const accounts = await (window as any).ethereum.request({
              method: 'eth_requestAccounts'
            });
            address = accounts[0];
          } else {
            throw new Error('MetaMask not installed');
          }
          break;
        case 'walletconnect':
          // Use Web3Auth WalletConnect adapter
          await login('walletconnect');
          if (wallet) {
            address = wallet.address;
          }
          break;
        default:
          throw new Error('Unsupported wallet');
      }

      setWalletAddress(address);
      setWalletStatus('connected');
      
      // Complete the step
      onComplete({ 
        walletAddress: address, 
        walletType: walletId,
        walletConnected: true 
      });

    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Check if Web3Auth is already connected
  useEffect(() => {
    if (isConnected && wallet && user) {
      setWalletAddress(wallet.address);
      setWalletStatus('connected');
      onComplete({
        walletAddress: wallet.address,
        walletType: 'web3auth',
        userInfo: user,
        walletConnected: true,
        seedless: true
      });
    }
  }, [isConnected, wallet, user, onComplete]);

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <VStack spacing={4} textAlign="center">
        <Icon as={FaWallet} boxSize={12} color="purple.500" />
        <Heading size="lg" color="gray.800">
          Create Your Web3 Wallet
        </Heading>
        <Text color="gray.600" maxW="2xl">
          Choose how you'd like to create your wallet. We recommend starting with email or social login for the easiest experience.
        </Text>
      </VStack>

      {/* Wallet Type Toggle */}
      <HStack justify="center" spacing={4}>
        <Button
          variant={walletType === 'social' ? 'solid' : 'outline'}
          colorScheme="purple"
          onClick={() => setWalletType('social')}
          leftIcon={<Icon as={FaEnvelope} />}
        >
          Email & Social
        </Button>
        <Button
          variant={walletType === 'traditional' ? 'solid' : 'outline'}
          colorScheme="purple"
          onClick={() => setWalletType('traditional')}
          leftIcon={<Icon as={FaWallet} />}
        >
          Traditional Wallets
        </Button>
      </HStack>

      {/* Connection Status */}
      {walletStatus === 'connected' && (
        <Alert status="success" rounded="lg">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">Wallet Connected Successfully!</Text>
            <HStack>
              <Text fontSize="sm">Address:</Text>
              <Code fontSize="sm">{formatAddress(walletAddress)}</Code>
            </HStack>
            {user && (
              <Text fontSize="sm" color="gray.600">
                Connected with: {user.email || user.name || selectedWallet}
              </Text>
            )}
          </VStack>
        </Alert>
      )}

      {walletStatus === 'error' && (
        <Alert status="error" rounded="lg">
          <AlertIcon />
          <Text>Failed to create wallet. Please try again or select a different method.</Text>
        </Alert>
      )}

      {/* Social Login Options */}
      {walletType === 'social' && (
        <VStack spacing={6}>
          {/* Email Login */}
          <Box w="full">
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <HStack>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isDisabled={walletStatus === 'connecting'}
                />
                <Button
                  colorScheme="purple"
                  onClick={handleEmailLogin}
                  isLoading={selectedWallet === 'email' && walletStatus === 'connecting'}
                  loadingText="Creating..."
                  leftIcon={<Icon as={FaEnvelope} />}
                  minW="120px"
                >
                  Create Wallet
                </Button>
              </HStack>
            </FormControl>
          </Box>

          <Divider />

          {/* Social Login Options */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {socialLogins.map((social) => (
              <Button
                key={social.id}
                size="lg"
                variant="outline"
                leftIcon={<Icon as={social.icon} color={social.color} />}
                onClick={() => handleSocialLogin(social.id)}
                isLoading={selectedWallet === social.id && walletStatus === 'connecting'}
                loadingText="Creating..."
                isDisabled={walletStatus === 'connected'}
                _hover={{ bg: `${social.color.split('.')[0]}.50` }}
              >
                Continue with {social.name}
              </Button>
            ))}
          </SimpleGrid>

          {/* Benefits of Social Login */}
          <Box bg="purple.50" p={4} rounded="lg" border="1px solid" borderColor="purple.200">
            <VStack spacing={2}>
              <Text fontWeight="bold" color="purple.800">✨ Benefits of Seedless Wallets</Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2} w="full">
                <HStack>
                  <Icon as={FaCheck} color="green.500" boxSize={3} />
                  <Text fontSize="sm" color="purple.700">No seed phrases to remember</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheck} color="green.500" boxSize={3} />
                  <Text fontSize="sm" color="purple.700">Instant wallet creation</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheck} color="green.500" boxSize={3} />
                  <Text fontSize="sm" color="purple.700">Social recovery options</Text>
                </HStack>
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      )}

      {/* Traditional Wallet Options */}
      {walletType === 'traditional' && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {wallets.map((wallet) => (
            <Box
              key={wallet.id}
              bg={cardBg}
              p={6}
              rounded="xl"
              border="2px solid"
              borderColor={
                selectedWallet === wallet.id && walletStatus === 'connecting'
                  ? "purple.500"
                  : wallet.isInstalled
                  ? "green.200"
                  : "gray.200"
              }
              shadow="md"
              _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
              transition="all 0.2s"
              position="relative"
          >
            {/* Status Indicators */}
            {wallet.isInstalled ? (
              <Badge
                position="absolute"
                top={3}
                right={3}
                colorScheme="green"
                variant="solid"
                fontSize="xs"
              >
                <Icon as={FaCheck} mr={1} />
                Installed
              </Badge>
            ) : (
              <Badge
                position="absolute"
                top={3}
                right={3}
                colorScheme="orange"
                variant="outline"
                fontSize="xs"
              >
                Not Installed
              </Badge>
            )}

            <VStack spacing={4} align="start">
              {/* Wallet Header */}
              <HStack>
                <Text fontSize="2xl">{wallet.icon}</Text>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="lg">
                    {wallet.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {wallet.description}
                  </Text>
                </VStack>
              </HStack>

              {/* Features */}
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                  Features:
                </Text>
                <VStack align="start" spacing={1}>
                  {wallet.features.map((feature) => (
                    <HStack key={feature} spacing={2}>
                      <Icon as={FaCheck} color="green.500" boxSize={3} />
                      <Text fontSize="xs" color="gray.600">
                        {feature}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* Action Button */}
              {wallet.isInstalled ? (
                <Button
                  colorScheme="purple"
                  size="sm"
                  w="full"
                  onClick={() => connectWallet(wallet.id)}
                  isLoading={selectedWallet === wallet.id && walletStatus === 'connecting'}
                  loadingText="Connecting..."
                  isDisabled={walletStatus === 'connected' && selectedWallet !== wallet.id}
                  leftIcon={
                    walletStatus === 'connected' && selectedWallet === wallet.id
                      ? <Icon as={FaCheck} />
                      : <Icon as={FaWallet} />
                  }
                >
                  {walletStatus === 'connected' && selectedWallet === wallet.id
                    ? 'Connected'
                    : 'Connect Wallet'
                  }
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  w="full"
                  as="a"
                  href={wallet.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<Icon as={FaDownload} />}
                  rightIcon={<Icon as={FaExternalLinkAlt} />}
                >
                  Install {wallet.name}
                </Button>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
      )}

      {/* Security Notice */}
      <Box
        bg="blue.50"
        p={6}
        rounded="lg"
        border="1px solid"
        borderColor="blue.200"
      >
        <VStack spacing={3}>
          <Icon as={FaShieldAlt} color="blue.500" boxSize={6} />
          <Heading size="md" color="blue.800">
            Security Best Practices
          </Heading>
          <VStack spacing={2} align="start" w="full">
            <HStack>
              <Icon as={FaCheck} color="green.500" boxSize={4} />
              <Text fontSize="sm" color="blue.700">
                Never share your private keys or seed phrase
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaCheck} color="green.500" boxSize={4} />
              <Text fontSize="sm" color="blue.700">
                Always verify transaction details before signing
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaCheck} color="green.500" boxSize={4} />
              <Text fontSize="sm" color="blue.700">
                Use hardware wallets for large amounts
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaCheck} color="green.500" boxSize={4} />
              <Text fontSize="sm" color="blue.700">
                Keep your wallet software updated
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>

      {/* Help Section */}
      <Box textAlign="center">
        <Text fontSize="sm" color="gray.500" mb={2}>
          Need help setting up a wallet?
        </Text>
        <Button variant="link" size="sm" colorScheme="purple">
          View Wallet Setup Guide
        </Button>
      </Box>
    </VStack>
  );
}
