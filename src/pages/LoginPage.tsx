import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, CheckCircle2, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@retailanalytics.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed');
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
    setLoading(true);
    setTimeout(() => {
      login(demoEmail, demoPass);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md card-theme p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-sky-500/20">
            SR
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Smart Retail Analytics
          </h1>
          <p className="text-xs text-slate-700">
            Enterprise Data Warehouse & Machine Learning Platform
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Account Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@retailanalytics.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
              <Mail size={16} className="absolute left-3 top-3 text-slate-600" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
              <Lock size={16} className="absolute left-3 top-3 text-slate-600" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-600 hover:text-slate-600:text-slate-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>Remember session</span>
            </label>
            <span className="text-sky-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 text-xs"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign In to Platform</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Logins Box */}
        <div className="pt-4 border-t border-slate-200 space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Quick Testing Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('admin@retailanalytics.com', 'Admin@123')}
              className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-800 hover:bg-amber-100 transition-colors text-left space-y-0.5"
            >
              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                <ShieldCheck size={14} />
                <span>Admin Login</span>
              </div>
              <p className="text-[10px] text-amber-600 truncate">admin@retailanalytics.com</p>
            </button>

            <button
              onClick={() => handleQuickDemo('analyst@retailanalytics.com', 'Analyst@123')}
              className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/50 text-sky-800 hover:bg-sky-100 transition-colors text-left space-y-0.5"
            >
              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                <CheckCircle2 size={14} />
                <span>Analyst Login</span>
              </div>
              <p className="text-[10px] text-sky-600 truncate">analyst@retailanalytics.com</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
