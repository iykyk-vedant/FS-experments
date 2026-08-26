import React, { useState } from 'react';

/**
 * Login Component (Matches Experiment 1 Visuals + React Hook Forms)
 */
export function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setSuccess(true);

    setTimeout(() => {
      onLoginSuccess();
    }, 600);
  };

  return (
    <section className="flex-1 flex items-center justify-center py-8">
      <div className="glass-panel rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-white/15 border border-white/20 mb-3 shadow-md">
            <svg class="w-7 h-7 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white">Welcome Back</h2>
          <p className="text-xs text-white/70 mt-1">Sign in to save favorite cities and customize alerts</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-xs">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-200 text-xs">
            ✅ Logged in successfully! Redirecting to Dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 bg-white/15 border border-white/25 rounded-xl text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white/15 border border-white/25 rounded-xl text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-white/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-white/30 text-sky-500 focus:ring-sky-400" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-sky-300 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/30 transition-all cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-white/60 mt-6">
          Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); alert('Registration will be connected in future backend experiment!'); }} className="text-sky-300 font-semibold hover:underline">Create an account</a>
        </p>
      </div>
    </section>
  );
}
