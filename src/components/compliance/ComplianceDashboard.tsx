"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Progress,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Icon,
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
  Select,
  Textarea,
  useToast,
  Spinner,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiEye,
  FiUserCheck,
  FiGlobe,
  FiFlag,
  FiActivity,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiPlus,
  FiMinus,
} from 'react-icons/fi';
import { useCompliance, ComplianceLevel, Region, RiskLevel } from '../../hooks/useCompliance';
import { useWallet } from '../../contexts/WalletContext';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface ComplianceMetrics {
  totalUsers: number;
  compliantUsers: number;
  pendingReviews: number;
  flaggedAccounts: number;
  kycCompletionRate: number;
  regionalDistribution: Record<string, number>;
}

const mockMetrics: ComplianceMetrics = {
  totalUsers: 12847,
  compliantUsers: 11234,
  pendingReviews: 156,
  flaggedAccounts: 23,
  kycCompletionRate: 87.4,
  regionalDistribution: {
    'US': 4521,
    'EU': 3892,
    'Asia Pacific': 2834,
    'Other': 1600,
  },
};

export default function ComplianceDashboard() {
  const [metrics, setMetrics] = useState<ComplianceMetrics>(mockMetrics);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBlacklistOpen,
    onOpen: onBlacklistOpen,
    onClose: onBlacklistClose,
  } = useDisclosure();

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { account, chainId } = useWallet();

  const {
    isLoading,
    error,
    complianceData,
    getComplianceReport,
    updateComplianceStatus,
    addToBlacklist,
    addToWhitelist,
  } = useCompliance();

  const [blacklistForm, setBlacklistForm] = useState({
    address: '',
    reason: '',
  });

  const [complianceForm, setComplianceForm] = useState({
    address: '',
    isCompliant: true,
    level: ComplianceLevel.BASIC,
    region: Region.UNRESTRICTED,
    expiryDays: 365,
  });

  // Load compliance data for current user
  useEffect(() => {
    if (account && chainId) {
      getComplianceReport(account, chainId);
    }
  }, [account, chainId, getComplianceReport]);

  const getComplianceLevelColor = (level: ComplianceLevel) => {
    switch (level) {
      case ComplianceLevel.NONE:
        return 'gray';
      case ComplianceLevel.BASIC:
        return 'blue';
      case ComplianceLevel.ENHANCED:
        return 'green';
      case ComplianceLevel.INSTITUTIONAL:
        return 'purple';
      case ComplianceLevel.RESTRICTED:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return 'green';
      case RiskLevel.MEDIUM:
        return 'yellow';
      case RiskLevel.HIGH:
        return 'orange';
      case RiskLevel.CRITICAL:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getRegionName = (region: Region) => {
    switch (region) {
      case Region.UNRESTRICTED:
        return 'Unrestricted';
      case Region.US:
        return 'United States';
      case Region.EU:
        return 'European Union';
      case Region.ASIA_PACIFIC:
        return 'Asia Pacific';
      case Region.RESTRICTED:
        return 'Restricted';
      case Region.SANCTIONED:
        return 'Sanctioned';
      default:
        return 'Unknown';
    }
  };

  const handleUpdateCompliance = async () => {
    if (!chainId) return;

    const expiryTimestamp = Math.floor(Date.now() / 1000) + (complianceForm.expiryDays * 24 * 60 * 60);
    
    const success = await updateComplianceStatus(
      complianceForm.address,
      complianceForm.isCompliant,
      complianceForm.level,
      complianceForm.region,
      expiryTimestamp,
      chainId
    );

    if (success) {
      toast({
        title: 'Compliance Updated',
        description: 'User compliance status has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };

  const handleBlacklistUser = async () => {
    if (!chainId) return;

    const success = await addToBlacklist(
      blacklistForm.address,
      blacklistForm.reason,
      chainId
    );

    if (success) {
      toast({
        title: 'User Blacklisted',
        description: 'User has been added to the blacklist.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      onBlacklistClose();
      setBlacklistForm({ address: '', reason: '' });
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={2}>
              <Heading size="xl" color="blue.500">
                <Icon as={FiShield} mr={3} />
                Compliance Dashboard
              </Heading>
              <Text color="gray.500">
                Monitor KYC, AML, and regulatory compliance across all users
              </Text>
            </VStack>
            
            {isAdmin && (
              <HStack spacing={3}>
                <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
                  Update Compliance
                </Button>
                <Button leftIcon={<FiMinus />} colorScheme="red" onClick={onBlacklistOpen}>
                  Blacklist User
                </Button>
              </HStack>
            )}
          </Flex>
        </MotionBox>

        {/* Current User Status */}
        {complianceData.status && (
          <MotionCard
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardHeader>
              <Heading size="md">Your Compliance Status</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack align="start">
                  <Text fontSize="sm" color="gray.500">Status</Text>
                  <Badge
                    colorScheme={complianceData.status.isCompliant ? 'green' : 'red'}
                    size="lg"
                    px={3}
                    py={1}
                  >
                    <Icon as={complianceData.status.isCompliant ? FiCheck : FiX} mr={1} />
                    {complianceData.status.isCompliant ? 'Compliant' : 'Non-Compliant'}
                  </Badge>
                </VStack>
                
                <VStack align="start">
                  <Text fontSize="sm" color="gray.500">Compliance Level</Text>
                  <Badge
                    colorScheme={getComplianceLevelColor(complianceData.status.requiredLevel)}
                    size="lg"
                    px={3}
                    py={1}
                  >
                    {ComplianceLevel[complianceData.status.requiredLevel]}
                  </Badge>
                </VStack>
                
                <VStack align="start">
                  <Text fontSize="sm" color="gray.500">Risk Level</Text>
                  <Badge
                    colorScheme={getRiskLevelColor(complianceData.status.riskLevel)}
                    size="lg"
                    px={3}
                    py={1}
                  >
                    {RiskLevel[complianceData.status.riskLevel]}
                  </Badge>
                </VStack>
              </SimpleGrid>
              
              {complianceData.status.expiryTimestamp > 0 && (
                <Alert status="info" mt={4}>
                  <AlertIcon />
                  <AlertDescription>
                    Your compliance status expires on{' '}
                    {new Date(complianceData.status.expiryTimestamp * 1000).toLocaleDateString()}
                  </AlertDescription>
                </Alert>
              )}
            </CardBody>
          </MotionCard>
        )}

        {/* Compliance Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <MotionCard
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardBody>
              <Stat>
                <StatLabel>Total Users</StatLabel>
                <StatNumber color="blue.500">{metrics.totalUsers.toLocaleString()}</StatNumber>
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
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CardBody>
              <Stat>
                <StatLabel>Compliant Users</StatLabel>
                <StatNumber color="green.500">{metrics.compliantUsers.toLocaleString()}</StatNumber>
                <StatHelpText>
                  {((metrics.compliantUsers / metrics.totalUsers) * 100).toFixed(1)}% compliance rate
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
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CardBody>
              <Stat>
                <StatLabel>Pending Reviews</StatLabel>
                <StatNumber color="orange.500">{metrics.pendingReviews}</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  8.2% from yesterday
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
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <CardBody>
              <Stat>
                <StatLabel>Flagged Accounts</StatLabel>
                <StatNumber color="red.500">{metrics.flaggedAccounts}</StatNumber>
                <StatHelpText>
                  Require immediate attention
                </StatHelpText>
              </Stat>
            </CardBody>
          </MotionCard>
        </SimpleGrid>

        {/* KYC Completion and Regional Distribution */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <MotionCard
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <CardHeader>
              <Heading size="md">KYC Completion Rate</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <Box w="full">
                  <Flex justify="space-between" mb={2}>
                    <Text>Overall KYC Completion</Text>
                    <Text fontWeight="bold">{metrics.kycCompletionRate}%</Text>
                  </Flex>
                  <Progress
                    value={metrics.kycCompletionRate}
                    colorScheme="green"
                    size="lg"
                    borderRadius="md"
                  />
                </Box>
                
                <SimpleGrid columns={2} spacing={4} w="full">
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="green.500">
                      {Math.floor((metrics.kycCompletionRate / 100) * metrics.totalUsers).toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color="gray.500">Completed KYC</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                      {(metrics.totalUsers - Math.floor((metrics.kycCompletionRate / 100) * metrics.totalUsers)).toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color="gray.500">Pending KYC</Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </MotionCard>

          <MotionCard
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <CardHeader>
              <Heading size="md">Regional Distribution</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3}>
                {Object.entries(metrics.regionalDistribution).map(([region, count]) => (
                  <Box key={region} w="full">
                    <Flex justify="space-between" mb={1}>
                      <Text>{region}</Text>
                      <Text fontWeight="bold">{count.toLocaleString()}</Text>
                    </Flex>
                    <Progress
                      value={(count / metrics.totalUsers) * 100}
                      colorScheme="blue"
                      size="sm"
                      borderRadius="md"
                    />
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </MotionCard>
        </SimpleGrid>

        {/* AML Data */}
        {complianceData.amlData && (
          <MotionCard
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <CardHeader>
              <Heading size="md">AML Monitoring</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack align="start">
                  <Text fontSize="sm" color="gray.500">24h Volume</Text>
                  <Text fontSize="xl" fontWeight="bold">
                    {parseFloat(complianceData.amlData.totalVolume24h).toFixed(2)} ETH
                  </Text>
                </VStack>
                
                <VStack align="start">
                  <Text fontSize="sm" color="gray.500">24h Transactions</Text>
                  <Text fontSize="xl" fontWeight="bold">
                    {complianceData.amlData.transactionCount24h}
                  </Text>
                </VStack>
                
                <VStack align="start">
                  <Text fontSize="sm" color="gray.500">Risk Score</Text>
                  <HStack>
                    <Text fontSize="xl" fontWeight="bold">
                      {complianceData.amlData.suspiciousActivityScore}
                    </Text>
                    <Badge
                      colorScheme={
                        complianceData.amlData.suspiciousActivityScore > 80
                          ? 'red'
                          : complianceData.amlData.suspiciousActivityScore > 50
                          ? 'orange'
                          : 'green'
                      }
                    >
                      {complianceData.amlData.suspiciousActivityScore > 80
                        ? 'High Risk'
                        : complianceData.amlData.suspiciousActivityScore > 50
                        ? 'Medium Risk'
                        : 'Low Risk'}
                    </Badge>
                  </HStack>
                </VStack>
              </SimpleGrid>
              
              {complianceData.amlData.flaggedForReview && (
                <Alert status="warning" mt={4}>
                  <AlertIcon />
                  <AlertTitle>Flagged for Review</AlertTitle>
                  <AlertDescription>
                    This account has been flagged for suspicious activity and requires manual review.
                  </AlertDescription>
                </Alert>
              )}
            </CardBody>
          </MotionCard>
        )}

        {/* Error Display */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </VStack>

      {/* Update Compliance Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Compliance Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="User Address"
                value={complianceForm.address}
                onChange={(e) => setComplianceForm({ ...complianceForm, address: e.target.value })}
              />
              
              <Select
                value={complianceForm.isCompliant ? 'true' : 'false'}
                onChange={(e) => setComplianceForm({ ...complianceForm, isCompliant: e.target.value === 'true' })}
              >
                <option value="true">Compliant</option>
                <option value="false">Non-Compliant</option>
              </Select>
              
              <Select
                value={complianceForm.level}
                onChange={(e) => setComplianceForm({ ...complianceForm, level: parseInt(e.target.value) as ComplianceLevel })}
              >
                <option value={ComplianceLevel.NONE}>None</option>
                <option value={ComplianceLevel.BASIC}>Basic</option>
                <option value={ComplianceLevel.ENHANCED}>Enhanced</option>
                <option value={ComplianceLevel.INSTITUTIONAL}>Institutional</option>
                <option value={ComplianceLevel.RESTRICTED}>Restricted</option>
              </Select>
              
              <Select
                value={complianceForm.region}
                onChange={(e) => setComplianceForm({ ...complianceForm, region: parseInt(e.target.value) as Region })}
              >
                <option value={Region.UNRESTRICTED}>Unrestricted</option>
                <option value={Region.US}>United States</option>
                <option value={Region.EU}>European Union</option>
                <option value={Region.ASIA_PACIFIC}>Asia Pacific</option>
                <option value={Region.RESTRICTED}>Restricted</option>
                <option value={Region.SANCTIONED}>Sanctioned</option>
              </Select>
              
              <Input
                type="number"
                placeholder="Expiry (days)"
                value={complianceForm.expiryDays}
                onChange={(e) => setComplianceForm({ ...complianceForm, expiryDays: parseInt(e.target.value) })}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdateCompliance} isLoading={isLoading}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Blacklist Modal */}
      <Modal isOpen={isBlacklistOpen} onClose={onBlacklistClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Blacklist User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="User Address"
                value={blacklistForm.address}
                onChange={(e) => setBlacklistForm({ ...blacklistForm, address: e.target.value })}
              />
              <Textarea
                placeholder="Reason for blacklisting"
                value={blacklistForm.reason}
                onChange={(e) => setBlacklistForm({ ...blacklistForm, reason: e.target.value })}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBlacklistClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleBlacklistUser} isLoading={isLoading}>
              Blacklist
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
