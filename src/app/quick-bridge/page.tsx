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
import QuickBridge from '../../components/bridge/QuickBridge';

const MotionBox = motion(Box);

export default function QuickBridgePage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="4xl" py={8}>
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
              bgGradient="linear(to-r, blue.400, purple.500, pink.400)" 
              bgClip="text"
            >
              Quick Bridge
            </Heading>
            <Text color="gray.500" fontSize="lg" maxW="2xl">
              Seamlessly transfer your RWA tokens and NFTs across chains with our secure, 
              fast cross-chain bridge powered by Wormhole and Circle CCTP.
            </Text>
          </VStack>
        </MotionBox>

        <QuickBridge />
      </Container>
    </Box>
  );
}
