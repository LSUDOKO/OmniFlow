"use client";

import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
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
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  useColorModeValue,
  Flex,
  Avatar,
  AvatarGroup,
  Tooltip,
  Button,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiFilter,
} from 'react-icons/fi';
import RWAMarketAnalytics from '../../components/analytics/RWAMarketAnalytics';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function MarketAnalyticsPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="8xl" py={8}>
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          mb={8}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={2}>
              <Heading size="2xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                RWA Market Analytics
              </Heading>
              <Text color="gray.500" fontSize="lg">
                Real-time insights into the tokenized real-world asset ecosystem
              </Text>
            </VStack>
            
            <HStack spacing={4}>
              <Select placeholder="All Chains" size="md" w="150px">
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">BSC</option>
                <option value="solana">Solana</option>
              </Select>
              
              <Button leftIcon={<FiRefreshCw />} colorScheme="blue" variant="outline">
                Refresh
              </Button>
              
              <Button leftIcon={<FiDownload />} colorScheme="green">
                Export
              </Button>
            </HStack>
          </Flex>
          
          <Divider />
        </MotionBox>

        {/* Main Analytics Component */}
        <RWAMarketAnalytics />
        
        {/* Additional Insights */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          mt={8}
        >
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Market Trends</Tab>
              <Tab>Asset Performance</Tab>
              <Tab>Network Activity</Tab>
              <Tab>Yield Analytics</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                    <CardBody>
                      <Heading size="md" mb={4}>Market Sentiment</Heading>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Text>Bullish Sentiment</Text>
                          <Badge colorScheme="green">68%</Badge>
                        </HStack>
                        <Progress value={68} colorScheme="green" size="lg" />
                        
                        <HStack justify="space-between">
                          <Text>Trading Volume Growth</Text>
                          <Badge colorScheme="blue">+24%</Badge>
                        </HStack>
                        <Progress value={74} colorScheme="blue" size="lg" />
                        
                        <HStack justify="space-between">
                          <Text>New Asset Listings</Text>
                          <Badge colorScheme="purple">+12%</Badge>
                        </HStack>
                        <Progress value={62} colorScheme="purple" size="lg" />
                      </VStack>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                    <CardBody>
                      <Heading size="md" mb={4}>Risk Metrics</Heading>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Text>Portfolio Volatility</Text>
                          <Badge colorScheme="yellow">Medium</Badge>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text>Liquidity Risk</Text>
                          <Badge colorScheme="green">Low</Badge>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text>Correlation Risk</Text>
                          <Badge colorScheme="orange">Medium</Badge>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text>Smart Contract Risk</Text>
                          <Badge colorScheme="green">Low</Badge>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>
              
              <TabPanel>
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                  <CardBody>
                    <Heading size="md" mb={4}>Top Performing Assets (7D)</Heading>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Asset</Th>
                            <Th>Type</Th>
                            <Th>Price Change</Th>
                            <Th>Volume</Th>
                            <Th>Market Cap</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>
                              <HStack>
                                <Text>🏢</Text>
                                <Text fontWeight="semibold">NYC Office Complex</Text>
                              </HStack>
                            </Td>
                            <Td>Real Estate</Td>
                            <Td color="green.500">+12.5%</Td>
                            <Td>$2.1M</Td>
                            <Td>$45.2M</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <HStack>
                                <Text>🌱</Text>
                                <Text fontWeight="semibold">Carbon Credits Pool</Text>
                              </HStack>
                            </Td>
                            <Td>Carbon Credits</Td>
                            <Td color="green.500">+8.3%</Td>
                            <Td>$1.8M</Td>
                            <Td>$32.1M</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <HStack>
                                <Text>🥇</Text>
                                <Text fontWeight="semibold">Gold Reserves</Text>
                              </HStack>
                            </Td>
                            <Td>Precious Metals</Td>
                            <Td color="green.500">+6.7%</Td>
                            <Td>$3.2M</Td>
                            <Td>$78.5M</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              </TabPanel>
              
              <TabPanel>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                    <CardBody>
                      <Heading size="md" mb={4}>Network Activity</Heading>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <HStack>
                            <Box w={3} h={3} bg="blue.500" borderRadius="full" />
                            <Text>Ethereum</Text>
                          </HStack>
                          <Text fontWeight="bold">1,247 TXs</Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <HStack>
                            <Box w={3} h={3} bg="purple.500" borderRadius="full" />
                            <Text>Polygon</Text>
                          </HStack>
                          <Text fontWeight="bold">3,891 TXs</Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <HStack>
                            <Box w={3} h={3} bg="yellow.500" borderRadius="full" />
                            <Text>BSC</Text>
                          </HStack>
                          <Text fontWeight="bold">2,156 TXs</Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <HStack>
                            <Box w={3} h={3} bg="green.500" borderRadius="full" />
                            <Text>Solana</Text>
                          </HStack>
                          <Text fontWeight="bold">5,432 TXs</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                    <CardBody>
                      <Heading size="md" mb={4}>Gas & Fees</Heading>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Text>Avg Gas Price (ETH)</Text>
                          <Badge colorScheme="blue">23 Gwei</Badge>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text>Avg Tx Fee (ETH)</Text>
                          <Badge colorScheme="blue">$12.45</Badge>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text>Avg Tx Fee (Polygon)</Text>
                          <Badge colorScheme="purple">$0.02</Badge>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text>Avg Tx Fee (Solana)</Text>
                          <Badge colorScheme="green">$0.0001</Badge>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>
              
              <TabPanel>
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                  <CardBody>
                    <Heading size="md" mb={4}>Yield Opportunities</Heading>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Protocol</Th>
                            <Th>Asset Type</Th>
                            <Th>APY</Th>
                            <Th>TVL</Th>
                            <Th>Risk Level</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td fontWeight="semibold">OmniFlow Vault</Td>
                            <Td>Mixed RWA</Td>
                            <Td color="green.500">8.5%</Td>
                            <Td>$12.3M</Td>
                            <Td><Badge colorScheme="green">Low</Badge></Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="semibold">RWA Staking</Td>
                            <Td>Real Estate</Td>
                            <Td color="green.500">12.1%</Td>
                            <Td>$8.7M</Td>
                            <Td><Badge colorScheme="yellow">Medium</Badge></Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="semibold">Carbon Pool</Td>
                            <Td>Carbon Credits</Td>
                            <Td color="green.500">15.3%</Td>
                            <Td>$5.2M</Td>
                            <Td><Badge colorScheme="orange">High</Badge></Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MotionBox>
      </Container>
    </Box>
  );
}
