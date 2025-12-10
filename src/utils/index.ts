import { User, ScoreColor, ValidationErrors, ScoreDistribution } from '../types';

/**
 * Calculate data quality score based on rubric:
 * - Complete data (all fields present): 40 points
 * - Valid zip code format (5 digits): 30 points
 * - Successful geo-lookup (lat/lng/timezone retrieved): 30 points
 */
export function calculateDataQualityScore(user: Partial<User>): number {
  let score = 0;

  // Complete data check (40 points)
  const hasCompleteName = user.name && user.name.trim().length > 0;
  const hasZipCode = user.zip_code && user.zip_code.trim().length > 0;
  if (hasCompleteName && hasZipCode) {
    score += 40;
  }

  // Valid zip code format (30 points)
  if (isValidZipCode(user.zip_code || '')) {
    score += 30;
  }

  // Successful geo-lookup (30 points)
  if (
    user.latitude !== null &&
    user.latitude !== undefined &&
    user.longitude !== null &&
    user.longitude !== undefined &&
    user.time_zone !== null &&
    user.time_zone !== undefined
  ) {
    score += 30;
  }

  return score;
}

/**
 * Validate zip code format (5 digits)
 */
export function isValidZipCode(zipCode: string): boolean {
  return /^\d{5}$/.test(zipCode.trim());
}

/**
 * Validate user form data
 */
export function validateUserForm(data: { name: string; zip_code: string; manual_score?: number }): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters';
  } else if (!/^[a-zA-Z\s\-']+$/.test(data.name.trim())) {
    errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }

  // Zip code validation
  if (!data.zip_code || data.zip_code.trim().length === 0) {
    errors.zip_code = 'Zip code is required';
  } else if (!isValidZipCode(data.zip_code)) {
    errors.zip_code = 'Zip code must be exactly 5 digits';
  }

  // Manual score validation
  if (data.manual_score !== undefined) {
    if (data.manual_score < 0) {
      errors.manual_score = 'Score cannot be negative';
    } else if (data.manual_score > 100) {
      errors.manual_score = 'Score cannot exceed 100';
    }
  }

  return errors;
}

/**
 * Get color based on score thresholds
 * 0-30: red, 31-70: yellow, 71-100: green
 */
export function getScoreColor(score: number): ScoreColor {
  if (score <= 30) return 'red';
  if (score <= 70) return 'yellow';
  return 'green';
}

/**
 * Get Chakra UI color scheme based on score
 */
export function getScoreColorScheme(score: number): string {
  const color = getScoreColor(score);
  switch (color) {
    case 'red':
      return 'red';
    case 'yellow':
      return 'orange';
    case 'green':
      return 'green';
    default:
      return 'gray';
  }
}

/**
 * Get background color for row based on combined average score
 */
export function getRowBackgroundColor(user: User): string {
  const combinedAverage = (user.manual_score + user.data_quality_score) / 2;
  const color = getScoreColor(combinedAverage);
  
  switch (color) {
    case 'red':
      return 'rgba(254, 178, 178, 0.3)'; // red.200 with opacity
    case 'yellow':
      return 'rgba(251, 211, 141, 0.3)'; // orange.200 with opacity
    case 'green':
      return 'rgba(154, 230, 180, 0.3)'; // green.200 with opacity
    default:
      return 'transparent';
  }
}

/**
 * Convert UTC offset (seconds) to timezone string
 */
export function formatTimezone(offsetSeconds: number): string {
  const hours = Math.floor(Math.abs(offsetSeconds) / 3600);
  const minutes = Math.floor((Math.abs(offsetSeconds) % 3600) / 60);
  const sign = offsetSeconds >= 0 ? '+' : '-';
  
  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }
  return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate dashboard statistics
 */
export function calculateDashboardStats(users: User[]): {
  averageManualScore: number;
  averageDataQualityScore: number;
  totalUsers: number;
  usersNeedingAttention: number;
} {
  if (users.length === 0) {
    return {
      averageManualScore: 0,
      averageDataQualityScore: 0,
      totalUsers: 0,
      usersNeedingAttention: 0,
    };
  }

  const totalManualScore = users.reduce((sum, user) => sum + user.manual_score, 0);
  const totalDataQualityScore = users.reduce((sum, user) => sum + user.data_quality_score, 0);
  
  const usersNeedingAttention = users.filter(user => {
    const combinedAverage = (user.manual_score + user.data_quality_score) / 2;
    return combinedAverage <= 30;
  }).length;

  return {
    averageManualScore: Math.round((totalManualScore / users.length) * 10) / 10,
    averageDataQualityScore: Math.round((totalDataQualityScore / users.length) * 10) / 10,
    totalUsers: users.length,
    usersNeedingAttention,
  };
}

/**
 * Calculate score distribution for charts
 */
export function calculateScoreDistribution(users: User[], scoreField: 'manual_score' | 'data_quality_score'): ScoreDistribution[] {
  const ranges = [
    { range: '0-10', min: 0, max: 10 },
    { range: '11-20', min: 11, max: 20 },
    { range: '21-30', min: 21, max: 30 },
    { range: '31-40', min: 31, max: 40 },
    { range: '41-50', min: 41, max: 50 },
    { range: '51-60', min: 51, max: 60 },
    { range: '61-70', min: 61, max: 70 },
    { range: '71-80', min: 71, max: 80 },
    { range: '81-90', min: 81, max: 90 },
    { range: '91-100', min: 91, max: 100 },
  ];

  return ranges.map(({ range, min, max }) => ({
    range,
    count: users.filter(user => {
      const score = user[scoreField];
      return score >= min && score <= max;
    }).length,
  }));
}

/**
 * Debounce function for input handling
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a UUID (for local development without Supabase)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
