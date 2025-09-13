"use client";

import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Icon,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Tooltip,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiDollarSign,
  FiGlobe,
  FiTrendingUp,
  FiTrendingDown,
  FiShield,
  FiZap,
  FiStar,
  FiLock,
  FiUnlock,
  FiRefreshCw,
  FiBarChart3,
} from 'react-icons/fi';
import { VirtualAsset } from '../../services/rwaTycoonService';
import { useRWATycoon } from '../../hooks/useRWATycoon';

const MotionCard = motion(Card);

interface VirtualAssetCardProps {
  asset: VirtualAsset;
  portfolioId: string;
  onUpdate?: () => void;
}

export default function VirtualAssetCard({ asset, portfolioId, onUpdate }: VirtualAssetCardProps) {
  const { purchaseVirtualShares, applyUpgrade, syncWithBlockchain } = useRWATycoon();
  const { isOpen: isBuyOpen, onOpen: onBuyOpen, onClose: onBuyClose } = useDisclosure();
  const { isOpen: isUpgradeOpen, onOpen: onUpgradeOpen, onClose: onUpgradeClose } = useDisclosure();
  
  const [shareAmount, setShareAmount] = useState(1);
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

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

  const getRiskColor = (riskMultiplier: number) => {
    if (riskMultiplier < 0.8) return 'green';
    if (riskMultiplier < 1.0) return 'yellow';
    if (riskMultiplier < 1.2) return 'orange';
    return 'red';
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const success = await purchaseVirtualShares(portfolioId, asset.id, shareAmount);
      if (success) {
        toast({
          title: "Purchase Successful! 🎉",
          description: `Bought ${shareAmount} shares of ${asset.name}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onBuyClose();
        onUpdate?.();
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Not enough governance points or other error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async (upgradeId: string) => {
    setIsProcessing(true);
    try {
      const success = await applyUpgrade(portfolioId, asset.id, upgradeId);
      if (success) {
        toast({
          title: "Upgrade Applied! ⚡",
          description: "Asset has been enhanced",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onUpgradeClose();
        onUpdate?.();
      }
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Not enough governance points",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSync = async () => {
    setIsProcessing(true);
    try {
      await syncWithBlockchain(portfolioId);
      toast({
        title: "Synced with Blockchain! 🔄",
        description: "Real ownership bonuses updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Could not sync with blockchain",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const purchaseCost = shareAmount * asset.currentValue * 0.1;
  const totalValue = asset.virtualShares * asset.currentValue;
  const dailyEarnings = asset.virtualShares * asset.dailyYield;
  const realityBonus = asset.realShares > 0 ? 1.5 : 1.0;
  const availableUpgrades = asset.upgrades.filter(u => !u.unlocked);

  return (
    <>
      <MotionCard
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        bg={cardBg}
        borderWidth="1px"
        borderColor={asset.realShares > 0 ? 'green.200' : 'gray.200'}
        position="relative"
      >
        {/* Reality Bonus Indicator */}
        {asset.realShares > 0 && (
          <Box
            position="absolute"
            top={2}
            right={2}
            bg="green.500"
            color="white"
            px={2}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
          >
            REAL +50%
          </Box>
        )}

        <CardHeader>
          <Flex justify="space-between" align="center">
            <HStack>
              <Icon 
                as={getAssetTypeIcon(asset.type)} 
                boxSize={6} 
                color={`${getAssetTypeColor(asset.type)}.500`} 
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="sm">
                  {asset.name}
                </Text>
                <Badge colorScheme={getAssetTypeColor(asset.type)} size="sm">
                  {asset.type.replace('_', ' ').toUpperCase()}
                </Badge>
              </VStack>
            </HStack>
            <VStack align="end" spacing={0}>
              <Text fontSize="xs" color={textColor}>Risk Level</Text>
              <Badge colorScheme={getRiskColor(asset.riskMultiplier)} size="sm">
                {(asset.riskMultiplier * 100).toFixed(0)}%
              </Badge>
            </VStack>
          </Flex>
        </CardHeader>

        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            {/* Asset Stats */}
            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Virtual Shares</StatLabel>
                <StatNumber fontSize="md" color="blue.500">
                  {asset.virtualShares.toLocaleString()}
                </StatNumber>
                {asset.realShares > 0 && (
                  <StatHelpText fontSize="xs">
                    {asset.realShares} real shares
                  </StatHelpText>
                )}
              </Stat>

              <Stat size="sm">
                <StatLabel fontSize="xs">Current Value</StatLabel>
                <StatNumber fontSize="md" color="green.500">
                  ${asset.currentValue.toFixed(2)}
                </StatNumber>
                <StatHelpText fontSize="xs">
                  <StatArrow type="increase" />
                  per share
                </StatHelpText>
              </Stat>

              <Stat size="sm">
                <StatLabel fontSize="xs">Total Value</StatLabel>
                <StatNumber fontSize="md">
                  ${totalValue.toLocaleString()}
                </StatNumber>
              </Stat>

              <Stat size="sm">
                <StatLabel fontSize="xs">Daily Yield</StatLabel>
                <StatNumber fontSize="md" color="purple.500">
                  ${(dailyEarnings * realityBonus).toFixed(2)}
                </StatNumber>
                <StatHelpText fontSize="xs">
                  {((asset.dailyYield * realityBonus) * 100).toFixed(3)}%
                </StatHelpText>
              </Stat>
            </Grid>

            {/* Upgrade Progress */}
            {asset.upgrades.length > 0 && (
              <Box>
                <Text fontSize="xs" color={textColor} mb={2}>
                  Upgrades: {asset.upgrades.filter(u => u.unlocked).length} / {asset.upgrades.length}
                </Text>
                <Progress
                  value={(asset.upgrades.filter(u => u.unlocked).length / asset.upgrades.length) * 100}
                  colorScheme="purple"
                  size="sm"
                  borderRadius="full"
                />
              </Box>
            )}

            <Divider />

            {/* Action Buttons */}
            <HStack spacing={2}>
              <Button
                size="sm"
                leftIcon={<FiTrendingUp />}
                onClick={onBuyOpen}
                colorScheme="blue"
                flex={1}
              >
                Buy More
              </Button>
              
              {availableUpgrades.length > 0 && (
                <Button
                  size="sm"
                  leftIcon={<FiZap />}
                  onClick={onUpgradeOpen}
                  colorScheme="purple"
                  flex={1}
                >
                  Upgrade
                </Button>
              )}
              
              <Tooltip label="Sync with blockchain">
                <Button
                  size="sm"
                  onClick={handleSync}
                  isLoading={isProcessing}
                  variant="outline"
                >
                  <Icon as={FiRefreshCw} />
                </Button>
              </Tooltip>
            </HStack>

            {/* Synergy Indicators */}
            {asset.synergies.length > 0 && (
              <Box>
                <Text fontSize="xs" color={textColor} mb={1}>Active Synergies:</Text>
                <HStack>
                  {asset.synergies.map((synergy, index) => (
                    <Badge key={index} colorScheme="orange" size="xs">
                      <Icon as={FiStar} mr={1} />
                      {synergy}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Purchase Modal */}
      <Modal isOpen={isBuyOpen} onClose={onBuyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Purchase Virtual Shares</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info" size="sm">
                <AlertIcon />
                <Text fontSize="sm">
                  Virtual shares cost 10% of asset value in governance points
                </Text>
              </Alert>

              <FormControl>
                <FormLabel>Number of Shares</FormLabel>
                <NumberInput
                  value={shareAmount}
                  onChange={(_, value) => setShareAmount(value || 1)}
                  min={1}
                  max={10000}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                <Stat size="sm" textAlign="center">
                  <StatLabel>Cost</StatLabel>
                  <StatNumber color="red.500">
                    {Math.floor(purchaseCost)} GP
                  </StatNumber>
                </Stat>
                <Stat size="sm" textAlign="center">
                  <StatLabel>Daily Earnings</StatLabel>
                  <StatNumber color="green.500">
                    ${(shareAmount * asset.dailyYield * realityBonus).toFixed(2)}
                  </StatNumber>
                </Stat>
              </Grid>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBuyClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handlePurchase}
              isLoading={isProcessing}
            >
              Purchase ({Math.floor(purchaseCost)} GP)
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Upgrade Modal */}
      <Modal isOpen={isUpgradeOpen} onClose={onUpgradeClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Asset Upgrades</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text color={textColor}>
                Enhance your asset with powerful upgrades to increase yield, reduce risk, or unlock special abilities.
              </Text>

              {availableUpgrades.map((upgrade) => (
                <Card
                  key={upgrade.id}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  cursor="pointer"
                  onClick={() => setSelectedUpgrade(upgrade.id)}
                  borderColor={selectedUpgrade === upgrade.id ? 'blue.500' : 'transparent'}
                  borderWidth="2px"
                >
                  <CardBody>
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={2} flex={1}>
                        <HStack>
                          <Icon
                            as={upgrade.effect.type === 'YIELD_BOOST' ? FiTrendingUp :
                                upgrade.effect.type === 'RISK_REDUCTION' ? FiShield :
                                upgrade.effect.type === 'SYNERGY_UNLOCK' ? FiStar : FiZap}
                            color={upgrade.effect.type === 'YIELD_BOOST' ? 'green.500' :
                                   upgrade.effect.type === 'RISK_REDUCTION' ? 'blue.500' :
                                   upgrade.effect.type === 'SYNERGY_UNLOCK' ? 'orange.500' : 'purple.500'}
                          />
                          <Text fontWeight="bold" fontSize="sm">
                            {upgrade.name}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color={textColor}>
                          {upgrade.description}
                        </Text>
                        <Badge colorScheme="purple">
                          {upgrade.effect.type === 'YIELD_BOOST' ? `+${upgrade.effect.value}% Yield` :
                           upgrade.effect.type === 'RISK_REDUCTION' ? `-${upgrade.effect.value}% Risk` :
                           upgrade.effect.type === 'SYNERGY_UNLOCK' ? 'Unlocks Synergy' :
                           'Special Effect'}
                        </Badge>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Text fontWeight="bold" color="purple.500">
                          {upgrade.cost} GP
                        </Text>
                        {selectedUpgrade === upgrade.id && (
                          <Icon as={FiUnlock} color="green.500" />
                        )}
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}

              {availableUpgrades.length === 0 && (
                <Alert status="info">
                  <AlertIcon />
                  <Text>All upgrades have been unlocked for this asset!</Text>
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onUpgradeClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={() => selectedUpgrade && handleUpgrade(selectedUpgrade)}
              isDisabled={!selectedUpgrade}
              isLoading={isProcessing}
            >
              Apply Upgrade
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
