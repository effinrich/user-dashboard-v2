import { useState, useRef, useEffect } from 'react';
import { 
  Input, 
  HStack, 
  IconButton, 
  Text, 
  Box,
  Spinner
} from '@chakra-ui/react';
import { FiCheck, FiX, FiEdit2 } from 'react-icons/fi';

interface ScoreInputProps {
  value: number;
  onSave: (value: number) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ScoreInput({ value, onSave, isLoading = false, disabled = false }: ScoreInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleStartEdit = () => {
    if (disabled || isLoading) return;
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(value.toString());
    setError(null);
  };

  const handleSave = async () => {
    const numValue = parseInt(inputValue, 10);
    
    if (isNaN(numValue)) {
      setError('Invalid number');
      return;
    }
    
    if (numValue < 0) {
      setError('Cannot be negative');
      return;
    }
    
    if (numValue > 100) {
      setError('Cannot exceed 100');
      return;
    }

    try {
      await onSave(numValue);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to save');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isLoading) {
    return (
      <HStack justify="center" minW="80px">
        <Spinner size="sm" color="brand.500" />
      </HStack>
    );
  }

  if (isEditing) {
    return (
      <Box>
        <HStack gap={1}>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(handleCancel, 200)}
            type="number"
            min={0}
            max={100}
            size="sm"
            width="60px"
            textAlign="center"
            bg="surface.elevated"
            borderColor={error ? 'red.500' : 'surface.border'}
            _focus={{
              borderColor: error ? 'red.500' : 'brand.500',
              boxShadow: error ? '0 0 0 1px #ff6b6b' : '0 0 0 1px #5c7cfa',
            }}
          />
          <IconButton
            aria-label="Save"
            size="xs"
            colorScheme="green"
            variant="ghost"
            onClick={handleSave}
          >
            <FiCheck />
          </IconButton>
          <IconButton
            aria-label="Cancel"
            size="xs"
            colorScheme="red"
            variant="ghost"
            onClick={handleCancel}
          >
            <FiX />
          </IconButton>
        </HStack>
        {error && (
          <Text fontSize="xs" color="red.400" mt={1}>
            {error}
          </Text>
        )}
      </Box>
    );
  }

  return (
    <HStack 
      gap={2} 
      cursor="pointer" 
      onClick={handleStartEdit}
      _hover={{ '& .edit-icon': { opacity: 1 } }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleStartEdit()}
    >
      <Text fontWeight="500" fontFamily="mono">
        {value}
      </Text>
      <Box 
        className="edit-icon" 
        opacity={0} 
        transition="opacity 0.2s"
        color="text.muted"
      >
        <FiEdit2 size={14} />
      </Box>
    </HStack>
  );
}

export default ScoreInput;
