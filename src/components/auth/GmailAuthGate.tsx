import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Lock,
  Mail,
  User as UserIcon,
  Store,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShoppingBag,
  Eye,
  EyeOff,
  Globe,
  Tag,
  Barcode,
  ArrowRight,
} from 'lucide-react';

export const GmailAuthGate: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset, addToast } = useMarketplace();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/signup') return 'signup';
      if (window.location.pathname === '/forgot-password') return 'forgot';
    }
    return 'login';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isSellerAccount, setIsSellerAccount] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // 1-Click Google / Gmail Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      addToast('success', 'Authenticated Successfully', 'Welcome to SHOPZA!');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setErrorMessage(
        err.message?.includes('popup-closed-by-user')
          ? 'Google sign-in popup was closed before completion. Please try again.'
          : err.message || 'Failed to authenticate with Google. Please use Gmail & password below.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Gmail + Password Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email or Gmail address.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await sendPasswordReset(cleanEmail);
        setResetSuccess(true);
        addToast('info', 'Password Reset Dispatched', `Recovery instructions sent to ${cleanEmail}`);
      } catch (resetErr: any) {
        console.error('Password reset error:', resetErr);
        const code = resetErr?.code || '';
        let resetMsg = resetErr?.message || 'Unable to send password reset email.';
        if (code.includes('user-not-found') || resetMsg.includes('user-not-found')) {
          resetMsg = 'No registered account found with this email.';
        } else if (code.includes('invalid-email') || resetMsg.includes('invalid-email')) {
          resetMsg = 'Please enter a valid email address.';
        }
        setErrorMessage(resetMsg);
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
      } else {
        await signUpWithEmail(
          cleanEmail,
          password,
          name.trim(),
          isSellerAccount,
          storeName.trim()
        );
        addToast('success', 'Account Registered', 'Welcome to SHOPZA! Your account is active.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication error. Please check your credentials.';
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
        msg = 'No account found with this email. Please switch to "Create Account" above to register.';
      } else if (code.includes('email-already-in-use') || msg.includes('email-already-in-use')) {
        msg = 'An account with this email address already exists. Please log in with your password.';
      } else if (code.includes('weak-password') || msg.includes('weak-password')) {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (code.includes('invalid-email') || msg.includes('invalid-email')) {
        msg = 'Please enter a valid email address (e.g. name@gmail.com).';
      } else if (code.includes('too-many-requests') || msg.includes('too-many-requests')) {
        msg = 'Too many failed login attempts. Please reset your password or try again in a few minutes.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to auto-append @gmail.com if user types just a handle
  const handleEmailChange = (val: string) => {
    setEmail(val);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0B0F] flex flex-col justify-between relative overflow-hidden selection:bg-[#5B35F5]/40 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#5B35F5]/20 via-[#7C4DFF]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-10 w-[500px] h-[400px] bg-[#00C896]/10 blur-3xl pointer-events-none" />

      {/* Top Header Strip */}
      <header className="relative z-10 w-full border-b border-white/[0.08] bg-[#0E0E14]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B35F5] to-[#7C4DFF] flex items-center justify-center shadow-lg shadow-[#5B35F5]/25">
            <span className="font-display font-extrabold text-white text-lg tracking-wider">S</span>
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-tight text-white">SHOPZA</span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00C896]/20 text-[#00C896] uppercase tracking-wide">
              Shopify Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#00C896]" />
          <span className="hidden sm:inline">Mandatory Verified Access</span>
          <span className="text-white/40">·</span>
          <span className="text-slate-300 font-mono text-[11px]">Firebase SSL 256-Bit</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="rounded-3xl bg-[#14141B] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Title & Brand Intro */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
                <span>Production Marketplace & Storefronts</span>
              </div>
              <h1 className="font-display text-2xl font-black text-white tracking-tight">
                {mode === 'login' && 'Sign in with your Gmail'}
                {mode === 'signup' && 'Create your Gmail Account'}
                {mode === 'forgot' && 'Reset your Gmail Password'}
              </h1>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {mode === 'login' &&
                  'Please log in with your Gmail and password to access the verified marketplace, POS terminal, and storefronts.'}
                {mode === 'signup' &&
                  'Join real buyers and Shopify-grade merchants across Nigeria and global markets.'}
                {mode === 'forgot' &&
                  'Enter your Gmail address to receive secure account recovery instructions.'}
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            {mode !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-[#5B35F5] text-white shadow-md shadow-[#5B35F5]/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-[#5B35F5] text-white shadow-md shadow-[#5B35F5]/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* 1-Click Google Sign In */}
            {mode !== 'forgot' && (
              <div className="space-y-3">
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
                  <span>Continue with Google / Gmail (1-Click)</span>
                </button>

                <div className="relative text-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <span className="relative px-3 bg-[#14141B] text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                    Or enter Gmail & password
                  </span>
                </div>
              </div>
            )}

            {/* Reset Success Message */}
            {resetSuccess ? (
              <div className="rounded-2xl bg-[#00C896]/10 border border-[#00C896]/20 p-5 text-center text-xs text-[#00C896] space-y-3">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p>A recovery link was dispatched to <strong>{email}</strong>.</p>
                <button
                  onClick={() => {
                    setResetSuccess(false);
                    setMode('login');
                  }}
                  className="rounded-xl bg-[#5B35F5] px-4 py-2 text-white font-bold cursor-pointer"
                >
                  Return to Gmail Login
                </button>
              </div>
            ) : (
              /* Main Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Collins Okafor"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1A1A24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5] transition"
                      />
                    </div>
                  </div>
                )}

                {/* Gmail Address */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      Gmail / Email Address
                    </label>
                    {!email.includes('@') && email.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setEmail(`${email}@gmail.com`)}
                        className="text-[10px] text-[#7C4DFF] hover:underline"
                      >
                        + Add @gmail.com
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1A1A24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5] transition"
                    />
                  </div>
                </div>

                {/* Gmail Password */}
                {mode !== 'forgot' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-slate-300">
                        {mode === 'login' ? 'Gmail / Account Password' : 'Create Account Password'}
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot');
                            setErrorMessage(null);
                          }}
                          className="text-[11px] text-[#7C4DFF] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        minLength={6}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#1A1A24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {mode === 'login' && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        Enter the correct password you chose when creating your email / account.
                      </p>
                    )}
                  </div>
                )}

                {/* Confirm Password (Sign Up Only) */}
                {mode === 'signup' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-slate-300">
                        Confirm Account Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        minLength={6}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#1A1A24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword ? (
                      <p className="text-[10px] text-rose-400 mt-1">Passwords do not match.</p>
                    ) : confirmPassword && password === confirmPassword ? (
                      <p className="text-[10px] text-[#00C896] mt-1">Passwords match perfectly.</p>
                    ) : null}
                  </div>
                )}

                {/* Account Type Selector for Sign Up */}
                {mode === 'signup' && (
                  <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-3.5 space-y-3">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                      Account Type
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsSellerAccount(false)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          !isSellerAccount
                            ? 'bg-[#5B35F5]/20 border-[#5B35F5] text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4 mb-1 text-[#7C4DFF]" />
                        <p className="text-xs font-bold">Shopper / Buyer</p>
                        <p className="text-[10px] text-slate-400">Discover & purchase</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsSellerAccount(true)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          isSellerAccount
                            ? 'bg-[#00C896]/20 border-[#00C896] text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Store className="w-4 h-4 mb-1 text-[#00C896]" />
                        <p className="text-xs font-bold">Seller Storefront</p>
                        <p className="text-[10px] text-slate-400">Shopify tools & POS</p>
                      </button>
                    </div>

                    {isSellerAccount && (
                      <div className="pt-1">
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Store / Brand Name
                        </label>
                        <input
                          type="text"
                          required
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="e.g. Apex Luxury Collections"
                          className="w-full px-3 py-2 rounded-xl bg-[#1A1A24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C896]"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-[#5B35F5] to-[#7C4DFF] hover:brightness-110 p-3.5 text-xs font-bold text-white shadow-xl shadow-[#5B35F5]/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  <span>
                    {mode === 'login' && 'Sign In with Gmail & Password'}
                    {mode === 'signup' && 'Create Account & Enter SHOPZA'}
                    {mode === 'forgot' && 'Send Password Reset Link'}
                  </span>
                </button>
              </form>
            )}

            {/* Bottom Footer inside Card */}
            <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
              {mode === 'login' && (
                <p>
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-[#7C4DFF] font-bold hover:underline cursor-pointer"
                  >
                    Create a free Gmail account
                  </button>
                </p>
              )}
              {mode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-[#7C4DFF] font-bold hover:underline cursor-pointer"
                  >
                    Sign in with Gmail
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-[#7C4DFF] font-semibold hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </div>

          {/* Shopify Features Highlights Strip */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <Barcode className="w-4 h-4 text-[#00C896] mx-auto mb-1.5" />
              <p className="text-[11px] font-bold text-white">POS Terminal</p>
              <p className="text-[10px] text-slate-500">Walk-in physical register</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <Globe className="w-4 h-4 text-[#7C4DFF] mx-auto mb-1.5" />
              <p className="text-[11px] font-bold text-white">Shopify Markets</p>
              <p className="text-[10px] text-slate-500">NGN, USD, GBP, EUR</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <Tag className="w-4 h-4 text-pink-400 mx-auto mb-1.5" />
              <p className="text-[11px] font-bold text-white">Discounts Engine</p>
              <p className="text-[10px] text-slate-500">Promos & coupon rules</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Strip */}
      <footer className="relative z-10 w-full border-t border-white/[0.08] bg-[#0E0E14]/80 px-4 py-4 text-center text-xs text-slate-500">
        <p>
          SHOPZA Commerce Platform · Built for Mass Market Use · Protected by Firebase Authentication & Firestore Escrow
        </p>
      </footer>
    </div>
  );
};
