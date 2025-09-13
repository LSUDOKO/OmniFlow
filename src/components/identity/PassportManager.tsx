import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useDisclosure,
  useToast,
  Alert,
  AlertIcon,
  Badge,
  SimpleGrid,
  Card,
  CardBody,
  Divider,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiPlus, FiLink, FiAward, FiRefreshCw } from 'react-icons/fi';
import { useIdentityPassport } from '../../hooks/useIdentityPassport';
import { useWallet } from '../../contexts/WalletContext';
import { didIdentityService } from '../../lib/did-identity';
import PassportDisplay from './PassportDisplay';

const MotionBox = motion(Box);

interface CrossChainLinkForm {
  chain: string;
  address: string;
  signature: string;
}

interface CredentialForm {
  type: string;
  issuer: string;
  description: string;
  proofDocument: File | null;
}

export const PassportManager: React.FC = () => {
  const { passport, loading, fetchPassport, hasPassport } = useIdentityPassport();
  const { address, isConnected, chainId } = useWallet();
  const toast = useToast();
  
  const { isOpen: isLinkOpen, onOpen: onLinkOpen, onClose: onLinkClose } = useDisclosure();
  const { isOpen: isCredOpen, onOpen: onCredOpen, onClose: onCredClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  const [linkForm, setLinkForm] = useState<CrossChainLinkForm>({
    chain: '',
    address: '',
    signature: '',
  });

  const [credForm, setCredForm] = useState<CredentialForm>({
    type: '',
    issuer: '',
    description: '',
    proofDocument: null,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const supportedChains = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'bsc', label: 'Binance Smart Chain' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'optimism', label: 'Optimism' },
    { value: 'solana', label: 'Solana' },
  ];

  const credentialTypes = [
    { value: 'kyc', label: 'KYC Verification' },
    { value: 'accredited_investor', label: 'Accredited Investor' },
    { value: 'institutional', label: 'Institutional Verification' },
    { value: 'professional', label: 'Professional Certification' },
    { value: 'education', label: 'Educational Credential' },
    { value: 'employment', label: 'Employment Verification' },
  ];

  const handleCreatePassport = async () => {
    if (!isConnected || !address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to create a passport',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Initialize DID if not already done
      const profile = didIdentityService.getProfile();
      if (!profile) {
        toast({
          title: 'DID Required',
          description: 'Please initialize your decentralized identity first',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // In a real implementation, this would call the smart contract
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Passport Creation Initiated',
        description: 'Your identity passport is being created. This may take a few minutes.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onCreateClose();
      fetchPassport();
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: 'Failed to create identity passport. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLinkAddress = async () => {
    if (!linkForm.chain || !linkForm.address) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);
    try {
      // In a real implementation, this would:
      // 1. Generate a signature proof
      // 2. Call the smart contract to link the address
      // 3. Update the passport NFT
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Address Linked',
        description: `Successfully linked ${linkForm.chain} address`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setLinkForm({ chain: '', address: '', signature: '' });
      onLinkClose();
      fetchPassport();
    } catch (error) {
      toast({
        title: 'Linking Failed',
        description: 'Failed to link cross-chain address',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCredential = async () => {
    if (!credForm.type || !credForm.issuer) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);
    try {
      // In a real implementation, this would:
      // 1. Upload proof document to IPFS
      // 2. Create verifiable credential
      // 3. Add to passport NFT
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Credential Added',
        description: `Successfully added ${credForm.type} credential`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setCredForm({ type: '', issuer: '', description: '', proofDocument: null });
      onCredClose();
      fetchPassport();
    } catch (error) {
      toast({
        title: 'Failed to Add Credential',
        description: 'Failed to add credential to passport',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isConnected) {
    return (
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardBody textAlign="center" py={8}>
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="semibold">
              Connect Your Wallet
            </Text>
            <Text color="gray.500">
              Connect your wallet to manage your identity passport
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VStack spacing={6} align="stretch">
        {/* Passport Display */}
        <PassportDisplay showDetails={true} />

        {/* Action Buttons */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={4}>
              <Text fontSize="lg" fontWeight="semibold">
                Passport Management
              </Text>
              
              {!hasPassport ? (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="semibold">No Identity Passport Found</Text>
                    <Text fontSize="sm">
                      Create your cross-chain identity passport to access premium features
                    </Text>
                  </Box>
                </Alert>
              ) : (
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="semibold">Identity Passport Active</Text>
                    <Text fontSize="sm">
                      Your passport is active across multiple chains
                    </Text>
                  </Box>
                </Alert>
              )}

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                {!hasPassport ? (
                  <Button
                    colorScheme="blue"
                    leftIcon={<Icon as={FiPlus} />}
                    onClick={onCreateOpen}
                    isLoading={isProcessing}
                    loadingText="Creating..."
                  >
                    Create Passport
                  </Button>
                ) : (
                  <>
                    <Button
                      colorScheme="green"
                      leftIcon={<Icon as={FiLink} />}
                      onClick={onLinkOpen}
                      isLoading={isProcessing}
                    >
                      Link Address
                    </Button>
                    <Button
                      colorScheme="purple"
                      leftIcon={<Icon as={FiAward} />}
                      onClick={onCredOpen}
                      isLoading={isProcessing}
                    >
                      Add Credential
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  leftIcon={<Icon as={FiRefreshCw} />}
                  onClick={fetchPassport}
                  isLoading={loading}
                >
                  Refresh
                </Button>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Passport Stats */}
        {hasPassport && passport && (
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {passport.crossChainAddresses.length}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Linked Chains
                </Text>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  {passport.credentials.length}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Credentials
                </Text>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {passport.reputationScore}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Reputation
                </Text>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardBody textAlign="center">
                <Badge colorScheme="green" fontSize="lg" px={2} py={1}>
                  {passport.kycLevel}
                </Badge>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  KYC Level
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}
      </VStack>

      {/* Create Passport Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Identity Passport</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="semibold">Cross-Chain Identity</Text>
                  <Text fontSize="sm">
                    Your passport will be created as an NFT and linked across multiple chains
                  </Text>
                </Box>
              </Alert>
              
              <Text fontSize="sm" color="gray.600">
                Current Chain: <Badge>{chainId === 1 ? 'Ethereum' : 'Other'}</Badge>
              </Text>
              
              <HStack spacing={4} w="full">
                <Button
                  colorScheme="blue"
                  onClick={handleCreatePassport}
                  isLoading={isProcessing}
                  loadingText="Creating..."
                  flex={1}
                >
                  Create Passport
                </Button>
                <Button variant="outline" onClick={onCreateClose}>
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Link Address Modal */}
      <Modal isOpen={isLinkOpen} onClose={onLinkClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Link Cross-Chain Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Chain</FormLabel>
                <Select
                  placeholder="Select chain"
                  value={linkForm.chain}
                  onChange={(e) => setLinkForm({ ...linkForm, chain: e.target.value })}
                >
                  {supportedChains.map((chain) => (
                    <option key={chain.value} value={chain.value}>
                      {chain.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  placeholder="Enter wallet address"
                  value={linkForm.address}
                  onChange={(e) => setLinkForm({ ...linkForm, address: e.target.value })}
                />
              </FormControl>

              <Alert status="warning" borderRadius="md" fontSize="sm">
                <AlertIcon />
                You'll need to sign a message to prove ownership of this address
              </Alert>

              <HStack spacing={4} w="full">
                <Button
                  colorScheme="green"
                  onClick={handleLinkAddress}
                  isLoading={isProcessing}
                  loadingText="Linking..."
                  flex={1}
                >
                  Link Address
                </Button>
                <Button variant="outline" onClick={onLinkClose}>
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Add Credential Modal */}
      <Modal isOpen={isCredOpen} onClose={onCredClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Verifiable Credential</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Credential Type</FormLabel>
                <Select
                  placeholder="Select credential type"
                  value={credForm.type}
                  onChange={(e) => setCredForm({ ...credForm, type: e.target.value })}
                >
                  {credentialTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Issuer</FormLabel>
                <Input
                  placeholder="Enter issuing organization"
                  value={credForm.issuer}
                  onChange={(e) => setCredForm({ ...credForm, issuer: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Additional details about this credential"
                  value={credForm.description}
                  onChange={(e) => setCredForm({ ...credForm, description: e.target.value })}
                />
              </FormControl>

              <Alert status="info" borderRadius="md" fontSize="sm">
                <AlertIcon />
                Credentials will be verified by authorized issuers before being added to your passport
              </Alert>

              <HStack spacing={4} w="full">
                <Button
                  colorScheme="purple"
                  onClick={handleAddCredential}
                  isLoading={isProcessing}
                  loadingText="Adding..."
                  flex={1}
                >
                  Add Credential
                </Button>
                <Button variant="outline" onClick={onCredClose}>
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
};

export default PassportManager;
