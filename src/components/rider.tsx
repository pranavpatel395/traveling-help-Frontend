"use client"

import React, { useState, useEffect } from 'react';
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
  Avatar,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Stack,
  Skeleton,
  SkeletonText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaRupeeSign,
  FaPhone,
  FaCar,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaWhatsapp,
  FaPhoneAlt
} from 'react-icons/fa';

interface Driver {
  _id: string;
  email: string;
}

interface Post {
  _id: string;
  driverId: Driver;
  ownerName: string;
  mobile: string;
  whatsAppNumber?: string;
  from: string;
  to: string;
  time: string;
  availableSeats: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  date: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      current: number;
      total: number;
      count: number;
      totalPosts: number;
    };
  };
}

const RidesListingPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalPosts: 0
  });
const modalCardBg = useColorModeValue('gray.50', 'gray.700');

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('blue.500', 'blue.400');
  const rideSummaryCardBg = useColorModeValue('gray.50', 'gray.700');

  const fetchRides = async (page = 1, from = '', to = '') => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/posts?page=${page}&limit=10`;
      
      if (from) url += `&from=${encodeURIComponent(from)}`;
      if (to) url += `&to=${encodeURIComponent(to)}`;

      const response = await fetch(url);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
        setError(null);
      } else {
        setError('Failed to fetch rides');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchRides(1, searchFrom, searchTo);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRides(page, searchFrom, searchTo);
  };

  const handleBookRide = (post: Post) => {
    setSelectedPost(post);
    onOpen();
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber: string, rideDetails: Post) => {
    const message = `Hi ${rideDetails.ownerName}! I'm interested in booking your ride from ${rideDetails.from} to ${rideDetails.to} on ${formatDate(rideDetails.date)} at ${formatTime(rideDetails.time)}. Price: ₹${rideDetails.price} per seat. Is it still available?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Header */}
      <Box bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
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
            <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
              Rider Mode
            </Badge>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        {/* Page Header */}
        <VStack spacing={6} mb={8}>
          <Heading
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="bold"
            bgGradient="linear(to-r, blue.600, purple.600)"
            bgClip="text"
            textAlign="center"
          >
            Available Rides
          </Heading>
          
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color={textColor}
            textAlign="center"
            maxW="2xl"
          >
            Find the perfect ride for your destination. Browse through available rides 
            posted by verified drivers in your area.
          </Text>
        </VStack>

        {/* Search Filters */}
        <Card bg={cardBg} mb={8} boxShadow="lg">
          <CardBody>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
              gap={4}
              alignItems="end"
            >
              <GridItem>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  From
                </Text>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaMapMarkerAlt} color="green.500" />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter departure city"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                  />
                </InputGroup>
              </GridItem>

              <GridItem>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  To
                </Text>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaMapMarkerAlt} color="red.500" />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter destination city"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                  />
                </InputGroup>
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 1, lg: 2 }}>
                <HStack spacing={4}>
                  <Button
                    colorScheme="blue"
                    leftIcon={<FaSearch />}
                    onClick={handleSearch}
                    isLoading={loading}
                    loadingText="Searching"
                  >
                    Search Rides
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchFrom('');
                      setSearchTo('');
                      setCurrentPage(1);
                      fetchRides();
                    }}
                  >
                    Clear Filters
                  </Button>
                </HStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Loading State */}
        {loading && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} bg={cardBg} boxShadow="md">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Skeleton height="40px" width="60%" />
                    <SkeletonText noOfLines={3} spacing="4" />
                    <Skeleton height="20px" width="40%" />
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Rides Grid */}
        {!loading && !error && posts.length > 0 && (
          <>
            <Text fontSize="lg" fontWeight="semibold" mb={6} color={textColor}>
              {pagination.totalPosts} rides found
            </Text>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={6}
              mb={8}
            >
              {posts.map((post) => (
                <Card
                  key={post._id}
                  bg={cardBg}
                  boxShadow="lg"
                  borderRadius="xl"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl'
                  }}
                >
                  <CardBody p={6}>
                    <VStack spacing={4} align="start">
                      {/* Driver Info */}
                      <HStack spacing={3} w="full">
                        <Avatar
                          name={post.ownerName}
                          size="md"
                          bg="blue.500"
                          color="white"
                        />
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontWeight="bold" fontSize="lg">
                            {post.ownerName}
                          </Text>
                          <HStack>
                            <Icon as={FaPhone} color="green.500" boxSize={3} />
                            <Text fontSize="sm" color={textColor}>
                              {post.mobile}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>

                      <Divider />

                      {/* Route Info */}
                      <VStack spacing={3} w="full">
                        <HStack justify="space-between" w="full">
                          <VStack align="start" spacing={1}>
                            <HStack>
                              <Icon as={FaMapMarkerAlt} color="green.500" />
                              <Text fontSize="sm" color={textColor}>From</Text>
                            </HStack>
                            <Text fontWeight="bold">{post.from}</Text>
                          </VStack>
                          
                          <Icon as={FaCar} color={accentColor} boxSize={6} />
                          
                          <VStack align="end" spacing={1}>
                            <HStack>
                              <Text fontSize="sm" color={textColor}>To</Text>
                              <Icon as={FaMapMarkerAlt} color="red.500" />
                            </HStack>
                            <Text fontWeight="bold">{post.to}</Text>
                          </VStack>
                        </HStack>

                        {/* Trip Details */}
                        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                          <VStack align="start" spacing={1}>
                            <HStack>
                              <Icon as={FaCalendarAlt} color="blue.500" boxSize={4} />
                              <Text fontSize="sm" color={textColor}>Date</Text>
                            </HStack>
                            <Text fontWeight="medium" fontSize="sm">
                              {formatDate(post.date)}
                            </Text>
                          </VStack>

                          <VStack align="start" spacing={1}>
                            <HStack>
                              <Icon as={FaClock} color="orange.500" boxSize={4} />
                              <Text fontSize="sm" color={textColor}>Time</Text>
                            </HStack>
                            <Text fontWeight="medium" fontSize="sm">
                              {formatTime(post.time)}
                            </Text>
                          </VStack>
                        </Grid>

                        {/* Price and Seats */}
                        <HStack justify="space-between" w="full">
                          <HStack>
                            <Icon as={FaRupeeSign} color="green.500" />
                            <Text fontWeight="bold" fontSize="xl" color="green.600">
                              ₹{post.price}
                            </Text>
                            <Text fontSize="sm" color={textColor}>per seat</Text>
                          </HStack>
                          
                          <HStack>
                            <Icon as={FaUsers} color="blue.500" />
                            <Text fontWeight="medium">
                              {post.availableSeats} seats left
                            </Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </VStack>
                  </CardBody>

                  <CardFooter pt={0} px={6} pb={6}>
                    <Button
                      size="md"
                      colorScheme="blue"
                      width="full"
                      onClick={() => handleBookRide(post)}
                      bgGradient="linear(to-r, blue.400, blue.600)"
                      _hover={{
                        bgGradient: "linear(to-r, blue.500, blue.700)",
                        transform: "translateY(-1px)"
                      }}
                      boxShadow="md"
                    >
                      Book This Ride
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </Grid>

            {/* Pagination */}
            {pagination.total > 1 && (
              <Flex justify="center" align="center" gap={2}>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>

                {Array.from({ length: pagination.total }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    colorScheme={currentPage === page ? "blue" : "gray"}
                    variant={currentPage === page ? "solid" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === pagination.total}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </Flex>
            )}
          </>
        )}

        {/* No Results State */}
        {!loading && !error && posts.length === 0 && (
          <Card bg={cardBg} textAlign="center" py={12}>
            <CardBody>
              <VStack spacing={4}>
                <Icon as={FaCar} boxSize={12} color="gray.400" />
                <Heading size="lg" color={textColor}>
                  No rides found
                </Heading>
                <Text color={textColor}>
                  Try adjusting your search filters or check back later for new rides.
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setSearchFrom('');
                    setSearchTo('');
                    fetchRides();
                  }}
                >
                  Show All Rides
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}
      </Container>

      {/* Booking Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent mx={4}>
          <ModalHeader>
            <VStack spacing={2} align="start">
              <Text>Contact Driver</Text>
              <Text fontSize="sm" color={textColor} fontWeight="normal">
                Choose how you&apos;d like to contact {selectedPost?.ownerName}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            {selectedPost && (
              <VStack spacing={6}>
                <Card bg={modalCardBg} w="full">
                  <CardBody p={4}>
                    <VStack spacing={3}>
                      <HStack justify="space-between" w="full">
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" color={textColor}>From</Text>
                          <Text fontWeight="bold">{selectedPost.from}</Text>
                        </VStack>
                        <Icon as={FaCar} color={accentColor} />
                        <VStack align="end" spacing={0}>
                          <Text fontSize="sm" color={textColor}>To</Text>
                          <Text fontWeight="bold">{selectedPost.to}</Text>
                        </VStack>
                      </HStack>
                      
                      <HStack justify="space-between" w="full" fontSize="sm">
                        <HStack>
                          <Icon as={FaCalendarAlt} color="blue.500" />
                          <Text>{formatDate(selectedPost.date)}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FaClock} color="orange.500" />
                          <Text>{formatTime(selectedPost.time)}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FaRupeeSign} color="green.500" />
                          <Text fontWeight="bold">₹{selectedPost.price}</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Driver Info */}
                <HStack spacing={3} w="full">
                  <Avatar
                    name={selectedPost.ownerName}
                    size="md"
                    bg="blue.500"
                    color="white"
                  />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontWeight="bold" fontSize="lg">
                      {selectedPost.ownerName}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {selectedPost.driverId.email}
                    </Text>
                  </VStack>
                </HStack>

                {/* Contact Options */}
                <VStack spacing={4} w="full">
                  <Text fontWeight="semibold" alignSelf="start">
                    Contact Options:
                  </Text>
                  
                  {/* WhatsApp Button */}
                  <Button
                    leftIcon={<FaWhatsapp />}
                    colorScheme="green"
                    size="lg"
                    w="full"
                    bg="green.500"
                    _hover={{ bg: "green.600" }}
                    onClick={() => {
                      const whatsappNumber = selectedPost.whatsAppNumber || selectedPost.mobile;
                      handleWhatsApp(whatsappNumber, selectedPost);
                      onClose();
                    }}
                  >
                    Chat on WhatsApp
                    <Text fontSize="sm" ml={2} opacity={0.8}>
                      {selectedPost.whatsAppNumber || selectedPost.mobile}
                    </Text>
                  </Button>

                  {/* Call Button */}
                  <Button
                    leftIcon={<FaPhoneAlt />}
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    onClick={() => {
                      handleCall(selectedPost.mobile);
                      onClose();
                    }}
                  >
                    Call Now
                    <Text fontSize="sm" ml={2} opacity={0.8}>
                      {selectedPost.mobile}
                    </Text>
                  </Button>
                </VStack>

                {/* Safety Note */}
                <Alert status="info" borderRadius="md" fontSize="sm">
                  <AlertIcon />
                  <Box>
                    <Text>
                      <strong>Safety Tip:</strong> Always verify the driver&apos;s identity and 
                      vehicle details before starting your journey.
                    </Text>
                  </Box>
                </Alert>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RidesListingPage;