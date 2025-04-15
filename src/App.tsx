import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { WeatherCard } from '@/components/WeatherCard';
import { useWeather } from '@/hooks/useWeather';
import axios from 'axios';

interface CitySuggestion {
  name: string;
  country: string;
}

const suggestionCache: Record<string, CitySuggestion[]> = {};

function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [invalidCity, setInvalidCity] = useState(false);
  const { data, loading, error, getWeather } = useWeather();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getWeather('Kyiv');
  }, []);

  const fetchCitySuggestions = async (query: string) => {
    if (!query) return;

    if (suggestionCache[query.toLowerCase()]) {
      setSuggestions(suggestionCache[query.toLowerCase()]);
      return;
    }
    const a = 5
    console.log(a)

    try {
      const res = await axios.get(
        'https://api.openweathermap.org/geo/1.0/direct',
        {
          params: {
            q: query,
            limit: 5,
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
          },
        },
      );

      const result: CitySuggestion[] = res.data.map((item: any) => ({
        name: item.name,
        country: item.country,
      }));

      suggestionCache[query.toLowerCase()] = result;
      setSuggestions(result);
    } catch (e) {
      console.error('Error fetching suggestions:', e);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    setShowSuggestions(true);
    setInvalidCity(false);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchCitySuggestions(value);
    }, 400);
  };

  const handleSuggestionSelect = (suggestion: CitySuggestion) => {
    const full = `${suggestion.name}`;
    setCity(full);
    getWeather(full);
    setShowSuggestions(false);
    setInvalidCity(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length,
      );
    } else if (e.key === 'Enter') {
      if (suggestions[highlightIndex]) {
        handleSuggestionSelect(suggestions[highlightIndex]);
      } else {
        const matched = suggestions.find(
          (s) => s.name.toLowerCase() === city.toLowerCase(),
        );
        if (matched) {
          handleSuggestionSelect(matched);
        } else {
          setInvalidCity(true);
        }
      }
      setShowSuggestions(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="space-y-4 w-full max-w-md">
        <div className="relative">
          <Input
            className="text-sm py-2 px-3"
            placeholder="Enter city"
            value={city}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {invalidCity && (
            <p className="text-sm text-red-500 mt-1">
              City not found. Please select from suggestions.
            </p>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full mt-1 w-full bg-white border z-10 text-sm rounded shadow-md">
              {suggestions.map((s, index) => (
                <li
                  key={`${s.name}-${index}`}
                  onClick={() => handleSuggestionSelect(s)}
                  className={`cursor-pointer px-3 py-2 hover:bg-muted ${highlightIndex === index ? 'bg-muted' : ''}`}
                >
                  {s.name}, {s.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <WeatherCard data={data} loading={loading} error={error} />
      </div>
    </main>
  );
}

export default App;
