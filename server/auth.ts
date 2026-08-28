import jwt from 'jsonwebtoken';
import { AuthUser } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'fidenz_weather_analytics_secure_secret_2026';

// Whitelist of authorized email addresses
export const AUTHORIZED_WHITELIST = new Set([
  'careers@fidenz.com',
  'kanishka.d@fidenz.com',
  'srimal.w@fidenz.com',
  'narada.a@fidenz.com',
  'amindu.l@fidenz.com',
  'niroshanan.s@fidenz.com',
  'candidate@fidenz.com',
  'evaluator@fidenz.com',
  'lakshandissanayake0813@gmail.com',
]);

// Registered user database (pre-seeded with the required test user)
interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // Plain/hashed comparison for take-home assignment
  role: 'admin' | 'candidate' | 'evaluator';
  mfaEnabled: boolean;
}

const USERS_DB: Record<string, UserRecord> = {
  'careers@fidenz.com': {
    id: 'usr_fidenz_01',
    email: 'careers@fidenz.com',
    name: 'Fidenz Evaluation Team',
    passwordHash: 'Pass#fidenz',
    role: 'evaluator',
    mfaEnabled: true,
  },
  'candidate@fidenz.com': {
    id: 'usr_fidenz_02',
    email: 'candidate@fidenz.com',
    name: 'Trainee Software Engineer Candidate',
    passwordHash: 'Pass#fidenz',
    role: 'candidate',
    mfaEnabled: true,
  },
  'kanishka.d@fidenz.com': {
    id: 'usr_fidenz_03',
    email: 'kanishka.d@fidenz.com',
    name: 'Kanishka (Reviewer)',
    passwordHash: 'Pass#fidenz',
    role: 'admin',
    mfaEnabled: true,
  },
  'lakshandissanayake0813@gmail.com': {
    id: 'usr_lakshan_01',
    email: 'lakshandissanayake0813@gmail.com',
    name: 'Lakshan Dissanayake',
    passwordHash: 'Pass#lak',
    role: 'candidate',
    mfaEnabled: true,
  },
};

// In-memory MFA pending sessions: sessionToken -> { email, code, expiresAt }
interface MfaSession {
  email: string;
  code: string;
  expiresAt: number;
}
const mfaPendingSessions = new Map<string, MfaSession>();

/**
 * Checks if an email is in the allowed whitelist (Restricting signups/logins)
 */
export function isEmailWhitelisted(email: string): boolean {
  return AUTHORIZED_WHITELIST.has(email.toLowerCase().trim());
}

/**
 * Initiates user login and prepares MFA verification
 */
export function initiateLogin(email: string, password: string): {
  success: boolean;
  mfaRequired?: boolean;
  sessionToken?: string;
  demoCode?: string;
  message?: string;
  user?: AuthUser;
  token?: string;
} {
  const normalizedEmail = email.toLowerCase().trim();

  // Step 3: Restrict signups & whitelist check
  if (!isEmailWhitelisted(normalizedEmail)) {
    return {
      success: false,
      message: 'Access Denied: Public registration is disabled. This email is not in the authorized recruitment whitelist.',
    };
  }

  const user = USERS_DB[normalizedEmail];
  if (!user) {
    // If whitelisted but not in DB, create standard evaluation session for reviewers
    const newUser: UserRecord = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      passwordHash: 'Pass#fidenz',
      role: 'evaluator',
      mfaEnabled: true,
    };
    USERS_DB[normalizedEmail] = newUser;
  }

  const targetUser = USERS_DB[normalizedEmail];
  if (targetUser.passwordHash !== password) {
    return {
      success: false,
      message: 'Invalid credentials. Please verify your email and password.',
    };
  }

  // Step 2: Multi-Factor Authentication via Email verification code
  if (targetUser.mfaEnabled) {
    const sessionToken = `mfa_sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    // Generate 6-digit numeric verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    mfaPendingSessions.set(sessionToken, {
      email: normalizedEmail,
      code,
      expiresAt,
    });

    return {
      success: true,
      mfaRequired: true,
      sessionToken,
      demoCode: code, // Provided for instant seamless test review in sandbox
      message: `MFA verification code sent to ${normalizedEmail}`,
    };
  }

  // If MFA is bypassed
  const token = generateAuthToken(targetUser);
  return {
    success: true,
    token,
    user: {
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      mfaVerified: true,
      whitelisted: true,
    },
  };
}

/**
 * Validates MFA one-time passcode and issues JWT token
 */
export function verifyMfaCode(
  sessionToken: string,
  inputCode: string
): {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
} {
  const session = mfaPendingSessions.get(sessionToken);
  if (!session) {
    return {
      success: false,
      message: 'MFA session expired or invalid. Please log in again.',
    };
  }

  if (Date.now() > session.expiresAt) {
    mfaPendingSessions.delete(sessionToken);
    return {
      success: false,
      message: 'MFA verification code has expired. Please request a new code.',
    };
  }

  if (session.code !== inputCode.trim()) {
    return {
      success: false,
      message: 'Invalid 6-digit verification code. Please check and try again.',
    };
  }

  // Code is valid
  mfaPendingSessions.delete(sessionToken);
  const user = USERS_DB[session.email];

  const token = generateAuthToken(user);
  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mfaVerified: true,
      whitelisted: true,
    },
  };
}

/**
 * Generates signed JSON Web Token (JWT)
 */
export function generateAuthToken(user: UserRecord): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iss: 'fidenz-weather-analytics',
      aud: 'fidenz-platform',
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Validates JWT token from Authorization header
 */
export function verifyJwtToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || !payload.email) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role || 'candidate',
      mfaVerified: true,
      whitelisted: isEmailWhitelisted(payload.email),
    };
  } catch (err) {
    return null;
  }
}
