import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FiEdit2, FiX } from 'react-icons/fi';
import { UserForm } from '../UserForm';
import { User, UserFormData, GeoData } from '../../types';
import { useUpdateUser, useGeoData } from '../../hooks';
import { isValidZipCode } from '../../utils';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess?: () => void;
}

export function EditUserModal({ isOpen, onClose, user, onSuccess }: EditUserModalProps) {
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (formData: UserFormData, geoData: GeoData | null) => {
    if (!user) return;

    const zipCodeChanged = formData.zip_code !== user.zip_code;

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        formData,
        geoData: zipCodeChanged ? geoData : null,
        zipCodeChanged,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleFormSubmit = () => {
    const form = document.getElementById('edit-user-form') as HTMLFormElement;
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  if (!isOpen || !user) return null;

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
              bg="accent.violet"
              color="white"
            >
              <Icon as={FiEdit2} boxSize={5} />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="lg" fontWeight="600" color="text.primary">
                Edit User
              </Text>
              <Text fontSize="sm" color="text.muted">
                Update user information
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
            initialData={{
              name: user.name,
              zip_code: user.zip_code,
              manual_score: user.manual_score,
            }}
            onSubmit={handleSubmit}
            isSubmitting={updateUserMutation.isPending}
            submitButtonId="edit-user-form"
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
            disabled={updateUserMutation.isPending}
            color="text.secondary"
            _hover={{ bg: 'surface.elevated' }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            bg="accent.violet"
            _hover={{ bg: '#7048e8' }}
            onClick={handleFormSubmit}
            loading={updateUserMutation.isPending}
          >
            Save Changes
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}

export default EditUserModal;
