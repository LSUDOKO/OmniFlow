"use client";

import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ComplianceDashboard from '../../components/compliance/ComplianceDashboard';

const MotionBox = motion(Box);

export default function CompliancePage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="8xl" py={8}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
          mb={8}
        >
          <VStack spacing={4}>
            <Heading 
              size="2xl" 
              bgGradient="linear(to-r, blue.400, purple.500, red.400)" 
              bgClip="text"
            >
              Compliance Center
            </Heading>
            <Text color="gray.500" fontSize="lg" maxW="3xl">
              Comprehensive regulatory compliance management for RWA tokenization. 
              Monitor KYC, AML, geographic restrictions, and maintain regulatory standards 
              across all jurisdictions.
            </Text>
          </VStack>
        </MotionBox>

        <ComplianceDashboard />
      </Container>
    </Box>
  );
}
