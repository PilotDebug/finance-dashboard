interface Props { subpage: string; }

export default function StocksPage({ subpage }: Props) {
  return (
    <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-orange-300">Stocks - {subpage}</h2>
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
              <tr><td className="px-4 py-2">AAPL</td><td className="px-4 py-2">$200</td></tr>
              <tr><td className="px-4 py-2">GOOG</td><td className="px-4 py-2">$2,500</td></tr>
            </tbody>
          </table>
        </div>
      )}
      {subpage === 'Alerts' && (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Stock Alerts]</div>
        </div>
      )}
    </div>
  );
} 