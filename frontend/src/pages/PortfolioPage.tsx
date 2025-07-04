import { useEffect, useState } from "react";
import { fetchPortfolio } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

interface Props { 
  subpage: string; 
}

interface Holding {
  id: string;
  symbol: string;
  marketValue: number;
}

interface PortfolioData {
  totalValue: number;
  holdings: Holding[];
}

export default function PortfolioPage({ subpage }: Props) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch portfolio data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-orange-200">Portfolio - {subpage}</h2>
      {loading ? (
        <LoadingSpinner message="Loading portfolio data..." />
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <>
          {subpage === 'Overview' && (
            <div className="w-full h-48 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 flex items-center justify-center text-2xl font-bold text-black">
                ${data?.totalValue?.toLocaleString() ?? '123,456'}
              </div>
            </div>
          )}
          {subpage === 'Performance' && (
            <div className="w-full h-48 flex items-center justify-center">
              <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Performance Chart]</div>
            </div>
          )}
          {subpage === 'Holdings' && (
            <div className="w-full h-48 flex items-center justify-center">
              <table className="w-2/3 text-left bg-neutral-800 rounded-lg overflow-hidden">
                <thead className="bg-orange-400 text-black">
                  <tr><th className="px-4 py-2">Asset</th><th className="px-4 py-2">Value</th></tr>
                </thead>
                <tbody>
                  {data?.holdings?.length ? data.holdings.map((h: Holding) => (
                    <tr key={h.id}><td className="px-4 py-2">{h.symbol}</td><td className="px-4 py-2">${h.marketValue.toLocaleString()}</td></tr>
                  )) : (
                    <>
                      <tr><td className="px-4 py-2">BTC</td><td className="px-4 py-2">$50,000</td></tr>
                      <tr><td className="px-4 py-2">ETH</td><td className="px-4 py-2">$30,000</td></tr>
                      <tr><td className="px-4 py-2">USDC</td><td className="px-4 py-2">$10,000</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
} 