"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Badge,
  Button,
  HStack,
  VStack,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  useToast,
  Icon,
  Flex,
  Divider,
  Tooltip,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import {
  FaHome,
  FaLeaf,
  FaGem,
  FaIndustry,
  FaEthereum,
  FaExchangeAlt,
  FaPlus,
  FaShoppingCart,
  FaGavel,
  FaCoins,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaRobot,
} from "react-icons/fa";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";

// Mock data for demonstration
const mockAssets = [
  {
    id: 1,
    name: "Manhattan Office Building",
    type: "Real Estate",
    price: "2.5 ETH",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop",
    location: "New York, NY",
    totalValue: "$5,000,000",
    fractionalized: true,
    fractionsAvailable: 10000,
    fractionsOwned: 2500,
    verified: true,
    chain: "OneChain",
  },
  {
    id: 2,
    name: "Carbon Credit Portfolio",
    type: "Carbon Credits",
    price: "0.8 ETH",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    location: "Amazon Rainforest",
    totalValue: "$1,200,000",
    fractionalized: true,
    fractionsAvailable: 50000,
    fractionsOwned: 12000,
    verified: true,
    chain: "Polygon",
  },
  {
    id: 3,
    name: "Gold Reserve Vault",
    type: "Precious Metals",
    price: "5.2 ETH",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=400&fit=crop",
    location: "Swiss Bank",
    totalValue: "$10,000,000",
    fractionalized: false,
    fractionsAvailable: 0,
    fractionsOwned: 0,
    verified: true,
    chain: "Ethereum",
  },
  {
    id: 4,
    name: "Solar Farm Investment",
    type: "Renewable Energy",
    price: "1.8 ETH",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=400&fit=crop",
    location: "California, USA",
    totalValue: "$3,500,000",
    fractionalized: true,
    fractionsAvailable: 25000,
    fractionsOwned: 8500,
    verified: true,
    chain: "BSC",
  },
];

const assetTypes = ["All", "Real Estate", "Carbon Credits", "Precious Metals", "Renewable Energy"];
const chains = ["All", "Ethereum", "Polygon", "BSC", "OneChain"];

