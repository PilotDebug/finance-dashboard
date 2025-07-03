import { useEffect, useState } from "react";

export default function Dashboard() {
  const [health, setHealth] = useState<string>("Checking...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data.status))
      .catch(() => setHealth("Backend not reachable"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-4xl font-bold mb-4 text-cyan-300 drop-shadow">Welcome to Pilot Debug</h2>
      <div className="p-6 bg-black bg-opacity-70 rounded-2xl shadow-xl border border-indigo-800 flex flex-col items-center mb-6">
        <p className="text-xl mb-2 font-mono tracking-wide text-indigo-200">Backend Health:</p>
        <span className={`text-2xl font-bold ${health === 'ok' ? 'text-green-400 animate-pulse' : 'text-red-400 animate-bounce'}`}>{health}</span>
      </div>
      <p className="text-lg text-indigo-200 max-w-xl text-center">
        This is your mission control. Use the navigation bar to explore your portfolio, analyze RKLB strategies, and scan DeFi opportunities across the galaxy.
      </p>
    </div>
  );
} 