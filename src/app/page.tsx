"use client"

import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  CardFooter,
  Icon,
  useColorModeValue,
  Grid,
  GridItem,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { FaCar, FaUsers, FaRoute, FaUserPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // ✅ Correct import for App Router

const TravelingHelpHomepage = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );
    const router = useRouter(); // ✅ Initialize router hook

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('blue.500', 'blue.400');

  const handleRiderClick = () => {
  router.push('/rides'); // Navigate to rides listing
};

const handleDriverClick = () => {
  router.push('/driver/signup'); // Navigate to driver registration
};

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Navbar */}
      <Box bg="#08080859" boxShadow="sm" position="sticky" top={0} zIndex={10}>
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <Heading
              size="lg"
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
              fontWeight="bold"
            >
              TravelingHelp
            </Heading>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxW="7xl" py={20}>
        <VStack spacing={6} textAlign="center" mb={16}>
          <Heading
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight="bold"
            bgGradient="linear(to-r, blue.600, purple.600)"
            bgClip="text"
            lineHeight="shorter"
          >
            Share Your Journey,
            <br />
            Save Your Money
          </Heading>
          
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color={textColor}
            maxW="2xl"
            lineHeight="tall"
          >
            Connect with fellow travelers and make your trips more affordable and enjoyable. 
            Whether you&apos;re looking for a ride or offering one, we&apos;ve got you covered.
          </Text>

          <HStack spacing={8} flexWrap="wrap" justify="center">
            <HStack>
              <Icon as={FaUsers} color={accentColor} />
              <Text fontWeight="medium">Safe Community</Text>
            </HStack>
            <HStack>
              <Icon as={FaRoute} color={accentColor} />
              <Text fontWeight="medium">Multiple Routes</Text>
            </HStack>
            <HStack>
              <Icon as={FaCar} color={accentColor} />
              <Text fontWeight="medium">Verified Drivers</Text>
            </HStack>
          </HStack>
        </VStack>

        {/* Cards Section */}
        <Grid
          templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
          gap={8}
          maxW="6xl"
          mx="auto"
        >
          {/* Rider Card */}
          <GridItem>
            <Card
              bg={cardBg}
              boxShadow="xl"
              borderRadius="2xl"
              overflow="hidden"
              position="relative"
              h="full"
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-8px)',
                boxShadow: '2xl'
              }}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h={2}
                bgGradient="linear(to-r, green.400, blue.500)"
              />
              
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack>
                    <Box
                      p={3}
                      borderRadius="full"
                      bg="green.50"
                      color="green.500"
                    >
                      <Icon as={FaUsers} boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Heading size="lg" color="green.600">
                        Looking for a Ride?
                      </Heading>
                      <Badge colorScheme="green" variant="subtle">
                        No Registration Required
                      </Badge>
                    </VStack>
                  </HStack>

                  <Text color={textColor} fontSize="md" lineHeight="tall">
                    Browse through available rides posted by verified drivers in your area. 
                    Find the perfect match for your destination and travel comfortably at 
                    affordable prices.
                  </Text>

                  <VStack spacing={3} align="start" w="full">
                    <HStack>
                      <Icon as={FaRoute} color="green.400" boxSize={4} />
                      <Text fontSize="sm" color={textColor}>
                        View all available routes and timings
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaCar} color="green.400" boxSize={4} />
                      <Text fontSize="sm" color={textColor}>
                        See driver details and car information
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaUsers} color="green.400" boxSize={4} />
                      <Text fontSize="sm" color={textColor}>
                        Book instantly with available seats
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>

              <Divider />

              <CardFooter p={8}>
                <Button
                  size="lg"
                  colorScheme="green"
                  width="full"
                  bgGradient="linear(to-r, green.400, green.600)"
                  _hover={{
                    bgGradient: "linear(to-r, green.500, green.700)",
                    transform: "translateY(-2px)"
                  }}
                  boxShadow="lg"
                  transition="all 0.3s ease"
                onClick={handleRiderClick}
                >
                  Continue as Rider
                </Button>
              </CardFooter>
            </Card>
          </GridItem>

          {/* Driver Card */}
          <GridItem>
            <Card
              bg={cardBg}
              boxShadow="xl"
              borderRadius="2xl"
              overflow="hidden"
              position="relative"
              h="full"
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-8px)',
                boxShadow: '2xl'
              }}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h={2}
                bgGradient="linear(to-r, purple.400, blue.500)"
              />
              
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack>
                    <Box
                      p={3}
                      borderRadius="full"
                      bg="purple.50"
                      color="purple.500"
                    >
                      <Icon as={FaCar} boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Heading size="lg" color="purple.600">
                        Want to Drive?
                      </Heading>
                      <Badge colorScheme="purple" variant="subtle">
                        Account Required
                      </Badge>
                    </VStack>
                  </HStack>

                  <Text color={textColor} fontSize="md" lineHeight="tall">
                    Share your travel plans and earn money by offering rides to passengers. 
                    Create your driver account, post your routes, and connect with travelers 
                    going your way.
                  </Text>

                  <VStack spacing={3} align="start" w="full">
                    <HStack>
                      <Icon as={FaUserPlus} color="purple.400" boxSize={4} />
                      <Text fontSize="sm" color={textColor}>
                        Create your verified driver profile
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaRoute} color="purple.400" boxSize={4} />
                      <Text fontSize="sm" color={textColor}>
                        Post your travel routes and schedules
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaUsers} color="purple.400" boxSize={4} />
                      <Text fontSize="sm" color={textColor}>
                        Connect with passengers and earn money
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>

              <Divider />

              <CardFooter p={8}>
                <Button
                  size="lg"
                  colorScheme="purple"
                  width="full"
                  bgGradient="linear(to-r, purple.400, purple.600)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.500, purple.700)",
                    transform: "translateY(-2px)"
                  }}
                  boxShadow="lg"
                  transition="all 0.3s ease"
                  onClick={handleDriverClick}
                >
                  Continue as Driver
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </Grid>

        {/* Bottom Stats Section */}
        <HStack
          spacing={12}
          justify="center"
          mt={20}
          flexWrap="wrap"
          textAlign="center"
        >
          <VStack>
            <Heading size="xl" color={accentColor}>
              1000+
            </Heading>
            <Text color={textColor} fontWeight="medium">
              Happy Riders
            </Text>
          </VStack>
          <VStack>
            <Heading size="xl" color={accentColor}>
              500+
            </Heading>
            <Text color={textColor} fontWeight="medium">
              Verified Drivers
            </Text>
          </VStack>
          <VStack>
            <Heading size="xl" color={accentColor}>
              50+
            </Heading>
            <Text color={textColor} fontWeight="medium">
              Routes Available
            </Text>
          </VStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default TravelingHelpHomepage;