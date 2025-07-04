import { useEffect, useState } from "react";
import { fetchDeFi } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

interface Props { 
  subpage: string; 
}

interface DeFiOpportunity {
  id: string;
  protocol: string;
  token: string;
  apy: number;
}

export default function DeFiPage({ subpage }: Props) {
  const [data, setData] = useState<DeFiOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeFi()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch DeFi data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-orange-200">DeFi - {subpage}</h2>
      {loading ? (
        <LoadingSpinner message="Loading DeFi data..." />
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <>
          {subpage === 'Opportunities' && (
            <ul className="list-disc pl-4 text-left">
              {data.map((opp: DeFiOpportunity) => (
                <li key={opp.id}>{opp.protocol} - {opp.token} - {opp.apy}% APY</li>
              ))}
            </ul>
          )}
          {subpage === 'DEX' && (
            <div className="w-full h-48 flex items-center justify-center">
              <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[DEX Chart]</div>
            </div>
          )}
          {subpage === 'CEX' && (
            <div className="w-full h-48 flex items-center justify-center">
              <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[CEX Chart]</div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 