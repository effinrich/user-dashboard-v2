import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, UserFormData, GeoData } from '../types';
import { calculateDataQualityScore } from '../utils';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if credentials are available
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Mock data for development without Supabase
let mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    zip_code: '37643',
    latitude: 36.3134,
    longitude: -82.3534,
    time_zone: 'UTC-5',
    manual_score: 75,
    data_quality_score: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    zip_code: '90210',
    latitude: 34.0901,
    longitude: -118.4065,
    time_zone: 'UTC-8',
    manual_score: 45,
    data_quality_score: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    zip_code: '10001',
    latitude: 40.7484,
    longitude: -73.9967,
    time_zone: 'UTC-5',
    manual_score: 20,
    data_quality_score: 70,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Alice Brown',
    zip_code: '33139',
    latitude: 25.7907,
    longitude: -80.1300,
    time_zone: 'UTC-5',
    manual_score: 90,
    data_quality_score: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Charlie Davis',
    zip_code: '98101',
    latitude: 47.6062,
    longitude: -122.3321,
    time_zone: 'UTC-8',
    manual_score: 55,
    data_quality_score: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const TABLE_NAME = 'users';

/**
 * Fetch all users with pagination
 */
export async function fetchUsers(page: number = 1, pageSize: number = 10): Promise<{
  users: User[];
  total: number;
}> {
  // Use mock data if Supabase is not configured
  if (!supabase) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      users: mockUsers.slice(start, end),
      total: mockUsers.length,
    };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return {
    users: data || [],
    total: count || 0,
  };
}

/**
 * Fetch all users (no pagination) for statistics
 */
export async function fetchAllUsers(): Promise<User[]> {
  if (!supabase) {
    return mockUsers;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a new user
 */
export async function createUser(formData: UserFormData, geoData: GeoData | null): Promise<User> {
  const newUser: Omit<User, 'id' | 'created_at' | 'updated_at'> = {
    name: formData.name.trim(),
    zip_code: formData.zip_code.trim(),
    latitude: geoData?.latitude || null,
    longitude: geoData?.longitude || null,
    time_zone: geoData?.time_zone || null,
    manual_score: formData.manual_score || 0,
    data_quality_score: 0,
  };

  // Calculate data quality score
  newUser.data_quality_score = calculateDataQualityScore(newUser);

  // Use mock data if Supabase is not configured
  if (!supabase) {
    const mockUser: User = {
      ...newUser,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockUsers = [mockUser, ...mockUsers];
    return mockUser;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([newUser])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing user
 */
export async function updateUser(
  id: string,
  formData: Partial<UserFormData>,
  geoData: GeoData | null,
  zipCodeChanged: boolean
): Promise<User> {
  const updates: Partial<User> = {
    updated_at: new Date().toISOString(),
  };

  if (formData.name !== undefined) {
    updates.name = formData.name.trim();
  }

  if (formData.zip_code !== undefined) {
    updates.zip_code = formData.zip_code.trim();
  }

  if (formData.manual_score !== undefined) {
    updates.manual_score = formData.manual_score;
  }

  // Update geo data if zip code changed
  if (zipCodeChanged && geoData) {
    updates.latitude = geoData.latitude;
    updates.longitude = geoData.longitude;
    updates.time_zone = geoData.time_zone;
  } else if (zipCodeChanged && !geoData) {
    updates.latitude = null;
    updates.longitude = null;
    updates.time_zone = null;
  }

  // Use mock data if Supabase is not configured
  if (!supabase) {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...mockUsers[index], ...updates };
    updatedUser.data_quality_score = calculateDataQualityScore(updatedUser);
    mockUsers[index] = updatedUser;
    return updatedUser;
  }

  // Recalculate data quality score
  const { data: existingUser } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (existingUser) {
    const mergedUser = { ...existingUser, ...updates };
    updates.data_quality_score = calculateDataQualityScore(mergedUser);
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data;
}

/**
 * Update only the manual score for a user
 */
export async function updateManualScore(id: string, manual_score: number): Promise<User> {
  if (!supabase) {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    mockUsers[index] = { ...mockUsers[index], manual_score, updated_at: new Date().toISOString() };
    return mockUsers[index];
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ manual_score, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update manual score: ${error.message}`);
  }

  return data;
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<void> {
  if (!supabase) {
    mockUsers = mockUsers.filter(u => u.id !== id);
    return;
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
