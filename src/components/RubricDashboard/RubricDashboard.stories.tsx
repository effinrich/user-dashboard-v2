import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@chakra-ui/react';
import { RubricDashboard } from './RubricDashboard';
import { User } from '../../types';

const meta: Meta<typeof RubricDashboard> = {
  title: 'Components/RubricDashboard',
  component: RubricDashboard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RubricDashboard>;

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    zip_code: '37643',
    latitude: 36.3134,
    longitude: -82.3534,
    time_zone: 'UTC-5',
    manual_score: 75,
    data_quality_score: 100,
  },
  {
    id: '2',
    name: 'Jane Smith',
    zip_code: '90210',
    latitude: 34.0901,
    longitude: -118.4065,
    time_zone: 'UTC-8',
    manual_score: 45,
    data_quality_score: 100,
  },
  {
    id: '3',
    name: 'Bob Wilson',
    zip_code: '10001',
    latitude: 40.7484,
    longitude: -73.9967,
    time_zone: 'UTC-5',
    manual_score: 20,
    data_quality_score: 70,
  },
  {
    id: '4',
    name: 'Alice Brown',
    zip_code: '33139',
    latitude: 25.7907,
    longitude: -80.1300,
    time_zone: 'UTC-5',
    manual_score: 90,
    data_quality_score: 100,
  },
  {
    id: '5',
    name: 'Charlie Davis',
    zip_code: '98101',
    latitude: 47.6062,
    longitude: -122.3321,
    time_zone: 'UTC-8',
    manual_score: 55,
    data_quality_score: 100,
  },
  {
    id: '6',
    name: 'Eva Martinez',
    zip_code: '60601',
    latitude: 41.8819,
    longitude: -87.6278,
    time_zone: 'UTC-6',
    manual_score: 85,
    data_quality_score: 100,
  },
  {
    id: '7',
    name: 'Frank Johnson',
    zip_code: '02101',
    latitude: null,
    longitude: null,
    time_zone: null,
    manual_score: 15,
    data_quality_score: 40,
  },
  {
    id: '8',
    name: 'Grace Lee',
    zip_code: '75201',
    latitude: 32.7767,
    longitude: -96.7970,
    time_zone: 'UTC-6',
    manual_score: 92,
    data_quality_score: 100,
  },
];

const lowScoreUsers: User[] = mockUsers.map(user => ({
  ...user,
  manual_score: Math.floor(Math.random() * 30),
  data_quality_score: Math.floor(Math.random() * 50) + 20,
}));

const highScoreUsers: User[] = mockUsers.map(user => ({
  ...user,
  manual_score: Math.floor(Math.random() * 30) + 70,
  data_quality_score: 100,
}));

export const Default: Story = {
  args: {
    users: mockUsers,
    isLoading: false,
  },
  decorators: [
    (Story) => (
      <Box p={6} bg="#0a0a0f" minH="100vh">
        <Story />
      </Box>
    ),
  ],
};

export const Loading: Story = {
  args: {
    users: [],
    isLoading: true,
  },
  decorators: [
    (Story) => (
      <Box p={6} bg="#0a0a0f" minH="100vh">
        <Story />
      </Box>
    ),
  ],
};

export const NoUsers: Story = {
  args: {
    users: [],
    isLoading: false,
  },
  decorators: [
    (Story) => (
      <Box p={6} bg="#0a0a0f" minH="100vh">
        <Story />
      </Box>
    ),
  ],
};

export const LowScores: Story = {
  args: {
    users: lowScoreUsers,
    isLoading: false,
  },
  decorators: [
    (Story) => (
      <Box p={6} bg="#0a0a0f" minH="100vh">
        <Story />
      </Box>
    ),
  ],
};

export const HighScores: Story = {
  args: {
    users: highScoreUsers,
    isLoading: false,
  },
  decorators: [
    (Story) => (
      <Box p={6} bg="#0a0a0f" minH="100vh">
        <Story />
      </Box>
    ),
  ],
};

export const SingleUser: Story = {
  args: {
    users: [mockUsers[0]],
    isLoading: false,
  },
  decorators: [
    (Story) => (
      <Box p={6} bg="#0a0a0f" minH="100vh">
        <Story />
      </Box>
    ),
  ],
};
