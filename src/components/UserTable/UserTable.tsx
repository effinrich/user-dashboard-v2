import { useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Icon,
  Table,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
} from 'react-icons/fi';
import { User } from '../../types';
import { DataQualityBadge } from '../DataQualityBadge';
import { ScoreInput } from '../ScoreInput';
import { getRowBackgroundColor, getScoreColor } from '../../utils';

interface UserTableProps {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onUpdateScore: (id: string, score: number) => Promise<void>;
  isLoading?: boolean;
  isUpdatingScore?: boolean;
}

export function UserTable({
  users,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onUpdateScore,
  isLoading = false,
  isUpdatingScore = false,
}: UserTableProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, total);

  const getRowIcon = (user: User) => {
    const combinedAverage = (user.manual_score + user.data_quality_score) / 2;
    const color = getScoreColor(combinedAverage);
    
    switch (color) {
      case 'red':
        return { icon: FiAlertCircle, color: '#ff6b6b' };
      case 'yellow':
        return { icon: FiAlertTriangle, color: '#fcc419' };
      case 'green':
        return { icon: FiCheckCircle, color: '#51cf66' };
    }
  };

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
          <Text color="text.muted">Loading users...</Text>
        </VStack>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box
        bg="surface.card"
        borderRadius="xl"
        p={10}
        borderWidth="1px"
        borderColor="surface.border"
        textAlign="center"
      >
        <VStack gap={3}>
          <Icon as={FiAlertCircle} boxSize={12} color="text.muted" />
          <Text fontSize="lg" fontWeight="500" color="text.primary">
            No users found
          </Text>
          <Text color="text.muted">
            Add your first user to get started
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      bg="surface.card"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="surface.border"
      overflow="hidden"
    >
      {/* Table */}
      <Box overflowX="auto">
        <Table.Root size="md">
          <Table.Header>
            <Table.Row bg="surface.elevated">
              <Table.ColumnHeader
                color="text.secondary"
                fontWeight="600"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                py={4}
                px={4}
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="text.secondary"
                fontWeight="600"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                py={4}
              >
                Name
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="text.secondary"
                fontWeight="600"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                py={4}
              >
                Zip Code
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="text.secondary"
                fontWeight="600"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                py={4}
              >
                Location
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="text.secondary"
                fontWeight="600"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                py={4}
              >
                Timezone
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="text.secondary"
                fontWeight="600"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                py={4}
              >
                Manual Score
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="text.secondary"
                fontWeight="600"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                py={4}
              >
                Data Quality
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="text.secondary"
                fontWeight="600"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                py={4}
                textAlign="right"
              >
                Actions
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user) => {
              const rowIcon = getRowIcon(user);
              return (
                <Table.Row
                  key={user.id}
                  bg={getRowBackgroundColor(user)}
                  _hover={{ bg: 'surface.elevated' }}
                  transition="background 0.2s"
                >
                  <Table.Cell py={4} px={4}>
                    <Icon as={rowIcon.icon} color={rowIcon.color} boxSize={5} />
                  </Table.Cell>
                  <Table.Cell py={4}>
                    <Text fontWeight="500" color="text.primary">
                      {user.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell py={4}>
                    <Text fontFamily="mono" color="text.secondary">
                      {user.zip_code}
                    </Text>
                  </Table.Cell>
                  <Table.Cell py={4}>
                    {user.latitude && user.longitude ? (
                      <HStack gap={1} color="text.secondary">
                        <Icon as={FiMapPin} boxSize={4} />
                        <Text fontSize="sm" fontFamily="mono">
                          {user.latitude.toFixed(2)}, {user.longitude.toFixed(2)}
                        </Text>
                      </HStack>
                    ) : (
                      <Text fontSize="sm" color="text.muted">—</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell py={4}>
                    {user.time_zone ? (
                      <HStack gap={1} color="text.secondary">
                        <Icon as={FiClock} boxSize={4} />
                        <Text fontSize="sm" fontFamily="mono">
                          {user.time_zone}
                        </Text>
                      </HStack>
                    ) : (
                      <Text fontSize="sm" color="text.muted">—</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell py={4}>
                    <ScoreInput
                      value={user.manual_score}
                      onSave={(score) => onUpdateScore(user.id, score)}
                      isLoading={isUpdatingScore}
                    />
                  </Table.Cell>
                  <Table.Cell py={4}>
                    <DataQualityBadge score={user.data_quality_score} />
                  </Table.Cell>
                  <Table.Cell py={4} textAlign="right">
                    <HStack gap={1} justify="flex-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(user)}
                        color="text.muted"
                        _hover={{ color: 'text.primary', bg: 'surface.elevated' }}
                      >
                        <Icon as={FiEdit2} boxSize={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(user)}
                        color="text.muted"
                        _hover={{ color: 'red.400', bg: 'rgba(255, 107, 107, 0.1)' }}
                      >
                        <Icon as={FiTrash2} boxSize={4} />
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Pagination */}
      <HStack
        justify="space-between"
        p={4}
        borderTopWidth="1px"
        borderColor="surface.border"
      >
        <Text fontSize="sm" color="text.muted">
          Showing {startRecord}-{endRecord} of {total} users
        </Text>
        <HStack gap={2}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            color="text.secondary"
            _hover={{ bg: 'surface.elevated' }}
          >
            <Icon as={FiChevronLeft} mr={1} />
            Previous
          </Button>
          <HStack gap={1}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={page === pageNum ? 'solid' : 'ghost'}
                  bg={page === pageNum ? 'brand.500' : 'transparent'}
                  color={page === pageNum ? 'white' : 'text.secondary'}
                  _hover={{
                    bg: page === pageNum ? 'brand.600' : 'surface.elevated',
                  }}
                  onClick={() => onPageChange(pageNum)}
                  minW="32px"
                >
                  {pageNum}
                </Button>
              );
            })}
          </HStack>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            color="text.secondary"
            _hover={{ bg: 'surface.elevated' }}
          >
            Next
            <Icon as={FiChevronRight} ml={1} />
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

export default UserTable;
