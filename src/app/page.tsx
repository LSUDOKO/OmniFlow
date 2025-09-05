"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Flex,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import {
  FaHome,
  FaLeaf,
  FaGem,
  FaIndustry,
  FaChartLine,
  FaGlobe,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";
import { ConnectButton } from "thirdweb/react";
import { client } from "../lib/thirdweb";

const assetTypes = [
  {
    name: "Real Estate",
    icon: FaHome,
    color: "blue",
    description: "Tokenize properties, commercial buildings, and land",
    totalValue: "$2.4B",
    assets: 1247,
  },
  {
    name: "Carbon Credits",
    icon: FaLeaf,
    color: "green",
    description: "Trade verified carbon offset certificates",
    totalValue: "$156M",
    assets: 892,
  },
  {
    name: "Precious Metals",
    icon: FaGem,
    color: "yellow",
    description: "Gold, silver, platinum backed tokens",
    totalValue: "$890M",
    assets: 445,
  },
  {
    name: "Commodities",
    icon: FaIndustry,
    color: "orange",
    description: "Oil, gas, agricultural products",
    totalValue: "$1.2B",
    assets: 678,
  },
];

const features = [
  {
    title: "Cross-Chain Compatible",
    description: "Trade assets across Ethereum, Polygon, BSC, and OneChain",
    icon: FaGlobe,
  },
  {
    title: "Compliance Ready",
    description: "Built-in KYC/AML compliance and regulatory frameworks",
    icon: FaShieldAlt,
  },
  {
    title: "Fractional Ownership",
    description: "Split high-value assets into affordable fractions",
    icon: FaChartLine,
  },
  {
    title: "Instant Liquidity",
    description: "24/7 trading with automated market making",
    icon: FaRocket,
  },
];

export default function HomePage() {
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null);
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box minH="100vh" bg={bgGradient}>
      {/* Hero Section */}
      <Container maxW="7xl" pt={20} pb={10}>
        <VStack spacing={8} textAlign="center">
          <Badge colorScheme="purple" fontSize="sm" px={3} py={1} rounded="full">
            🚀 Now Live on OneChain
          </Badge>
          
          <Heading
            as="h1"
            size="3xl"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
          >
            OmniFlow RWA Marketplace
          </Heading>
          
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            The world's first production-ready cross-chain marketplace for Real World Assets.
            Tokenize, trade, and fractionalize any asset with institutional-grade security.
          </Text>
          
          <HStack spacing={4}>
            <ConnectButton
              client={client}
              theme="dark"
            />
            <Button size="lg" variant="outline" colorScheme="purple">
              View Documentation
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Stats Section */}
      <Container maxW="7xl" py={10}>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
          <Stat textAlign="center">
            <StatLabel>Total Value Locked</StatLabel>
            <StatNumber color="blue.500">$4.6B</StatNumber>
            <StatHelpText>+12.5% this month</StatHelpText>
          </Stat>
          <Stat textAlign="center">
            <StatLabel>Active Assets</StatLabel>
            <StatNumber color="green.500">3,262</StatNumber>
            <StatHelpText>Across 5 chains</StatHelpText>
          </Stat>
          <Stat textAlign="center">
            <StatLabel>Total Trades</StatLabel>
            <StatNumber color="purple.500">89,432</StatNumber>
            <StatHelpText>24/7 liquidity</StatHelpText>
          </Stat>
          <Stat textAlign="center">
            <StatLabel>Verified Users</StatLabel>
            <StatNumber color="orange.500">12,847</StatNumber>
            <StatHelpText>KYC compliant</StatHelpText>
          </Stat>
        </SimpleGrid>
      </Container>

      {/* Asset Types Section */}
      <Container maxW="7xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" size="2xl">
              Supported Asset Classes
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Trade a diverse range of tokenized real-world assets with full regulatory compliance
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            {assetTypes.map((asset, index) => (
              <Card
                key={index}
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-4px)",
                  shadow: "xl",
                  borderColor: `${asset.color}.300`,
                }}
                onClick={() => setSelectedAssetType(asset.name)}
              >
                <CardHeader pb={2}>
                  <VStack spacing={3}>
                    <Box
                      p={3}
                      rounded="full"
                      bg={`${asset.color}.100`}
                      color={`${asset.color}.600`}
                    >
                      <Icon as={asset.icon} boxSize={6} />
                    </Box>
                    <Heading size="md" textAlign="center">
                      {asset.name}
                    </Heading>
                  </VStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={3}>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      {asset.description}
                    </Text>
                    <VStack spacing={1}>
                      <Text fontWeight="bold" color={`${asset.color}.500`}>
                        {asset.totalValue}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {asset.assets} assets
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="7xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" size="2xl">
              Why Choose OmniFlow?
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Built for institutions and retail investors with enterprise-grade infrastructure
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            {features.map((feature, index) => (
              <Card
                key={index}
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                p={6}
              >
                <HStack spacing={4} align="start">
                  <Box
                    p={3}
                    rounded="full"
                    bg="purple.100"
                    color="purple.600"
                    flexShrink={0}
                  >
                    <Icon as={feature.icon} boxSize={6} />
                  </Box>
                  <VStack align="start" spacing={2}>
                    <Heading size="md">{feature.title}</Heading>
                    <Text color="gray.600">{feature.description}</Text>
                  </VStack>
                </HStack>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Supported Networks */}
      <Container maxW="7xl" py={16}>
        <VStack spacing={8}>
          <Heading as="h2" size="xl" textAlign="center">
            Supported Networks
          </Heading>
          <HStack spacing={8} justify="center" wrap="wrap">
            <Badge colorScheme="blue" size="lg" p={3} rounded="full">
              Ethereum
            </Badge>
            <Badge colorScheme="purple" size="lg" p={3} rounded="full">
              Polygon
            </Badge>
            <Badge colorScheme="yellow" size="lg" p={3} rounded="full">
              BSC
            </Badge>
            <Badge colorScheme="green" size="lg" p={3} rounded="full">
              OneChain
            </Badge>
            <Badge colorScheme="cyan" size="lg" p={3} rounded="full">
              SUI (Coming Soon)
            </Badge>
          </HStack>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Container maxW="7xl" py={20}>
        <Card bg="purple.600" color="white" p={12} textAlign="center">
          <VStack spacing={6}>
            <Heading as="h2" size="2xl">
              Ready to Start Trading?
            </Heading>
            <Text fontSize="lg" opacity={0.9} maxW="2xl">
              Join thousands of investors already trading real-world assets on OmniFlow.
              Get started in minutes with our intuitive platform.
            </Text>
            <HStack spacing={4}>
              <Button size="lg" bg="white" color="purple.600" _hover={{ bg: "gray.100" }}>
                Launch App
              </Button>
              <Button size="lg" variant="outline" color="white" borderColor="white">
                Learn More
              </Button>
            </HStack>
          </VStack>
        </Card>
      </Container>
    </Box>
  );
}
