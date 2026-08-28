export interface CityDefinition {
  id: number;
  name: string;
  country: string;
  coord?: {
    lat: number;
    lon: number;
  };
}

export interface OpenWeatherRawResponse {
  id: number;
  name: string;
  cod: number | string;
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number; // Kelvin
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number; // hPa
    humidity: number; // %
    sea_level?: number;
    grnd_level?: number;
  };
  visibility?: number; // meters
  wind: {
    speed: number; // m/s
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number; // %
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
}

export interface ComfortScoreBreakdown {
  temperatureScore: number; // 0-100
  humidityScore: number;    // 0-100
  windScore: number;        // 0-100
  cloudinessScore: number;  // 0-100
  pressureScore: number;    // 0-100
  visibilityScore: number;  // 0-100
  compositeScore: number;   // 0-100
  rating: 'Optimal' | 'Pleasant' | 'Moderate' | 'Uncomfortable' | 'Harsh';
  description: string;
  weights: {
    temperature: number;
    humidity: number;
    wind: number;
    cloudiness: number;
    pressure: number;
    visibility: number;
  };
}

export interface ProcessedCityWeather {
  id: number;
  name: string;
  country: string;
  weatherDescription: string;
  weatherMain: string;
  weatherIcon: string;
  temperatureKelvin: number;
  temperatureCelsius: number;
  temperatureFahrenheit: number;
  feelsLikeCelsius: number;
  feelsLikeFahrenheit: number;
  tempMinCelsius: number;
  tempMaxCelsius: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  clouds: number;
  pressure: number;
  visibilityKm: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  comfortScore: number; // 0-100
  comfortBreakdown: ComfortScoreBreakdown;
  rankPosition: number; // 1 = Most comfortable
  lastUpdated: string;
  cacheSource?: 'HIT' | 'MISS';
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number; // ms
  ttlMs: number;     // ms
  key: string;
}

export interface CacheStats {
  rawCache: {
    totalEntries: number;
    hits: number;
    misses: number;
    hitRatio: number;
    keys: Array<{ key: string; ageSeconds: number; ttlRemainingSeconds: number }>;
  };
  processedCache: {
    totalEntries: number;
    hits: number;
    misses: number;
    hitRatio: number;
    lastComputed: string | null;
  };
  totalRequests: number;
  ttlSeconds: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'candidate' | 'evaluator';
  mfaVerified: boolean;
  whitelisted: boolean;
}
