import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Text,
  Spinner,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FiMapPin, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { UserFormData, ValidationErrors, GeoData } from '../../types';
import { validateUserForm, isValidZipCode } from '../../utils';
import { useGeoData } from '../../hooks';

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData, geoData: GeoData | null) => void;
  isSubmitting?: boolean;
  submitButtonId?: string;
}

export function UserForm({ 
  initialData, 
  onSubmit, 
  isSubmitting = false,
  submitButtonId 
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.name || '',
    zip_code: initialData?.zip_code || '',
    manual_score: initialData?.manual_score || 0,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Fetch geo data when zip code is valid
  const shouldFetchGeo = isValidZipCode(formData.zip_code);
  const { data: geoData, isLoading: isGeoLoading, error: geoError } = useGeoData(
    formData.zip_code,
    shouldFetchGeo
  );

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        zip_code: initialData.zip_code || '',
        manual_score: initialData.manual_score || 0,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof UserFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    const validationErrors = validateUserForm(formData);
    if (validationErrors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ 
        ...prev, 
        [field]: validationErrors[field as keyof ValidationErrors] 
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateUserForm(formData);
    setErrors(validationErrors);
    setTouched({ name: true, zip_code: true });
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData, geoData || null);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} id={submitButtonId}>
      <VStack gap={5} align="stretch">
        {/* Name Field */}
        <Box>
          <Text mb={2} fontWeight="500" color="text.secondary" fontSize="sm">
            Name
          </Text>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Enter user name"
            bg="surface.elevated"
            borderColor={touched.name && errors.name ? 'red.500' : 'surface.border'}
            _hover={{ borderColor: 'brand.400' }}
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px #5c7cfa',
            }}
            _placeholder={{ color: 'text.muted' }}
          />
          {touched.name && errors.name && (
            <Text fontSize="sm" color="red.400" mt={1}>
              {errors.name}
            </Text>
          )}
        </Box>

        {/* Zip Code Field */}
        <Box>
          <Text mb={2} fontWeight="500" color="text.secondary" fontSize="sm">
            Zip Code
          </Text>
          <Input
            value={formData.zip_code}
            onChange={(e) => handleChange('zip_code', e.target.value.replace(/\D/g, '').slice(0, 5))}
            onBlur={() => handleBlur('zip_code')}
            placeholder="Enter 5-digit zip code"
            maxLength={5}
            bg="surface.elevated"
            borderColor={touched.zip_code && errors.zip_code ? 'red.500' : 'surface.border'}
            _hover={{ borderColor: 'brand.400' }}
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px #5c7cfa',
            }}
            _placeholder={{ color: 'text.muted' }}
          />
          {touched.zip_code && errors.zip_code && (
            <Text fontSize="sm" color="red.400" mt={1}>
              {errors.zip_code}
            </Text>
          )}
        </Box>

        {/* Geo Data Preview */}
        {shouldFetchGeo && (
          <Box
            p={4}
            bg="surface.elevated"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="surface.border"
          >
            <Text fontWeight="500" color="text.secondary" fontSize="sm" mb={3}>
              Location Data Preview
            </Text>
            
            {isGeoLoading && (
              <HStack gap={2} color="text.muted">
                <Spinner size="sm" />
                <Text fontSize="sm">Fetching location data...</Text>
              </HStack>
            )}
            
            {geoError && (
              <HStack gap={2} color="red.400">
                <Icon as={FiAlertCircle} />
                <Text fontSize="sm">
                  {geoError instanceof Error ? geoError.message : 'Failed to fetch location'}
                </Text>
              </HStack>
            )}
            
            {geoData && !isGeoLoading && (
              <VStack align="stretch" gap={2}>
                <HStack gap={2} color="green.400">
                  <Icon as={FiCheckCircle} />
                  <Text fontSize="sm">Location found</Text>
                </HStack>
                <HStack gap={4} flexWrap="wrap">
                  <HStack gap={1} color="text.secondary">
                    <Icon as={FiMapPin} boxSize={4} />
                    <Text fontSize="sm" fontFamily="mono">
                      {geoData.latitude.toFixed(4)}, {geoData.longitude.toFixed(4)}
                    </Text>
                  </HStack>
                  <HStack gap={1} color="text.secondary">
                    <Icon as={FiClock} boxSize={4} />
                    <Text fontSize="sm" fontFamily="mono">
                      {geoData.time_zone}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            )}
          </Box>
        )}

        {/* Hidden submit button for form submission via external button */}
        <input type="submit" hidden disabled={isSubmitting} />
      </VStack>
    </Box>
  );
}

export default UserForm;
