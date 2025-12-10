import { Badge, HStack, Icon } from '@chakra-ui/react';
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { getScoreColor } from '../../utils';

interface DataQualityBadgeProps {
  score: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function DataQualityBadge({ score, showIcon = true, size = 'md' }: DataQualityBadgeProps) {
  const color = getScoreColor(score);
  
  const colorMap = {
    red: {
      bg: 'rgba(255, 107, 107, 0.15)',
      color: '#ff6b6b',
      icon: FiAlertCircle,
    },
    yellow: {
      bg: 'rgba(252, 196, 25, 0.15)',
      color: '#fcc419',
      icon: FiAlertTriangle,
    },
    green: {
      bg: 'rgba(81, 207, 102, 0.15)',
      color: '#51cf66',
      icon: FiCheckCircle,
    },
  };

  const sizeMap = {
    sm: { px: 2, py: 0.5, fontSize: 'xs' },
    md: { px: 3, py: 1, fontSize: 'sm' },
    lg: { px: 4, py: 1.5, fontSize: 'md' },
  };

  const { bg, color: textColor, icon } = colorMap[color];
  const sizeStyles = sizeMap[size];

  return (
    <Badge
      bg={bg}
      color={textColor}
      px={sizeStyles.px}
      py={sizeStyles.py}
      fontSize={sizeStyles.fontSize}
      fontWeight="600"
      borderRadius="full"
      display="inline-flex"
      alignItems="center"
      gap={1.5}
    >
      <HStack gap={1}>
        {showIcon && <Icon as={icon} boxSize={size === 'sm' ? 3 : 4} />}
        <span>{score}</span>
      </HStack>
    </Badge>
  );
}

export default DataQualityBadge;
