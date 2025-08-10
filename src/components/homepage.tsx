// src/components/homepage.tsx

'use client'

import React from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'

const Homepage: React.FC = () => {
  return (
    <Box p={8}>
      <Heading size="xl" mb={4}>
        Welcome to the Homepage
      </Heading>
      <Text fontSize="lg" color="gray.600">
        This is a sample homepage component using Chakra UI.
      </Text>
    </Box>
  )
}

export default Homepage
