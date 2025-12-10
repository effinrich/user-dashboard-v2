import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';
import { ScoreInput } from './ScoreInput';

const meta: Meta<typeof ScoreInput> = {
  title: 'Components/ScoreInput',
  component: ScoreInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScoreInput>;

// Interactive wrapper component
function ScoreInputWrapper({ initialValue = 50 }: { initialValue?: number }) {
  const [value, setValue] = useState(initialValue);

  const handleSave = async (newValue: number) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setValue(newValue);
  };

  return (
    <Box>
      <Text fontSize="sm" color="gray.400" mb={2}>
        Click to edit (current value: {value})
      </Text>
      <ScoreInput value={value} onSave={handleSave} />
    </Box>
  );
}

export const Default: Story = {
  render: () => <ScoreInputWrapper initialValue={75} />,
};

export const Interactive: Story = {
  render: () => (
    <VStack gap={6} align="start">
      <Text fontWeight="bold" color="white">Interactive Examples</Text>
      <VStack gap={4} align="start">
        <Box>
          <Text fontSize="sm" color="gray.400" mb={1}>Low Score</Text>
          <ScoreInputWrapper initialValue={15} />
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400" mb={1}>Medium Score</Text>
          <ScoreInputWrapper initialValue={50} />
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.400" mb={1}>High Score</Text>
          <ScoreInputWrapper initialValue={90} />
        </Box>
      </VStack>
    </VStack>
  ),
};

export const Loading: Story = {
  args: {
    value: 75,
    onSave: async () => {},
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    value: 75,
    onSave: async () => {},
    disabled: true,
  },
};

export const ZeroValue: Story = {
  render: () => <ScoreInputWrapper initialValue={0} />,
};

export const MaxValue: Story = {
  render: () => <ScoreInputWrapper initialValue={100} />,
};
