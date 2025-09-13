"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useColorModeValue,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Icon,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FiShield, 
  FiTrendingUp, 
  FiLeaf, 
  FiUser, 
  FiGlobe, 
  FiRefreshCw,
  FiDownload,
  FiEye,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
  FiBarChart3,
  FiFileText
} from 'react-icons/fi';
import { useAIDueDiligence } from '../../hooks/useAIDueDiligence';
import { AIDueDiligenceReport, RWAAssetMetadata } from '../../services/aiDueDiligenceService';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface DueDiligenceReportProps {
  assetId: string;
  metadata: RWAAssetMetadata;
  onReportGenerated?: (report: AIDueDiligenceReport) => void;
}

export default function DueDiligenceReport({ assetId, metadata, onReportGenerated }: DueDiligenceReportProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showFullReport, setShowFullReport] = useState(false);
  
  const {
    isGenerating,
    report,
    error,
    generateReport,
    clearReport,
    getCachedReport
  } = useAIDueDiligence({ autoCache: true });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Check for cached report on mount
  useEffect(() => {
    const cached = getCachedReport(assetId);
    if (cached && onReportGenerated) {
      onReportGenerated(cached);
    }
  }, [assetId, getCachedReport, onReportGenerated]);

  const handleGenerateReport = async () => {
    const newReport = await generateReport(assetId, metadata, {
      detailLevel: 'comprehensive',
      includeMarketAnalysis: true,
      includeESGAnalysis: true
    });
    
    if (newReport && onReportGenerated) {
      onReportGenerated(newReport);
    }
  };

  const handleRegenerateReport = async () => {
    clearReport();
    const newReport = await generateReport(assetId, metadata, {
      forceRefresh: true,
      detailLevel: 'comprehensive'
    });
    
    if (newReport && onReportGenerated) {
      onReportGenerated(newReport);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'VERY_LOW': return 'green';
      case 'LOW': return 'green';
      case 'MEDIUM': return 'yellow';
      case 'HIGH': return 'orange';
      case 'VERY_HIGH': return 'red';
      default: return 'gray';
    }
  };

  const getESGColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!report && !isGenerating) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <HStack>
                <Icon as={FiFileText} color="blue.500" boxSize={6} />
                <Heading size="md">AI Due Diligence Report</Heading>
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="center" py={8}>
              <Icon as={FiBarChart3} boxSize={12} color="gray.400" />
              <Text color={textColor} textAlign="center" maxW="md">
                Generate a comprehensive AI-powered due diligence report for this RWA asset. 
                Our AI analyzes risk factors, ESG scores, yield projections, and regulatory compliance.
              </Text>
              <Button
                colorScheme="blue"
                leftIcon={<FiBarChart3 />}
                onClick={handleGenerateReport}
                size="lg"
                loadingText="Generating Report..."
              >
                Generate AI Due Diligence
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </MotionBox>
    );
  }

  if (isGenerating) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="center" py={12}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <VStack spacing={2}>
                <Heading size="md">Generating AI Due Diligence Report</Heading>
                <Text color={textColor} textAlign="center">
                  Our AI is analyzing the asset metadata, market conditions, and regulatory requirements...
                </Text>
              </VStack>
              <Progress size="lg" isIndeterminate colorScheme="blue" w="full" maxW="md" />
            </VStack>
          </CardBody>
        </Card>
      </MotionBox>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Report Generation Failed!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Box>
        <Button ml="auto" onClick={handleGenerateReport} size="sm">
          Retry
        </Button>
      </Alert>
    );
  }

  if (!report) return null;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <HStack>
              <Icon as={FiFileText} color="blue.500" boxSize={6} />
              <VStack align="start" spacing={0}>
                <Heading size="md">AI Due Diligence Report</Heading>
                <Text fontSize="sm" color={textColor}>
                  Generated {report.generatedAt.toLocaleDateString()} • 
                  Confidence: {Math.round(report.overallConfidence * 100)}% • 
                  Provider: {report.aiProvider.toUpperCase()}
                </Text>
              </VStack>
            </HStack>
            <HStack>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<FiRefreshCw />}
                onClick={handleRegenerateReport}
                isLoading={isGenerating}
              >
                Regenerate
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<FiEye />}
                onClick={onOpen}
              >
                Full Report
              </Button>
            </HStack>
          </Flex>
        </CardHeader>

        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Executive Summary */}
            <Box>
              <Heading size="sm" mb={3}>Executive Summary</Heading>
              <Text color={textColor} lineHeight="tall">
                {report.executiveSummary}
              </Text>
            </Box>

            {/* Key Metrics Grid */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
              {/* Risk Assessment */}
              <GridItem>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  bg={useColorModeValue('red.50', 'red.900')}
                  borderColor={`${getRiskColor(report.riskAssessment.level)}.200`}
                  borderWidth="1px"
                >
                  <CardBody>
                    <VStack spacing={3}>
                      <Icon as={FiShield} boxSize={8} color={`${getRiskColor(report.riskAssessment.level)}.500`} />
                      <Stat textAlign="center">
                        <StatLabel>Risk Level</StatLabel>
                        <StatNumber fontSize="lg">
                          <Badge colorScheme={getRiskColor(report.riskAssessment.level)} size="lg">
                            {report.riskAssessment.level}
                          </Badge>
                        </StatNumber>
                        <StatHelpText>Score: {report.riskAssessment.score}/1000</StatHelpText>
                      </Stat>
                    </VStack>
                  </CardBody>
                </MotionCard>
              </GridItem>

              {/* Yield Projection */}
              <GridItem>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  bg={useColorModeValue('green.50', 'green.900')}
                  borderColor="green.200"
                  borderWidth="1px"
                >
                  <CardBody>
                    <VStack spacing={3}>
                      <Icon as={FiTrendingUp} boxSize={8} color="green.500" />
                      <Stat textAlign="center">
                        <StatLabel>Projected Yield</StatLabel>
                        <StatNumber fontSize="2xl" color="green.500">
                          {report.yieldProjection.suggestedAPY.toFixed(1)}%
                        </StatNumber>
                        <StatHelpText>
                          Confidence: {Math.round(report.yieldProjection.confidence * 100)}%
                        </StatHelpText>
                      </Stat>
                    </VStack>
                  </CardBody>
                </MotionCard>
              </GridItem>

              {/* ESG Score */}
              <GridItem>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  borderColor="blue.200"
                  borderWidth="1px"
                >
                  <CardBody>
                    <VStack spacing={3}>
                      <Icon as={FiLeaf} boxSize={8} color={`${getESGColor(report.esgScore.overall)}.500`} />
                      <Stat textAlign="center">
                        <StatLabel>ESG Score</StatLabel>
                        <CircularProgress 
                          value={report.esgScore.overall} 
                          color={`${getESGColor(report.esgScore.overall)}.500`}
                          size="60px"
                        >
                          <CircularProgressLabel fontSize="sm" fontWeight="bold">
                            {report.esgScore.overall}
                          </CircularProgressLabel>
                        </CircularProgress>
                        <StatHelpText>Environmental, Social, Governance</StatHelpText>
                      </Stat>
                    </VStack>
                  </CardBody>
                </MotionCard>
              </GridItem>

              {/* Compliance Score */}
              <GridItem>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  bg={useColorModeValue('purple.50', 'purple.900')}
                  borderColor="purple.200"
                  borderWidth="1px"
                >
                  <CardBody>
                    <VStack spacing={3}>
                      <Icon as={FiUser} boxSize={8} color="purple.500" />
                      <Stat textAlign="center">
                        <StatLabel>Compliance</StatLabel>
                        <StatNumber fontSize="2xl" color="purple.500">
                          {report.complianceScore}%
                        </StatNumber>
                        <StatHelpText>KYC: {report.kycRisk.level}</StatHelpText>
                      </Stat>
                    </VStack>
                  </CardBody>
                </MotionCard>
              </GridItem>
            </Grid>

            {/* Key Findings */}
            <Box>
              <Heading size="sm" mb={3}>Key Findings</Heading>
              <List spacing={2}>
                {report.keyFindings.map((finding, index) => (
                  <ListItem key={index}>
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    <Text as="span" color={textColor}>{finding}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Recommendations */}
            <Box>
              <Heading size="sm" mb={3}>Recommendations</Heading>
              <List spacing={2}>
                {report.recommendations.map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListIcon as={FiAlertTriangle} color="orange.500" />
                    <Text as="span" color={textColor}>{recommendation}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Regulatory Flags */}
            {report.regulatoryFlags.length > 0 && (
              <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>Regulatory Considerations</AlertTitle>
                  <AlertDescription>
                    <Wrap mt={2}>
                      {report.regulatoryFlags.map((flag, index) => (
                        <WrapItem key={index}>
                          <Tag colorScheme="orange" size="sm">
                            <TagLeftIcon as={FiAlertTriangle} />
                            <TagLabel>{flag}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </AlertDescription>
                </Box>
              </Alert>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Full Report Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FiFileText} color="blue.500" />
              <Text>Complete AI Due Diligence Report</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Detailed Risk Analysis */}
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <Icon as={FiShield} color="red.500" />
                        <Text fontWeight="semibold">Risk Assessment Details</Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack spacing={4} align="stretch">
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Risk Factors</Text>
                          <List spacing={1}>
                            {report.riskAssessment.factors.map((factor, index) => (
                              <ListItem key={index}>
                                <ListIcon as={FiXCircle} color="red.500" />
                                <Text as="span" fontSize="sm">{factor}</Text>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Risk Mitigations</Text>
                          <List spacing={1}>
                            {report.riskAssessment.mitigations.map((mitigation, index) => (
                              <ListItem key={index}>
                                <ListIcon as={FiCheckCircle} color="green.500" />
                                <Text as="span" fontSize="sm">{mitigation}</Text>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Grid>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* ESG Details */}
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <Icon as={FiLeaf} color="green.500" />
                        <Text fontWeight="semibold">ESG Analysis</Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={4}>
                      <Stat textAlign="center">
                        <StatLabel>Environmental</StatLabel>
                        <StatNumber color={`${getESGColor(report.esgScore.environmental)}.500`}>
                          {report.esgScore.environmental}
                        </StatNumber>
                      </Stat>
                      <Stat textAlign="center">
                        <StatLabel>Social</StatLabel>
                        <StatNumber color={`${getESGColor(report.esgScore.social)}.500`}>
                          {report.esgScore.social}
                        </StatNumber>
                      </Stat>
                      <Stat textAlign="center">
                        <StatLabel>Governance</StatLabel>
                        <StatNumber color={`${getESGColor(report.esgScore.governance)}.500`}>
                          {report.esgScore.governance}
                        </StatNumber>
                      </Stat>
                    </Grid>
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Text fontWeight="semibold" mb={2}>ESG Factors</Text>
                        <Wrap>
                          {report.esgScore.factors.map((factor, index) => (
                            <WrapItem key={index}>
                              <Tag size="sm" colorScheme="blue">
                                {factor}
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" mb={2}>Improvement Opportunities</Text>
                        <List spacing={1}>
                          {report.esgScore.improvements.map((improvement, index) => (
                            <ListItem key={index}>
                              <ListIcon as={FiTrendingUp} color="blue.500" />
                              <Text as="span" fontSize="sm">{improvement}</Text>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* Yield Analysis */}
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <Icon as={FiTrendingUp} color="green.500" />
                        <Text fontWeight="semibold">Yield Projection Analysis</Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <Box>
                        <Text fontWeight="semibold" mb={2}>Yield Factors</Text>
                        <List spacing={1}>
                          {report.yieldProjection.factors.map((factor, index) => (
                            <ListItem key={index}>
                              <ListIcon as={FiDollarSign} color="green.500" />
                              <Text as="span" fontSize="sm">{factor}</Text>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" mb={2}>Market Comparables</Text>
                        <List spacing={1}>
                          {report.yieldProjection.comparables.map((comparable, index) => (
                            <ListItem key={index}>
                              <ListIcon as={FiBarChart3} color="blue.500" />
                              <Text as="span" fontSize="sm">{comparable}</Text>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Grid>
                    {report.yieldProjection.riskAdjustment !== 0 && (
                      <Box mt={4} p={3} bg={useColorModeValue('yellow.50', 'yellow.900')} borderRadius="md">
                        <Text fontSize="sm">
                          <strong>Risk Adjustment:</strong> {report.yieldProjection.riskAdjustment > 0 ? '+' : ''}
                          {report.yieldProjection.riskAdjustment}% applied to base yield projection
                        </Text>
                      </Box>
                    )}
                  </AccordionPanel>
                </AccordionItem>

                {/* Jurisdiction & Compliance */}
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <Icon as={FiGlobe} color="purple.500" />
                        <Text fontWeight="semibold">Jurisdiction & Compliance</Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack spacing={4} align="stretch">
                      <HStack>
                        <Text fontWeight="semibold">Country:</Text>
                        <Badge colorScheme="purple">{report.jurisdiction.country}</Badge>
                        <Text fontWeight="semibold">Risk Level:</Text>
                        <Badge colorScheme={report.jurisdiction.riskLevel === 'LOW' ? 'green' : 
                                         report.jurisdiction.riskLevel === 'MEDIUM' ? 'yellow' : 'red'}>
                          {report.jurisdiction.riskLevel}
                        </Badge>
                      </HStack>
                      
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Regulations</Text>
                          <List spacing={1}>
                            {report.jurisdiction.regulations.map((regulation, index) => (
                              <ListItem key={index}>
                                <ListIcon as={FiFileText} color="purple.500" />
                                <Text as="span" fontSize="sm">{regulation}</Text>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Compliance Requirements</Text>
                          <List spacing={1}>
                            {report.jurisdiction.compliance.map((requirement, index) => (
                              <ListItem key={index}>
                                <ListIcon as={FiCheckCircle} color="green.500" />
                                <Text as="span" fontSize="sm">{requirement}</Text>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Grid>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              {/* Valuation Range */}
              <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                <Text fontWeight="semibold" mb={2}>Valuation Assessment</Text>
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color={textColor}>Estimated Range</Text>
                    <Text fontWeight="bold">
                      {formatCurrency(report.valuationRange.min, report.valuationRange.currency)} - {' '}
                      {formatCurrency(report.valuationRange.max, report.valuationRange.currency)}
                    </Text>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Text fontSize="sm" color={textColor}>Liquidity</Text>
                    <Text fontWeight="semibold">{report.liquidityAssessment}</Text>
                  </VStack>
                </HStack>
              </Box>

              {/* Report Metadata */}
              <Box p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
                <Grid templateColumns="repeat(3, 1fr)" gap={4} fontSize="sm">
                  <VStack align="start" spacing={1}>
                    <Text color={textColor}>Generated</Text>
                    <Text fontWeight="semibold">{report.generatedAt.toLocaleString()}</Text>
                  </VStack>
                  <VStack align="start" spacing={1}>
                    <Text color={textColor}>Data Quality</Text>
                    <Badge colorScheme={report.dataQuality === 'EXCELLENT' ? 'green' : 
                                       report.dataQuality === 'GOOD' ? 'blue' : 
                                       report.dataQuality === 'FAIR' ? 'yellow' : 'red'}>
                      {report.dataQuality}
                    </Badge>
                  </VStack>
                  <VStack align="start" spacing={1}>
                    <Text color={textColor}>AI Provider</Text>
                    <Text fontWeight="semibold">{report.aiProvider.toUpperCase()}</Text>
                  </VStack>
                </Grid>
                
                {report.limitations.length > 0 && (
                  <Box mt={3}>
                    <Text fontSize="sm" fontWeight="semibold" mb={1}>Limitations:</Text>
                    <Text fontSize="xs" color={textColor}>
                      {report.limitations.join(', ')}
                    </Text>
                  </Box>
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" leftIcon={<FiDownload />}>
              Export Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
}
