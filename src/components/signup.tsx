"use client"
import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  useColorModeValue,
  useToast,
  Link,
  Divider,
  Icon,
  Alert,
  AlertIcon,
  Spinner,
  Checkbox,
  Badge
} from '@chakra-ui/react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCar,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaUserPlus,
  FaSignInAlt
} from 'react-icons/fa';

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

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

// Registration Component
const DriverRegister = ({ switchToLogin }: { switchToLogin: () => void }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    carOwnerName: '',
    mobile: '',
    carType: '',
    carNo: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const toast = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.carOwnerName) {
      newErrors.carOwnerName = 'Car owner name is required';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    // Vehicle information is optional
    if (formData.carNo && !formData.carType) {
      newErrors.carType = 'Car type is required when car number is provided';
    }

    if (formData.carType && !formData.carNo) {
      newErrors.carNo = 'Car number is required when car type is provided';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in cookies
        setCookie('driverToken', data.data.accessToken, 7);
        setCookie('driverData', JSON.stringify(data.data.driver), 7);

        toast({
          title: 'Registration Successful!',
          description: `Welcome ${data.data.driver.carOwnerName}! Your account has been created.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Redirect to driver dashboard or desired page
        window.location.href = '/driver/dashboard';
      } else {
        toast({
          title: 'Registration Failed',
          description: data.message || 'Something went wrong. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Network Error',
        description: 'Unable to connect to server. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Card maxW="lg" mx="auto" boxShadow="2xl">
      <CardBody p={8}>
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center">
            <Icon as={FaUserPlus} boxSize={12} color="purple.500" />
            <Heading size="lg" color="purple.600">
              Create Driver Account
            </Heading>
            <Text color="gray.600">
              Join our community of verified drivers
            </Text>
          </VStack>

          <VStack spacing={4} w="full" as="form" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <Text fontWeight="semibold" alignSelf="start" color="gray.700">
                Personal Information
              </Text>

              <FormControl isInvalid={!!errors.carOwnerName}>
                <FormLabel>Full Name</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaUser} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="carOwnerName"
                    placeholder="Enter your full name"
                    value={formData.carOwnerName}
                    onChange={handleInputChange}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.carOwnerName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email Address</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaEnvelope} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.mobile}>
                <FormLabel>Mobile Number</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaPhone} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="mobile"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.mobile}</FormErrorMessage>
              </FormControl>

              <Divider />

              {/* Vehicle Information */}
              <Text fontWeight="semibold" alignSelf="start" color="gray.700">
                Vehicle Information
                <Badge ml={2} colorScheme="gray" variant="subtle" fontSize="xs">
                  Optional
                </Badge>
              </Text>

              <FormControl isInvalid={!!errors.carType}>
                <FormLabel>
                  Car Type
                  <Text as="span" color="gray.500" fontSize="sm" ml={1}>
                    (Optional)
                  </Text>
                </FormLabel>
                <Select
                  name="carType"
                  placeholder="Select car type"
                  value={formData.carType}
                  onChange={handleInputChange}
                >
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="MPV">MPV</option>
                  <option value="Others">Others</option>
                </Select>
                <FormErrorMessage>{errors.carType}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.carNo}>
                <FormLabel>
                  Car Number
                  <Text as="span" color="gray.500" fontSize="sm" ml={1}>
                    (Optional)
                  </Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaIdCard} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="carNo"
                    placeholder="e.g., GJ01AB1234"
                    value={formData.carNo}
                    onChange={handleInputChange}
                    textTransform="uppercase"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.carNo}</FormErrorMessage>
              </FormControl>

              <Divider />

              {/* Security */}
              <Text fontWeight="semibold" alignSelf="start" color="gray.700">
                Security
              </Text>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon as={showPassword ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Icon as={showConfirmPassword ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              {/* Terms and Conditions */}
              <FormControl isInvalid={!!errors.terms}>
                <Checkbox
                  isChecked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                >
                  <Text fontSize="sm">
                    I agree to the{' '}
                    <Link color="purple.500" href="#" textDecoration="underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link color="purple.500" href="#" textDecoration="underline">
                      Privacy Policy
                    </Link>
                  </Text>
                </Checkbox>
                <FormErrorMessage>{errors.terms}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText="Creating Account..."
                bgGradient="linear(to-r, purple.400, purple.600)"
                _hover={{
                  bgGradient: "linear(to-r, purple.500, purple.700)",
                }}
              >
                Create Account
              </Button>

              <Text textAlign="center" fontSize="sm">
                Already have an account?{' '}
                <Link
                  color="purple.500"
                  fontWeight="semibold"
                  onClick={switchToLogin}
                  cursor="pointer"
                >
                  Sign In
                </Link>
              </Text>
            </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

// Login Component
const DriverLogin = ({ switchToRegister }: { switchToRegister: () => void }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const toast = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.identifier) {
      newErrors.identifier = 'Email or mobile number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in cookies
        const tokenExpiry = rememberMe ? 30 : 7; // 30 days if remember me, otherwise 7 days
        setCookie('driverToken', data.data.accessToken, tokenExpiry);
        setCookie('driverData', JSON.stringify(data.data.driver), tokenExpiry);

        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${data.data.driver.carOwnerName}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Redirect to driver dashboard
        window.location.href = '/driver/dashboard';
      } else {
        toast({
          title: 'Login Failed',
          description: data.message || 'Invalid credentials. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Network Error',
        description: 'Unable to connect to server. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Card maxW="md" mx="auto" boxShadow="2xl">
      <CardBody p={8}>
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center">
            <Icon as={FaSignInAlt} boxSize={12} color="purple.500" />
            <Heading size="lg" color="purple.600">
              Driver Sign In
            </Heading>
            <Text color="gray.600">
              Sign in to manage your rides
            </Text>
          </VStack>

          <VStack spacing={4} w="full" as="form" onSubmit={handleSubmit}>
              <FormControl isInvalid={!!errors.identifier}>
                <FormLabel>Email or Mobile Number</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaEnvelope} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="identifier"
                    placeholder="Enter email or mobile number"
                    value={formData.identifier}
                    onChange={handleInputChange}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.identifier}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon as={showPassword ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <Flex justify="space-between" w="full" fontSize="sm">
                <Checkbox
                  isChecked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember me
                </Checkbox>
                <Link color="purple.500" href="#">
                  Forgot password?
                </Link>
              </Flex>

              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText="Signing In..."
                bgGradient="linear(to-r, purple.400, purple.600)"
                _hover={{
                  bgGradient: "linear(to-r, purple.500, purple.700)",
                }}
              >
                Sign In
              </Button>

              <Text textAlign="center" fontSize="sm">
                Don&apos;t have an account?{' '}
                <Link
                  color="purple.500"
                  fontWeight="semibold"
                  onClick={switchToRegister}
                  cursor="pointer"
                >
                  Create Account
                </Link>
              </Text>
            </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

// Main Auth Container
const DriverAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Header */}
      <Box bg="white" boxShadow="sm">
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
            <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
              Driver Portal
            </Badge>
          </Flex>
        </Container>
      </Box>

      {/* Auth Forms */}
      <Container maxW="2xl" py={12}>
        {isLogin ? (
          <DriverLogin switchToRegister={() => setIsLogin(false)} />
        ) : (
          <DriverRegister switchToLogin={() => setIsLogin(true)} />
        )}
      </Container>
    </Box>
  );
};

export default DriverAuthPage;