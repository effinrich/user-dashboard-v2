import type { Meta, StoryObj } from '@storybook/react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { ScoreDistributionChart } from './ScoreDistributionChart';
import { ScoreDistribution } from '../../types';

const meta: Meta<typeof ScoreDistributionChart> = {
  title: 'Components/ScoreDistributionChart',
  component: ScoreDistributionChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScoreDistributionChart>;

const mockDistribution: ScoreDistribution[] = [
  { range: '0-10', count: 2 },
  { range: '11-20', count: 3 },
  { range: '21-30', count: 5 },
  { range: '31-40', count: 8 },
  { range: '41-50', count: 12 },
  { range: '51-60', count: 15 },
  { range: '61-70', count: 10 },
  { range: '71-80', count: 18 },
  { range: '81-90', count: 14 },
  { range: '91-100', count: 8 },
];

const lowScoreDistribution: ScoreDistribution[] = [
  { range: '0-10', count: 15 },
  { range: '11-20', count: 20 },
  { range: '21-30', count: 18 },
  { range: '31-40', count: 10 },
  { range: '41-50', count: 5 },
  { range: '51-60', count: 3 },
  { range: '61-70', count: 2 },
  { range: '71-80', count: 1 },
  { range: '81-90', count: 0 },
  { range: '91-100', count: 0 },
];

const highScoreDistribution: ScoreDistribution[] = [
  { range: '0-10', count: 0 },
  { range: '11-20', count: 1 },
  { range: '21-30', count: 2 },
  { range: '31-40', count: 3 },
  { range: '41-50', count: 5 },
  { range: '51-60', count: 8 },
  { range: '61-70', count: 10 },
  { range: '71-80', count: 18 },
  { range: '81-90', count: 25 },
  { range: '91-100', count: 20 },
];

const emptyDistribution: ScoreDistribution[] = [
  { range: '0-10', count: 0 },
  { range: '11-20', count: 0 },
  { range: '21-30', count: 0 },
  { range: '31-40', count: 0 },
  { range: '41-50', count: 0 },
  { range: '51-60', count: 0 },
  { range: '61-70', count: 0 },
  { range: '71-80', count: 0 },
  { range: '81-90', count: 0 },
  { range: '91-100', count: 0 },
];

export const Default: Story = {
  args: {
    data: mockDistribution,
    title: 'Manual Score Distribution',
  },
  decorators: [
    (Story) => (
      <Box w="500px">
        <Story />
      </Box>
    ),
  ],
};

export const ManualScoreChart: Story = {
  args: {
    data: mockDistribution,
    title: 'Manual Score Distribution',
    color: '#5c7cfa',
  },
  decorators: [
    (Story) => (
      <Box w="500px">
        <Story />
      </Box>
    ),
  ],
};

export const DataQualityChart: Story = {
  args: {
    data: highScoreDistribution,
    title: 'Data Quality Score Distribution',
    color: '#845ef7',
  },
  decorators: [
    (Story) => (
      <Box w="500px">
        <Story />
      </Box>
    ),
  ],
};

export const LowScores: Story = {
  args: {
    data: lowScoreDistribution,
    title: 'Low Score Distribution (Needs Attention)',
  },
  decorators: [
    (Story) => (
      <Box w="500px">
        <Story />
      </Box>
    ),
  ],
};

export const HighScores: Story = {
  args: {
    data: highScoreDistribution,
    title: 'High Score Distribution (Good)',
  },
  decorators: [
    (Story) => (
      <Box w="500px">
        <Story />
      </Box>
    ),
  ],
};

export const EmptyData: Story = {
  args: {
    data: emptyDistribution,
    title: 'No Data Available',
  },
  decorators: [
    (Story) => (
      <Box w="500px">
        <Story />
      </Box>
    ),
  ],
};

export const SideBySide: Story = {
  render: () => (
    <SimpleGrid columns={2} gap={4} w="900px">
      <ScoreDistributionChart
        data={mockDistribution}
        title="Manual Score Distribution"
        color="#5c7cfa"
      />
      <ScoreDistributionChart
        data={highScoreDistribution}
        title="Data Quality Score Distribution"
        color="#845ef7"
      />
    </SimpleGrid>
  ),
};

export const CustomHeight: Story = {
  args: {
    data: mockDistribution,
    title: 'Tall Chart',
    height: 400,
  },
  decorators: [
    (Story) => (
      <Box w="500px">
        <Story />
      </Box>
    ),
  ],
};
