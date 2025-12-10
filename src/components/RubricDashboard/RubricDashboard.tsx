import { Box, SimpleGrid, Text, VStack, HStack, Icon, Spinner } from '@chakra-ui/react';
import { FiUsers, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { ScoreDistributionChart } from '../ScoreDistributionChart';
import { User } from '../../types';
import { calculateDashboardStats, calculateScoreDistribution, getScoreColor } from '../../utils';

interface RubricDashboardProps {
  users: User[];
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  return (
    <Box
      bg="surface.card"
      borderRadius="xl"
      p={5}
      borderWidth="1px"
      borderColor="surface.border"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative gradient */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="100px"
        h="100px"
        bg={`${color}15`}
        borderRadius="full"
        transform="translate(30%, -30%)"
      />
      
      <VStack align="start" gap={3} position="relative">
        <HStack justify="space-between" w="full">
          <Box
            p={2}
            borderRadius="lg"
            bg={`${color}20`}
          >
            <Icon as={icon} boxSize={5} color={color} />
          </Box>
        </HStack>
        
        <VStack align="start" gap={0}>
          <Text
            fontSize="3xl"
            fontWeight="700"
            color="text.primary"
            fontFamily="heading"
          >
            {value}
          </Text>
          <Text fontSize="sm" color="text.muted">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="xs" color="text.muted" mt={1}>
              {subtitle}
            </Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}

export function RubricDashboard({ users, isLoading = false }: RubricDashboardProps) {
  if (isLoading) {
    return (
      <Box
        bg="surface.card"
        borderRadius="xl"
        p={10}
        borderWidth="1px"
        borderColor="surface.border"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={3}>
          <Spinner size="lg" color="brand.500" />
          <Text color="text.muted">Loading statistics...</Text>
        </VStack>
      </Box>
    );
  }

  const stats = calculateDashboardStats(users);
  const manualScoreDistribution = calculateScoreDistribution(users, 'manual_score');
  const dataQualityDistribution = calculateScoreDistribution(users, 'data_quality_score');

  const avgManualColor = getScoreColor(stats.averageManualScore);
  const avgDataQualityColor = getScoreColor(stats.averageDataQualityScore);

  const colorMap = {
    red: '#ff6b6b',
    yellow: '#fcc419',
    green: '#51cf66',
  };

  return (
    <VStack gap={6} align="stretch">
      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="#5c7cfa"
        />
        <StatCard
          title="Avg Manual Score"
          value={stats.averageManualScore}
          icon={FiTrendingUp}
          color={colorMap[avgManualColor]}
          subtitle="Target: 70+"
        />
        <StatCard
          title="Avg Data Quality"
          value={stats.averageDataQualityScore}
          icon={FiCheckCircle}
          color={colorMap[avgDataQualityColor]}
          subtitle="Target: 70+"
        />
        <StatCard
          title="Needs Attention"
          value={stats.usersNeedingAttention}
          icon={FiAlertCircle}
          color="#ff6b6b"
          subtitle="Combined avg ≤ 30"
        />
      </SimpleGrid>

      {/* Score Legend */}
      <Box
        bg="surface.card"
        borderRadius="xl"
        p={4}
        borderWidth="1px"
        borderColor="surface.border"
      >
        <Text fontSize="sm" fontWeight="500" color="text.secondary" mb={3}>
          Score Color Legend
        </Text>
        <HStack gap={6} flexWrap="wrap">
          <HStack gap={2}>
            <Box w={3} h={3} borderRadius="full" bg="#ff6b6b" />
            <Text fontSize="sm" color="text.muted">0-30 (Critical)</Text>
          </HStack>
          <HStack gap={2}>
            <Box w={3} h={3} borderRadius="full" bg="#fcc419" />
            <Text fontSize="sm" color="text.muted">31-70 (Warning)</Text>
          </HStack>
          <HStack gap={2}>
            <Box w={3} h={3} borderRadius="full" bg="#51cf66" />
            <Text fontSize="sm" color="text.muted">71-100 (Good)</Text>
          </HStack>
        </HStack>
      </Box>

      {/* Charts Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
        <ScoreDistributionChart
          data={manualScoreDistribution}
          title="Manual Score Distribution"
          color="#5c7cfa"
        />
        <ScoreDistributionChart
          data={dataQualityDistribution}
          title="Data Quality Score Distribution"
          color="#845ef7"
        />
      </SimpleGrid>
    </VStack>
  );
}

export default RubricDashboard;
