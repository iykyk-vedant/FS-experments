import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Login & Registration Component: Full-Stack JWT Authentication
 */
export function Login({ onLoginSuccess }) {
  const { user, login, register, logout } = useAppContext();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your name.');
        setLoading(false);
        return;
      }

      const res = await register({ name, email, password, role });
      setLoading(false);

      if (!res.success) {
        setError(res.message);
        return;
      }

      setSuccess('Account registered successfully! Please sign in.');
      setIsRegister(false);
    } else {
      const res = await login(email, password);
      setLoading(false);

      if (!res.success) {
        setError(res.message);
        return;
      }

      setSuccess(`Welcome back, ${res.user.name}!`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 700);
    }
  };

  // If already logged in, show authenticated state card
  if (user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 mx-auto flex items-center justify-center text-3xl mb-4">
            👤
          </div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>

          <div className="my-5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300">
            <span>Role:</span>
            <span
              className={
                user.role === 'admin'
                  ? 'text-emerald-400 font-bold'
                  : 'text-sky-400 font-bold'
              }
            >
              {user.role}
            </span>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl text-left text-xs text-slate-400 space-y-1.5 mb-6">
            <p>
              Status: <span className="text-emerald-400 font-semibold">● Active Session</span>
            </p>
            <p>
              Session Token: <span className="text-slate-500 font-mono text-[10px]">JWT Authenticated</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onLoginSuccess && onLoginSuccess()}
              className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-3xl">🔐</span>
          <h2 className="text-2xl font-black text-white mt-2">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister
              ? 'Register with role user or admin'
              : 'Sign in to access protected features & live chat'}
          </p>
        </div>

        {/* Tab switch between Sign In and Register */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
              !isRegister ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
              isRegister ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vedant"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Role (RBAC)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500 transition"
              >
                <option value="user">User (Standard Access)</option>
                <option value="admin">Admin (Full Administrative Privileges)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-lg shadow-sky-500/20"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
