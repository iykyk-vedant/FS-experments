import React, { useState, useEffect } from "react";

export function DockerBanner() {
  const [message, setMessage] = useState("Connecting to backend...");
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        setMessage(data.message || "Backend is running inside Docker!");
        setStatus("success");
      })
      .catch((err) => {
        console.error("Backend connection failed:", err);
        setMessage("Backend connection failed");
        setStatus("error");
      });
  }, []);

  return (
    <section className="mb-6 p-4 sm:p-5 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Docker Logo + Title */}
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="#0091e2"
              aria-label="Docker logo"
            >
              <path d="M13.98 10.35h2.18V8.17h-2.18v2.18zm-2.8 0h2.18V8.17h-2.18v2.18zm-2.81 0h2.18V8.17H8.37v2.18zm-2.8 0h2.17V8.17H5.57v2.18zm-2.8 0h2.18V8.17H2.77v2.18zm5.61-2.8h2.18V5.37H8.37v2.18zm-2.8 0h2.17V5.37H5.57v2.18zm5.61 0h2.18V5.37h-2.18v2.18zm2.8 0h2.18V5.37h-2.18v2.18z" />
              <path d="M23.99 12.22c-.22-.38-.64-.53-1.07-.46-.37.06-.71.25-.99.51-.57-.45-1.29-.69-2.02-.69-.07 0-.15 0-.22.01-.25-.99-.86-1.84-1.72-2.39l-.49-.31-.4.41c-.42.44-.72 1.01-.84 1.63-.44-.06-.9-.08-1.37-.08H1.3c-.35 0-.67.14-.91.38-.25.25-.39.58-.39.93 0 2.22.69 4.3 1.94 5.86 1.49 1.86 3.63 2.98 6.03 3.16.48.04.96.06 1.43.06 4.33 0 8.07-1.57 10.45-4.36 1.84-.25 3.39-1.27 4.02-2.67.18-.39.24-.79.12-1.05zm-4.32 1.44c-.38.01-.76-.07-1.12-.22-.37-.15-.7-.37-.97-.66.69-.5 1.54-.76 2.41-.75.14 0 .28.01.42.03-.1.59-.35 1.15-.74 1.6z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Full Stack Docker Application
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Frontend: <span className="text-sky-400 font-semibold">React</span> • Backend: <span className="text-emerald-400 font-semibold">Node.js/Express</span>
            </p>
          </div>
        </div>

        {/* Right: PS Expected Output Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all ${
              status === "success"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : status === "error"
                ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                : "bg-sky-500/15 text-sky-300 border-sky-500/30"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === "success"
                  ? "bg-emerald-400 animate-pulse"
                  : status === "error"
                  ? "bg-rose-400"
                  : "bg-sky-400 animate-ping"
              }`}
            />
            <span>
              Backend Response:{" "}
              <strong className="font-bold underline decoration-emerald-500/50">
                {message}
              </strong>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Compose: <strong>2/2 Up</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
