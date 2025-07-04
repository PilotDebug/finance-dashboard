interface Props { subpage: string; }

export default function TradingActivityPage({ subpage }: Props) {
  return (
    <div className="w-full h-full flex flex-col">
      {subpage === 'History' && (
        <div className="w-full h-48 flex items-center justify-center">
          <table className="w-2/3 text-left bg-neutral-800 rounded-lg overflow-hidden">
            <thead className="bg-orange-400 text-black">
              <tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">Pair</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Amount</th></tr>
            </thead>
            <tbody>
              <tr><td className="px-4 py-2">2024-07-01</td><td className="px-4 py-2">BTC/USD</td><td className="px-4 py-2">Buy</td><td className="px-4 py-2">0.5</td></tr>
              <tr><td className="px-4 py-2">2024-07-02</td><td className="px-4 py-2">ETH/USD</td><td className="px-4 py-2">Sell</td><td className="px-4 py-2">2</td></tr>
            </tbody>
          </table>
        </div>
      )}
      {subpage === 'Open Orders' && (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Open Orders Chart]</div>
        </div>
      )}
      {subpage === 'Analytics' && (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Trading Analytics]</div>
        </div>
      )}
    </div>
  );
} 