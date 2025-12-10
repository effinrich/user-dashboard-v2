import { useRef } from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FiUserPlus, FiX } from 'react-icons/fi';
import { UserForm } from '../UserForm';
import { UserFormData, GeoData } from '../../types';
import { useCreateUser } from '../../hooks';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const createUserMutation = useCreateUser();

  const handleSubmit = async (formData: UserFormData, geoData: GeoData | null) => {
    try {
      await createUserMutation.mutateAsync({ formData, geoData });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleFormSubmit = () => {
    // Trigger form submission
    const form = document.getElementById('add-user-form') as HTMLFormElement;
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.700"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      onClick={onClose}
    >
      <Box
        bg="surface.card"
        borderRadius="xl"
        maxW="500px"
        w="90%"
        maxH="90vh"
        overflow="hidden"
        borderWidth="1px"
        borderColor="surface.border"
        boxShadow="xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <HStack
          justify="space-between"
          p={5}
          borderBottomWidth="1px"
          borderColor="surface.border"
        >
          <HStack gap={3}>
            <Box
              p={2}
              borderRadius="lg"
              bg="brand.500"
              color="white"
            >
              <Icon as={FiUserPlus} boxSize={5} />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="lg" fontWeight="600" color="text.primary">
                Add New User
              </Text>
              <Text fontSize="sm" color="text.muted">
                Fill in the details below
              </Text>
            </VStack>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            color="text.muted"
            _hover={{ color: 'text.primary', bg: 'surface.elevated' }}
          >
            <Icon as={FiX} boxSize={5} />
          </Button>
        </HStack>

        {/* Body */}
        <Box p={5} overflowY="auto" maxH="calc(90vh - 140px)">
          <UserForm
            onSubmit={handleSubmit}
            isSubmitting={createUserMutation.isPending}
            submitButtonId="add-user-form"
          />
        </Box>

        {/* Footer */}
        <HStack
          justify="flex-end"
          gap={3}
          p={5}
          borderTopWidth="1px"
          borderColor="surface.border"
        >
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={createUserMutation.isPending}
            color="text.secondary"
            _hover={{ bg: 'surface.elevated' }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            bg="brand.500"
            _hover={{ bg: 'brand.600' }}
            onClick={handleFormSubmit}
            loading={createUserMutation.isPending}
          >
            Add User
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}

export default AddUserModal;
