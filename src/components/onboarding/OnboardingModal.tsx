"use client";

import React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import OnboardingFlow from './OnboardingFlow';
import { useWeb3Onboarding } from '../../contexts/Web3OnboardingContext';

interface OnboardingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  autoStart?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  autoStart = false
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ 
    defaultIsOpen: autoStart || externalIsOpen 
  });
  
  const {
    completeOnboarding,
    updateOnboardingData,
    onboardingData
  } = useWeb3Onboarding();

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      onClose();
    }
  };

  const handleComplete = (data: any) => {
    completeOnboarding(data);
    handleClose();
  };

  return (
    <OnboardingFlow
      isOpen={externalIsOpen !== undefined ? externalIsOpen : isOpen}
      onClose={handleClose}
      onComplete={handleComplete}
    />
  );
};

export default OnboardingModal;
