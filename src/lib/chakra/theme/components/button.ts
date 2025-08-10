import { defineStyleConfig } from '@chakra-ui/react'

export const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'lg',
    transition: 'all 0.2s',
    _focus: {
      boxShadow: 'outline',
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4,
      py: 2,
      h: 8,
    },
    md: {
      fontSize: 'md',
      px: 6,
      py: 3,
      h: 10,
    },
    lg: {
      fontSize: 'lg',
      px: 8,
      py: 4,
      h: 12,
    },
    xl: {
      fontSize: 'xl',
      px: 10,
      py: 5,
      h: 14,
    },
  },
  variants: {
    solid: {
      bg: 'brand.500',
      color: 'white',
      _hover: {
        bg: 'brand.600',
        _disabled: {
          bg: 'brand.500',
        },
      },
      _active: {
        bg: 'brand.700',
      },
    },
    outline: {
      border: '2px solid',
      borderColor: 'brand.500',
      color: 'brand.500',
      bg: 'transparent',
      _hover: {
        bg: 'brand.50',
        _dark: {
          bg: 'brand.900',
        },
      },
      _active: {
        bg: 'brand.100',
        _dark: {
          bg: 'brand.800',
        },
      },
    },
    ghost: {
      color: 'brand.500',
      bg: 'transparent',
      _hover: {
        bg: 'brand.50',
        _dark: {
          bg: 'brand.900',
        },
      },
      _active: {
        bg: 'brand.100',
        _dark: {
          bg: 'brand.800',
        },
      },
    },
    gradient: {
      bg: 'linear-gradient(135deg, brand.400, brand.600)',
      color: 'white',
      _hover: {
        bg: 'linear-gradient(135deg, brand.500, brand.700)',
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      },
      _active: {
        transform: 'translateY(0)',
      },
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
})