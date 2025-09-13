"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Badge,
  VStack,
  HStack,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  AvatarGroup,
  Tooltip,
  useColorModeValue,
  Flex,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiUsers,
  FiGlobe,
  FiBarChart3,
  FiPieChart,
  FiActivity,
} from 'react-icons/fi';

const MotionCard = motion(Card);

interface MarketData {
  totalValueLocked: number;
  totalVolume24h: number;
  activeTraders: number;
  assetClasses: AssetClass[];
  topTraders: Trader[];
  chainDistribution: ChainData[];
  marketMetrics: MarketMetrics;
}

interface AssetClass {
  name: string;
  value: number;
  percentage: number;
  change24h: number;
  color: string;
  icon: string;
}

interface Trader {
  address: string;
  volume24h: number;
  trades: number;
  pnl: number;
  avatar: string;
  verified: boolean;
}

interface ChainData {
  name: string;
  tvl: number;
  percentage: number;
  transactions: number;
  color: string;
  logo: string;
}

interface MarketMetrics {
  totalAssets: number;
  avgYield: number;
  marketCap: number;
  liquidityRatio: number;
}

// Mock data with realistic RWA market values
const mockMarketData: MarketData = {
  totalValueLocked: 2847500000, // $2.85B
  totalVolume24h: 125600000, // $125.6M
  activeTraders: 12847,
  assetClasses: [
    {
      name: "Real Estate",
      value: 1420000000,
      percentage: 49.8,
      change24h: 3.2,
      color: "blue.500",
      icon: "🏢"
    },
    {
      name: "Commodities",
      value: 682500000,
      percentage: 24.0,
      change24h: -1.8,
      color: "orange.500",
      icon: "🌾"
    },
    {
      name: "Precious Metals",
      value: 455200000,
      percentage: 16.0,
      change24h: 2.1,
      color: "yellow.500",
      icon: "🥇"
    },
    {
      name: "Carbon Credits",
      value: 199500000,
      percentage: 7.0,
      change24h: 8.5,
      color: "green.500",
      icon: "🌱"
    },
    {
      name: "Art & Collectibles",
      value: 90300000,
      percentage: 3.2,
      change24h: -0.5,
      color: "purple.500",
      icon: "🎨"
    }
  ],
  topTraders: [
    {
      address: "0x742d35Cc6634C0532925a3b8D87f1C0D5d4317A9",
      volume24h: 2450000,
      trades: 23,
      pnl: 145000,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      verified: true
    },
    {
      address: "0x8ba1f109551bD432803012645Hac136c22C85B",
      volume24h: 1890000,
      trades: 18,
      pnl: 89000,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      verified: true
    },
    {
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      volume24h: 1650000,
      trades: 31,
      pnl: -23000,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      verified: false
    },
    {
      address: "0xA0b86a33E6441e8e421f4D7c6c1d8b8c5F8b2C3D",
      volume24h: 1420000,
      trades: 15,
      pnl: 67000,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
      verified: true
    },
    {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      volume24h: 1280000,
      trades: 27,
      pnl: 34000,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
      verified: false
    }
  ],
  chainDistribution: [
    {
      name: "Ethereum",
      tvl: 1423750000,
      percentage: 50.0,
      transactions: 1247,
      color: "blue.500",
      logo: "⟠"
    },
    {
      name: "Polygon",
      tvl: 597375000,
      percentage: 21.0,
      transactions: 3891,
      color: "purple.500",
      logo: "⬟"
    },
    {
      name: "BSC",
      tvl: 455200000,
      percentage: 16.0,
      transactions: 2156,
      color: "yellow.500",
      logo: "◆"
    },
    {
      name: "Solana",
      tvl: 284750000,
      percentage: 10.0,
      transactions: 5432,
      color: "green.500",
      logo: "◉"
    },
    {
      name: "Arbitrum",
      tvl: 85425000,
      percentage: 3.0,
      transactions: 892,
      color: "cyan.500",
      logo: "▲"
    }
  ],
  marketMetrics: {
    totalAssets: 1847,
    avgYield: 8.7,
    marketCap: 3200000000,
    liquidityRatio: 0.78
  }
};

