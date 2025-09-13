"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Button,
  Select,
  Input,
  Text,
  Heading,
  Badge,
  Progress,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Avatar,
  AvatarGroup,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  useToast,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiRefreshCw,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiExternalLink,
  FiCopy,
  FiZap,
  FiShield,
  FiTrendingUp,
} from 'react-icons/fi';
import { useBridge } from '../../hooks/useBridge';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface Chain {
  id: string;
  name: string;
  chainId: number;
  logo: string;
  color: string;
  nativeCurrency: string;
  rpcUrl: string;
  blockExplorer: string;
}

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  balance: string;
  usdValue: string;
  type: 'token' | 'nft';
}

interface BridgeStatus {
  step: number;
  status: 'idle' | 'pending' | 'success' | 'error';
  message: string;
  txHash?: string;
  estimatedTime?: string;
}

const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    logo: '⟠',
    color: 'blue.500',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo',
    blockExplorer: 'https://etherscan.io',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    logo: '⬟',
    color: 'purple.500',
    nativeCurrency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
  },
  {
    id: 'bsc',
    name: 'BSC',
    chainId: 56,
    logo: '◆',
    color: 'yellow.500',
    nativeCurrency: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
  },
  {
    id: 'solana',
    name: 'Solana',
    chainId: 0,
    logo: '◉',
    color: 'green.500',
    nativeCurrency: 'SOL',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    blockExplorer: 'https://explorer.solana.com',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    logo: '▲',
    color: 'cyan.500',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
  },
];

const MOCK_TOKENS: Token[] = [
  {
    address: '0x...',
    symbol: 'RWA-RE',
    name: 'Real Estate Token',
    decimals: 18,
    logo: '🏢',
    balance: '1,250.50',
    usdValue: '$125,050.00',
    type: 'token',
  },
  {
    address: '0x...',
    symbol: 'RWA-GOLD',
    name: 'Gold Reserves',
    decimals: 18,
    logo: '🥇',
    balance: '500.25',
    usdValue: '$87,543.75',
    type: 'token',
  },
  {
    address: '0x...',
    symbol: 'CARBON',
    name: 'Carbon Credits',
    decimals: 18,
    logo: '🌱',
    balance: '2,500.00',
    usdValue: '$25,000.00',
    type: 'token',
  },
  {
    address: '0x...',
    symbol: 'PROP-NFT',
    name: 'Property NFT #1247',
    decimals: 0,
    logo: '🏠',
    balance: '1',
    usdValue: '$312,500.00',
    type: 'nft',
  },
];

const BRIDGE_STEPS = [
  { id: 1, title: 'Approve Token', description: 'Approve token spending' },
  { id: 2, title: 'Lock on Source', description: 'Lock tokens on source chain' },
  { id: 3, title: 'Validate Transfer', description: 'Cross-chain validation' },
  { id: 4, title: 'Mint on Destination', description: 'Mint tokens on destination chain' },
];

