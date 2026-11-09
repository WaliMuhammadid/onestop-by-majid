/**
 * Security utilities:
 * - Admin secret URL detection & verification
 * - Rate limiting & brute force lockout (5 failed attempts -> 5 min lockout)
 * - Generic error sanitization
 */

export const SECRET_ADMIN_PATH = '/control-x7k2';
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export interface RateLimitState {
  failedAttempts: number;
  lockoutUntil: number | null;
  lastAttemptAt: number | null;
}

const STORAGE_KEY = 'onestop_auth_rate_limit';

export function getRateLimitState(): RateLimitState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RateLimitState;
      // Check if lockout has naturally expired
      if (parsed.lockoutUntil && Date.now() > parsed.lockoutUntil) {
        return { failedAttempts: 0, lockoutUntil: null, lastAttemptAt: null };
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return { failedAttempts: 0, lockoutUntil: null, lastAttemptAt: null };
}

export function recordFailedAttempt(): { isLocked: boolean; remainingAttempts: number; lockoutSeconds: number } {
  const current = getRateLimitState();
  const failedAttempts = current.failedAttempts + 1;
  let lockoutUntil: number | null = current.lockoutUntil;

  if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
    lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  const updated: RateLimitState = {
    failedAttempts,
    lockoutUntil,
    lastAttemptAt: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  const isLocked = lockoutUntil !== null && Date.now() < lockoutUntil;
  const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - failedAttempts);
  const lockoutSeconds = lockoutUntil ? Math.ceil((lockoutUntil - Date.now()) / 1000) : 0;

  return { isLocked, remainingAttempts, lockoutSeconds };
}

export function resetRateLimit(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function checkIsLocked(): { isLocked: boolean; lockoutSeconds: number; remainingAttempts: number } {
  const current = getRateLimitState();
  if (current.lockoutUntil && Date.now() < current.lockoutUntil) {
    const lockoutSeconds = Math.ceil((current.lockoutUntil - Date.now()) / 1000);
    return { isLocked: true, lockoutSeconds, remainingAttempts: 0 };
  }
  return {
    isLocked: false,
    lockoutSeconds: 0,
    remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - current.failedAttempts),
  };
}

/**
 * Generic security message to prevent user enumeration
 */
export const GENERIC_AUTH_ERROR = 'Invalid email or security credentials.';
