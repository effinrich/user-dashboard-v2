import { Box, Text } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ScoreDistribution } from '../../types';

interface ScoreDistributionChartProps {
  data: ScoreDistribution[];
  title: string;
  color?: string;
  height?: number;
}

export function ScoreDistributionChart({
  data,
  title,
  color = '#5c7cfa',
  height = 250,
}: ScoreDistributionChartProps) {
  // Get colors based on score ranges
  const getBarColor = (range: string) => {
    const start = parseInt(range.split('-')[0]);
    if (start <= 30) return '#ff6b6b';
    if (start <= 70) return '#fcc419';
    return '#51cf66';
  };

  return (
    <Box
      bg="surface.card"
      borderRadius="xl"
      p={5}
      borderWidth="1px"
      borderColor="surface.border"
    >
      <Text
        fontSize="md"
        fontWeight="600"
        color="text.primary"
        mb={4}
      >
        {title}
      </Text>
      
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#2a2a3a" 
            vertical={false}
          />
          <XAxis
            dataKey="range"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            axisLine={{ stroke: '#2a2a3a' }}
            tickLine={{ stroke: '#2a2a3a' }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={{ stroke: '#2a2a3a' }}
            tickLine={{ stroke: '#2a2a3a' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a24',
              border: '1px solid #2a2a3a',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            labelStyle={{ color: '#a1a1aa' }}
            cursor={{ fill: 'rgba(92, 124, 250, 0.1)' }}
          />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.range)}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default ScoreDistributionChart;
