import { useEffect, useState } from "react";
import { fetchStocks } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

interface Props { 
  subpage: string; 
}

interface Stock {
  symbol: string;
  price: number;
}

export default function StocksPage({ subpage }: Props) {
  const [data, setData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStocks()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch stocks data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-orange-200">Stocks - {subpage}</h2>
      {loading ? (
        <LoadingSpinner message="Loading stocks data..." />
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <>
          {subpage === 'RKLB' && (
            <div className="w-full h-48 flex items-center justify-center">
              <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[RKLB Chart]</div>
            </div>
          )}
          {subpage === 'Watchlist' && (
            <div className="w-full h-48 flex items-center justify-center">
              <table className="w-2/3 text-left bg-neutral-800 rounded-lg overflow-hidden">
                <thead className="bg-orange-400 text-black">
                  <tr><th className="px-4 py-2">Symbol</th><th className="px-4 py-2">Price</th></tr>
                </thead>
                <tbody>
                  {data?.length ? data.map((s: Stock) => (
                    <tr key={s.symbol}><td className="px-4 py-2">{s.symbol}</td><td className="px-4 py-2">${s.price.toLocaleString()}</td></tr>
                  )) : (
                    <>
                      <tr><td className="px-4 py-2">AAPL</td><td className="px-4 py-2">$200</td></tr>
                      <tr><td className="px-4 py-2">GOOG</td><td className="px-4 py-2">$2,500</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {subpage === 'Alerts' && (
            <div className="w-full h-48 flex items-center justify-center">
              <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Stock Alerts]</div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 