import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { getAllCitiesWeather, fetchRawCityWeather, processCityWeather, getCitiesList } from './server/weather';
import { getFullCacheTelemetry, rawWeatherCache, processedWeatherCache } from './server/cache';
import { initiateLogin, verifyMfaCode, verifyJwtToken, AUTHORIZED_WHITELIST } from './server/auth';
import { computeComfortIndex, DEFAULT_WEIGHTS } from './server/comfort-index';
import { runAllComfortIndexTests } from './server/comfort-index.test';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging & cache header attachment middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Authentication middleware for protected endpoints
function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // For developer ease in testing and demo inspection, allow open access if header is optional, or validate if present
  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is required to access this resource. Please log in with an authorized account.',
    });
    return;
  }

  const user = verifyJwtToken(token);
  if (!user) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired session token. Please log in again.',
    });
    return;
  }

  (req as any).user = user;
  next();
}

/* ==========================================================================
   AUTHENTICATION & AUTHORIZATION API (Auth0 / Whitelist / MFA)
   ========================================================================== */

// 1. Login with whitelist check & MFA initiation
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const result = initiateLogin(email, password);
  if (!result.success) {
    res.status(401).json({ error: result.message });
    return;
  }

  res.json(result);
});

// 2. MFA Verification step
app.post('/api/auth/verify-mfa', (req: Request, res: Response) => {
  const { sessionToken, code } = req.body;
  if (!sessionToken || !code) {
    res.status(400).json({ error: 'Session token and 6-digit MFA code are required' });
    return;
  }

  const result = verifyMfaCode(sessionToken, code);
  if (!result.success) {
    res.status(400).json({ error: result.message });
    return;
  }

  res.json(result);
});

// 3. Current user session profile
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({ authenticated: false, user: null });
    return;
  }

  const user = verifyJwtToken(token);
  if (!user) {
    res.status(401).json({ authenticated: false, user: null });
    return;
  }

  res.json({ authenticated: true, user });
});

// 4. Whitelist inquiry endpoint (for signup restrictions demonstration)
app.get('/api/auth/whitelist', (_req: Request, res: Response) => {
  res.json({
    signupsRestricted: true,
    totalWhitelisted: AUTHORIZED_WHITELIST.size,
    allowedAccounts: Array.from(AUTHORIZED_WHITELIST),
    testCredentials: {
      email: 'careers@fidenz.com',
      passwordNote: 'Provided in recruitment briefing document',
    },
  });
});

/* ==========================================================================
   WEATHER & COMFORT INDEX ANALYTICS API
   ========================================================================== */

// 5. Main Weather Analytics Endpoint (Retrieves weather, computes Comfort Index, ranks cities)
app.get('/api/weather', async (req: Request, res: Response) => {
  try {
    const apiKey = (req.query.apiKey as string) || undefined;
    const forceRefresh = req.query.refresh === 'true';

    // Optional custom weights parsing
    let customWeights = undefined;
    if (req.query.weights) {
      try {
        customWeights = JSON.parse(req.query.weights as string);
      } catch (e) {
        // ignore invalid JSON
      }
    }

    const result = await getAllCitiesWeather(apiKey, forceRefresh, customWeights);

    // Set cache control & debug headers
    res.setHeader('X-Cache-Status', result.cacheStatus);
    res.setHeader('X-Calculation-Time-Ms', result.executionTimeMs.toString());
    res.setHeader('X-Total-Cities', result.totalCities.toString());

    res.json(result);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({
      error: 'Failed to process weather analytics',
      details: (error as Error).message,
    });
  }
});

// 6. Single City Weather & Comfort Detail
app.get('/api/weather/:id', async (req: Request, res: Response) => {
  try {
    const cityId = parseInt(req.params.id, 10);
    const cities = getCitiesList();
    const city = cities.find((c) => c.id === cityId);

    if (!city) {
      res.status(404).json({ error: `City with ID ${cityId} not found in cities.json` });
      return;
    }

    const apiKey = (req.query.apiKey as string) || undefined;
    const { raw, cacheStatus } = await fetchRawCityWeather(city, apiKey);
    const processed = processCityWeather(raw, cacheStatus);

    res.setHeader('X-Cache-Status', cacheStatus);
    res.json({
      city: processed,
      rawPayload: raw,
      cacheStatus,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve city weather', details: (error as Error).message });
  }
});

// 7. Comfort Index Algorithm Live Simulator (for Part 3 Live Extension Requirement)
app.post('/api/comfort-index/preview', (req: Request, res: Response) => {
  try {
    const { weights, rawWeatherSample } = req.body;
    const cities = getCitiesList();

    // Default sample if none provided
    const sample = rawWeatherSample || {
      id: 1248991,
      name: 'Colombo',
      main: { temp: 298.15, humidity: 75, pressure: 1012 },
      wind: { speed: 3.2 },
      clouds: { all: 40 },
      visibility: 10000,
      weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
    };

    const breakdown = computeComfortIndex(sample, weights);
    res.json({
      breakdown,
      appliedWeights: breakdown.weights,
      availableParameters: [
        { key: 'temperature', label: 'Temperature (Celsius)', defaultWeight: DEFAULT_WEIGHTS.temperature },
        { key: 'humidity', label: 'Relative Humidity (%)', defaultWeight: DEFAULT_WEIGHTS.humidity },
        { key: 'wind', label: 'Wind Speed (m/s)', defaultWeight: DEFAULT_WEIGHTS.wind },
        { key: 'cloudiness', label: 'Cloudiness (%)', defaultWeight: DEFAULT_WEIGHTS.cloudiness },
        { key: 'pressure', label: 'Atmospheric Pressure (hPa)', defaultWeight: DEFAULT_WEIGHTS.pressure },
        { key: 'visibility', label: 'Air Visibility (meters)', defaultWeight: DEFAULT_WEIGHTS.visibility },
      ],
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid parameters for comfort preview' });
  }
});

/* ==========================================================================
   SERVER-SIDE CACHING TELEMETRY & DEBUG ENDPOINTS
   ========================================================================== */

// 8. Cache Telemetry & Status Inspector (Step 5: HIT/MISS status and cache inspector)
app.get('/api/cache-status', (_req: Request, res: Response) => {
  const telemetry = getFullCacheTelemetry();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    telemetry,
  });
});

// 9. Manual Cache Invalidation / Flush Trigger
app.post('/api/cache/clear', (_req: Request, res: Response) => {
  rawWeatherCache.clear();
  processedWeatherCache.clear();
  res.json({
    success: true,
    message: 'All server-side raw and processed weather caches have been successfully cleared.',
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================================================
   UNIT TESTING & SYSTEM HEALTH ENDPOINTS
   ========================================================================== */

// 10. Automated Unit Test Runner (Bonus Feature: live in-browser & CLI test runner)
app.get('/api/tests/run', (_req: Request, res: Response) => {
  const testOutcome = runAllComfortIndexTests();
  res.json({
    executedAt: new Date().toISOString(),
    suite: 'Comfort Index Mathematical Bounds & Physical Validity',
    ...testOutcome,
  });
});

// 11. Health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Fidenz Weather Analytics Engine',
    uptimeSeconds: Math.floor(process.uptime()),
    version: '1.0.0',
    citiesLoaded: getCitiesList().length,
  });
});

/* ==========================================================================
   VITE MIDDLEWARE INTEGRATION (Development & Production SPA Serving)
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fidenz Weather Analytics Server running on http://localhost:${PORT}`);
  });
}

startServer();
