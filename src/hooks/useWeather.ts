import { useState } from 'react';
import { getCachedWeather, setCachedWeather } from '@/utils/cache';
import { fetchWeather } from '@/api/api.ts';

export const useWeather = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeather = async (city: string) => {
    setError(null);
    setLoading(true);

    const cached = getCachedWeather(city);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    try {
      const result = await fetchWeather(city);
      setData(result);
      setCachedWeather(city, result);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getWeather };
};
