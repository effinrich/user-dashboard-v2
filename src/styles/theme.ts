import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f0f4ff' },
          100: { value: '#dbe4ff' },
          200: { value: '#bac8ff' },
          300: { value: '#91a7ff' },
          400: { value: '#748ffc' },
          500: { value: '#5c7cfa' },
          600: { value: '#4c6ef5' },
          700: { value: '#4263eb' },
          800: { value: '#3b5bdb' },
          900: { value: '#364fc7' },
        },
        surface: {
          bg: { value: '#0a0a0f' },
          card: { value: '#12121a' },
          elevated: { value: '#1a1a24' },
          border: { value: '#2a2a3a' },
        },
        accent: {
          coral: { value: '#ff6b6b' },
          mint: { value: '#51cf66' },
          amber: { value: '#fcc419' },
          sky: { value: '#339af0' },
          violet: { value: '#845ef7' },
        },
        score: {
          red: { value: '#ff6b6b' },
          yellow: { value: '#fcc419' },
          green: { value: '#51cf66' },
          redBg: { value: 'rgba(255, 107, 107, 0.15)' },
          yellowBg: { value: 'rgba(252, 196, 25, 0.15)' },
          greenBg: { value: 'rgba(81, 207, 102, 0.15)' },
        },
      },
      fonts: {
        heading: { value: '"Space Grotesk", "Segoe UI", system-ui, sans-serif' },
        body: { value: '"DM Sans", "Segoe UI", system-ui, sans-serif' },
        mono: { value: '"JetBrains Mono", "Fira Code", monospace' },
      },
      fontSizes: {
        xs: { value: '0.75rem' },
        sm: { value: '0.875rem' },
        md: { value: '1rem' },
        lg: { value: '1.125rem' },
        xl: { value: '1.25rem' },
        '2xl': { value: '1.5rem' },
        '3xl': { value: '1.875rem' },
        '4xl': { value: '2.25rem' },
        '5xl': { value: '3rem' },
      },
      radii: {
        sm: { value: '0.375rem' },
        md: { value: '0.5rem' },
        lg: { value: '0.75rem' },
        xl: { value: '1rem' },
        '2xl': { value: '1.5rem' },
        full: { value: '9999px' },
      },
      shadows: {
        sm: { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
        md: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
        lg: { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
        xl: { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
        glow: { value: '0 0 20px rgba(92, 124, 250, 0.3)' },
        glowGreen: { value: '0 0 20px rgba(81, 207, 102, 0.3)' },
        glowRed: { value: '0 0 20px rgba(255, 107, 107, 0.3)' },
      },
    },
    semanticTokens: {
      colors: {
        'bg.canvas': { value: '{colors.surface.bg}' },
        'bg.surface': { value: '{colors.surface.card}' },
        'bg.elevated': { value: '{colors.surface.elevated}' },
        'border.default': { value: '{colors.surface.border}' },
        'text.primary': { value: '#ffffff' },
        'text.secondary': { value: '#a1a1aa' },
        'text.muted': { value: '#71717a' },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
