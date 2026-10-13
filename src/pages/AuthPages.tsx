import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Lock, Mail, User as UserIcon, Phone, CheckCircle2, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

interface AuthPagesProps {
  mode: 'login' | 'signup' | 'forgot';
  navigate: (path: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode, navigate }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset, addToast } = useMarketplace();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isSellerAccount, setIsSellerAccount] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sentReset, setSentReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      addToast('success', 'Signed In', 'Welcome to SHOPZA!');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message?.includes('popup-closed-by-user')
          ? 'Sign-in window closed. Please try again.'
          : err.message || 'Failed to authenticate with Google.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await sendPasswordReset(cleanEmail);
        setSentReset(true);
        addToast('info', 'Reset Sent', `Password reset instructions sent to ${cleanEmail}`);
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || 'Failed to send password reset email.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please ensure both passwords match.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(cleanEmail, password);
        addToast('success', 'Welcome Back', 'Successfully signed in to SHOPZA.');
        navigate('/');
      } else {
        await signUpWithEmail(
          cleanEmail,
          password,
          name.trim() || 'New Merchant',
          isSellerAccount,
          storeName.trim()
        );
        addToast('success', 'Account Ready', 'Your account has been registered.');
        navigate(isSellerAccount ? '/seller/dashboard' : '/');
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Authentication failed.';
      const code = err.code || '';
      if (
        code.includes('invalid-credential') ||
        code.includes('wrong-password') ||
        msg.includes('invalid-credential') ||
        msg.includes('wrong-password') ||
        msg.includes('invalid-login-credentials')
      ) {
        msg = 'Incorrect password or email. Please enter the exact password you used when creating your account.';
      } else if (code.includes('user-not-found') || msg.includes('user-not-found')) {
        msg = 'No account found with this email. Please click "Sign up free" below to register.';
      } else if (code.includes('email-already-in-use') || msg.includes('email-already-in-use')) {
        msg = 'An account with this email already exists. Please sign in with your password.';
      } else if (code.includes('weak-password') || msg.includes('weak-password')) {
        msg = 'Password should be at least 6 characters long.';
      } else if (code.includes('invalid-email') || msg.includes('invalid-email')) {
        msg = 'Please enter a valid email address.';
      } else if (code.includes('too-many-requests') || msg.includes('too-many-requests')) {
        msg = 'Too many failed login attempts. Please try again later.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 min-h-[75vh] flex flex-col justify-center">
      <div className="rounded-3xl bg-[#14141B] border border-white/10 p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B35F5] to-[#7C4DFF] flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <span className="font-display text-2xl font-black text-white">SHOPZA</span>
          </div>
          <h1 className="font-bold text-lg text-white">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your SHOPZA account'}
            {mode === 'forgot' && 'Reset your password'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Access your Shopify-grade store, orders, and saved items.'}
            {mode === 'signup' && 'Join thousands of buyers and sellers across Nigeria and beyond.'}
            {mode === 'forgot' && 'Enter your registered Gmail to receive recovery instructions.'}
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Google Sign-In */}
        {mode !== 'forgot' && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Continue with Google / Gmail</span>
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative px-3 bg-[#14141B] text-[10px] uppercase tracking-wider text-slate-500 font-medium">
              Or with Gmail & password
            </span>
          </div>
        )}

        {sentReset ? (
          <div className="rounded-2xl bg-[#00C896]/10 border border-[#00C896]/20 p-5 text-center text-xs text-[#00C896] space-y-3">
            <CheckCircle2 className="w-8 h-8 mx-auto" />
            <p>A recovery link was dispatched to <strong>{email}</strong>.</p>
            <button
              onClick={() => navigate('/login')}
              className="rounded-xl bg-[#5B35F5] px-4 py-2 text-white font-bold cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Collins Okafor"
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-[#5B35F5]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gmail / Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-[#5B35F5]"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    {mode === 'login' ? 'Password' : 'Create Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-[11px] text-[#7C4DFF] hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    minLength={6}
                    className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 pr-10 text-xs text-white focus:outline-none focus:border-[#5B35F5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'login' && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Enter the exact password you used when creating your account.
                  </p>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    minLength={6}
                    className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 pr-10 text-xs text-white focus:outline-none focus:border-[#5B35F5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword ? (
                  <p className="text-[10px] text-rose-400 mt-1">Passwords do not match.</p>
                ) : confirmPassword && password === confirmPassword ? (
                  <p className="text-[10px] text-[#00C896] mt-1">Passwords match.</p>
                ) : null}
              </div>
            )}

            {mode === 'signup' && (
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSellerAccount}
                    onChange={(e) => setIsSellerAccount(e.target.checked)}
                    className="rounded border-white/20 text-[#5B35F5]"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    I want to open a Merchant Storefront (Shopify features)
                  </span>
                </label>

                {isSellerAccount && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Store Name (e.g. Apex Luxury Collections)"
                      className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-[#00C896]"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#5B35F5] hover:bg-[#4d2ad4] p-3 text-xs font-bold text-white shadow-lg shadow-[#5B35F5]/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {mode === 'login' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </span>
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-[#7C4DFF] font-semibold hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#7C4DFF] font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
