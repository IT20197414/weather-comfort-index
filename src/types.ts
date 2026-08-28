export interface ComfortScoreBreakdown {
  temperatureScore: number;
  humidityScore: number;
  windScore: number;
  cloudinessScore: number;
  pressureScore: number;
  visibilityScore: number;
  compositeScore: number;
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
  comfortScore: number;
  comfortBreakdown: ComfortScoreBreakdown;
  rankPosition: number;
  lastUpdated: string;
  cacheSource?: 'HIT' | 'MISS';
}

export interface CacheTelemetry {
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

export type TempUnit = 'C' | 'F';

export type SortField = 'rank' | 'comfort' | 'temp' | 'name' | 'humidity' | 'wind';
export type SortOrder = 'asc' | 'desc';

export type ComfortFilter = 'ALL' | 'Optimal' | 'Pleasant' | 'Moderate' | 'Uncomfortable' | 'Harsh';

export interface TestResultItem {
  suite: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  durationMs: number;
}

export interface TestSuiteOutcome {
  executedAt: string;
  suite: string;
  total: number;
  passed: number;
  failed: number;
  results: TestResultItem[];
}
