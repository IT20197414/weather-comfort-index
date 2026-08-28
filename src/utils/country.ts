// ISO-3166-1 country code to flag emoji and full country name mapping

export const COUNTRY_NAMES: Record<string, string> = {
  DE: 'Germany',
  LK: 'Sri Lanka',
  GB: 'United Kingdom',
  JP: 'Japan',
  AU: 'Australia',
  US: 'United States',
  FR: 'France',
  SG: 'Singapore',
  CA: 'Canada',
  AE: 'United Arab Emirates',
  IT: 'Italy',
  IN: 'India',
  TH: 'Thailand',
  BR: 'Brazil',
  ZA: 'South Africa',
  EG: 'Egypt',
  ES: 'Spain',
  CN: 'China',
  RU: 'Russia',
  NZ: 'New Zealand',
  CH: 'Switzerland',
  NL: 'Netherlands',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
};

/**
 * Converts a 2-letter ISO country code into the official Unicode flag emoji
 * e.g., 'DE' -> '🇩🇪', 'LK' -> '🇱🇰', 'GB' -> '🇬🇧'
 */
export function getCountryFlag(countryCode?: string): string {
  if (!countryCode || countryCode.trim().length !== 2) return '🌐';
  const cleanCode = countryCode.trim().toUpperCase();
  const codePoints = cleanCode
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Returns the full country name for a given code
 */
export function getCountryName(countryCode?: string): string {
  if (!countryCode) return '';
  const clean = countryCode.trim().toUpperCase();
  return COUNTRY_NAMES[clean] || clean;
}
