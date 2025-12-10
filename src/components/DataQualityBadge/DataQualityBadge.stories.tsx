import type { Meta, StoryObj } from '@storybook/react';
import { HStack, VStack, Text } from '@chakra-ui/react';
import { DataQualityBadge } from './DataQualityBadge';

const meta: Meta<typeof DataQualityBadge> = {
  title: 'Components/DataQualityBadge',
  component: DataQualityBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    showIcon: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataQualityBadge>;

export const Default: Story = {
  args: {
    score: 75,
    showIcon: true,
    size: 'md',
  },
};

export const AllScoreRanges: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <Text fontWeight="bold" color="white">Score Ranges</Text>
      <HStack gap={4}>
        <VStack align="start">
          <Text fontSize="sm" color="gray.400">Critical (0-30)</Text>
          <DataQualityBadge score={15} />
        </VStack>
        <VStack align="start">
          <Text fontSize="sm" color="gray.400">Warning (31-70)</Text>
          <DataQualityBadge score={50} />
        </VStack>
        <VStack align="start">
          <Text fontSize="sm" color="gray.400">Good (71-100)</Text>
          <DataQualityBadge score={85} />
        </VStack>
      </HStack>
    </VStack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <HStack gap={4}>
      <VStack align="start">
        <Text fontSize="sm" color="gray.400">Small</Text>
        <DataQualityBadge score={75} size="sm" />
      </VStack>
      <VStack align="start">
        <Text fontSize="sm" color="gray.400">Medium</Text>
        <DataQualityBadge score={75} size="md" />
      </VStack>
      <VStack align="start">
        <Text fontSize="sm" color="gray.400">Large</Text>
        <DataQualityBadge score={75} size="lg" />
      </VStack>
    </HStack>
  ),
};

export const WithoutIcon: Story = {
  args: {
    score: 75,
    showIcon: false,
  },
};

export const CriticalScore: Story = {
  args: {
    score: 20,
  },
};

export const WarningScore: Story = {
  args: {
    score: 55,
  },
};

export const GoodScore: Story = {
  args: {
    score: 90,
  },
};

export const PerfectScore: Story = {
  args: {
    score: 100,
  },
};

export const ZeroScore: Story = {
  args: {
    score: 0,
  },
};
