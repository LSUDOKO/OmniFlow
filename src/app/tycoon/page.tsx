"use client";

import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import RWATycoonDashboard from '../../components/game/RWATycoonDashboard';

const MotionBox = motion(Box);

export default function TycoonPage() {
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
              bgGradient="linear(to-r, blue.400, purple.500, pink.400)" 
              bgClip="text"
            >
              RWA Tycoon
            </Heading>
            <Text color="gray.500" fontSize="lg" maxW="3xl">
              Build your virtual real-world asset empire! Transform your RWA investments 
              into an engaging simulation game with rewards, achievements, and competition.
            </Text>
          </VStack>
        </MotionBox>

        <RWATycoonDashboard />
      </Container>
    </Box>
  );
}
