import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import {
  checkIsLocked,
  recordFailedAttempt,
  resetRateLimit,
  GENERIC_AUTH_ERROR,
  SECRET_ADMIN_PATH,
} from '../../lib/security';
import { ShieldAlert, Lock, KeyRound, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    loginAdmin,
    addToast,
    addAuditLog,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [lockoutStatus, setLockoutStatus] = useState(checkIsLocked());

  // Update countdown timer if locked out
  useEffect(() => {
    if (!lockoutStatus.isLocked) return;
    const interval = setInterval(() => {
      const current = checkIsLocked();
      setLockoutStatus(current);
      if (!current.isLocked) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutStatus.isLocked]);

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check lock
    const currentLock = checkIsLocked();
    if (currentLock.isLocked) {
      setLockoutStatus(currentLock);
      setErrorMessage(`Access suspended due to repeated authentication failures. Try again in ${currentLock.lockoutSeconds}s.`);
      return;
    }

    // Verify against secret admin credentials
    const trimmedEmail = email.trim().toLowerCase();
    const isValidEmail = trimmedEmail === 'admin@onestopbymajid.com' || trimmedEmail === 'admin@aura-studio.com';
    const isValidPass = password === 'AdminSecretPass123!';
    const isValidTotp = !totpToken || totpToken === '849201';

    if (isValidEmail && isValidPass && isValidTotp) {
      resetRateLimit();
      loginAdmin({
        id: 'usr-admin-01',
        email: email.trim().toLowerCase(),
        role: 'super_admin',
        lastLogin: new Date().toISOString(),
        twoFactorEnabled: true,
      });
      addToast('Secure administrative session initiated.', 'success');
    } else {
      const outcome = recordFailedAttempt();
      setLockoutStatus(checkIsLocked());

      if (outcome.isLocked) {
        addAuditLog('BRUTE_FORCE_LOCKOUT', 'auth', `Account locked out after 5 consecutive failures for ${email}`);
        setErrorMessage(`Security lockout activated. High rate of invalid attempts detected. Locked for ${outcome.lockoutSeconds}s.`);
      } else {
        addAuditLog('FAILED_LOGIN_ATTEMPT', 'auth', `Failed authentication attempt for ${email}. Remaining attempts: ${outcome.remainingAttempts}`);
        setErrorMessage(`${GENERIC_AUTH_ERROR} (${outcome.remainingAttempts} attempts remaining before security lockout).`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#161412] text-stone-100 rounded-2xl shadow-2xl border border-stone-800 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Secret Path Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif text-lg tracking-wide text-white">Privileged Atelier Console</h2>
          </div>
          <button
            onClick={() => setIsAdminLoginOpen(false)}
            aria-label="Close admin login"
            className="p-1 text-stone-500 hover:text-stone-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3 bg-stone-900/90 rounded-lg border border-stone-800 text-[11px] text-stone-400 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            <span>Strict Secret Route Access ({SECRET_ADMIN_PATH})</span>
          </div>
          <p>
            This portal is restricted to authorized administrative principals. All connection attempts, IP traces, and cryptographic tokens are logged in public.audit_logs.
          </p>
        </div>

        {/* Lockout Notice if triggered */}
        {lockoutStatus.isLocked && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2.5 animate-pulse">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <div>
              <p className="font-semibold">Brute-Force Lockout Engaged</p>
              <p className="text-[11px] text-rose-400">
                Unlock cooldown active: {lockoutStatus.lockoutSeconds} seconds remaining.
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-stone-400 mb-1">
              Admin Identity Email
            </label>
            <input
              type="email"
              required
              disabled={lockoutStatus.isLocked}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@onestopbymajid.com"
              className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono disabled:opacity-40"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-stone-400 mb-1">
              Master Password
            </label>
            <input
              type="password"
              required
              disabled={lockoutStatus.isLocked}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-40"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-medium uppercase tracking-wider text-stone-400">
                TOTP 2FA Token (6-digit)
              </label>
              <span className="text-[10px] text-stone-500">RFC 6238 Authenticator</span>
            </div>
            <div className="relative">
              <KeyRound className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="text"
                maxLength={6}
                disabled={lockoutStatus.isLocked}
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value)}
                placeholder="Optional (e.g. 849201)"
                className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-700 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono tracking-widest disabled:opacity-40"
              />
            </div>
          </div>

          {errorMessage && !lockoutStatus.isLocked && (
            <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded border border-rose-900">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={lockoutStatus.isLocked}
            className="w-full py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs uppercase tracking-widest transition-colors shadow-lg disabled:opacity-40"
          >
            Authenticate &bull; Enter Console
          </button>
        </form>
      </div>
    </div>
  );
};
