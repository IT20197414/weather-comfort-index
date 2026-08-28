import { ComfortScoreBreakdown, OpenWeatherRawResponse } from './types';

export interface ComfortWeights {
  temperature: number;
  humidity: number;
  wind: number;
  cloudiness: number;
  pressure: number;
  visibility: number;
}

export const DEFAULT_WEIGHTS: ComfortWeights = {
  temperature: 0.40,
  humidity: 0.25,
  wind: 0.15,
  cloudiness: 0.10,
  pressure: 0.05,
  visibility: 0.05,
};

/**
 * Calculates thermal comfort score (0-100) based on Celsius temperature.
 * Peak comfort is modeled at 22°C (71.6°F) using a Gaussian distribution (standard deviation = 6.5°C).
 */
export function calculateTemperatureScore(tempCelsius: number): number {
  const idealTemp = 22.0;
  const sigma = 6.5;
  const score = 100 * Math.exp(-Math.pow(tempCelsius - idealTemp, 2) / (2 * Math.pow(sigma, 2)));
  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Calculates humidity comfort score (0-100).
 * Ideal relative humidity is 45% - 55%. Penalizes muggy/sticky air (>60%) and dry air (<40%).
 */
export function calculateHumidityScore(humidityPercent: number): number {
  const h = Math.min(100, Math.max(0, humidityPercent));
  let score: number;
  if (h >= 40 && h <= 60) {
    score = 100 - Math.abs(h - 50) * 0.5;
  } else if (h < 40) {
    score = Math.max(0, 95 - 2.375 * (40 - h));
  } else {
    // h > 60
    score = Math.max(0, 95 - 2.125 * (h - 60));
  }
  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Calculates wind comfort score (0-100).
 * Ideal wind speed is a gentle breeze (2.0 - 3.5 m/s). Penalizes stagnation (<0.5 m/s) and high gusts (>8 m/s).
 */
export function calculateWindScore(windSpeedMs: number): number {
  const w = Math.max(0, windSpeedMs);
  let score: number;
  if (w <= 2.5) {
    // from 70 at calm (0 m/s) up to 100 at 2.5 m/s
    score = 70 + (w / 2.5) * 30;
  } else if (w <= 5.0) {
    // gentle decrease from 100 to 80
    score = 100 - ((w - 2.5) / 2.5) * 20;
  } else {
    // sharper penalty for strong winds
    score = Math.max(0, 80 - (w - 5.0) * 12);
  }
  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Calculates cloudiness comfort score (0-100).
 * Partly cloudy skies (20% - 40%) provide optimal lighting balance and reduced UV glare.
 */
export function calculateCloudinessScore(cloudsPercent: number): number {
  const c = Math.min(100, Math.max(0, cloudsPercent));
  // Peak at 30% cloudiness
  const distance = Math.abs(c - 30);
  const score = 100 - (distance / 70) * 30;
  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Calculates atmospheric pressure comfort score (0-100).
 * Standard barometric baseline is 1013.25 hPa. Deviations relate to weather instability / altitude stress.
 */
export function calculatePressureScore(pressureHpa: number): number {
  const standardPressure = 1013.25;
  const deviation = Math.abs(pressureHpa - standardPressure);
  const score = Math.max(0, 100 - (deviation / 30) * 40);
  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Calculates visibility score (0-100).
 * 10,000 meters (10 km) represents crystal-clear atmosphere.
 */
export function calculateVisibilityScore(visibilityMeters?: number): number {
  if (visibilityMeters === undefined || visibilityMeters === null) {
    return 85; // Default safe estimate if missing in standard payload
  }
  const v = Math.min(10000, Math.max(0, visibilityMeters));
  const score = (v / 10000) * 100;
  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Categorizes a numeric comfort score (0-100) into human-interpretable ratings and descriptions.
 */
export function getComfortRating(score: number): {
  rating: 'Optimal' | 'Pleasant' | 'Moderate' | 'Uncomfortable' | 'Harsh';
  description: string;
} {
  if (score >= 85) {
    return {
      rating: 'Optimal',
      description: 'Ideal thermal comfort with balanced humidity and gentle atmospheric conditions.',
    };
  } else if (score >= 70) {
    return {
      rating: 'Pleasant',
      description: 'Comfortable outdoor environment with mild, favorable conditions.',
    };
  } else if (score >= 50) {
    return {
      rating: 'Moderate',
      description: 'Noticeable heat, chill, or humidity; acceptable for most activities.',
    };
  } else if (score >= 35) {
    return {
      rating: 'Uncomfortable',
      description: 'Challenging weather with significant thermal stress or high humidity/wind.',
    };
  } else {
    return {
      rating: 'Harsh',
      description: 'Severe weather conditions requiring climate-controlled shelter.',
    };
  }
}

/**
 * Computes the complete Comfort Index score and breakdown for raw weather data.
 */
export function computeComfortIndex(
  weather: OpenWeatherRawResponse,
  customWeights?: Partial<ComfortWeights>
): ComfortScoreBreakdown {
  const weights: ComfortWeights = {
    ...DEFAULT_WEIGHTS,
    ...(customWeights || {}),
  };

  // Convert Kelvin to Celsius (OpenWeather raw temp is Kelvin)
  const tempCelsius = weather.main.temp - 273.15;
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind?.speed ?? 0;
  const cloudiness = weather.clouds?.all ?? 0;
  const pressure = weather.main.pressure ?? 1013.25;
  const visibility = weather.visibility;

  const temperatureScore = calculateTemperatureScore(tempCelsius);
  const humidityScore = calculateHumidityScore(humidity);
  const windScore = calculateWindScore(windSpeed);
  const cloudinessScore = calculateCloudinessScore(cloudiness);
  const pressureScore = calculatePressureScore(pressure);
  const visibilityScore = calculateVisibilityScore(visibility);

  // Normalize weights in case custom weights were provided
  const totalWeight =
    weights.temperature +
    weights.humidity +
    weights.wind +
    weights.cloudiness +
    weights.pressure +
    weights.visibility;

  const normalizedWeights: ComfortWeights = {
    temperature: weights.temperature / totalWeight,
    humidity: weights.humidity / totalWeight,
    wind: weights.wind / totalWeight,
    cloudiness: weights.cloudiness / totalWeight,
    pressure: weights.pressure / totalWeight,
    visibility: weights.visibility / totalWeight,
  };

  const compositeScoreRaw =
    temperatureScore * normalizedWeights.temperature +
    humidityScore * normalizedWeights.humidity +
    windScore * normalizedWeights.wind +
    cloudinessScore * normalizedWeights.cloudiness +
    pressureScore * normalizedWeights.pressure +
    visibilityScore * normalizedWeights.visibility;

  const compositeScore = Math.min(100, Math.max(0, Math.round(compositeScoreRaw * 10) / 10));
  const { rating, description } = getComfortRating(compositeScore);

  return {
    temperatureScore,
    humidityScore,
    windScore,
    cloudinessScore,
    pressureScore,
    visibilityScore,
    compositeScore,
    rating,
    description,
    weights: normalizedWeights,
  };
}
