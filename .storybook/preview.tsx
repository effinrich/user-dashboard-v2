import type { Preview } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { system } from '../src/styles/theme';
import '../src/styles/global.css';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0a0a0f',
        },
        {
          name: 'card',
          value: '#12121a',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={system}>
          <div style={{ padding: '2rem' }}>
            <Story />
          </div>
        </ChakraProvider>
      </QueryClientProvider>
    ),
  ],
};

export default preview;
