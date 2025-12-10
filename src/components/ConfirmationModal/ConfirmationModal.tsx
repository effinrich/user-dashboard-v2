import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantColors = {
    danger: {
      icon: '#ff6b6b',
      button: 'red',
    },
    warning: {
      icon: '#fcc419',
      button: 'orange',
    },
    info: {
      icon: '#339af0',
      button: 'blue',
    },
  };

  const colors = variantColors[variant];

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
        p={6}
        maxW="400px"
        w="90%"
        borderWidth="1px"
        borderColor="surface.border"
        boxShadow="xl"
        onClick={(e) => e.stopPropagation()}
      >
        <VStack gap={4} align="stretch">
          <HStack gap={3}>
            <Box
              p={2}
              borderRadius="full"
              bg={`${colors.icon}20`}
            >
              <Icon 
                as={FiAlertTriangle} 
                boxSize={6} 
                color={colors.icon} 
              />
            </Box>
            <Text fontSize="lg" fontWeight="600" color="text.primary">
              {title}
            </Text>
          </HStack>

          <Text color="text.secondary" pl={11}>
            {message}
          </Text>

          <HStack gap={3} justify="flex-end" pt={2}>
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              color="text.secondary"
              _hover={{ bg: 'surface.elevated' }}
            >
              {cancelText}
            </Button>
            <Button
              colorScheme={colors.button}
              onClick={onConfirm}
              loading={isLoading}
            >
              {confirmText}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

export default ConfirmationModal;
