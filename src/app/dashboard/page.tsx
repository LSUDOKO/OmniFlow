"use client";

import { useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Icon,
  Badge,
} from "@chakra-ui/react";
import {
  FaChartLine,
  FaWallet,
  FaCoins,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";
import PortfolioOverview from "../../components/dashboard/PortfolioOverview";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const tabs = [
    {
      label: "Overview",
      icon: FaChartLine,
      component: <PortfolioOverview />,
      badge: null,
    },
    {
      label: "Assets",
      icon: FaWallet,
      component: (
        <Box p={8} textAlign="center">
          <Text fontSize="lg" color="gray.500">
            Asset management coming soon...
          </Text>
        </Box>
      ),
      badge: "Soon",
    },
    {
      label: "Dividends",
      icon: FaCoins,
      component: (
        <Box p={8} textAlign="center">
          <Text fontSize="lg" color="gray.500">
            Dividend tracking coming soon...
          </Text>
        </Box>
      ),
      badge: "Soon",
    },
    {
      label: "Reports",
      icon: FaFileAlt,
      component: (
        <Box p={8} textAlign="center">
          <Text fontSize="lg" color="gray.500">
            Advanced reports coming soon...
          </Text>
        </Box>
      ),
      badge: "Soon",
    },
    {
      label: "Settings",
      icon: FaCog,
      component: (
        <Box p={8} textAlign="center">
          <Text fontSize="lg" color="gray.500">
            Dashboard settings coming soon...
          </Text>
        </Box>
      ),
      badge: "Soon",
    },
  ];

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <Box>
            <VStack align="start" spacing={2}>
              <Text fontSize="3xl" fontWeight="bold">
                Investor Dashboard
              </Text>
              <Text fontSize="lg" color="gray.600">
                Track your portfolio performance, dividends, and investment insights
              </Text>
            </VStack>
          </Box>

          {/* Dashboard Tabs */}
          <Box
            bg={cardBg}
            rounded="xl"
            shadow="sm"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          >
            <Tabs
              index={activeTab}
              onChange={setActiveTab}
              variant="enclosed"
              colorScheme="purple"
            >
              <TabList borderBottom="1px solid" borderColor={useColorModeValue("gray.200", "gray.600")}>
                {tabs.map((tab, index) => (
                  <Tab key={index} py={4} px={6}>
                    <HStack spacing={2}>
                      <Icon as={tab.icon} />
                      <Text>{tab.label}</Text>
                      {tab.badge && (
                        <Badge size="sm" colorScheme="purple" variant="subtle">
                          {tab.badge}
                        </Badge>
                      )}
                    </HStack>
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {tabs.map((tab, index) => (
                  <TabPanel key={index} p={6}>
                    {tab.component}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
