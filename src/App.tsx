import { useState } from 'react';
import { Box, Button, HStack, Icon, VStack, Text } from '@chakra-ui/react';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import {
  Layout,
  UserTable,
  AddUserModal,
  EditUserModal,
  ConfirmationModal,
  RubricDashboard,
} from './components';
import { useUsers, useAllUsers, useUpdateManualScore, useDeleteUser } from './hooks';
import { User } from './types';

function App() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Queries and mutations
  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useUsers(page, pageSize);
  const { data: allUsers, isLoading: isLoadingAllUsers, refetch: refetchAllUsers } = useAllUsers();
  const updateScoreMutation = useUpdateManualScore();
  const deleteUserMutation = useDeleteUser();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleUpdateScore = async (id: string, score: number) => {
    await updateScoreMutation.mutateAsync({ id, manual_score: score });
  };

  const handleRefresh = () => {
    refetchUsers();
    refetchAllUsers();
  };

  return (
    <Layout>
      <VStack gap={8} align="stretch">
        {/* Page Header */}
        <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
          <VStack align="start" gap={1}>
            <Text
              fontSize="3xl"
              fontWeight="700"
              color="text.primary"
              fontFamily="heading"
            >
              Users
            </Text>
            <Text color="text.muted">
              Manage your users and track their scores
            </Text>
          </VStack>
          <HStack gap={3}>
            <Button
              variant="ghost"
              onClick={handleRefresh}
              color="text.secondary"
              _hover={{ bg: 'surface.elevated' }}
              px={4}
              py={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <Icon as={FiRefreshCw} />
              <span>Refresh</span>
            </Button>
            <Button
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              onClick={() => setIsAddModalOpen(true)}
              px={5}
              py={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <Icon as={FiPlus} />
              <span>Add User</span>
            </Button>
          </HStack>
        </HStack>

        {/* Rubric Dashboard */}
        <RubricDashboard
          users={allUsers || []}
          isLoading={isLoadingAllUsers}
        />

        {/* User Table Section */}
        <Box>
          <Text
            fontSize="xl"
            fontWeight="700"
            color="text.primary"
            fontFamily="heading"
            mb={4}
          >
            User Directory
          </Text>
          <UserTable
            users={usersData?.users || []}
            total={usersData?.total || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onUpdateScore={handleUpdateScore}
            isLoading={isLoadingUsers}
            isUpdatingScore={updateScoreMutation.isPending}
          />
        </Box>
      </VStack>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteUserMutation.isPending}
        variant="danger"
      />
    </Layout>
  );
}

export default App;
