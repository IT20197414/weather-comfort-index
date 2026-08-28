import {
  calculateTemperatureScore,
  calculateHumidityScore,
  calculateWindScore,
  calculateCloudinessScore,
  calculatePressureScore,
  calculateVisibilityScore,
  computeComfortIndex,
} from './comfort-index';
import { OpenWeatherRawResponse } from './types';

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  durationMs: number;
}

export function runAllComfortIndexTests(): {
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
} {
  const results: TestResult[] = [];

  function assert(
    suite: string,
    name: string,
    condition: boolean,
    expected: string,
    actual: string,
    startTime: number
  ) {
    results.push({
      suite,
      name,
      passed: condition,
      expected,
      actual,
      durationMs: Math.round((performance.now() - startTime) * 100) / 100,
    });
  }

  // Suite 1: Temperature Score Tests
  {
    const t0 = performance.now();
    const score22 = calculateTemperatureScore(22.0);
    assert(
      'Temperature Formula',
      'Ideal temperature (22°C) scores exactly 100',
      score22 === 100,
      '100',
      `${score22}`,
      t0
    );

    const t1 = performance.now();
    const score18 = calculateTemperatureScore(18.0);
    assert(
      'Temperature Formula',
      'Mild temperature (18°C) scores high (>80)',
      score18 >= 80 && score18 < 100,
      '80 - 99',
      `${score18}`,
      t1
    );

    const t2 = performance.now();
    const scoreExtremeHeat = calculateTemperatureScore(42.0);
    assert(
      'Temperature Formula',
      'Extreme heat (42°C) receives heavy penalty (<10)',
      scoreExtremeHeat < 10,
      '< 10',
      `${scoreExtremeHeat}`,
      t2
    );

    const t3 = performance.now();
    const scoreExtremeCold = calculateTemperatureScore(-10.0);
    assert(
      'Temperature Formula',
      'Sub-zero freezing (-10°C) receives heavy penalty (<5)',
      scoreExtremeCold < 5,
      '< 5',
      `${scoreExtremeCold}`,
      t3
    );
  }

  // Suite 2: Humidity Score Tests
  {
    const t0 = performance.now();
    const score50 = calculateHumidityScore(50);
    assert(
      'Humidity Formula',
      'Ideal humidity (50%) scores 100',
      score50 === 100,
      '100',
      `${score50}`,
      t0
    );

    const t1 = performance.now();
    const scoreHighHumidity = calculateHumidityScore(95);
    assert(
      'Humidity Formula',
      'Severe tropical humidity (95%) is penalized (<30)',
      scoreHighHumidity < 30,
      '< 30',
      `${scoreHighHumidity}`,
      t1
    );

    const t2 = performance.now();
    const scoreLowHumidity = calculateHumidityScore(15);
    assert(
      'Humidity Formula',
      'Arid dry air (15%) is penalized (<40)',
      scoreLowHumidity < 40,
      '< 40',
      `${scoreLowHumidity}`,
      t2
    );
  }

  // Suite 3: Wind Speed Score Tests
  {
    const t0 = performance.now();
    const scoreBreeze = calculateWindScore(2.5);
    assert(
      'Wind Speed Formula',
      'Gentle refreshing breeze (2.5 m/s) scores 100',
      scoreBreeze === 100,
      '100',
      `${scoreBreeze}`,
      t0
    );

    const t1 = performance.now();
    const scoreStagnant = calculateWindScore(0.0);
    assert(
      'Wind Speed Formula',
      'Stagnant windless air (0 m/s) scores 70 baseline',
      scoreStagnant === 70,
      '70',
      `${scoreStagnant}`,
      t1
    );

    const t2 = performance.now();
    const scoreGale = calculateWindScore(12.0);
    assert(
      'Wind Speed Formula',
      'Strong gale force wind (12 m/s) receives heavy penalty (<10)',
      scoreGale < 10,
      '< 10',
      `${scoreGale}`,
      t2
    );
  }

  // Suite 4: Pressure & Visibility Tests
  {
    const t0 = performance.now();
    const scorePressureStd = calculatePressureScore(1013.25);
    assert(
      'Barometric Pressure',
      'Standard sea level pressure (1013.25 hPa) scores 100',
      scorePressureStd === 100,
      '100',
      `${scorePressureStd}`,
      t0
    );

    const t1 = performance.now();
    const scoreVisClear = calculateVisibilityScore(10000);
    assert(
      'Atmospheric Visibility',
      'Full visibility (10,000m) scores 100',
      scoreVisClear === 100,
      '100',
      `${scoreVisClear}`,
      t1
    );
  }

  // Suite 5: Composite Comfort Index Bounds & Validation
  {
    const t0 = performance.now();
    const mockOptimalWeather: OpenWeatherRawResponse = {
      id: 99999,
      name: 'Utopia City',
      cod: 200,
      coord: { lon: 0, lat: 0 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      base: 'stations',
      main: {
        temp: 295.15, // 22°C
        feels_like: 295.15,
        temp_min: 294.15,
        temp_max: 296.15,
        pressure: 1013.25,
        humidity: 50,
      },
      visibility: 10000,
      wind: { speed: 2.5, deg: 180 },
      clouds: { all: 30 },
      dt: 1700000000,
      sys: { country: 'UT', sunrise: 1700000000, sunset: 1700045000 },
      timezone: 0,
    };

    const breakdown = computeComfortIndex(mockOptimalWeather);
    assert(
      'Composite Comfort Index',
      'Optimal weather conditions yield near-perfect score (>= 98)',
      breakdown.compositeScore >= 98 && breakdown.compositeScore <= 100,
      '98 - 100',
      `${breakdown.compositeScore}`,
      t0
    );

    const t1 = performance.now();
    const mockHarshWeather: OpenWeatherRawResponse = {
      id: 99998,
      name: 'Harsh Zone',
      cod: 200,
      coord: { lon: 0, lat: 0 },
      weather: [{ id: 500, main: 'Rain', description: 'monsoon storm', icon: '10d' }],
      base: 'stations',
      main: {
        temp: 318.15, // 45°C
        feels_like: 325.15,
        temp_min: 316.15,
        temp_max: 320.15,
        pressure: 980,
        humidity: 98,
      },
      visibility: 2000,
      wind: { speed: 18.0, deg: 270 },
      clouds: { all: 100 },
      dt: 1700000000,
      sys: { country: 'HZ', sunrise: 1700000000, sunset: 1700045000 },
      timezone: 0,
    };

    const harshBreakdown = computeComfortIndex(mockHarshWeather);
    assert(
      'Composite Comfort Index',
      'Severe weather receives harsh rating (<25)',
      harshBreakdown.compositeScore < 25 && harshBreakdown.rating === 'Harsh',
      '< 25 (Harsh)',
      `${harshBreakdown.compositeScore} (${harshBreakdown.rating})`,
      t1
    );

    const t2 = performance.now();
    assert(
      'Composite Comfort Index',
      'Score is always strictly bounded within [0, 100]',
      breakdown.compositeScore >= 0 &&
        breakdown.compositeScore <= 100 &&
        harshBreakdown.compositeScore >= 0 &&
        harshBreakdown.compositeScore <= 100,
      '0 <= Score <= 100',
      `Optimal: ${breakdown.compositeScore}, Harsh: ${harshBreakdown.compositeScore}`,
      t2
    );
  }

  const passed = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    results,
  };
}

// Support CLI node:test runner
if (process.argv[1]?.includes('comfort-index.test')) {
  console.log('🧪 Running Comfort Index Unit Test Suite...');
  const outcome = runAllComfortIndexTests();
  console.table(outcome.results.map(r => ({ Suite: r.suite, Test: r.name, Status: r.passed ? '✅ PASS' : '❌ FAIL', Duration: `${r.durationMs}ms` })));
  console.log(`\nSummary: ${outcome.passed}/${outcome.total} passed (${outcome.failed} failed)\n`);
  if (outcome.failed > 0) process.exit(1);
}