export default function MarketplacePage() {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedChain, setSelectedChain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAssets, setFilteredAssets] = useState(mockAssets);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  
  const address = useAddress();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    let filtered = mockAssets;
    
    if (selectedType !== "All") {
      filtered = filtered.filter(asset => asset.type === selectedType);
    }
    
    if (selectedChain !== "All") {
      filtered = filtered.filter(asset => asset.chain === selectedChain);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredAssets(filtered);
  }, [selectedType, selectedChain, searchQuery]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Real Estate": return FaHome;
      case "Carbon Credits": return FaLeaf;
      case "Precious Metals": return FaGem;
      case "Renewable Energy": return FaIndustry;
      default: return FaHome;
    }
  };

  const getChainColor = (chain: string) => {
    switch (chain) {
      case "Ethereum": return "blue";
      case "Polygon": return "purple";
      case "BSC": return "yellow";
      case "OneChain": return "green";
      default: return "gray";
    }
  };

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset);
    onOpen();
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Container maxW="7xl" py={8}>
        {/* Header */}
        <VStack spacing={6} mb={8}>
          <Heading as="h1" size="2xl" textAlign="center">
            RWA Marketplace
          </Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center" maxW="2xl">
            Discover and trade tokenized real-world assets across multiple blockchains
          </Text>
        </VStack>

        {/* Filters */}
        <Card bg={cardBg} mb={8} p={6}>
          <VStack spacing={4}>
            <InputGroup maxW="md">
              <InputLeftElement>
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            
            <HStack spacing={4} wrap="wrap" justify="center">
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                maxW="200px"
              >
                {assetTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
              
              <Select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                maxW="200px"
              >
                {chains.map(chain => (
                  <option key={chain} value={chain}>{chain}</option>
                ))}
              </Select>
              
              <Button leftIcon={<FaPlus />} colorScheme="purple">
                List Asset
              </Button>
            </HStack>
          </VStack>
        </Card>

        {/* Asset Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-4px)",
                shadow: "xl",
              }}
              onClick={() => handleAssetClick(asset)}
            >
              <Box position="relative">
                <Image
                  src={asset.image}
                  alt={asset.name}
                  h="200px"
                  w="full"
                  objectFit="cover"
                  roundedTop="md"
                />
                
                {/* Chain Badge */}
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme={getChainColor(asset.chain)}
                  variant="solid"
                >
                  {asset.chain}
                </Badge>
                
                {/* Verified Badge */}
                {asset.verified && (
                  <Badge
                    position="absolute"
                    top={2}
                    left={2}
                    colorScheme="green"
                    variant="solid"
                  >
                    ✓ Verified
                  </Badge>
                )}
              </Box>
              
              <CardBody>
                <VStack align="start" spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Icon as={getAssetIcon(asset.type)} color="purple.500" />
                    <Badge colorScheme="purple" variant="subtle">
                      {asset.type}
                    </Badge>
                  </HStack>
                  
                  <Heading size="md" noOfLines={2}>
                    {asset.name}
                  </Heading>
                  
                  <Text fontSize="sm" color="gray.600">
                    📍 {asset.location}
                  </Text>
                  
                  <HStack justify="space-between" w="full">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Price</Text>
                      <Text fontWeight="bold" color="purple.500">
                        {asset.price}
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Total Value</Text>
                      <Text fontWeight="bold">
                        {asset.totalValue}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  {asset.fractionalized && (
                    <Box w="full">
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Fractions Available: {asset.fractionsAvailable.toLocaleString()}
                      </Text>
                      <Box bg="gray.200" rounded="full" h={2}>
                        <Box
                          bg="purple.500"
                          h={2}
                          rounded="full"
                          w={`${(asset.fractionsOwned / asset.fractionsAvailable) * 100}%`}
                        />
                      </Box>
                    </Box>
                  )}
                  
                  <HStack spacing={2} w="full">
                    <Button size="sm" colorScheme="purple" flex={1} leftIcon={<FaShoppingCart />}>
                      Buy
                    </Button>
                    {asset.fractionalized && (
                      <Button size="sm" variant="outline" flex={1} leftIcon={<FaExchangeAlt />}>
                        Trade
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Asset Detail Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedAsset?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedAsset && (
                <VStack spacing={4} align="start">
                  <Image
                    src={selectedAsset.image}
                    alt={selectedAsset.name}
                    w="full"
                    h="300px"
                    objectFit="cover"
                    rounded="md"
                  />
                  
                  <HStack spacing={4}>
                    <Badge colorScheme={getChainColor(selectedAsset.chain)}>
                      {selectedAsset.chain}
                    </Badge>
                    <Badge colorScheme="purple">
                      {selectedAsset.type}
                    </Badge>
                    {selectedAsset.verified && (
                      <Badge colorScheme="green">✓ Verified</Badge>
                    )}
                  </HStack>
                  
                  <Text><strong>Location:</strong> {selectedAsset.location}</Text>
                  <Text><strong>Total Value:</strong> {selectedAsset.totalValue}</Text>
                  <Text><strong>Price:</strong> {selectedAsset.price}</Text>
                  
                  {selectedAsset.fractionalized && (
                    <>
                      <Text><strong>Fractionalized:</strong> Yes</Text>
                      <Text><strong>Total Fractions:</strong> {selectedAsset.fractionsAvailable.toLocaleString()}</Text>
                      <Text><strong>Available:</strong> {(selectedAsset.fractionsAvailable - selectedAsset.fractionsOwned).toLocaleString()}</Text>
                    </>
                  )}
                  
                  <Tabs w="full">
                    <TabList>
                      <Tab>Buy</Tab>
                      {selectedAsset.fractionalized && <Tab>Trade Fractions</Tab>}
                      <Tab>Auction</Tab>
                    </TabList>
                    
                    <TabPanels>
                      <TabPanel>
                        <VStack spacing={4}>
                          <FormControl>
                            <FormLabel>Amount to Buy</FormLabel>
                            <NumberInput defaultValue={1} min={1}>
                              <NumberInputField />
                            </NumberInput>
                          </FormControl>
                          <Button colorScheme="purple" w="full" size="lg">
                            Buy Now for {selectedAsset.price}
                          </Button>
                        </VStack>
                      </TabPanel>
                      
                      {selectedAsset.fractionalized && (
                        <TabPanel>
                          <VStack spacing={4}>
                            <FormControl>
                              <FormLabel>Number of Fractions</FormLabel>
                              <NumberInput defaultValue={100} min={1} max={selectedAsset.fractionsAvailable - selectedAsset.fractionsOwned}>
                                <NumberInputField />
                              </NumberInput>
                            </FormControl>
                            <Button colorScheme="green" w="full" size="lg">
                              Buy Fractions
                            </Button>
                          </VStack>
                        </TabPanel>
                      )}
                      
                      <TabPanel>
                        <VStack spacing={4}>
                          <FormControl>
                            <FormLabel>Starting Bid</FormLabel>
                            <NumberInput defaultValue={parseFloat(selectedAsset.price)} min={0.1} step={0.1}>
                              <NumberInputField />
                            </NumberInput>
                          </FormLabel>
                          <FormControl>
                            <FormLabel>Auction Duration (hours)</FormLabel>
                            <NumberInput defaultValue={24} min={1} max={168}>
                              <NumberInputField />
                            </NumberInput>
                          </FormControl>
                          <Button colorScheme="orange" w="full" size="lg" leftIcon={<FaGavel />}>
                            Start Auction
                          </Button>
                        </VStack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
