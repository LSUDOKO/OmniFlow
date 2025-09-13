import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Image,
  Skeleton,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Divider,
  Tooltip,
  Progress,
  SimpleGrid,
  Icon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiShield, FiUser, FiGlobe, FiAward, FiClock, FiCheck } from 'react-icons/fi';
import { useIdentityPassport } from '../../hooks/useIdentityPassport';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface PassportDisplayProps {
  showDetails?: boolean;
  compact?: boolean;
}

export const PassportDisplay: React.FC<PassportDisplayProps> = ({
  showDetails = true,
  compact = false,
}) => {
  const {
    passport,
    metadata,
    loading,
    error,
    isPassportValid,
    passportStatus,
    getKYCLevelColor,
    getInvestorTierBadge,
    hasPassport,
  } = useIdentityPassport();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  if (loading) {
    return (
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <VStack spacing={4}>
            <Skeleton height="120px" width="120px" borderRadius="xl" />
            <VStack spacing={2}>
              <Skeleton height="20px" width="200px" />
              <Skeleton height="16px" width="150px" />
              <Skeleton height="16px" width="100px" />
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="xl">
        <AlertIcon />
        <Text>Failed to load identity passport: {error}</Text>
      </Alert>
    );
  }

  if (!hasPassport) {
    return (
      <MotionCard
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardBody textAlign="center">
          <VStack spacing={4}>
            <Icon as={FiUser} size="48px" color="gray.400" />
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="semibold">
                No Identity Passport
              </Text>
              <Text color={textColor} fontSize="sm">
                Get verified to access premium features and build your reputation
              </Text>
            </VStack>
            <Button colorScheme="blue" size="sm">
              Get Verified
            </Button>
          </VStack>
        </CardBody>
      </MotionCard>
    );
  }

  if (compact) {
    return (
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <HStack spacing={3} p={3} bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <Box position="relative">
            <Image
              src={metadata?.image || '/default-passport.png'}
              alt="Identity Passport"
              boxSize="40px"
              borderRadius="lg"
              fallback={<Icon as={FiShield} boxSize="40px" color="blue.500" />}
            />
            {isPassportValid && (
              <Icon
                as={FiCheck}
                position="absolute"
                top="-2px"
                right="-2px"
                color="green.500"
                bg="white"
                borderRadius="full"
                boxSize="16px"
              />
            )}
          </Box>
          <VStack align="start" spacing={0} flex={1}>
            <HStack spacing={2}>
              <Badge colorScheme={getKYCLevelColor(passport.kycLevel)} size="sm">
                {passport.kycLevel}
              </Badge>
              <Text fontSize="sm">{getInvestorTierBadge(passport.investorTier)}</Text>
            </HStack>
            <Text fontSize="xs" color={textColor}>
              Reputation: {passport.reputationScore}
            </Text>
          </VStack>
          <Badge
            colorScheme={isPassportValid ? 'green' : 'red'}
            variant="subtle"
            fontSize="xs"
          >
            {passportStatus}
          </Badge>
        </HStack>
      </MotionBox>
    );
  }

  return (
    <MotionCard
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      overflow="hidden"
    >
      <CardBody p={6}>
        <VStack spacing={6}>
          {/* Header */}
          <HStack spacing={4} w="full">
            <Box position="relative">
              <Image
                src={metadata?.image || '/default-passport.png'}
                alt="Identity Passport"
                boxSize="80px"
                borderRadius="xl"
                fallback={
                  <Box
                    boxSize="80px"
                    bg="blue.500"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiShield} color="white" boxSize="40px" />
                  </Box>
                }
              />
              {isPassportValid && (
                <Icon
                  as={FiCheck}
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  color="green.500"
                  bg="white"
                  borderRadius="full"
                  boxSize="20px"
                />
              )}
            </Box>
            <VStack align="start" spacing={2} flex={1}>
              <HStack spacing={2}>
                <Text fontSize="xl" fontWeight="bold">
                  Identity Passport
                </Text>
                <Badge
                  colorScheme={isPassportValid ? 'green' : 'red'}
                  variant="solid"
                >
                  {passportStatus}
                </Badge>
              </HStack>
              <Text fontSize="sm" color={textColor} fontFamily="mono">
                {passport.did.length > 40 
                  ? `${passport.did.slice(0, 20)}...${passport.did.slice(-20)}`
                  : passport.did
                }
              </Text>
            </VStack>
          </HStack>

          {showDetails && (
            <>
              <Divider />

              {/* Verification Levels */}
              <SimpleGrid columns={2} spacing={4} w="full">
                <VStack spacing={2}>
                  <HStack>
                    <Icon as={FiShield} color="blue.500" />
                    <Text fontSize="sm" fontWeight="semibold">KYC Level</Text>
                  </HStack>
                  <Badge
                    colorScheme={getKYCLevelColor(passport.kycLevel)}
                    size="lg"
                    px={3}
                    py={1}
                  >
                    {passport.kycLevel}
                  </Badge>
                </VStack>

                <VStack spacing={2}>
                  <HStack>
                    <Icon as={FiUser} color="purple.500" />
                    <Text fontSize="sm" fontWeight="semibold">Investor Tier</Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="lg">{getInvestorTierBadge(passport.investorTier)}</Text>
                    <Badge colorScheme="purple" size="lg" px={3} py={1}>
                      {passport.investorTier}
                    </Badge>
                  </HStack>
                </VStack>
              </SimpleGrid>

              {/* Reputation Score */}
              <Box w="full">
                <HStack justify="space-between" mb={2}>
                  <HStack>
                    <Icon as={FiAward} color="orange.500" />
                    <Text fontSize="sm" fontWeight="semibold">Reputation Score</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold">
                    {passport.reputationScore}/1000
                  </Text>
                </HStack>
                <Progress
                  value={(passport.reputationScore / 1000) * 100}
                  colorScheme="orange"
                  size="lg"
                  borderRadius="full"
                />
              </Box>

              {/* Cross-Chain Addresses */}
              {passport.crossChainAddresses.length > 0 && (
                <Box w="full">
                  <HStack mb={3}>
                    <Icon as={FiGlobe} color="green.500" />
                    <Text fontSize="sm" fontWeight="semibold">
                      Linked Addresses ({passport.crossChainAddresses.length})
                    </Text>
                  </HStack>
                  <SimpleGrid columns={1} spacing={2}>
                    {passport.crossChainAddresses.slice(0, 3).map((addr, index) => (
                      <HStack key={index} spacing={3} p={2} bg="gray.50" borderRadius="md">
                        <Badge colorScheme="blue" size="sm">
                          {addr.chain.toUpperCase()}
                        </Badge>
                        <Text fontSize="xs" fontFamily="mono" flex={1}>
                          {addr.address.length > 20
                            ? `${addr.address.slice(0, 10)}...${addr.address.slice(-10)}`
                            : addr.address
                          }
                        </Text>
                        {addr.verified && (
                          <Icon as={FiCheck} color="green.500" boxSize="12px" />
                        )}
                      </HStack>
                    ))}
                    {passport.crossChainAddresses.length > 3 && (
                      <Text fontSize="xs" color={textColor} textAlign="center">
                        +{passport.crossChainAddresses.length - 3} more addresses
                      </Text>
                    )}
                  </SimpleGrid>
                </Box>
              )}

              {/* Credentials */}
              {passport.credentials.length > 0 && (
                <Box w="full">
                  <HStack mb={3}>
                    <Icon as={FiAward} color="purple.500" />
                    <Text fontSize="sm" fontWeight="semibold">
                      Credentials ({passport.credentials.length})
                    </Text>
                  </HStack>
                  <HStack spacing={2} flexWrap="wrap">
                    {passport.credentials.slice(0, 5).map((credential, index) => (
                      <Tooltip key={index} label={credential}>
                        <Badge colorScheme="purple" size="sm">
                          Credential #{index + 1}
                        </Badge>
                      </Tooltip>
                    ))}
                    {passport.credentials.length > 5 && (
                      <Badge variant="outline" size="sm">
                        +{passport.credentials.length - 5} more
                      </Badge>
                    )}
                  </HStack>
                </Box>
              )}

              {/* Expiration */}
              <Box w="full">
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiClock} color="gray.500" />
                    <Text fontSize="sm" color={textColor}>Expires</Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    {passport.expirationDate.toLocaleDateString()}
                  </Text>
                </HStack>
              </Box>

              {/* Chain Info */}
              <Box w="full" pt={2} borderTop="1px" borderColor={borderColor}>
                <HStack justify="space-between">
                  <Text fontSize="xs" color={textColor}>
                    Chain: {passport.chain.toUpperCase()}
                  </Text>
                  <Text fontSize="xs" color={textColor}>
                    Token ID: #{passport.tokenId}
                  </Text>
                </HStack>
              </Box>
            </>
          )}
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

export default PassportDisplay;
