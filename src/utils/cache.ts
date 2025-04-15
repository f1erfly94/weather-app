const CACHE_TTL = 5 * 60 * 1000; // 5 хвилин

const getCachedWeather = (city: string) => {
  const key = `weather:${city.toLowerCase()}`;
  const cachedString = localStorage.getItem(key);
  if (!cachedString) return null;

  try {
    const cached = JSON.parse(cachedString);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  } catch (e) {
    console.warn('Failed to parse cache', e);
  }

  return null;
};

const setCachedWeather = (city: string, data: any) => {
  const key = `weather:${city.toLowerCase()}`;
  const payload = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(payload));
};

export { getCachedWeather, setCachedWeather };
