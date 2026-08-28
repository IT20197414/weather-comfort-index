import React, { useState } from 'react';
import { getCountryName } from '../utils/country';

interface CountryFlagProps {
  countryCode?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

const SIZE_MAP = {
  xs: 'w-4 h-3 rounded-[2px]',
  sm: 'w-5 h-3.5 rounded-[2px]',
  md: 'w-6 h-4 rounded-xs',
  lg: 'w-7 h-5 rounded-xs',
  xl: 'w-9 h-6 rounded-md',
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const code = (countryCode || '').trim().toLowerCase();
  const countryName = getCountryName(countryCode);

  if (!code || code.length !== 2) {
    return (
      <span className="inline-flex items-center text-xs text-stone-400">
        🌐
      </span>
    );
  }

  const flagUrl = `https://flagcdn.com/w40/${code}.png`;
  const flagUrl2x = `https://flagcdn.com/w80/${code}.png 2x`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 align-middle ${className}`}
      title={countryName}
      aria-label={countryName}
    >
      {!hasError ? (
        <img
          src={flagUrl}
          srcSet={flagUrl2x}
          alt={countryName || code.toUpperCase()}
          className={`${SIZE_MAP[size]} object-cover shadow-2xs border border-black/10 dark:border-white/10 shrink-0 inline-block`}
          onError={() => setHasError(true)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="px-1 py-0.2 rounded text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
          {code.toUpperCase()}
        </span>
      )}
      {showLabel && (
        <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
          {countryName}
        </span>
      )}
    </span>
  );
};
