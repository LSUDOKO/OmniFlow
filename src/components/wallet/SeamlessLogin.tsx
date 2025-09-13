"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FaGoogle, FaFacebook, FaTwitter, FaDiscord, FaApple, FaEnvelope, FaMobile } from 'react-icons/fa';
import { useWallet } from '@/contexts/WalletContext';

interface LoginOption {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const loginOptions: LoginOption[] = [
  {
    id: 'google',
    name: 'Google',
    icon: FaGoogle,
    color: '#4285f4',
    description: 'Continue with Google account'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: FaFacebook,
    color: '#1877f2',
    description: 'Continue with Facebook'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: FaTwitter,
    color: '#1da1f2',
    description: 'Continue with Twitter'
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: FaDiscord,
    color: '#5865f2',
    description: 'Continue with Discord'
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: FaApple,
    color: '#000000',
    description: 'Continue with Apple ID'
  },
  {
    id: 'email_passwordless',
    name: 'Email',
    icon: FaEnvelope,
    color: '#f59e0b',
    description: 'Passwordless email login'
  },
  {
    id: 'sms_passwordless',
    name: 'SMS',
    icon: FaMobile,
    color: '#10b981',
    description: 'SMS verification login'
  },
];

interface SeamlessLoginProps {
  isOpen: boolean;
  onClose: () => void;
  autoConnect?: boolean;
}

export const SeamlessLogin: React.FC<SeamlessLoginProps> = ({ 
  isOpen, 
  onClose, 
  autoConnect = true 
}) => {
  const { login, isLoading, isConnected, userInfo, autoConnect: performAutoConnect } = useWallet();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const toast = useToast();

  // Auto-connect on component mount if enabled
  useEffect(() => {
    if (autoConnect && !isConnected) {
      performAutoConnect();
    }
  }, [autoConnect, isConnected, performAutoConnect]);

  const handleLogin = async (provider: string) => {
    setSelectedProvider(provider);
    try {
      await login(provider);
      toast({
        title: "Login Successful! 🎉",
        description: "Your seedless wallet has been created and connected.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Please try again or use a different login method.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSelectedProvider(null);
    }
  };

  const handleQuickLogin = async () => {
    // Default to Google for quick login
    await handleLogin('google');
  };

  if (isConnected && userInfo) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent 
          bg="rgba(15, 23, 42, 0.95)" 
          backdropFilter="blur(20px)"
          border="1px solid rgba(245, 158, 11, 0.2)"
          borderRadius="xl"
        >
          <ModalHeader color="gold.400">Wallet Connected ✅</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <VStack spacing={4} align="center">
              <Avatar 
                src={userInfo.profileImage} 
                name={userInfo.name || userInfo.email}
                size="lg"
                border="2px solid"
                borderColor="gold.400"
              />
              <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="bold" color="white">
                  {userInfo.name || 'Anonymous User'}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  {userInfo.email}
                </Text>
                <Badge colorScheme="green" variant="subtle">
                  Seedless Wallet Active
                </Badge>
              </VStack>
              <Text fontSize="sm" color="gray.300" textAlign="center">
                Your embedded wallet is ready! No seed phrase needed - your wallet is secured by your social login.
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent 
        bg="rgba(15, 23, 42, 0.95)" 
        backdropFilter="blur(20px)"
        border="1px solid rgba(245, 158, 11, 0.2)"
        borderRadius="xl"
        maxW="500px"
      >
        <ModalHeader color="gold.400" textAlign="center">
          <VStack spacing={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Welcome to OmniFlow 🚀
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              Create your seedless wallet in seconds
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={6}>
          <VStack spacing={6}>
            {/* Quick Login Button */}
            <Button
              onClick={handleQuickLogin}
              size="lg"
              width="100%"
              variant="royal"
              isLoading={isLoading && selectedProvider === 'google'}
              loadingText="Connecting..."
              leftIcon={<Icon as={FaGoogle} />}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(245, 158, 11, 0.4)",
              }}
            >
              Quick Start with Google
            </Button>

            <Flex align="center" width="100%">
              <Box flex="1" height="1px" bg="gray.600" />
              <Text px={4} color="gray.400" fontSize="sm">
                or choose your preferred method
              </Text>
              <Box flex="1" height="1px" bg="gray.600" />
            </Flex>

            {/* Login Options Grid */}
            <SimpleGrid columns={2} spacing={3} width="100%">
              {loginOptions.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleLogin(option.id)}
                  variant="glass"
                  size="md"
                  height="60px"
                  isLoading={isLoading && selectedProvider === option.id}
                  loadingText="Connecting..."
                  leftIcon={
                    <Icon 
                      as={option.icon} 
                      color={option.color}
                      boxSize={5}
                    />
                  }
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.1)",
                    borderColor: option.color,
                    transform: "translateY(-1px)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                >
                  <VStack spacing={0} align="start">
                    <Text fontSize="sm" fontWeight="semibold">
                      {option.name}
                    </Text>
                  </VStack>
                </Button>
              ))}
            </SimpleGrid>

            {/* Security Notice */}
            <Box
              p={4}
              bg="rgba(16, 185, 129, 0.1)"
              border="1px solid rgba(16, 185, 129, 0.3)"
              borderRadius="lg"
              width="100%"
            >
              <VStack spacing={2} align="start">
                <Text fontSize="sm" fontWeight="semibold" color="green.400">
                  🔒 Seedless & Secure
                </Text>
                <Text fontSize="xs" color="gray.300">
                  • No seed phrase to remember or lose
                </Text>
                <Text fontSize="xs" color="gray.300">
                  • Your wallet is secured by your social login
                </Text>
                <Text fontSize="xs" color="gray.300">
                  • Instant access across all devices
                </Text>
                <Text fontSize="xs" color="gray.300">
                  • Enterprise-grade security with Web3Auth
                </Text>
              </VStack>
            </Box>

            {/* Loading State */}
            {isLoading && (
              <HStack spacing={3} color="gold.400">
                <Spinner size="sm" />
                <Text fontSize="sm">
                  Creating your embedded wallet...
                </Text>
              </HStack>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Compact Login Button Component
interface CompactLoginButtonProps {
  onOpen: () => void;
}

export const CompactLoginButton: React.FC<CompactLoginButtonProps> = ({ onOpen }) => {
  const { isConnected, userInfo, logout, address } = useWallet();

  if (isConnected && userInfo) {
    return (
      <HStack spacing={3}>
        <Avatar 
          src={userInfo.profileImage} 
          name={userInfo.name || userInfo.email}
          size="sm"
          border="1px solid"
          borderColor="gold.400"
        />
        <VStack spacing={0} align="start">
          <Text fontSize="sm" fontWeight="semibold" color="white">
            {userInfo.name || 'User'}
          </Text>
          <Text fontSize="xs" color="gray.400">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Text>
        </VStack>
        <Button
          size="sm"
          variant="ghost"
          onClick={logout}
          color="gray.400"
          _hover={{ color: "white" }}
        >
          Logout
        </Button>
      </HStack>
    );
  }

  return (
    <Button
      onClick={onOpen}
      variant="royal"
      size="md"
      leftIcon={<Icon as={FaGoogle} />}
    >
      Connect Wallet
    </Button>
  );
};
