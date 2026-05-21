import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { EXTENSION_PREFIX, ROOT_CLASS, ROOT_ID } from '@/lib/constants';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  cssVarPrefix: EXTENSION_PREFIX,
};

const ROOT_SELECTOR = `#${ROOT_ID}.${ROOT_CLASS}`;

export const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    mono: `'SF Mono', 'Fira Code', 'Consolas', monospace`,
  },
  colors: {
    brand: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
  },
  semanticTokens: {
    colors: {
      'bg.panel': {
        default: 'white',
        _dark: 'gray.800',
      },
      'bg.elevated': {
        default: 'gray.50',
        _dark: 'gray.700',
      },
      'border.subtle': {
        default: 'gray.200',
        _dark: 'gray.600',
      },
      'text.primary': {
        default: 'gray.900',
        _dark: 'whiteAlpha.900',
      },
      'text.muted': {
        default: 'gray.500',
        _dark: 'gray.400',
      },
      'highlight.ring': {
        default: 'brand.500',
        _dark: 'brand.400',
      },
      'highlight.fill': {
        default: 'rgba(99, 102, 241, 0.08)',
        _dark: 'rgba(129, 140, 248, 0.12)',
      },
    },
  },
  components: {
    Button: {
      defaultProps: { size: 'sm' },
    },
    IconButton: {
      defaultProps: { size: 'sm', variant: 'outline' },
    },
  },
  styles: {
    global: {
      [`${ROOT_SELECTOR}, ${ROOT_SELECTOR} *, ${ROOT_SELECTOR} *::before, ${ROOT_SELECTOR} *::after`]:
        { boxSizing: 'border-box' },
      [ROOT_SELECTOR]: {
        color: `var(--${EXTENSION_PREFIX}-colors-text-primary, #1A202C)`,
        fontSize: '16px',
        lineHeight: '1.5',
        WebkitTextFillColor: 'currentColor',
      },
    },
  },
});
