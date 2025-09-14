"use client";

import React from 'react';
import {
  Button,
  Icon,
  useDisclosure,
  HStack,
  Text,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaWallet,
  FaUserPlus,
  FaCheck,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useWeb3Onboarding } from '../contexts/Web3OnboardingContext';
import OnboardingModal from './onboarding/OnboardingModal';

interface Web3OnboardingButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  showStatus?: boolean;
}

export const Web3OnboardingButton: React.FC<Web3OnboardingButtonProps> = ({
  variant = 'solid',
  size = 'md',
  colorScheme = 'purple',
  showStatus = true
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const {
    isWalletConnected,
    walletAddress,
    user,
    onboardingData,
    hasValidIdentity,
    startOnboarding
  } = useWeb3Onboarding();

  const handleClick = () => {
    if (!isWalletConnected) {
      startOnboarding();
      onOpen();
    }
  };

  const getButtonContent = () => {
    if (isWalletConnected && hasValidIdentity()) {
      return {
        icon: FaCheck,
        text: 'Wallet Connected',
        color: 'green',
        tooltip: `Connected: ${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`
      };
    }
    
    if (isWalletConnected && !hasValidIdentity()) {
      return {
        icon: FaExclamationTriangle,
        text: 'Complete Setup',
        color: 'orange',
        tooltip: 'Identity NFT required to access all features'
      };
    }

    return {
      icon: FaUserPlus,
      text: 'Get Started',
      color: colorScheme,
      tooltip: 'Create your Web3 wallet and identity'
    };
  };

  const buttonContent = getButtonContent();

  const ButtonComponent = (
    <Button
      variant={variant}
      size={size}
      colorScheme={buttonContent.color}
      onClick={handleClick}
      leftIcon={<Icon as={buttonContent.icon} />}
      isDisabled={isWalletConnected && hasValidIdentity()}
    >
      <HStack spacing={2}>
        <Text>{buttonContent.text}</Text>
        {showStatus && isWalletConnected && (
          <Badge
            colorScheme={hasValidIdentity() ? 'green' : 'orange'}
            variant="solid"
            fontSize="xs"
          >
            {hasValidIdentity() ? 'Complete' : 'Pending'}
          </Badge>
        )}
      </HStack>
    </Button>
  );

  return (
    <>
      {buttonContent.tooltip ? (
        <Tooltip label={buttonContent.tooltip} placement="bottom">
          {ButtonComponent}
        </Tooltip>
      ) : (
        ButtonComponent
      )}
      
      <OnboardingModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default Web3OnboardingButton;