export default function RWAMarketAnalytics() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Simulate real-time data fetching
  useEffect(() => {
    const fetchMarketData = () => {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setMarketData(mockMarketData);
        setIsLoading(false);
        setLastUpdate(new Date());
      }, 1500);
    };

    fetchMarketData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text mt={4} color="gray.500">Loading market analytics...</Text>
      </Box>
    );
  }

  if (!marketData) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load market data. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <CardBody>
            <Stat>
              <StatLabel>Total Value Locked</StatLabel>
              <HStack>
                <Icon as={FiDollarSign} color="green.500" />
                <StatNumber>{formatCurrency(marketData.totalValueLocked)}</StatNumber>
              </HStack>
              <StatHelpText>
                <StatArrow type="increase" />
                12.5% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <CardBody>
            <Stat>
              <StatLabel>24h Volume</StatLabel>
              <HStack>
                <Icon as={FiBarChart3} color="blue.500" />
                <StatNumber>{formatCurrency(marketData.totalVolume24h)}</StatNumber>
              </HStack>
              <StatHelpText>
                <StatArrow type="increase" />
                8.3% from yesterday
              </StatHelpText>
            </Stat>
          </CardBody>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <CardBody>
            <Stat>
              <StatLabel>Active Traders</StatLabel>
              <HStack>
                <Icon as={FiUsers} color="purple.500" />
                <StatNumber>{marketData.activeTraders.toLocaleString()}</StatNumber>
              </HStack>
              <StatHelpText>
                <StatArrow type="increase" />
                15.2% growth
              </StatHelpText>
            </Stat>
          </CardBody>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <CardBody>
            <Stat>
              <StatLabel>Average Yield</StatLabel>
              <HStack>
                <Icon as={FiTrendingUp} color="orange.500" />
                <StatNumber>{marketData.marketMetrics.avgYield}%</StatNumber>
              </HStack>
              <StatHelpText>
                <StatArrow type="increase" />
                APY across all assets
              </StatHelpText>
            </Stat>
          </CardBody>
        </MotionCard>
      </SimpleGrid>

      {/* Asset Classes & Chain Distribution */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CardBody>
            <Heading size="md" mb={6}>Asset Classes Distribution</Heading>
            <VStack spacing={4} align="stretch">
              {marketData.assetClasses.map((asset, index) => (
                <Box key={asset.name}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <HStack>
                      <Text fontSize="lg">{asset.icon}</Text>
                      <Text fontWeight="semibold">{asset.name}</Text>
                    </HStack>
                    <VStack spacing={0} align="end">
                      <Text fontWeight="bold">{formatCurrency(asset.value)}</Text>
                      <Text 
                        fontSize="sm" 
                        color={asset.change24h >= 0 ? 'green.500' : 'red.500'}
                      >
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </Text>
                    </VStack>
                  </Flex>
                  <Progress 
                    value={asset.percentage} 
                    colorScheme={asset.color.split('.')[0]} 
                    size="md" 
                    borderRadius="md"
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {asset.percentage}% of total TVL
                  </Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <CardBody>
            <Heading size="md" mb={6}>Chain Distribution</Heading>
            <VStack spacing={4} align="stretch">
              {marketData.chainDistribution.map((chain, index) => (
                <Box key={chain.name}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <HStack>
                      <Text fontSize="lg">{chain.logo}</Text>
                      <VStack spacing={0} align="start">
                        <Text fontWeight="semibold">{chain.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {chain.transactions} transactions
                        </Text>
                      </VStack>
                    </HStack>
                    <VStack spacing={0} align="end">
                      <Text fontWeight="bold">{formatCurrency(chain.tvl)}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {chain.percentage}%
                      </Text>
                    </VStack>
                  </Flex>
                  <Progress 
                    value={chain.percentage} 
                    colorScheme={chain.color.split('.')[0]} 
                    size="md" 
                    borderRadius="md"
                  />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </MotionCard>
      </SimpleGrid>

      {/* Top Traders */}
      <MotionCard
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        mb={8}
      >
        <CardBody>
          <Heading size="md" mb={6}>Top Traders (24h)</Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Trader</Th>
                  <Th>24h Volume</Th>
                  <Th>Trades</Th>
                  <Th>P&L</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {marketData.topTraders.map((trader, index) => (
                  <Tr key={trader.address}>
                    <Td>
                      <HStack>
                        <Avatar size="sm" src={trader.avatar} />
                        <VStack spacing={0} align="start">
                          <Text fontWeight="semibold">
                            {formatAddress(trader.address)}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Rank #{index + 1}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td fontWeight="semibold">
                      {formatCurrency(trader.volume24h)}
                    </Td>
                    <Td>{trader.trades}</Td>
                    <Td color={trader.pnl >= 0 ? 'green.500' : 'red.500'}>
                      {trader.pnl >= 0 ? '+' : ''}{formatCurrency(Math.abs(trader.pnl))}
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={trader.verified ? 'green' : 'gray'}
                        variant="subtle"
                      >
                        {trader.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </MotionCard>

      {/* Market Health Indicators */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          textAlign="center"
        >
          <CardBody>
            <CircularProgress 
              value={marketData.marketMetrics.liquidityRatio * 100} 
              color="blue.500" 
              size="80px"
              thickness="8px"
            >
              <CircularProgressLabel fontSize="sm" fontWeight="bold">
                {(marketData.marketMetrics.liquidityRatio * 100).toFixed(0)}%
              </CircularProgressLabel>
            </CircularProgress>
            <Text fontWeight="semibold" mt={3}>Liquidity Ratio</Text>
            <Text fontSize="sm" color="gray.500">Market Health</Text>
          </CardBody>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          textAlign="center"
        >
          <CardBody>
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {marketData.marketMetrics.totalAssets}
            </Text>
            <Text fontWeight="semibold" mt={2}>Total Assets</Text>
            <Text fontSize="sm" color="gray.500">Tokenized RWAs</Text>
          </CardBody>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          textAlign="center"
        >
          <CardBody>
            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
              {formatCurrency(marketData.marketMetrics.marketCap)}
            </Text>
            <Text fontWeight="semibold" mt={2}>Market Cap</Text>
            <Text fontSize="sm" color="gray.500">Total Valuation</Text>
          </CardBody>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          borderColor={borderColor}
          borderWidth="1px"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          textAlign="center"
        >
          <CardBody>
            <Text fontSize="sm" color="gray.500" mb={2}>Last Updated</Text>
            <Text fontSize="sm" fontWeight="semibold">
              {lastUpdate.toLocaleTimeString()}
            </Text>
            <Badge colorScheme="green" mt={2}>Live</Badge>
          </CardBody>
        </MotionCard>
      </SimpleGrid>
    </Box>
  );
}
