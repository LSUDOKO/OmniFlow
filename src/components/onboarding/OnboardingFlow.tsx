"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Progress,
  Text,
  Button,
  Icon,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Fade,
  ScaleFade,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes } from "react-icons/fa";
import { paymentService } from "../../services/paymentService";
import { localizationService } from "../../services/localizationService";
import { kycService } from "../../services/kycService";

// Import step components
import WelcomeStep from "./steps/WelcomeStep";
import RegionSelectionStep from "./steps/RegionSelectionStep";
import WalletSetupStep from "./steps/WalletSetupStep";
import EmailVerificationStep from "./steps/EmailVerificationStep";
import PhoneVerificationStep from "./steps/PhoneVerificationStep";
import IdentityVerificationStep from "./steps/IdentityVerificationStep";
import PaymentSetupStep from "./steps/PaymentSetupStep";
import CompletionStep from "./steps/CompletionStep";

interface OnboardingData {
  region?: string;
  locale?: string;
  walletAddress?: string;
  email?: string;
  phone?: string;
  kycLevel?: number;
  paymentMethod?: string;
  completedSteps: string[];
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

export default function OnboardingFlow({ isOpen, onClose, onComplete }: OnboardingFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    completedSteps: []
  });
  const [steps, setSteps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, purple.900)"
  );

  // Initialize onboarding steps based on detected region
  useEffect(() => {
    const initializeSteps = async () => {
      // Detect user's region
      const detectedRegion = await paymentService.detectUserRegion();
      const browserLocale = localizationService.detectBrowserLocale();
      
      // Set initial locale
      localizationService.setLocale(browserLocale);
      
      // Get region-specific onboarding steps
      const regionSteps = paymentService.getOnboardingSteps(detectedRegion);
      
      setSteps(regionSteps);
      setOnboardingData(prev => ({
        ...prev,
        region: detectedRegion,
        locale: browserLocale
      }));
    };

    if (isOpen) {
      initializeSteps();
    }
  }, [isOpen]);

  const stepComponents = {
    WelcomeStep,
    RegionSelectionStep,
    WalletSetupStep,
    EmailVerificationStep,
    PhoneVerificationStep,
    IdentityVerificationStep,
    PaymentSetupStep,
    CompletionStep,
  };

  const currentStep = steps[currentStepIndex];
  const CurrentStepComponent = currentStep ? stepComponents[currentStep.component as keyof typeof stepComponents] : null;

  const handleStepComplete = (stepData: any) => {
    const updatedData = {
      ...onboardingData,
      ...stepData,
      completedSteps: [...onboardingData.completedSteps, currentStep.id]
    };
    
    setOnboardingData(updatedData);
    setCanProceed(true);

    // Auto-advance for certain steps
    if (currentStep.id === 'welcome' || currentStep.id === 'completion') {
      setTimeout(() => handleNext(), 1500);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setCanProceed(false);
    } else {
      // Onboarding complete
      onComplete(onboardingData);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setCanProceed(true); // Allow going back
    }
  };

  const handleSkip = () => {
    if (!currentStep.required) {
      handleNext();
    }
  };

  const handleRegionChange = async (newRegion: string) => {
    // Update steps based on new region
    const regionSteps = paymentService.getOnboardingSteps(newRegion);
    setSteps(regionSteps);
    
    // Update locale based on region
    const regionConfig = paymentService.getRegionConfig(newRegion);
    if (regionConfig) {
      localizationService.setLocale(regionConfig.language);
    }
    
    setOnboardingData(prev => ({
      ...prev,
      region: newRegion,
      locale: regionConfig?.language || 'en'
    }));
  };

  const progressPercentage = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;
  const t = localizationService.t;

  if (!currentStep || !CurrentStepComponent) {
    return null;
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="4xl" 
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent maxW="900px" maxH="90vh" bg="transparent" shadow="none">
        <ModalBody p={0}>
          <Box
            bg={bgGradient}
            rounded="2xl"
            shadow="2xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
            overflow="hidden"
          >
            {/* Header with Progress */}
            <Box bg="white" p={6} borderBottom="1px solid" borderColor="gray.200">
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      {t(currentStep.title) || currentStep.title}
                    </Text>
                    <Text color="gray.600">
                      {t('onboarding.step', { current: currentStepIndex + 1, total: steps.length })}
                    </Text>
                  </VStack>
                  
                  <VStack align="end" spacing={1}>
                    <Text fontSize="sm" color="gray.500">
                      {t('onboarding.estimatedTime', { time: currentStep.estimatedTime })}
                    </Text>
                    {currentStep.required ? (
                      <Text fontSize="xs" color="red.500" fontWeight="bold">
                        {t('onboarding.required')}
                      </Text>
                    ) : (
                      <Text fontSize="xs" color="gray.500">
                        {t('onboarding.optional')}
                      </Text>
                    )}
                  </VStack>
                </HStack>

                {/* Progress Bar */}
                <Box w="full">
                  <Progress
                    value={progressPercentage}
                    colorScheme="purple"
                    size="lg"
                    rounded="full"
                    bg="gray.100"
                  />
                  <HStack justify="space-between" mt={2}>
                    <Text fontSize="xs" color="gray.500">
                      {Math.round(progressPercentage)}% {t('common.completed')}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {steps.length - currentStepIndex - 1} {t('common.remaining')}
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            {/* Step Content */}
            <Box p={8} minH="400px">
              <ScaleFade in={true} initialScale={0.9}>
                <CurrentStepComponent
                  data={onboardingData}
                  onComplete={handleStepComplete}
                  onRegionChange={handleRegionChange}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </ScaleFade>
            </Box>

            {/* Footer with Navigation */}
            <Box bg="white" p={6} borderTop="1px solid" borderColor="gray.200">
              <HStack justify="space-between">
                <Button
                  leftIcon={<Icon as={FaArrowLeft} />}
                  variant="outline"
                  onClick={handleBack}
                  isDisabled={currentStepIndex === 0}
                >
                  {t('common.back')}
                </Button>

                <HStack spacing={3}>
                  {!currentStep.required && (
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      color="gray.600"
                    >
                      {t('onboarding.skipForNow')}
                    </Button>
                  )}
                  
                  <Button
                    rightIcon={<Icon as={currentStepIndex === steps.length - 1 ? FaCheck : FaArrowRight} />}
                    colorScheme="purple"
                    onClick={handleNext}
                    isDisabled={currentStep.required && !canProceed}
                    isLoading={isLoading}
                    loadingText={t('common.processing')}
                  >
                    {currentStepIndex === steps.length - 1 
                      ? t('common.complete') 
                      : t('common.continue')
                    }
                  </Button>
                </HStack>
              </HStack>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
