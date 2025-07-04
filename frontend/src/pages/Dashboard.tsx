import { useEffect, useState } from "react";
import { fetchHealth } from "../api";

export default function Dashboard() {
  const [health, setHealth] = useState<string>("Checking...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => {
        setHealth(data.data?.status || "Unknown");
        setLoading(false);
      })
      .catch(() => {
        setError("Backend not reachable");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-4xl font-bold mb-4 text-cyan-300 drop-shadow">Welcome to Pilot Debug</h2>
      <div className="p-6 bg-black bg-opacity-70 rounded-2xl shadow-xl border border-indigo-800 flex flex-col items-center mb-6">
        <p className="text-xl mb-2 font-mono tracking-wide text-indigo-200">Backend Health:</p>
        {loading ? (
          <span className="text-2xl font-bold text-yellow-400 animate-pulse">Checking...</span>
        ) : error ? (
          <span className="text-2xl font-bold text-red-400 animate-bounce">{error}</span>
        ) : (
          <span className={`text-2xl font-bold ${health === 'ok' ? 'text-green-400 animate-pulse' : 'text-red-400 animate-bounce'}`}>{health}</span>
        )}
      </div>
      <p className="text-lg text-indigo-200 max-w-xl text-center">
        This is your mission control. Use the navigation bar to explore your portfolio, analyze RKLB strategies, and scan DeFi opportunities across the galaxy.
      </p>
    </div>
  );
} 