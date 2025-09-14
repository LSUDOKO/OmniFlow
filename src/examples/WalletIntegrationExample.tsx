"use client";

import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  useDisclosure,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Code,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useWallet } from '@/contexts/WalletContext';
import { SeamlessLogin, CompactLoginButton } from '@/components/wallet/SeamlessLogin';

/**
 * Complete example showing how to integrate Web3Auth + MetaMask Embedded Wallet
 * This example demonstrates:
 * 1. Seamless login with social providers
 * 2. Auto-connect functionality
 * 3. Wallet state management
 * 4. Chain switching
 * 5. User info display
 * 6. No seed phrase required
 */
export const WalletIntegrationExample: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  
  const {
    isConnected,
    isLoading,
    userInfo,
    walletInfo,
    address,
    balance,
    currentChain,
    supportedChains,
    login,
    logout,
    switchChain,
    autoConnect,
  } = useWallet();

  const handleChainSwitch = async (chainKey: string) => {
    setSelectedChain(chainKey);
    try {
      await switchChain(chainKey);
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  const formatBalance = (balance: string | null) => {
    if (!balance) return '0';
    const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
    return balanceInEth.toFixed(4);
  };

  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" color="gold.400" mb={4}>
            🚀 Seedless Wallet Integration Demo
          </Heading>
          <Text color="gray.300" fontSize="lg">
            Experience instant, seedless login with Web3Auth + MetaMask Embedded Wallet
          </Text>
        </Box>

        {/* Connection Status */}
        <Card bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)">
          <CardBody>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Text fontSize="lg" fontWeight="semibold" color="white">
                    Wallet Status:
                  </Text>
                  <Badge 
                    colorScheme={isConnected ? "green" : "red"} 
                    variant="subtle"
                    fontSize="sm"
                  >
                    {isConnected ? "Connected ✅" : "Disconnected ❌"}
                  </Badge>
                </HStack>
                {isConnected && (
                  <Text fontSize="sm" color="gray.400">
                    No seed phrase required - secured by social login
                  </Text>
                )}
              </VStack>
              
              <CompactLoginButton onOpen={onOpen} />
            </HStack>
          </CardBody>
        </Card>

        {/* User Information */}
        {isConnected && userInfo && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)">
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md" color="gold.400">
                    👤 User Profile
                  </Heading>
                  <VStack align="start" spacing={2} w="full">
                    <HStack justify="space-between" w="full">
                      <Text color="gray.400">Name:</Text>
                      <Text color="white">{userInfo.name || 'Anonymous'}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color="gray.400">Email:</Text>
                      <Text color="white" fontSize="sm">{userInfo.email}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color="gray.400">Login Method:</Text>
                      <Badge colorScheme="blue" variant="subtle">
                        {userInfo.typeOfLogin || 'Social'}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color="gray.400">MFA Enabled:</Text>
                      <Badge 
                        colorScheme={userInfo.isMfaEnabled ? "green" : "orange"} 
                        variant="subtle"
                      >
                        {userInfo.isMfaEnabled ? "Yes" : "No"}
                      </Badge>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)">
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md" color="gold.400">
                    💰 Wallet Details
                  </Heading>
                  <VStack align="start" spacing={2} w="full">
                    <HStack justify="space-between" w="full">
                      <Text color="gray.400">Address:</Text>
                      <Code colorScheme="blue" fontSize="sm">
                        {formatAddress(address)}
                      </Code>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color="gray.400">Balance:</Text>
                      <Text color="white" fontWeight="semibold">
                        {formatBalance(balance)} ETH
                      </Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color="gray.400">Network:</Text>
                      <Badge colorScheme="purple" variant="subtle">
                        {currentChain.charAt(0).toUpperCase() + currentChain.slice(1)}
                      </Badge>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

        {/* Chain Switching */}
        {isConnected && (
          <Card bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)">
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="md" color="gold.400">
                  🔗 Chain Switching
                </Heading>
                <Text color="gray.400" fontSize="sm">
                  Switch between supported blockchain networks seamlessly
                </Text>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} w="full">
                  {Object.entries(supportedChains).map(([key, config]: [string, any]) => (
                    <Button
                      key={key}
                      onClick={() => handleChainSwitch(key)}
                      variant={currentChain === key ? "royal" : "glass"}
                      size="sm"
                      isLoading={isLoading && selectedChain === key}
                      loadingText="Switching..."
                    >
                      {config.displayName}
                    </Button>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Integration Guide */}
        <Card bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)">
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="md" color="gold.400">
                📚 Integration Guide
              </Heading>
              
              <Alert status="info" bg="rgba(66, 153, 225, 0.1)" border="1px solid rgba(66, 153, 225, 0.3)">
                <AlertIcon color="blue.400" />
                <Box>
                  <AlertTitle color="blue.400">Quick Setup!</AlertTitle>
                  <AlertDescription color="gray.300">
                    This integration is already configured in your app. Here's how to use it:
                  </AlertDescription>
                </Box>
              </Alert>

              <VStack align="start" spacing={3} w="full">
                <Box>
                  <Text fontWeight="semibold" color="white" mb={2}>
                    1. Import the wallet hook:
                  </Text>
                  <Code p={3} bg="gray.800" color="green.300" fontSize="sm" w="full" display="block">
                    {`import { useWallet } from '@/contexts/WalletContext';`}
                  </Code>
                </Box>

                <Box>
                  <Text fontWeight="semibold" color="white" mb={2}>
                    2. Use the wallet in your component:
                  </Text>
                  <Code p={3} bg="gray.800" color="green.300" fontSize="sm" w="full" display="block" whiteSpace="pre-wrap">
{`const { 
  isConnected, 
  userInfo, 
  address, 
  login, 
  logout 
} = useWallet();`}
                  </Code>
                </Box>

                <Box>
                  <Text fontWeight="semibold" color="white" mb={2}>
                    3. Add the login component:
                  </Text>
                  <Code p={3} bg="gray.800" color="green.300" fontSize="sm" w="full" display="block" whiteSpace="pre-wrap">
{`import { SeamlessLogin } from '@/components/wallet/SeamlessLogin';

<SeamlessLogin 
  isOpen={isOpen} 
  onClose={onClose} 
  autoConnect={true} 
/>`}
                  </Code>
                </Box>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Features */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card bg="rgba(16, 185, 129, 0.1)" border="1px solid rgba(16, 185, 129, 0.3)">
            <CardBody textAlign="center">
              <Text fontSize="2xl" mb={2}>🔒</Text>
              <Heading size="sm" color="green.400" mb={2}>
                Seedless Security
              </Heading>
              <Text fontSize="sm" color="gray.300">
                No seed phrases to remember or lose. Your wallet is secured by your social login.
              </Text>
            </CardBody>
          </Card>

          <Card bg="rgba(245, 158, 11, 0.1)" border="1px solid rgba(245, 158, 11, 0.3)">
            <CardBody textAlign="center">
              <Text fontSize="2xl" mb={2}>⚡</Text>
              <Heading size="sm" color="gold.400" mb={2}>
                Instant Access
              </Heading>
              <Text fontSize="sm" color="gray.300">
                Login with Google, Facebook, Twitter, or any social provider in seconds.
              </Text>
            </CardBody>
          </Card>

          <Card bg="rgba(139, 92, 246, 0.1)" border="1px solid rgba(139, 92, 246, 0.3)">
            <CardBody textAlign="center">
              <Text fontSize="2xl" mb={2}>🌐</Text>
              <Heading size="sm" color="purple.400" mb={2}>
                Cross-Chain Ready
              </Heading>
              <Text fontSize="sm" color="gray.300">
                Switch between Ethereum, Polygon, BSC, and more with one click.
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Login Modal */}
        <SeamlessLogin 
          isOpen={isOpen} 
          onClose={onClose} 
          autoConnect={true} 
        />
      </VStack>
    </Container>
  );
};
