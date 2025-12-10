import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchUsers, 
  fetchAllUsers,
  createUser, 
  updateUser, 
  updateManualScore,
  deleteUser 
} from '../services/supabase';
import { fetchGeoData } from '../services/weather';
import { User, UserFormData, GeoData } from '../types';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...userKeys.lists(), { page, pageSize }] as const,
  allList: () => [...userKeys.all, 'all'] as const,
};

/**
 * Hook to fetch paginated users
 */
export function useUsers(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: userKeys.list(page, pageSize),
    queryFn: () => fetchUsers(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all users (for statistics)
 */
export function useAllUsers() {
  return useQuery({
    queryKey: userKeys.allList(),
    queryFn: fetchAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch geo data from zip code
 */
export function useGeoData(zipCode: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['geoData', zipCode],
    queryFn: () => fetchGeoData(zipCode),
    enabled: enabled && zipCode.length === 5,
    staleTime: 30 * 60 * 1000, // 30 minutes (geo data doesn't change often)
    retry: 2,
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, geoData }: { formData: UserFormData; geoData: GeoData | null }) => {
      return createUser(formData, geoData);
    },
    onSuccess: () => {
      // Invalidate all user queries to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
      geoData,
      zipCodeChanged,
    }: {
      id: string;
      formData: Partial<UserFormData>;
      geoData: GeoData | null;
      zipCodeChanged: boolean;
    }) => {
      return updateUser(id, formData, geoData, zipCodeChanged);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * Hook to update manual score (inline editing)
 */
export function useUpdateManualScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, manual_score }: { id: string; manual_score: number }) => {
      return updateManualScore(id, manual_score);
    },
    // Optimistic update for better UX
    onMutate: async ({ id, manual_score }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.all });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(userKeys.allList());

      // Optimistically update
      queryClient.setQueryData(userKeys.allList(), (old: User[] | undefined) => {
        if (!old) return old;
        return old.map(user => 
          user.id === id ? { ...user, manual_score } : user
        );
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(userKeys.allList(), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
