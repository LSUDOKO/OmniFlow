"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  AvatarBadge,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  CircularProgress,
  CircularProgressLabel,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  Divider,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrendingUp,
  FiAward,
  FiTarget,
  FiUsers,
  FiDollarSign,
  FiBarChart3,
  FiStar,
  FiTrophy,
  FiGift,
  FiPlay,
  FiRefreshCw,
  FiPlus,
  FiEye,
  FiZap,
  FiShield,
  FiCrown,
  FiGamepad2,
  FiTrendingDown,
  FiCalendar,
  FiClock
} from 'react-icons/fi';
import { useRWATycoon, useAchievements } from '../../hooks/useRWATycoon';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function RWATycoonDashboard() {
  const {
    player,
    portfolios,
    activePortfolio,
    leaderboards,
    isLoading,
    error,
    initializePlayer,
    createPortfolio,
    claimDailyRewards,
    refreshData,
    getPlayerRank,
    getNextLevelProgress
  } = useRWATycoon();

  const { achievements, getAchievementProgress, getRecentAchievements } = useAchievements();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isWelcomeOpen, onOpen: onWelcomeOpen, onClose: onWelcomeClose } = useDisclosure();
  
  const [portfolioName, setPortfolioName] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [dailyRewardsClaimed, setDailyRewardsClaimed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Show welcome modal for new players
  useEffect(() => {
    if (!player && !isLoading) {
      onWelcomeOpen();
    }
  }, [player, isLoading, onWelcomeOpen]);

  const handleInitializePlayer = async () => {
    const newPlayer = await initializePlayer();
    if (newPlayer) {
      onWelcomeClose();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      toast({
        title: "Welcome to RWA Tycoon! 🎉",
        description: "Your empire awaits. Start building your virtual RWA portfolio!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCreatePortfolio = async () => {
    if (!portfolioName.trim()) return;
    
    const newPortfolio = await createPortfolio(portfolioName, portfolioDescription);
    if (newPortfolio) {
      setPortfolioName('');
      setPortfolioDescription('');
      onCreateClose();
      
      toast({
        title: "Portfolio Created! 📊",
        description: `${portfolioName} is ready for your investments`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClaimRewards = async () => {
    const rewards = await claimDailyRewards();
    if (rewards > 0) {
      setDailyRewardsClaimed(true);
      toast({
        title: "Daily Rewards Claimed! 💰",
        description: `You earned ${Math.floor(rewards)} governance points`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const getTitleColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'green';
      case 'RARE': return 'blue';
      case 'EPIC': return 'purple';
      case 'LEGENDARY': return 'orange';
      case 'MYTHIC': return 'red';
      default: return 'gray';
    }
  };

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'INVESTMENT': return FiDollarSign;
      case 'PORTFOLIO': return FiBarChart3;
      case 'SOCIAL': return FiUsers;
      case 'MILESTONE': return FiTrophy;
      case 'SPECIAL': return FiStar;
      default: return FiAward;
    }
  };

  const levelProgress = getNextLevelProgress();
  const achievementProgress = getAchievementProgress();
  const recentAchievements = getRecentAchievements(7);
  const portfolioRank = getPlayerRank('PORTFOLIO_VALUE');
  const governanceRank = getPlayerRank('GOVERNANCE_POINTS');

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <CircularProgress isIndeterminate color="blue.500" size="80px" />
          <Text fontSize="lg">Loading your RWA Empire...</Text>
        </VStack>
      </Box>
    );
  }

  if (!player) {
    return (
      <>
        <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card maxW="md" bg={cardBg} textAlign="center" p={8}>
              <CardBody>
                <VStack spacing={6}>
                  <Icon as={FiGamepad2} boxSize={16} color="blue.500" />
                  <Heading size="lg" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                    Welcome to RWA Tycoon
                  </Heading>
                  <Text color={textColor} textAlign="center">
                    Build your virtual real-world asset empire! Connect your wallet to start your journey 
                    as an RWA investment tycoon.
                  </Text>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    leftIcon={<FiPlay />}
                    onClick={onWelcomeOpen}
                  >
                    Start Your Empire
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </Box>

        {/* Welcome Modal */}
        <Modal isOpen={isWelcomeOpen} onClose={onWelcomeClose} size="xl" closeOnOverlayClick={false}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <Icon as={FiCrown} color="gold" />
                <Text>Welcome to RWA Tycoon!</Text>
              </HStack>
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Text>
                  Transform your real RWA investments into an engaging simulation game! 
                  Build virtual portfolios, earn governance points, unlock achievements, 
                  and compete with other investors.
                </Text>
                
                <Box p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
                  <Text fontWeight="semibold" mb={2}>🎮 Game Features:</Text>
                  <VStack align="start" spacing={1} fontSize="sm">
                    <Text>• Virtual portfolios based on your real RWA holdings</Text>
                    <Text>• Daily rewards and governance points</Text>
                    <Text>• Achievements, titles, and leaderboards</Text>
                    <Text>• Asset upgrades and synergy bonuses</Text>
                    <Text>• Market events and challenges</Text>
                  </VStack>
                </Box>

                <Alert status="info">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Your virtual portfolio will sync with your actual RWA token holdings for bonus rewards!
                  </Text>
                </Alert>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onWelcomeClose}>
                Maybe Later
              </Button>
              <Button colorScheme="blue" onClick={handleInitializePlayer} leftIcon={<FiZap />}>
                Start Playing!
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <MotionBox
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            pointerEvents="none"
            zIndex={9999}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti particles would go here */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              fontSize="6xl"
            >
              🎉
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      <Box p={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiGamepad2} boxSize={8} color="blue.500" />
                  <Heading size="xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                    RWA Tycoon
                  </Heading>
                </HStack>
                <HStack>
                  <Avatar size="sm" name={player.username}>
                    <AvatarBadge boxSize="1.25em" bg={getTitleColor(player.title.rarity)}>
                      <Text fontSize="xs">{player.level}</Text>
                    </AvatarBadge>
                  </Avatar>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="semibold">{player.username}</Text>
                    <Badge colorScheme={getTitleColor(player.title.rarity)} size="sm">
                      {player.title.icon} {player.title.name}
                    </Badge>
                  </VStack>
                </HStack>
              </VStack>

              <HStack>
                <Button
                  leftIcon={<FiGift />}
                  colorScheme="green"
                  onClick={handleClaimRewards}
                  isDisabled={dailyRewardsClaimed}
                >
                  {dailyRewardsClaimed ? 'Claimed Today' : 'Claim Daily Rewards'}
                </Button>
                <Button leftIcon={<FiRefreshCw />} onClick={refreshData} variant="outline">
                  Refresh
                </Button>
              </HStack>
            </Flex>
          </MotionBox>

          {/* Player Stats Cards */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {/* Level Progress */}
              <MotionCard whileHover={{ scale: 1.02 }} bg={cardBg}>
                <CardBody>
                  <VStack spacing={3}>
                    <HStack w="full" justify="space-between">
                      <Text fontWeight="semibold">Level {player.level}</Text>
                      <Icon as={FiStar} color="yellow.500" />
                    </HStack>
                    <Progress
                      value={levelProgress.percentage}
                      colorScheme="blue"
                      size="lg"
                      w="full"
                      borderRadius="full"
                    />
                    <Text fontSize="sm" color={textColor}>
                      {levelProgress.current} / {levelProgress.required} XP
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Governance Points */}
              <MotionCard whileHover={{ scale: 1.02 }} bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Governance Points</StatLabel>
                    <StatNumber color="purple.500">
                      {player.governancePoints.toLocaleString()}
                    </StatNumber>
                    <StatHelpText>
                      Rank #{governanceRank || 'Unranked'}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </MotionCard>

              {/* Portfolio Value */}
              <MotionCard whileHover={{ scale: 1.02 }} bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Portfolio Value</StatLabel>
                    <StatNumber color="green.500">
                      ${player.stats.portfolioValue.toLocaleString()}
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      Rank #{portfolioRank || 'Unranked'}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </MotionCard>

              {/* Win Rate */}
              <MotionCard whileHover={{ scale: 1.02 }} bg={cardBg}>
                <CardBody>
                  <VStack spacing={3}>
                    <HStack w="full" justify="space-between">
                      <Text fontWeight="semibold">Win Rate</Text>
                      <Icon as={FiTrendingUp} color="green.500" />
                    </HStack>
                    <CircularProgress
                      value={player.stats.winRate}
                      color="green.500"
                      size="60px"
                    >
                      <CircularProgressLabel fontSize="sm" fontWeight="bold">
                        {player.stats.winRate}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <Text fontSize="sm" color={textColor}>
                      {player.stats.streakDays} day streak
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>
            </SimpleGrid>
          </MotionBox>

          {/* Main Content Tabs */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card bg={cardBg}>
              <CardBody>
                <Tabs variant="enclosed" colorScheme="blue">
                  <TabList>
                    <Tab>Portfolio</Tab>
                    <Tab>Achievements</Tab>
                    <Tab>Leaderboards</Tab>
                    <Tab>Challenges</Tab>
                  </TabList>

                  <TabPanels>
                    {/* Portfolio Tab */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Heading size="md">Your Virtual Portfolios</Heading>
                          <Button leftIcon={<FiPlus />} onClick={onCreateOpen} colorScheme="blue">
                            Create Portfolio
                          </Button>
                        </Flex>

                        {portfolios.length === 0 ? (
                          <Alert status="info">
                            <AlertIcon />
                            <Box>
                              <Text fontWeight="semibold">No portfolios yet!</Text>
                              <Text fontSize="sm">
                                Create your first virtual portfolio to start building your RWA empire.
                              </Text>
                            </Box>
                          </Alert>
                        ) : (
                          <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
                            {portfolios.map((portfolio) => (
                              <MotionCard
                                key={portfolio.id}
                                whileHover={{ scale: 1.02 }}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                              >
                                <CardHeader>
                                  <HStack justify="space-between">
                                    <VStack align="start" spacing={1}>
                                      <Text fontWeight="bold">{portfolio.name}</Text>
                                      <Text fontSize="sm" color={textColor}>
                                        {portfolio.description}
                                      </Text>
                                    </VStack>
                                    <Badge colorScheme="blue">
                                      {portfolio.assets.length} Assets
                                    </Badge>
                                  </HStack>
                                </CardHeader>
                                <CardBody pt={0}>
                                  <VStack spacing={3} align="stretch">
                                    <HStack justify="space-between">
                                      <Text fontSize="sm">Total Value:</Text>
                                      <Text fontWeight="bold" color="green.500">
                                        ${portfolio.totalValue.toLocaleString()}
                                      </Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm">Daily Return:</Text>
                                      <Text fontWeight="bold" color="blue.500">
                                        ${portfolio.dailyReturn.toFixed(2)}
                                      </Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm">Risk Level:</Text>
                                      <Badge
                                        colorScheme={
                                          portfolio.riskLevel < 30 ? 'green' :
                                          portfolio.riskLevel < 70 ? 'yellow' : 'red'
                                        }
                                      >
                                        {portfolio.riskLevel}%
                                      </Badge>
                                    </HStack>
                                    <Button size="sm" leftIcon={<FiEye />} variant="outline">
                                      View Details
                                    </Button>
                                  </VStack>
                                </CardBody>
                              </MotionCard>
                            ))}
                          </Grid>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* Achievements Tab */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <HStack justify="space-between">
                          <Heading size="md">Achievements</Heading>
                          <Badge colorScheme="purple" fontSize="md" p={2}>
                            {achievementProgress.unlocked} / {achievementProgress.total}
                          </Badge>
                        </HStack>

                        <Progress
                          value={achievementProgress.percentage}
                          colorScheme="purple"
                          size="lg"
                          borderRadius="full"
                        />

                        {recentAchievements.length > 0 && (
                          <Box>
                            <Text fontWeight="semibold" mb={3}>Recent Achievements</Text>
                            <Wrap>
                              {recentAchievements.map((achievement) => (
                                <WrapItem key={achievement.id}>
                                  <Tooltip label={achievement.description}>
                                    <Tag
                                      size="lg"
                                      colorScheme={achievement.rarity.toLowerCase() as any}
                                      cursor="pointer"
                                    >
                                      <TagLeftIcon as={getAchievementIcon(achievement.category)} />
                                      <TagLabel>{achievement.name}</TagLabel>
                                    </Tag>
                                  </Tooltip>
                                </WrapItem>
                              ))}
                            </Wrap>
                          </Box>
                        )}

                        <Box>
                          <Text fontWeight="semibold" mb={3}>All Achievements</Text>
                          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                            {achievements.map((achievement) => (
                              <MotionCard
                                key={achievement.id}
                                whileHover={{ scale: 1.02 }}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                              >
                                <CardBody>
                                  <HStack>
                                    <Icon
                                      as={getAchievementIcon(achievement.category)}
                                      boxSize={6}
                                      color={`${achievement.rarity.toLowerCase()}.500`}
                                    />
                                    <VStack align="start" spacing={1} flex={1}>
                                      <Text fontWeight="bold" fontSize="sm">
                                        {achievement.icon} {achievement.name}
                                      </Text>
                                      <Text fontSize="xs" color={textColor}>
                                        {achievement.description}
                                      </Text>
                                      <HStack>
                                        <Badge
                                          size="xs"
                                          colorScheme={achievement.rarity.toLowerCase() as any}
                                        >
                                          {achievement.rarity}
                                        </Badge>
                                        <Text fontSize="xs" color="green.500">
                                          +{achievement.governancePoints} GP
                                        </Text>
                                      </HStack>
                                    </VStack>
                                  </HStack>
                                </CardBody>
                              </MotionCard>
                            ))}
                          </Grid>
                        </Box>
                      </VStack>
                    </TabPanel>

                    {/* Leaderboards Tab */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <Heading size="md">Leaderboards</Heading>
                        
                        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                          {Array.from(leaderboards.entries()).map(([category, leaderboard]) => (
                            <Card key={category} bg={useColorModeValue('gray.50', 'gray.700')}>
                              <CardHeader>
                                <Text fontWeight="bold">
                                  {category.replace('_', ' ')} Leaders
                                </Text>
                              </CardHeader>
                              <CardBody pt={0}>
                                <Table size="sm">
                                  <Thead>
                                    <Tr>
                                      <Th>Rank</Th>
                                      <Th>Player</Th>
                                      <Th isNumeric>Value</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {leaderboard.entries.slice(0, 5).map((entry) => (
                                      <Tr
                                        key={entry.playerId}
                                        bg={entry.playerId === player.address ? 'blue.50' : undefined}
                                      >
                                        <Td>
                                          <HStack>
                                            <Text>#{entry.rank}</Text>
                                            {entry.rank <= 3 && (
                                              <Icon
                                                as={FiTrophy}
                                                color={
                                                  entry.rank === 1 ? 'gold' :
                                                  entry.rank === 2 ? 'silver' : '#CD7F32'
                                                }
                                              />
                                            )}
                                          </HStack>
                                        </Td>
                                        <Td>
                                          <VStack align="start" spacing={0}>
                                            <Text fontSize="sm" fontWeight="semibold">
                                              {entry.username}
                                            </Text>
                                            <Badge size="xs" colorScheme={getTitleColor(entry.title.rarity)}>
                                              {entry.title.name}
                                            </Badge>
                                          </VStack>
                                        </Td>
                                        <Td isNumeric>
                                          <Text fontSize="sm" fontWeight="bold">
                                            {category === 'GOVERNANCE_POINTS' || category === 'PORTFOLIO_VALUE'
                                              ? entry.value.toLocaleString()
                                              : `${entry.value.toFixed(1)}%`
                                            }
                                          </Text>
                                        </Td>
                                      </Tr>
                                    ))}
                                  </Tbody>
                                </Table>
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>
                      </VStack>
                    </TabPanel>

                    {/* Challenges Tab */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <Heading size="md">Active Challenges</Heading>
                        
                        <Alert status="info">
                          <AlertIcon />
                          <Box>
                            <Text fontWeight="semibold">Coming Soon!</Text>
                            <Text fontSize="sm">
                              Daily, weekly, and seasonal challenges will be available soon. 
                              Complete objectives to earn exclusive rewards!
                            </Text>
                          </Box>
                        </Alert>

                        {/* Preview of upcoming challenges */}
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                          <Card bg={useColorModeValue('gray.50', 'gray.700')}>
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack>
                                  <Icon as={FiCalendar} color="blue.500" />
                                  <Text fontWeight="bold">Daily Challenge</Text>
                                  <Badge colorScheme="blue">Coming Soon</Badge>
                                </HStack>
                                <Text fontSize="sm" color={textColor}>
                                  Complete daily investment tasks to earn bonus governance points
                                </Text>
                                <Text fontSize="xs" color="green.500">
                                  Reward: 100-500 GP
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>

                          <Card bg={useColorModeValue('gray.50', 'gray.700')}>
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack>
                                  <Icon as={FiClock} color="purple.500" />
                                  <Text fontWeight="bold">Weekly Tournament</Text>
                                  <Badge colorScheme="purple">Coming Soon</Badge>
                                </HStack>
                                <Text fontSize="sm" color={textColor}>
                                  Compete with other players for the highest portfolio returns
                                </Text>
                                <Text fontSize="xs" color="green.500">
                                  Reward: Exclusive titles & 5000 GP
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        </Grid>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </MotionBox>
        </VStack>
      </Box>

      {/* Create Portfolio Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Portfolio</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Portfolio Name</FormLabel>
                <Input
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="My RWA Empire"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={portfolioDescription}
                  onChange={(e) => setPortfolioDescription(e.target.value)}
                  placeholder="Building wealth through tokenized real-world assets..."
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleCreatePortfolio}
              isDisabled={!portfolioName.trim()}
            >
              Create Portfolio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {error && (
        <Alert status="error" position="fixed" bottom={4} right={4} maxW="md">
          <AlertIcon />
          {error}
        </Alert>
      )}
    </Box>
  );
}
