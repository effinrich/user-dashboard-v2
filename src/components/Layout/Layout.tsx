import { Box, Container, HStack, Text, Icon, VStack } from '@chakra-ui/react';
import { FiDatabase, FiGithub } from 'react-icons/fi';
import { isSupabaseConfigured } from '../../services/supabase';
import { isWeatherApiConfigured } from '../../services/weather';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const supabaseConfigured = isSupabaseConfigured();
  const weatherConfigured = isWeatherApiConfigured();

  return (
    <Box minH="100vh" bg="surface.bg">
      {/* Header */}
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={100}
        bg="surface.card"
        borderBottomWidth="1px"
        borderColor="surface.border"
        backdropFilter="blur(10px)"
      >
        <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }} py={4}>
          <HStack justify="space-between">
            <HStack gap={3}>
              <Box
                p={2}
                borderRadius="lg"
                bg="brand.500"
                color="white"
              >
                <Icon as={FiDatabase} boxSize={5} />
              </Box>
              <VStack align="start" gap={0}>
                <Text
                  fontSize="2xl"
                  fontWeight="700"
                  color="text.primary"
                  fontFamily="heading"
                >
                  Dashboard
                </Text>
                <Text fontSize="xs" color="text.muted">
                  Manage users with scoring system
                </Text>
              </VStack>
            </HStack>

            {/* Status Indicators */}
            <HStack gap={4}>
              <HStack gap={2}>
                <Box
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg={supabaseConfigured ? 'green.400' : 'orange.400'}
                />
                <Text fontSize="xs" color="text.muted">
                  {supabaseConfigured ? 'Supabase Connected' : 'Using Mock Data'}
                </Text>
              </HStack>
              <HStack gap={2}>
                <Box
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg={weatherConfigured ? 'green.400' : 'orange.400'}
                />
                <Text fontSize="xs" color="text.muted">
                  {weatherConfigured ? 'Weather API Ready' : 'Mock Geo Data'}
                </Text>
              </HStack>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box as="main" py={8}>
        <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        py={6}
        borderTopWidth="1px"
        borderColor="surface.border"
      >
        <Container maxW="container.xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="text.muted">
              © 2025 User Dashboard. Built with React, Chakra UI & Supabase.
            </Text>
            <HStack gap={4}>
              <Text fontSize="xs" color="text.muted">
                Data Quality Rubric: Complete (40pts) + Valid Zip (30pts) + Geo Lookup (30pts)
              </Text>
            </HStack>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
