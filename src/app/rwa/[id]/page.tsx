"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Image,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Icon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiDollarSign, 
  FiMapPin, 
  FiCalendar, 
  FiTrendingUp,
  FiShield,
  FiFileText,
  FiGlobe,
  FiUsers,
  FiBarChart3
} from 'react-icons/fi';
import { useParams } from 'next/navigation';
import DueDiligenceReport from '../../../components/rwa/DueDiligenceReport';
import { RWAAssetMetadata } from '../../../services/aiDueDiligenceService';

const MotionBox = motion(Box);

// Mock RWA asset data - in production, this would come from your API/blockchain
const mockRWAAssets: Record<string, RWAAssetMetadata & {
  id: string;
  images: string[];
  currentValue: number;
  totalSupply: number;
  availableShares: number;
  pricePerShare: number;
  historicalReturns: number[];
  keyMetrics: {
    occupancyRate?: number;
    capRate?: number;
    noi?: number;
    appreciation?: number;
  };
}> = {
  'manhattan-office-tower': {
    id: 'manhattan-office-tower',
    name: 'Manhattan Office Tower - 432 Park Ave',
    description: 'Premium Class A office building in Midtown Manhattan with long-term tenants including Fortune 500 companies. Features modern amenities, LEED Gold certification, and prime location near Central Park.',
    assetType: 'real_estate',
    location: 'New York, NY, USA',
    jurisdiction: 'United States',
    value: 125000000,
    currency: 'USD',
    currentValue: 125000000,
    totalSupply: 1000000,
    availableShares: 250000,
    pricePerShare: 125,
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800'
    ],
    documents: ['Property Deed', 'Lease Agreements', 'Environmental Report', 'Appraisal Report'],
    certifications: ['LEED Gold', 'Energy Star', 'BOMA 360'],
    legalStructure: 'Delaware Statutory Trust',
    underlyingAssets: '432 Park Avenue Office Building, Manhattan, NY',
    historicalReturns: [8.2, 7.8, 9.1, 6.5, 8.9, 7.3, 8.7],
    keyMetrics: {
      occupancyRate: 94.5,
      capRate: 4.2,
      noi: 5250000,
      appreciation: 3.8
    }
  },
  'gold-bullion-vault': {
    id: 'gold-bullion-vault',
    name: 'Swiss Gold Bullion Reserve',
    description: 'Physical gold bullion stored in secure Swiss vaults with full insurance coverage and regular audits. Each token represents 1 gram of 99.99% pure gold.',
    assetType: 'precious_metals',
    location: 'Zurich, Switzerland',
    jurisdiction: 'Switzerland',
    value: 50000000,
    currency: 'USD',
    currentValue: 50000000,
    totalSupply: 800000,
    availableShares: 200000,
    pricePerShare: 62.5,
    images: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800',
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800'
    ],
    documents: ['Vault Certificate', 'Insurance Policy', 'Audit Report', 'Purity Certificate'],
    certifications: ['LBMA Good Delivery', 'Swiss Certified', 'ISO 9001'],
    legalStructure: 'Swiss Trust',
    underlyingAssets: '800kg of 99.99% pure gold bullion',
    historicalReturns: [12.1, -2.3, 18.7, 5.4, -1.2, 24.8, 8.9],
    keyMetrics: {}
  },
  'carbon-forest-project': {
    id: 'carbon-forest-project',
    name: 'Amazon Rainforest Carbon Credits',
    description: 'Verified carbon offset credits from protected Amazon rainforest conservation project. Each credit represents 1 metric ton of CO2 sequestered through forest preservation.',
    assetType: 'carbon_credits',
    location: 'Amazon Basin, Brazil',
    jurisdiction: 'Brazil',
    value: 15000000,
    currency: 'USD',
    currentValue: 15000000,
    totalSupply: 500000,
    availableShares: 150000,
    pricePerShare: 30,
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      'https://images.unsplash.com/photo-1574263867128-a3d5c1b1dedc?w=800'
    ],
    documents: ['VCS Certificate', 'Project Design Document', 'Monitoring Report', 'Impact Assessment'],
    certifications: ['VCS Verified', 'CCB Standards', 'UN SDG Aligned'],
    legalStructure: 'Environmental Trust',
    underlyingAssets: '500,000 metric tons CO2 sequestration capacity',
    historicalReturns: [15.2, 22.1, 8.7, 31.4, 12.8, 18.9, 25.3],
    keyMetrics: {}
  }
};

