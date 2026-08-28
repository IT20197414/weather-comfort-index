# Fidenz Technologies - Trainee Software Engineer Take-Home Assignment (Full Stack)

## Project Overview

A full-stack Weather Analytics & Comfort Index platform developed for Fidenz Technologies recruitment evaluation. The system retrieves meteorological data for global city codes from `cities.json` (via OpenWeatherMap API with server-side caching), processes the readings through a custom scientific **Comfort Index Algorithm (0-100)** on the backend, and delivers insights with sorting, ranking, interactive analytics, and multi-factor authentication (MFA).

---

## Key Deliverables Implemented

### 1. Weather Data Retrieval & Processing
- Reads city codes from `cities.json` (includes Colombo, London, Tokyo, Cairns, New York, Sydney, Paris, Singapore, Berlin, Dubai, Toronto, Auckland, Reykjavik, Nairobi, Honolulu, Mumbai).
- Fetches weather data via OpenWeatherMap 2.5 API with seamless fallback for testing environments.
- Computes Comfort Index on the **backend** (never client-side) and ranks from **"Most Comfortable" (#1)** to **"Least Comfortable"**.

### 2. Custom Comfort Index Formula & Rationale
The Comfort Index produces a normalized score between **0 and 100** based on biometeorological human thermal comfort principles:

$$ \text{Comfort Index} = \sum (w_i \times S_i) $$

#### Parameter Breakdown & Weights ($w_i$):
1. **Temperature Score (40% Weight):**
   - Ideal thermal neutrality is centered at **22.0°C (71.6°F)**.
   - Evaluated via Gaussian bell curve: $S_{\text{temp}} = 100 \times \exp\left(-\frac{(T - 22.0)^2}{2 \times 6.5^2}\right)$.
   - Prevents harsh step-function cliffs and models natural human homeostasis.
2. **Relative Humidity Score (25% Weight):**
   - Optimal human comfort zone: **45% - 55%**.
   - Penalizes sticky tropical mugginess ($>65\%$) and respiratory dryness ($<35\%$).
3. **Wind Speed & Airflow (15% Weight):**
   - Optimal zone: **2.0 - 3.5 m/s** (gentle refreshing breeze).
   - Penalizes stagnant unventilated air ($<0.5\text{ m/s}$) and gale turbulence ($>7.0\text{ m/s}$).
4. **Cloudiness & Sunlight Balance (10% Weight):**
   - Optimal zone: **20% - 40%** (partly cloudy sky filtering extreme UV glare while preserving brightness).
5. **Barometric Pressure (5% Weight):**
   - Standard sea-level baseline: **1013.25 hPa**. Deviations reflect storm instability or altitude stress.
6. **Atmospheric Visibility (5% Weight):**
   - Clear horizon ($10\text{ km} = 10,000\text{ m}$) yields maximum visibility comfort.

#### Rating Classification:
- **Optimal (85 - 100 pts):** Ideal thermal neutrality, balanced humidity, pleasant breeze.
- **Pleasant (70 - 84 pts):** Mild, highly favorable conditions.
- **Moderate (50 - 69 pts):** Noticeable chill/heat or humidity; acceptable for outdoor activity.
- **Uncomfortable (35 - 49 pts):** Thermal stress or high humidity.
- **Harsh (0 - 34 pts):** Severe meteorological conditions.

---

### 3. Server-Side Caching Architecture
- **5-Minute TTL (300 seconds):**
  - **Raw Weather API Cache:** Caches responses from OpenWeatherMap by city ID to strictly comply with API rate limits and minimize external HTTP overhead.
  - **Processed Analytics Cache:** Caches normalized calculation outcomes, ranks, and sub-score metrics.
- **Telemetry & Inspection:**
  - Real-time HIT/MISS counter, hit ratio calculations, latency metrics, and cache flush capability available via `/api/cache-status` and the UI Cache Inspector.

---

### 4. Authentication & Authorization (Auth0 / Whitelist / MFA)
- **Restricted Access:** Public signups disabled; only authorized recruitment emails can authenticate.
- **Whitelisted Test Credentials:**
  - **Email:** `careers@fidenz.com`
  - **Password:** `Pass#fidenz`
- **Multi-Factor Authentication (MFA):**
  - Two-step login requiring a 6-digit one-time verification code.
  - Generates secure signed JWT tokens with 24-hour expiration.

---

### 5. Bonus Features Included
- **Interactive Algorithm Simulator & Live Extension Tool:** Test real-time parameter tuning for Part 3 screen recording requirements.
- **Automated Unit Test Suite:** Run mathematical bounds and edge-case assertions in the UI or via CLI `npm test`.
- **Dark Mode Support:** Sophisticated light/dark themes with high-contrast typography.
- **Sorting & Filtering:** Instant filtering by comfort rating tier and sorting by temperature, humidity, wind, or rank.
- **Visual Analytics:** Interactive Recharts graphs showing leaderboard ranking, temperature correlation, and component breakdowns.

---

### 6. Setup & Running Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run automated Unit Tests
npm test

# 3. Start Development Server
npm run dev

# 4. Build for Production
npm run build
npm start
```

Access the application in your browser at `http://localhost:3000`.
