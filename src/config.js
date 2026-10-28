/**
 * Central API & WebSocket configuration for Local and Cloud Deployment (Exp 10)
 * Uses VITE_API_URL environment variable on Vercel/Production, defaults to localhost:5000 in development.
 */
export const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
export const API_WEATHER = `${BACKEND_URL}/api/weather`;
export const API_AUTH = `${BACKEND_URL}/api/auth`;
export const API_USER = `${BACKEND_URL}/api/user`;
