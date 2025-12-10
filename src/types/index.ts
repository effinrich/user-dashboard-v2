// User type matching Supabase schema
export interface User {
  id: string;
  name: string;
  zip_code: string;
  latitude: number | null;
  longitude: number | null;
  time_zone: string | null;
  manual_score: number;
  data_quality_score: number;
  created_at?: string;
  updated_at?: string;
}

// Form data for creating/updating users
export interface UserFormData {
  name: string;
  zip_code: string;
  manual_score?: number;
}

// Geo data from OpenWeatherMap API
export interface GeoData {
  latitude: number;
  longitude: number;
  time_zone: string;
}

// OpenWeatherMap API response
export interface WeatherApiResponse {
  coord: {
    lon: number;
    lat: number;
  };
  timezone: number; // UTC offset in seconds
  name: string;
}

// Score distribution data for charts
export interface ScoreDistribution {
  range: string;
  count: number;
}

// Dashboard statistics
export interface DashboardStats {
  averageManualScore: number;
  averageDataQualityScore: number;
  totalUsers: number;
  usersNeedingAttention: number;
  manualScoreDistribution: ScoreDistribution[];
  dataQualityScoreDistribution: ScoreDistribution[];
}

// Color coding thresholds
export type ScoreColor = 'red' | 'yellow' | 'green';

// Validation errors
export interface ValidationErrors {
  name?: string;
  zip_code?: string;
  manual_score?: string;
}

// API error response
export interface ApiError {
  message: string;
  code?: string;
}

// Pagination
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// Sort configuration
export interface SortConfig {
  field: keyof User;
  direction: 'asc' | 'desc';
}
