import axios from 'axios';
import { GeoData, WeatherApiResponse } from '../types';
import { formatTimezone } from '../utils';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Mock geo data for development
const mockGeoData: Record<string, GeoData> = {
  '37643': { latitude: 36.3134, longitude: -82.3534, time_zone: 'UTC-5' },
  '90210': { latitude: 34.0901, longitude: -118.4065, time_zone: 'UTC-8' },
  '10001': { latitude: 40.7484, longitude: -73.9967, time_zone: 'UTC-5' },
  '33139': { latitude: 25.7907, longitude: -80.1300, time_zone: 'UTC-5' },
  '98101': { latitude: 47.6062, longitude: -122.3321, time_zone: 'UTC-8' },
  '60601': { latitude: 41.8819, longitude: -87.6278, time_zone: 'UTC-6' },
  '02101': { latitude: 42.3601, longitude: -71.0589, time_zone: 'UTC-5' },
  '75201': { latitude: 32.7767, longitude: -96.7970, time_zone: 'UTC-6' },
  '85001': { latitude: 33.4484, longitude: -112.0740, time_zone: 'UTC-7' },
  '19101': { latitude: 39.9526, longitude: -75.1652, time_zone: 'UTC-5' },
};

/**
 * Fetch geo data (latitude, longitude, timezone) from OpenWeatherMap API
 */
export async function fetchGeoData(zipCode: string): Promise<GeoData> {
  // Use mock data if API key is not configured
  if (!API_KEY) {
    console.warn('OpenWeatherMap API key not configured. Using mock data.');
    
    // Check if we have mock data for this zip code
    if (mockGeoData[zipCode]) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockGeoData[zipCode];
    }
    
    // Generate random data for unknown zip codes
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      latitude: 35 + Math.random() * 10,
      longitude: -120 + Math.random() * 50,
      time_zone: 'UTC-5',
    };
  }

  try {
    const response = await axios.get<WeatherApiResponse>(BASE_URL, {
      params: {
        zip: `${zipCode},US`,
        appid: API_KEY,
      },
      timeout: 10000,
    });

    const { coord, timezone } = response.data;

    return {
      latitude: coord.lat,
      longitude: coord.lon,
      time_zone: formatTimezone(timezone),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Zip code not found in weather database');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection.');
      }
    }
    throw new Error('Failed to fetch geo data. Please try again.');
  }
}

/**
 * Check if OpenWeatherMap API is configured
 */
export function isWeatherApiConfigured(): boolean {
  return API_KEY !== '';
}
