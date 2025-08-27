'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Container,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Badge,
  List,
  ListItem,
  ListIcon,
  Button,
} from '@chakra-ui/react';
import { 
  FiGlobe, 
  FiTrendingUp, 
  FiActivity, 
  FiBarChart3,
  FiMapPin,
  FiEye,
  FiZap,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';
import GlobalAnalyticsDashboard from '../../components/analytics/GlobalAnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Hero Section */}
      <Box bg="gradient-to-r from-purple-600 to-blue-600" color="white" py={20}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <VStack spacing={4}>
              <Text fontSize="5xl" fontWeight="bold" lineHeight="shorter">
                Real-Time Global Analytics
              </Text>
              <Text fontSize="xl" maxW="3xl" opacity={0.9}>
                Visualize tokenized real-world assets across the globe with interactive 3D maps, 
                live price feeds, and comprehensive trading analytics.
              </Text>
            </VStack>

            <HStack spacing={8} fontSize="lg">
              <VStack>
                <Text fontSize="3xl" fontWeight="bold">8</Text>
                <Text opacity={0.8}>Asset Types</Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="bold">15+</Text>
                <Text opacity={0.8}>Countries</Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="bold">$15M+</Text>
                <Text opacity={0.8}>Total Value</Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="bold">Real-Time</Text>
                <Text opacity={0.8}>Updates</Text>
              </VStack>
            </HStack>

            <Button
              size="lg"
              colorScheme="whiteAlpha"
              variant="solid"
              rightIcon={<Icon as={FiArrowRight} />}
              onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Global Map
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="7xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                Advanced Analytics Platform
              </Text>
              <Text fontSize="lg" color="gray.600" maxW="3xl">
                Our comprehensive analytics platform provides real-time insights into the global 
                RWA market with cutting-edge visualization and data analysis tools.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {/* 3D World Map */}
              <Card shadow="lg" borderRadius="xl" overflow="hidden">
                <CardBody p={8}>
                  <VStack spacing={4} align="start">
                    <Box p={3} bg="purple.100" borderRadius="lg">
                      <Icon as={FiGlobe} size="24px" color="purple.600" />
                    </Box>
                    <Text fontSize="xl" fontWeight="bold">
                      3D Interactive World Map
                    </Text>
                    <Text color="gray.600">
                      Explore tokenized assets across the globe with our interactive 3D visualization. 
                      Each pin represents real assets with live data and trading activity.
                    </Text>
                    <List spacing={2} fontSize="sm">
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Real-time asset positioning
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Interactive asset details
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Trading activity visualization
                      </ListItem>
                    </List>
                  </VStack>
                </CardBody>
              </Card>

              {/* Real-Time Charts */}
              <Card shadow="lg" borderRadius="xl" overflow="hidden">
                <CardBody p={8}>
                  <VStack spacing={4} align="start">
                    <Box p={3} bg="blue.100" borderRadius="lg">
                      <Icon as={FiBarChart3} size="24px" color="blue.600" />
                    </Box>
                    <Text fontSize="xl" fontWeight="bold">
                      Advanced Analytics Charts
                    </Text>
                    <Text color="gray.600">
                      Comprehensive charting tools with price movements, volume analysis, 
                      performance metrics, and asset distribution insights.
                    </Text>
                    <List spacing={2} fontSize="sm">
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Multiple chart types
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Performance analytics
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Market distribution
                      </ListItem>
                    </List>
                  </VStack>
                </CardBody>
              </Card>

              {/* Live Data Feeds */}
              <Card shadow="lg" borderRadius="xl" overflow="hidden">
                <CardBody p={8}>
                  <VStack spacing={4} align="start">
                    <Box p={3} bg="green.100" borderRadius="lg">
                      <Icon as={FiZap} size="24px" color="green.600" />
                    </Box>
                    <Text fontSize="xl" fontWeight="bold">
                      Live Data Streaming
                    </Text>
                    <Text color="gray.600">
                      Real-time price feeds, trading activity, and market alerts keep you 
                      informed of every market movement as it happens.
                    </Text>
                    <List spacing={2} fontSize="sm">
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        5-second data updates
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Price movement alerts
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Trading notifications
                      </ListItem>
                    </List>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Asset Types Section */}
      <Box py={20} bg="white">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                Global Asset Coverage
              </Text>
              <Text fontSize="lg" color="gray.600">
                Track and analyze diverse real-world assets across multiple sectors and regions
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              <Card textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Box p={3} bg="blue.100" borderRadius="lg">
                    <Icon as={FiMapPin} size="24px" color="blue.600" />
                  </Box>
                  <Text fontWeight="bold">Real Estate</Text>
                  <Text fontSize="sm" color="gray.600">
                    Commercial & residential properties worldwide
                  </Text>
                </VStack>
              </Card>

              <Card textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Box p={3} bg="green.100" borderRadius="lg">
                    <Icon as={FiActivity} size="24px" color="green.600" />
                  </Box>
                  <Text fontWeight="bold">Carbon Credits</Text>
                  <Text fontSize="sm" color="gray.600">
                    Environmental impact assets and credits
                  </Text>
                </VStack>
              </Card>

              <Card textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Box p={3} bg="yellow.100" borderRadius="lg">
                    <Icon as={FiTrendingUp} size="24px" color="yellow.600" />
                  </Box>
                  <Text fontWeight="bold">Precious Metals</Text>
                  <Text fontSize="sm" color="gray.600">
                    Gold, silver, and other valuable metals
                  </Text>
                </VStack>
              </Card>

              <Card textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Box p={3} bg="purple.100" borderRadius="lg">
                    <Icon as={FiZap} size="24px" color="purple.600" />
                  </Box>
                  <Text fontWeight="bold">Renewable Energy</Text>
                  <Text fontSize="sm" color="gray.600">
                    Solar farms, wind projects, and clean energy
                  </Text>
                </VStack>
              </Card>

              <Card textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Box p={3} bg="red.100" borderRadius="lg">
                    <Icon as={FiBarChart3} size="24px" color="red.600" />
                  </Box>
                  <Text fontWeight="bold">Commodities</Text>
                  <Text fontSize="sm" color="gray.600">
                    Raw materials and agricultural products
                  </Text>
                </VStack>
              </Card>

              <Card textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Box p={3} bg="indigo.100" borderRadius="lg">
                    <Icon as={FiGlobe} size="24px" color="indigo.600" />
                  </Box>
                  <Text fontWeight="bold">Infrastructure</Text>
                  <Text fontSize="sm" color="gray.600">
                    Data centers, transportation, utilities
                  </Text>
                </VStack>
              </Card>

              <Card textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Box p={3} bg="pink.100" borderRadius="lg">
                    <Icon as={FiEye} size="24px" color="pink.600" />
                  </Box>
                  <Text fontWeight="bold">Art & Collectibles</Text>
                  <Text fontSize="sm" color="gray.600">
                    Fine art, collectibles, and cultural assets
                  </Text>
                </VStack>
              </Card>

              <Card textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Box p={3} bg="gray.100" borderRadius="lg">
                    <Icon as={FiActivity} size="24px" color="gray.600" />
                  </Box>
                  <Text fontWeight="bold">Bonds & Securities</Text>
                  <Text fontSize="sm" color="gray.600">
                    Fixed income and debt instruments
                  </Text>
                </VStack>
              </Card>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Dashboard Section */}
      <Box id="dashboard" py={20}>
        <Container maxW="8xl">
          <VStack spacing={8}>
            <VStack spacing={4} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                Global Analytics Dashboard
              </Text>
              <Text fontSize="lg" color="gray.600">
                Explore real-world assets with interactive 3D visualization and comprehensive analytics
              </Text>
            </VStack>

            <Box w="full">
              <GlobalAnalyticsDashboard />
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Technical Features */}
      <Box py={20} bg="white">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                Technical Capabilities
              </Text>
              <Text fontSize="lg" color="gray.600">
                Built with cutting-edge technology for superior performance and user experience
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              <Card>
                <CardBody textAlign="center" p={6}>
                  <VStack spacing={3}>
                    <Icon as={FiGlobe} size="32px" color="blue.500" />
                    <Text fontWeight="bold">3D Visualization</Text>
                    <Text fontSize="sm" color="gray.600">
                      Three.js powered interactive globe with real-time asset positioning
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody textAlign="center" p={6}>
                  <VStack spacing={3}>
                    <Icon as={FiZap} size="32px" color="green.500" />
                    <Text fontWeight="bold">Real-Time Data</Text>
                    <Text fontSize="sm" color="gray.600">
                      WebSocket connections for live price feeds and trading activity
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody textAlign="center" p={6}>
                  <VStack spacing={3}>
                    <Icon as={FiBarChart3} size="32px" color="purple.500" />
                    <Text fontWeight="bold">Advanced Charts</Text>
                    <Text fontSize="sm" color="gray.600">
                      Recharts integration with multiple visualization types
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody textAlign="center" p={6}>
                  <VStack spacing={3}>
                    <Icon as={FiActivity} size="32px" color="orange.500" />
                    <Text fontWeight="bold">Event Streaming</Text>
                    <Text fontSize="sm" color="gray.600">
                      Real-time alerts and notifications for market events
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
