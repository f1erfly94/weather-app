import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherCard } from '@/components/WeatherCard';

test('displays city and temperature', () => {
  const mockData = {
    name: 'Kyiv',
    main: { temp: 15 },
    weather: [{ description: 'clear sky', icon: '01d' }],
    dt: Math.floor(Date.now() / 1000),
  };

  render(<WeatherCard data={mockData} loading={false} error={null} />);

  expect(screen.getByText('Kyiv')).toBeInTheDocument();
  expect(screen.getByText(/15°C/)).toBeInTheDocument();
  expect(screen.getByText(/clear sky/)).toBeInTheDocument();
});