export default function RWADetailPage() {
  const params = useParams();
  const assetId = params?.id as string;
  const [asset, setAsset] = useState<typeof mockRWAAssets[string] | null>(null);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundAsset = mockRWAAssets[assetId];
      setAsset(foundAsset || null);
      setLoading(false);
    }, 1000);
  }, [assetId]);

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Loading RWA asset details...</Text>
        </VStack>
      </Box>
    );
  }

  if (!asset) {
    return (
      <Box minH="100vh" bg={bgColor} py={8}>
        <Container maxW="6xl">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            Asset not found. Please check the asset ID and try again.
          </Alert>
        </Container>
      </Box>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: asset.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'real_estate': return FiHome;
      case 'precious_metals': return FiDollarSign;
      case 'carbon_credits': return FiGlobe;
      default: return FiBarChart3;
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'real_estate': return 'blue';
      case 'precious_metals': return 'yellow';
      case 'carbon_credits': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="8xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card bg={cardBg}>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                  <VStack align="start" spacing={4}>
                    <HStack>
                      <Icon 
                        as={getAssetTypeIcon(asset.assetType)} 
                        boxSize={8} 
                        color={`${getAssetTypeColor(asset.assetType)}.500`} 
                      />
                      <VStack align="start" spacing={1}>
                        <Heading size="xl">{asset.name}</Heading>
                        <HStack>
                          <Badge colorScheme={getAssetTypeColor(asset.assetType)} size="lg">
                            {asset.assetType.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <HStack color={textColor}>
                            <Icon as={FiMapPin} />
                            <Text>{asset.location}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </HStack>
                    
                    <Text color={textColor} lineHeight="tall">
                      {asset.description}
                    </Text>

                    <Wrap>
                      {asset.certifications?.map((cert, index) => (
                        <WrapItem key={index}>
                          <Tag colorScheme="green" size="sm">
                            <TagLabel>{cert}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </VStack>

                  <VStack spacing={4}>
                    {asset.images && asset.images.length > 0 && (
                      <Image
                        src={asset.images[0]}
                        alt={asset.name}
                        borderRadius="lg"
                        objectFit="cover"
                        w="full"
                        h="300px"
                      />
                    )}
                  </VStack>
                </Grid>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Key Metrics */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Value</StatLabel>
                    <StatNumber color="blue.500">{formatCurrency(asset.currentValue)}</StatNumber>
                    <StatHelpText>Current market valuation</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Price per Share</StatLabel>
                    <StatNumber color="green.500">{formatCurrency(asset.pricePerShare)}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      {asset.historicalReturns[asset.historicalReturns.length - 1]}% last period
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Available Shares</StatLabel>
                    <StatNumber>{asset.availableShares.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      of {asset.totalSupply.toLocaleString()} total
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Avg. Annual Return</StatLabel>
                    <StatNumber color="purple.500">
                      {(asset.historicalReturns.reduce((a, b) => a + b, 0) / asset.historicalReturns.length).toFixed(1)}%
                    </StatNumber>
                    <StatHelpText>Historical performance</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Grid>
          </MotionBox>

          {/* Detailed Information Tabs */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card bg={cardBg}>
              <CardBody>
                <Tabs variant="enclosed" colorScheme="blue">
                  <TabList>
                    <Tab>Overview</Tab>
                    <Tab>Due Diligence Report</Tab>
                    <Tab>Performance</Tab>
                    <Tab>Documents</Tab>
                    <Tab>Investment</Tab>
                  </TabList>

                  <TabPanels>
                    {/* Overview Tab */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                          <Box>
                            <Heading size="md" mb={4}>Asset Details</Heading>
                            <VStack align="start" spacing={3}>
                              <HStack>
                                <Text fontWeight="semibold" minW="120px">Asset Type:</Text>
                                <Badge colorScheme={getAssetTypeColor(asset.assetType)}>
                                  {asset.assetType.replace('_', ' ')}
                                </Badge>
                              </HStack>
                              <HStack>
                                <Text fontWeight="semibold" minW="120px">Location:</Text>
                                <Text color={textColor}>{asset.location}</Text>
                              </HStack>
                              <HStack>
                                <Text fontWeight="semibold" minW="120px">Jurisdiction:</Text>
                                <Text color={textColor}>{asset.jurisdiction}</Text>
                              </HStack>
                              <HStack>
                                <Text fontWeight="semibold" minW="120px">Legal Structure:</Text>
                                <Text color={textColor}>{asset.legalStructure}</Text>
                              </HStack>
                              <HStack align="start">
                                <Text fontWeight="semibold" minW="120px">Underlying:</Text>
                                <Text color={textColor}>{asset.underlyingAssets}</Text>
                              </HStack>
                            </VStack>
                          </Box>

                          {/* Asset-specific metrics */}
                          {asset.assetType === 'real_estate' && asset.keyMetrics.occupancyRate && (
                            <Box>
                              <Heading size="md" mb={4}>Property Metrics</Heading>
                              <VStack align="start" spacing={3}>
                                <HStack>
                                  <Text fontWeight="semibold" minW="120px">Occupancy Rate:</Text>
                                  <Text color="green.500" fontWeight="bold">{asset.keyMetrics.occupancyRate}%</Text>
                                </HStack>
                                <HStack>
                                  <Text fontWeight="semibold" minW="120px">Cap Rate:</Text>
                                  <Text color={textColor}>{asset.keyMetrics.capRate}%</Text>
                                </HStack>
                                <HStack>
                                  <Text fontWeight="semibold" minW="120px">NOI:</Text>
                                  <Text color={textColor}>{formatCurrency(asset.keyMetrics.noi || 0)}</Text>
                                </HStack>
                                <HStack>
                                  <Text fontWeight="semibold" minW="120px">Appreciation:</Text>
                                  <Text color="green.500">{asset.keyMetrics.appreciation}% annually</Text>
                                </HStack>
                              </VStack>
                            </Box>
                          )}
                        </Grid>

                        <Divider />

                        <Box>
                          <Heading size="md" mb={4}>Certifications & Compliance</Heading>
                          <Wrap>
                            {asset.certifications?.map((cert, index) => (
                              <WrapItem key={index}>
                                <Tag colorScheme="green" size="lg">
                                  <TagLabel>{cert}</TagLabel>
                                </Tag>
                              </WrapItem>
                            ))}
                          </Wrap>
                        </Box>
                      </VStack>
                    </TabPanel>

                    {/* Due Diligence Report Tab */}
                    <TabPanel>
                      <DueDiligenceReport
                        assetId={asset.id}
                        metadata={{
                          name: asset.name,
                          description: asset.description,
                          assetType: asset.assetType,
                          location: asset.location,
                          jurisdiction: asset.jurisdiction,
                          value: asset.value,
                          currency: asset.currency,
                          documents: asset.documents,
                          certifications: asset.certifications,
                          legalStructure: asset.legalStructure,
                          underlyingAssets: asset.underlyingAssets
                        }}
                        onReportGenerated={(report) => {
                          console.log('Due diligence report generated:', report);
                        }}
                      />
                    </TabPanel>

                    {/* Performance Tab */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <Heading size="md">Historical Performance</Heading>
                        <Grid templateColumns="repeat(7, 1fr)" gap={2}>
                          {asset.historicalReturns.map((return_, index) => (
                            <Card key={index} bg={return_ > 0 ? 'green.50' : 'red.50'}>
                              <CardBody p={3} textAlign="center">
                                <Text fontSize="xs" color={textColor}>
                                  Period {index + 1}
                                </Text>
                                <Text 
                                  fontWeight="bold" 
                                  color={return_ > 0 ? 'green.500' : 'red.500'}
                                >
                                  {return_ > 0 ? '+' : ''}{return_}%
                                </Text>
                              </CardBody>
                            </Card>
                          ))}
                        </Grid>
                        
                        <Alert status="info" borderRadius="lg">
                          <AlertIcon />
                          <Box>
                            <Text fontWeight="semibold">Performance Disclaimer</Text>
                            <Text fontSize="sm">
                              Past performance does not guarantee future results. All investments carry risk of loss.
                            </Text>
                          </Box>
                        </Alert>
                      </VStack>
                    </TabPanel>

                    {/* Documents Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">Asset Documentation</Heading>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                          {asset.documents?.map((doc, index) => (
                            <Card key={index} bg={useColorModeValue('gray.50', 'gray.700')}>
                              <CardBody>
                                <HStack>
                                  <Icon as={FiFileText} color="blue.500" />
                                  <VStack align="start" spacing={0}>
                                    <Text fontWeight="semibold">{doc}</Text>
                                    <Text fontSize="sm" color={textColor}>
                                      Available for verified investors
                                    </Text>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                        </Grid>
                      </VStack>
                    </TabPanel>

                    {/* Investment Tab */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <Heading size="md">Investment Opportunity</Heading>
                        
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                          <Card bg={useColorModeValue('blue.50', 'blue.900')}>
                            <CardBody>
                              <VStack spacing={4}>
                                <Icon as={FiDollarSign} boxSize={8} color="blue.500" />
                                <Text fontWeight="semibold" textAlign="center">
                                  Minimum Investment: {formatCurrency(asset.pricePerShare)}
                                </Text>
                                <Text fontSize="sm" color={textColor} textAlign="center">
                                  Purchase fractional shares starting from one token
                                </Text>
                                <Button colorScheme="blue" size="lg" w="full">
                                  Invest Now
                                </Button>
                              </VStack>
                            </CardBody>
                          </Card>

                          <Card bg={useColorModeValue('green.50', 'green.900')}>
                            <CardBody>
                              <VStack spacing={4}>
                                <Icon as={FiTrendingUp} boxSize={8} color="green.500" />
                                <Text fontWeight="semibold" textAlign="center">
                                  Projected Annual Yield
                                </Text>
                                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                  {(asset.historicalReturns.reduce((a, b) => a + b, 0) / asset.historicalReturns.length).toFixed(1)}%
                                </Text>
                                <Text fontSize="sm" color={textColor} textAlign="center">
                                  Based on historical performance
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        </Grid>

                        <Alert status="warning" borderRadius="lg">
                          <AlertIcon />
                          <Box>
                            <Text fontWeight="semibold">Investment Risk Notice</Text>
                            <Text fontSize="sm">
                              This is a high-risk investment. You may lose some or all of your investment. 
                              Please ensure you understand the risks and have completed KYC verification.
                            </Text>
                          </Box>
                        </Alert>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