export default function QuickBridge() {
  const [sourceChain, setSourceChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [destinationChain, setDestinationChain] = useState<Chain>(SUPPORTED_CHAINS[3]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>({
    step: 0,
    status: 'idle',
    message: 'Ready to bridge',
  });
  const [estimatedFee, setEstimatedFee] = useState<string>('~$12.50');
  const [estimatedTime, setEstimatedTime] = useState<string>('~8 minutes');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { initiateBridge, getBridgeStatus } = useBridge();

  const swapChains = () => {
    const temp = sourceChain;
    setSourceChain(destinationChain);
    setDestinationChain(temp);
  };

  const handleBridge = async () => {
    if (!selectedToken || !amount) {
      toast({
        title: 'Missing Information',
        description: 'Please select a token and enter an amount',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onOpen();
    
    try {
      // Step 1: Approve Token
      setBridgeStatus({
        step: 1,
        status: 'pending',
        message: 'Approving token spending...',
        estimatedTime: '~2 minutes',
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBridgeStatus({
        step: 1,
        status: 'success',
        message: 'Token approved successfully',
        txHash: '0x1234...5678',
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Lock on Source
      setBridgeStatus({
        step: 2,
        status: 'pending',
        message: `Locking ${amount} ${selectedToken.symbol} on ${sourceChain.name}...`,
        estimatedTime: '~3 minutes',
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      setBridgeStatus({
        step: 2,
        status: 'success',
        message: 'Tokens locked successfully',
        txHash: '0xabcd...efgh',
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Validate Transfer
      setBridgeStatus({
        step: 3,
        status: 'pending',
        message: 'Validating cross-chain transfer...',
        estimatedTime: '~2 minutes',
      });

      await new Promise(resolve => setTimeout(resolve, 2500));

      setBridgeStatus({
        step: 3,
        status: 'success',
        message: 'Transfer validated by bridge validators',
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Mint on Destination
      setBridgeStatus({
        step: 4,
        status: 'pending',
        message: `Minting ${amount} ${selectedToken.symbol} on ${destinationChain.name}...`,
        estimatedTime: '~1 minute',
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      setBridgeStatus({
        step: 4,
        status: 'success',
        message: 'Bridge completed successfully!',
        txHash: '0x9876...5432',
      });

      toast({
        title: 'Bridge Successful!',
        description: `${amount} ${selectedToken.symbol} bridged to ${destinationChain.name}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      setBridgeStatus({
        step: bridgeStatus.step,
        status: 'error',
        message: 'Bridge failed. Please try again.',
      });
      
      toast({
        title: 'Bridge Failed',
        description: 'Transaction failed. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const resetBridge = () => {
    setBridgeStatus({
      step: 0,
      status: 'idle',
      message: 'Ready to bridge',
    });
    onClose();
  };

  return (
    <VStack spacing={6} w="full">
      {/* Bridge Interface */}
      <MotionCard
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        w="full"
        maxW="600px"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardBody p={8}>
          <VStack spacing={6}>
            {/* Header */}
            <HStack justify="space-between" w="full">
              <Heading size="lg">Bridge Assets</Heading>
              <HStack>
                <Badge colorScheme="green" px={3} py={1}>
                  <Icon as={FiShield} mr={1} />
                  Secure
                </Badge>
                <Badge colorScheme="blue" px={3} py={1}>
                  <Icon as={FiZap} mr={1} />
                  Fast
                </Badge>
              </HStack>
            </HStack>

            {/* Chain Selection */}
            <VStack spacing={4} w="full">
              {/* Source Chain */}
              <Box w="full">
                <Text fontSize="sm" color="gray.500" mb={2}>From</Text>
                <Select
                  value={sourceChain.id}
                  onChange={(e) => {
                    const chain = SUPPORTED_CHAINS.find(c => c.id === e.target.value);
                    if (chain) setSourceChain(chain);
                  }}
                  size="lg"
                  bg={cardBg}
                >
                  {SUPPORTED_CHAINS.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.logo} {chain.name}
                    </option>
                  ))}
                </Select>
              </Box>

              {/* Swap Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={swapChains}
                leftIcon={<Icon as={FiRefreshCw} />}
                _hover={{ bg: 'gray.100', _dark: { bg: 'gray.700' } }}
              >
                Swap Chains
              </Button>

              {/* Destination Chain */}
              <Box w="full">
                <Text fontSize="sm" color="gray.500" mb={2}>To</Text>
                <Select
                  value={destinationChain.id}
                  onChange={(e) => {
                    const chain = SUPPORTED_CHAINS.find(c => c.id === e.target.value);
                    if (chain) setDestinationChain(chain);
                  }}
                  size="lg"
                  bg={cardBg}
                >
                  {SUPPORTED_CHAINS.filter(c => c.id !== sourceChain.id).map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.logo} {chain.name}
                    </option>
                  ))}
                </Select>
              </Box>
            </VStack>

            <Divider />

            {/* Token Selection */}
            <VStack spacing={4} w="full">
              <Text fontSize="sm" color="gray.500" alignSelf="start">Select Asset</Text>
              <SimpleGrid columns={2} spacing={3} w="full">
                {MOCK_TOKENS.map((token) => (
                  <MotionBox
                    key={token.address}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      cursor="pointer"
                      onClick={() => setSelectedToken(token)}
                      bg={selectedToken?.address === token.address ? 'blue.50' : cardBg}
                      borderColor={selectedToken?.address === token.address ? 'blue.500' : borderColor}
                      borderWidth="2px"
                      _hover={{ borderColor: 'blue.300' }}
                      _dark={{
                        bg: selectedToken?.address === token.address ? 'blue.900' : 'gray.800',
                      }}
                    >
                      <CardBody p={4}>
                        <VStack spacing={2}>
                          <Text fontSize="2xl">{token.logo}</Text>
                          <Text fontWeight="semibold" fontSize="sm" textAlign="center">
                            {token.symbol}
                          </Text>
                          <Text fontSize="xs" color="gray.500" textAlign="center">
                            {token.balance} {token.type === 'nft' ? 'NFT' : 'tokens'}
                          </Text>
                          <Text fontSize="xs" color="green.500" fontWeight="semibold">
                            {token.usdValue}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </VStack>

            {/* Amount Input */}
            {selectedToken && selectedToken.type === 'token' && (
              <VStack spacing={2} w="full">
                <Text fontSize="sm" color="gray.500" alignSelf="start">Amount</Text>
                <NumberInput value={amount} onChange={setAmount} size="lg" w="full">
                  <NumberInputField placeholder={`Enter ${selectedToken.symbol} amount`} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <HStack justify="space-between" w="full">
                  <Text fontSize="xs" color="gray.500">
                    Balance: {selectedToken.balance} {selectedToken.symbol}
                  </Text>
                  <Button
                    size="xs"
                    variant="link"
                    onClick={() => setAmount(selectedToken.balance.replace(',', ''))}
                  >
                    Max
                  </Button>
                </HStack>
              </VStack>
            )}

            {/* Bridge Info */}
            {selectedToken && (
              <VStack spacing={3} w="full" p={4} bg="gray.50" borderRadius="lg" _dark={{ bg: 'gray.700' }}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Estimated Fee:</Text>
                  <Text fontSize="sm" fontWeight="semibold">{estimatedFee}</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Estimated Time:</Text>
                  <Text fontSize="sm" fontWeight="semibold">{estimatedTime}</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Route:</Text>
                  <HStack spacing={1}>
                    <Text fontSize="xs">{sourceChain.logo}</Text>
                    <Icon as={FiArrowRight} boxSize={3} />
                    <Text fontSize="xs">Wormhole</Text>
                    <Icon as={FiArrowRight} boxSize={3} />
                    <Text fontSize="xs">{destinationChain.logo}</Text>
                  </HStack>
                </HStack>
              </VStack>
            )}

            {/* Bridge Button */}
            <Button
              colorScheme="blue"
              size="lg"
              w="full"
              onClick={handleBridge}
              isDisabled={!selectedToken || (selectedToken.type === 'token' && !amount)}
              leftIcon={<Icon as={FiArrowRight} />}
            >
              Bridge {selectedToken ? selectedToken.symbol : 'Asset'}
            </Button>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Bridge Status Modal */}
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FiZap} color="blue.500" />
              <Text>Bridge in Progress</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Progress Steps */}
              <VStack spacing={4} w="full">
                {BRIDGE_STEPS.map((step, index) => (
                  <HStack key={step.id} w="full" spacing={4}>
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg={
                        bridgeStatus.step > step.id
                          ? 'green.500'
                          : bridgeStatus.step === step.id
                          ? bridgeStatus.status === 'pending'
                            ? 'blue.500'
                            : bridgeStatus.status === 'success'
                            ? 'green.500'
                            : bridgeStatus.status === 'error'
                            ? 'red.500'
                            : 'gray.300'
                          : 'gray.300'
                      }
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {bridgeStatus.step > step.id ? (
                        <Icon as={FiCheck} color="white" />
                      ) : bridgeStatus.step === step.id && bridgeStatus.status === 'pending' ? (
                        <Spinner size="sm" color="white" />
                      ) : bridgeStatus.step === step.id && bridgeStatus.status === 'error' ? (
                        <Icon as={FiAlertCircle} color="white" />
                      ) : (
                        <Text color="white" fontSize="sm" fontWeight="bold">
                          {step.id}
                        </Text>
                      )}
                    </Box>
                    
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontWeight="semibold">{step.title}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {step.description}
                      </Text>
                    </VStack>
                    
                    {bridgeStatus.step === step.id && (
                      <Badge
                        colorScheme={
                          bridgeStatus.status === 'pending'
                            ? 'blue'
                            : bridgeStatus.status === 'success'
                            ? 'green'
                            : 'red'
                        }
                      >
                        {bridgeStatus.status}
                      </Badge>
                    )}
                  </HStack>
                ))}
              </VStack>

              {/* Current Status */}
              <Alert
                status={
                  bridgeStatus.status === 'pending'
                    ? 'info'
                    : bridgeStatus.status === 'success'
                    ? 'success'
                    : bridgeStatus.status === 'error'
                    ? 'error'
                    : 'info'
                }
              >
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold">{bridgeStatus.message}</Text>
                  {bridgeStatus.estimatedTime && (
                    <Text fontSize="sm">ETA: {bridgeStatus.estimatedTime}</Text>
                  )}
                  {bridgeStatus.txHash && (
                    <HStack>
                      <Text fontSize="sm">Tx: {bridgeStatus.txHash}</Text>
                      <Button size="xs" variant="link" leftIcon={<Icon as={FiExternalLink} />}>
                        View
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </Alert>
            </VStack>
          </ModalBody>

          <ModalFooter>
            {bridgeStatus.step === 4 && bridgeStatus.status === 'success' ? (
              <Button colorScheme="green" onClick={resetBridge} w="full">
                Bridge Another Asset
              </Button>
            ) : bridgeStatus.status === 'error' ? (
              <HStack w="full">
                <Button variant="outline" onClick={resetBridge} flex={1}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleBridge} flex={1}>
                  Retry
                </Button>
              </HStack>
            ) : (
              <Button variant="outline" onClick={resetBridge} w="full" isDisabled={bridgeStatus.status === 'pending'}>
                Cancel Bridge
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bridge Statistics */}
      <MotionCard
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        w="full"
        maxW="600px"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardBody>
          <VStack spacing={4}>
            <Heading size="md">Bridge Statistics</Heading>
            <SimpleGrid columns={3} spacing={4} w="full">
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  $2.4M
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  24h Volume
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  99.2%
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Success Rate
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  8.5min
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Avg Time
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </MotionCard>
    </VStack>
  );
}
