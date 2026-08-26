import React, { useState } from 'react';

/**
 * Login Component: Controlled Form demonstrating useState and form submission
 */
export function Login({ onLoginSuccess }) {
  // useState hooks for controlled form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents browser page reload

    // Basic Form Validation
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
    }, 800);
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-xl">
        <div className="text-center mb-6">
          <span className="text-3xl">🔐</span>
          <h2 className="text-2xl font-black text-white mt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to save favorite cities</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs">
            ✅ Logged in successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
