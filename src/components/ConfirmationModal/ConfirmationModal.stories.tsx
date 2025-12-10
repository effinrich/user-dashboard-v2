import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { ConfirmationModal } from './ConfirmationModal';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Components/ConfirmationModal',
  component: ConfirmationModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['danger', 'warning', 'info'],
    },
    isLoading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationModal>;

// Wrapper component for interactive stories
function ModalWrapper({
  title,
  message,
  variant = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: {
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} colorScheme="blue">
        Open Modal
      </Button>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title={title}
        message={message}
        variant={variant}
        confirmText={confirmText}
        cancelText={cancelText}
        isLoading={isLoading}
      />
    </>
  );
}

export const DeleteConfirmation: Story = {
  render: () => (
    <ModalWrapper
      title="Delete User"
      message="Are you sure you want to delete John Doe? This action cannot be undone."
      variant="danger"
      confirmText="Delete"
    />
  ),
};

export const WarningConfirmation: Story = {
  render: () => (
    <ModalWrapper
      title="Reset Scores"
      message="This will reset all manual scores to 0. Are you sure you want to continue?"
      variant="warning"
      confirmText="Reset"
    />
  ),
};

export const InfoConfirmation: Story = {
  render: () => (
    <ModalWrapper
      title="Refresh Data"
      message="This will refresh all geo-location data for existing users. This may take a few minutes."
      variant="info"
      confirmText="Refresh"
    />
  ),
};

export const DangerOpen: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    title: 'Delete User',
    message: 'Are you sure you want to delete John Doe? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  },
};

export const WarningOpen: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    title: 'Warning',
    message: 'This action may have unintended consequences.',
    confirmText: 'Proceed',
    cancelText: 'Cancel',
    variant: 'warning',
  },
};

export const Loading: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    title: 'Delete User',
    message: 'Deleting user...',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    isLoading: true,
  },
};
