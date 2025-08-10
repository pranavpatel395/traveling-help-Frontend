import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { colors } from './colors'
import { fonts } from './fonts'
import { components } from './components'


const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

export const theme = extendTheme({
  config,
  colors,
  fonts,

  components,

})