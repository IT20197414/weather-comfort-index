import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginView: React.FC = () => {
  const { login, verifyMfa, mfaState, cancelMfa, error, clearError, quickFillCredentials } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFillTestUser = () => {
    const creds = quickFillCredentials();
    setEmail(creds.email);
    setPassword(creds.pass);
    clearError();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode) return;
    setSubmitting(true);
    await verifyMfa(mfaCode);
    setSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-stone-50 dark:bg-stone-950 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Fidenz Secure Portal
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Weather Analytics & Comfort Ranking Engine
              </p>
            </div>
          </div>

          {/* Whitelist Badge */}
          <div className="flex items-center space-x-2 text-[11px] text-stone-600 dark:text-stone-300 bg-stone-200/60 dark:bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-300/40 dark:border-stone-700">
            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Public signups restricted. Whitelisted recruitment access only.</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {!mfaState ? (
            /* STEP 1: Email & Password Credentials */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="careers@fidenz.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    id="input-login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Pass#fidenz"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Validating Whitelist...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Fill Buttons */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('lakshandissanayake0813@gmail.com');
                    setPassword('Pass#lak');
                    clearError();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-500/30 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Fill My Account (lakshandissanayake0813@gmail.com)</span>
                </button>

                <button
                  type="button"
                  onClick={handleFillTestUser}
                  className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-500/30 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Fill Evaluator Account (careers@fidenz.com)</span>
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: MFA Verification Code Challenge */
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-2 border border-emerald-500/30">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Multi-Factor Authentication (MFA)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Enter the 6-digit verification code for <strong className="text-stone-700 dark:text-stone-200">{mfaState.email}</strong>
                </p>
              </div>

              {/* Demo Helper Prompt showing generated code for instant evaluator review */}
              {mfaState.demoCode && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block mb-1">
                    Simulated Email Verification Code:
                  </span>
                  <span className="font-mono text-xl font-bold tracking-widest text-emerald-800 dark:text-emerald-200">
                    {mfaState.demoCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMfaCode(mfaState.demoCode!)}
                    className="mt-1.5 text-[11px] underline text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 block mx-auto"
                  >
                    Click to auto-insert code
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 text-center">
                  6-Digit One-Time Code
                </label>
                <input
                  id="input-mfa-code"
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={cancelMfa}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  id="btn-verify-mfa"
                  type="submit"
                  disabled={submitting || mfaCode.length !== 6}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Access</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Recruitment Briefing Helper */}
          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-center">
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Evaluator Test Credentials: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-stone-700 dark:text-stone-300">careers@fidenz.com</code> / <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-stone-700 dark:text-stone-300">Pass#fidenz</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
