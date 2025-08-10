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
  CardHeader,
  CardFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Select,
  useColorModeValue,
  useToast,
  Grid,
  GridItem,
  Badge,
  Divider,
  Avatar,
  Icon,
  IconButton,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Stat,
  StatLabel,
  StatNumber,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  FaPlus,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaRupeeSign,
  FaPhone,
  FaCar,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaWhatsapp,
  FaEye,
  FaSignOutAlt,
  FaChevronDown,
  FaTachometerAlt,
  FaUser
} from 'react-icons/fa';

// Cookie utility functions
const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

interface Driver {
  id: string;
  email: string;
  carOwnerName: string;
  mobile: string;
  carType?: string;
  carNo?: string;
}

interface Post {
  _id: string;
  driverId: {
    _id: string;
    email: string;
  };
  ownerName: string;
  mobile: string;
  whatsAppNumber?: string;
  from: string;
  to: string;
  date: string;
  time: string;
  availableSeats: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

const DriverDashboard = () => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Form state for create/edit post
  const [formData, setFormData] = useState({
    ownerName: '',
    mobile: '',
    whatsAppNumber: '',
    from: '',
    to: '',
    date: '',
    time: '',
    availableSeats: 1,
    price: 0
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toast = useToast();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Get auth token
  const getAuthHeaders = () => {
    const token = getCookie('driverToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Check authentication
  useEffect(() => {
    const token = getCookie('driverToken');
    const driverData = getCookie('driverData');
    
    if (!token || !driverData) {
      window.location.href = '/driver/auth';
      return;
    }

    try {
      const parsedDriver = JSON.parse(driverData);
      setDriver(parsedDriver);
      setFormData(prev => ({
        ...prev,
        ownerName: parsedDriver.carOwnerName || '',
        mobile: parsedDriver.mobile || ''
      }));
    } catch (error) {
      window.location.href = '/driver/auth';
    }
  }, []);

  // Fetch driver's posts
 const fetchMyPosts = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/driver/my-posts`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    if (data.success) {
      setPosts(data.data);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to load your posts',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (driver) {
      fetchMyPosts();
    }
  }, [driver]);

  // Logout function
  const handleLogout = () => {
    removeCookie('driverToken');
    removeCookie('driverData');
    window.location.href = '/';
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
    if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
    if (!formData.from) newErrors.from = 'From location is required';
    if (!formData.to) newErrors.to = 'To location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (formData.availableSeats < 1) newErrors.availableSeats = 'At least 1 seat required';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Create post
const handleCreatePost = async () => {
  if (!validateForm()) return;

  setCreateLoading(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...formData,
        date: new Date(formData.date).toISOString(),
        time: new Date(`${formData.date}T${formData.time}`).toISOString()
      }),
    });

    const data = await response.json();
    if (data.success) {
      toast({
        title: 'Post Created!',
        description: 'Your ride has been posted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchMyPosts();
      onCreateClose();
      resetForm();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to create post',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setCreateLoading(false);
  }
};

// Update post
const handleUpdatePost = async () => {
  if (!validateForm() || !selectedPost) return;

  setCreateLoading(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${selectedPost._id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...formData,
        date: new Date(formData.date).toISOString(),
        time: new Date(`${formData.date}T${formData.time}`).toISOString()
      }),
    });

    const data = await response.json();
    if (data.success) {
      toast({
        title: 'Post Updated!',
        description: 'Your ride has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchMyPosts();
      onEditClose();
      resetForm();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update post',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setCreateLoading(false);
  }
};

// Delete post
const handleDeletePost = async () => {
  if (!deletePostId) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${deletePostId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    if (data.success) {
      toast({
        title: 'Post Deleted!',
        description: 'Your ride post has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchMyPosts();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to delete post',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setDeletePostId(null);
    onDeleteClose();
  }
};


  // Helper functions
  const resetForm = () => {
    setFormData({
      ownerName: driver?.carOwnerName || '',
      mobile: driver?.mobile || '',
      whatsAppNumber: '',
      from: '',
      to: '',
      date: '',
      time: '',
      availableSeats: 1,
      price: 0
    });
    setErrors({});
    setSelectedPost(null);
  };

  const openCreateModal = () => {
    resetForm();
    onCreateOpen();
  };

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    const postDate = new Date(post.date);
    const postTime = new Date(post.time);
    
    setFormData({
      ownerName: post.ownerName,
      mobile: post.mobile,
      whatsAppNumber: post.whatsAppNumber || '',
      from: post.from,
      to: post.to,
      date: postDate.toISOString().split('T')[0],
      time: postTime.toTimeString().slice(0, 5),
      availableSeats: post.availableSeats,
      price: post.price
    });
    onEditOpen();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!driver) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Header */}
      <Box bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <HStack spacing={4}>
              <Heading
                size="lg"
                bgGradient="linear(to-r, blue.500, purple.500)"
                bgClip="text"
                fontWeight="bold"
              >
                TravelingHelp
              </Heading>
              <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
                Driver Dashboard
              </Badge>
            </HStack>
            
            <HStack spacing={4}>
              <Text fontSize="sm" color="gray.600">
                Welcome, {driver.carOwnerName}
              </Text>
              <Menu>
                <MenuButton as={Button} rightIcon={<FaChevronDown />} size="sm" variant="outline">
                  <Avatar size="xs" name={driver.carOwnerName} mr={2} />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout} color="red.500">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <Tabs index={activeTab} onChange={setActiveTab} colorScheme="purple">
          <TabList>
            <Tab>
              <Icon as={FaTachometerAlt} mr={2} />
              Dashboard
            </Tab>
            <Tab>
              <Icon as={FaCar} mr={2} />
              My Posts ({posts.length})
            </Tab>
          </TabList>

          <TabPanels>
            {/* Dashboard Tab */}
            <TabPanel>
              <VStack spacing={8}>
                {/* Stats Cards */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} w="full">
                  <Card bg={cardBg} boxShadow="lg">
                    <CardBody textAlign="center">
                      <Stat>
                        <StatLabel>Total Posts</StatLabel>
                        <StatNumber color="purple.500">{posts.length}</StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} boxShadow="lg">
                    <CardBody textAlign="center">
                      <Stat>
                        <StatLabel>Available Seats</StatLabel>
                        <StatNumber color="green.500">
                          {posts.reduce((sum, post) => sum + post.availableSeats, 0)}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} boxShadow="lg">
                    <CardBody textAlign="center">
                      <Stat>
                        <StatLabel>Active Routes</StatLabel>
                        <StatNumber color="blue.500">
                          {new Set(posts.map(post => `${post.from}-${post.to}`)).size}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                </Grid>

                {/* Quick Actions */}
                <Card bg={cardBg} boxShadow="lg" w="full">
                  <CardHeader>
                    <Heading size="md">Quick Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <Button
                        leftIcon={<FaPlus />}
                        colorScheme="purple"
                        size="lg"
                        onClick={openCreateModal}
                        bgGradient="linear(to-r, purple.400, purple.600)"
                        _hover={{ bgGradient: "linear(to-r, purple.500, purple.700)" }}
                      >
                        Create New Ride Post
                      </Button>
                      
                      <Button
                        leftIcon={<FaEye />}
                        variant="outline"
                        colorScheme="purple"
                        size="lg"
                        onClick={() => setActiveTab(1)}
                      >
                        View My Posts
                      </Button>
                    </Grid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* My Posts Tab */}
            <TabPanel>
              <VStack spacing={6}>
                <Flex justify="space-between" align="center" w="full">
                  <Heading size="lg">My Ride Posts</Heading>
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme="purple"
                    onClick={openCreateModal}
                  >
                    New Post
                  </Button>
                </Flex>

                {loading ? (
                  <Flex justify="center" py={12}>
                    <Spinner size="xl" color="purple.500" />
                  </Flex>
                ) : posts.length === 0 ? (
                  <Card bg={cardBg} textAlign="center" py={12} w="full">
                    <CardBody>
                      <VStack spacing={4}>
                        <Icon as={FaCar} boxSize={12} color="gray.400" />
                        <Heading size="lg" color={textColor}>
                          No posts yet
                        </Heading>
                        <Text color={textColor}>
                          Create your first ride post to start connecting with passengers
                        </Text>
                        <Button
                          colorScheme="purple"
                          leftIcon={<FaPlus />}
                          onClick={openCreateModal}
                        >
                          Create First Post
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                    gap={6}
                    w="full"
                  >
                    {posts.map((post) => (
                      <Card
                        key={post._id}
                        bg={cardBg}
                        boxShadow="lg"
                        borderRadius="xl"
                        overflow="hidden"
                        transition="all 0.3s ease"
                        _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                      >
                        <CardBody p={6}>
                          <VStack spacing={4} align="start">
                            {/* Route */}
                            <HStack justify="space-between" w="full">
                              <VStack align="start" spacing={1}>
                                <HStack>
                                  <Icon as={FaMapMarkerAlt} color="green.500" />
                                  <Text fontSize="sm" color={textColor}>From</Text>
                                </HStack>
                                <Text fontWeight="bold">{post.from}</Text>
                              </VStack>
                              
                              <Icon as={FaCar} color="purple.500" boxSize={6} />
                              
                              <VStack align="end" spacing={1}>
                                <HStack>
                                  <Text fontSize="sm" color={textColor}>To</Text>
                                  <Icon as={FaMapMarkerAlt} color="red.500" />
                                </HStack>
                                <Text fontWeight="bold">{post.to}</Text>
                              </VStack>
                            </HStack>

                            <Divider />

                            {/* Details */}
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
                                <Text fontWeight="bold" fontSize="lg" color="green.600">
                                  ₹{post.price}
                                </Text>
                              </HStack>
                              
                              <HStack>
                                <Icon as={FaUsers} color="blue.500" />
                                <Text fontWeight="medium">
                                  {post.availableSeats} seats
                                </Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </CardBody>

                        <CardFooter pt={0} px={6} pb={6}>
                          <HStack spacing={2} w="full">
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              leftIcon={<FaEdit />}
                              onClick={() => openEditModal(post)}
                              flex={1}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              leftIcon={<FaTrash />}
                              onClick={() => {
                                setDeletePostId(post._id);
                                onDeleteOpen();
                              }}
                              flex={1}
                            >
                              Delete
                            </Button>
                          </HStack>
                        </CardFooter>
                      </Card>
                    ))}
                  </Grid>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* Create Post Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent mx={4}>
          <ModalHeader>Create New Ride Post</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <PostForm
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleCreatePost}
              isLoading={createLoading}
              loadingText="Creating..."
            >
              Create Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Post Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent mx={4}>
          <ModalHeader>Edit Ride Post</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <PostForm
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleUpdatePost}
              isLoading={createLoading}
              loadingText="Updating..."
            >
              Update Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Ride Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this ride post? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeletePost} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

// Post Form Component
const PostForm = ({ 
  formData, 
  setFormData, 
  errors, 
  setErrors 
}: {
  formData: {
    ownerName: string;
    mobile: string;
    whatsAppNumber: string;
    from: string;
    to: string;
    date: string;
    time: string;
    availableSeats: number;
    price: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    ownerName: string;
    mobile: string;
    whatsAppNumber: string;
    from: string;
    to: string;
    date: string;
    time: string;
    availableSeats: number;
    price: number;
  }>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: name === 'availableSeats' || name === 'price' ? Number(value) : value
    }));
    
    if (errors[name]) {
      setErrors((prev: { [key: string]: string }) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <VStack spacing={4}>
      {/* Driver Details */}
      <Text fontWeight="semibold" alignSelf="start" color="gray.700">
        Driver Details
      </Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
        <FormControl isInvalid={!!errors.ownerName}>
          <FormLabel>Owner Name</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={FaUser} color="gray.400" />
            </InputLeftElement>
            <Input
              name="ownerName"
              placeholder="Your name"
              value={formData.ownerName}
              onChange={handleInputChange}
            />
          </InputGroup>
          <FormErrorMessage>{errors.ownerName}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.mobile}>
          <FormLabel>Mobile Number</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={FaPhone} color="gray.400" />
            </InputLeftElement>
            <Input
              name="mobile"
              placeholder="Mobile number"
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </InputGroup>
          <FormErrorMessage>{errors.mobile}</FormErrorMessage>
        </FormControl>
      </Grid>

      <FormControl>
        <FormLabel>
          WhatsApp Number
         
        </FormLabel>
        <InputGroup>
          <InputLeftElement>
            <Icon as={FaWhatsapp} color="green.500" />
          </InputLeftElement>
          <Input
            name="whatsAppNumber"
            placeholder="WhatsApp number"
            value={formData.whatsAppNumber}
            onChange={handleInputChange}
          />
        </InputGroup>
      </FormControl>

      <Divider />

      {/* Trip Details */}
      <Text fontWeight="semibold" alignSelf="start" color="gray.700">
        Trip Details
      </Text>

      <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
        <FormControl isInvalid={!!errors.from}>
          <FormLabel>From</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={FaMapMarkerAlt} color="green.500" />
            </InputLeftElement>
            <Input
              name="from"
              placeholder="Departure city"
              value={formData.from}
              onChange={handleInputChange}
            />
          </InputGroup>
          <FormErrorMessage>{errors.from}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.to}>
          <FormLabel>To</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={FaMapMarkerAlt} color="red.500" />
            </InputLeftElement>
            <Input
              name="to"
              placeholder="Destination city"
              value={formData.to}
              onChange={handleInputChange}
            />
          </InputGroup>
          <FormErrorMessage>{errors.to}</FormErrorMessage>
        </FormControl>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
        <FormControl isInvalid={!!errors.date}>
          <FormLabel>Date</FormLabel>
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
          />
          <FormErrorMessage>{errors.date}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.time}>
          <FormLabel>Time</FormLabel>
          <Input
            name="time"
            type="time"
            value={formData.time}
            onChange={handleInputChange}
          />
          <FormErrorMessage>{errors.time}</FormErrorMessage>
        </FormControl>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
        <FormControl isInvalid={!!errors.availableSeats}>
          <FormLabel>Available Seats</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={FaUsers} color="blue.500" />
            </InputLeftElement>
            <Input
              name="availableSeats"
              type="number"
              min="1"
              max="8"
              placeholder="Number of seats"
              value={formData.availableSeats}
              onChange={handleInputChange}
            />
          </InputGroup>
          <FormErrorMessage>{errors.availableSeats}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.price}>
          <FormLabel>Price per Seat</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={FaRupeeSign} color="green.500" />
            </InputLeftElement>
            <Input
              name="price"
              type="number"
              min="0"
              placeholder="Price in ₹"
              value={formData.price}
              onChange={handleInputChange}
            />
          </InputGroup>
          <FormErrorMessage>{errors.price}</FormErrorMessage>
        </FormControl>
      </Grid>

      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontSize="sm">
            <strong>Tip:</strong> Set competitive prices and provide accurate timing to attract more riders.
          </Text>
        </Box>
      </Alert>
    </VStack>
  );
};

export default DriverDashboard;