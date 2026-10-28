import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { API_USER } from '../config';

export function AdminPanel() {
  const { token, user } = useAppContext();
  const [adminMessage, setAdminMessage] = useState('Verifying admin privileges...');
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'

  useEffect(() => {
    async function verifyAdmin() {
      try {
        const res = await fetch(`${API_USER}/admin`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          setAdminMessage(data.message || 'Welcome Admin! You can access this page.');
          setStatus('success');
        } else {
          setAdminMessage(data.message || 'Access Denied: You do not have admin permissions.');
          setStatus('error');
        }
      } catch (err) {
        setAdminMessage('Failed to connect to admin verification API.');
        setStatus('error');
      }
    }

    if (token) {
      verifyAdmin();
    } else {
      setAdminMessage('No token provided. Please log in as Admin.');
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-800">
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-3xl">
          🛡️
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Administrator Control Panel</h2>
          <p className="text-xs text-slate-400">
            Protected RBAC Route • Restricted to users with role: <span className="text-emerald-400 font-bold">admin</span>
          </p>
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border text-sm font-medium mb-6 ${
          status === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : status === 'error'
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
        }`}
      >
        <span className="font-bold">Backend Response: </span>
        {adminMessage}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
          <p className="text-slate-400 font-semibold mb-1">Authenticated Admin</p>
          <p className="text-white font-mono text-sm">{user?.name || 'Unknown'}</p>
          <p className="text-slate-500 mt-1">{user?.email}</p>
        </div>
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
          <p className="text-slate-400 font-semibold mb-1">Access Level</p>
          <span className="inline-block px-2 py-0.5 rounded font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 uppercase text-[10px]">
            {user?.role || 'Guest'}
          </span>
          <p className="text-slate-500 mt-2">Route: <span className="font-mono text-[10px] text-slate-400">GET /api/user/admin</span></p>
        </div>
      </div>
    </div>
  );
}

