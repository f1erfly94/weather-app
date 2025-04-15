import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  data: any;
  loading: boolean;
  error: string | null;
}

export const WeatherCard = ({ data, loading, error }: Props) => {
  if (loading) return <Skeleton className="w-full h-48 rounded-xl" />;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!data) return null;

  const { name, main, weather, dt } = data;

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6 flex flex-col items-center space-y-3 text-center">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-muted-foreground capitalize">
          {weather[0].description}
        </p>
        <img
          src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
          alt="weather icon"
          width={80}
          height={80}
        />
        <p className="text-3xl font-bold">{Math.round(main.temp)}°C</p>
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date(dt * 1000).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};
