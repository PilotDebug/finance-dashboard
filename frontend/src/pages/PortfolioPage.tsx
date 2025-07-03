interface Props { subpage: string; }

export default function PortfolioPage({ subpage }: Props) {
  return (
    <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-orange-300">Portfolio - {subpage}</h2>
      {subpage === 'Overview' && (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 flex items-center justify-center text-2xl font-bold text-black">$123,456</div>
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
              <tr><td className="px-4 py-2">BTC</td><td className="px-4 py-2">$50,000</td></tr>
              <tr><td className="px-4 py-2">ETH</td><td className="px-4 py-2">$30,000</td></tr>
              <tr><td className="px-4 py-2">USDC</td><td className="px-4 py-2">$10,000</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 