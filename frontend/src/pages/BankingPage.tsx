interface Props { subpage: string; }

export default function BankingPage({ subpage }: Props) {
  return (
    <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-orange-300">Banking - {subpage}</h2>
      {subpage === 'Accounts' && (
        <div className="w-full h-48 flex items-center justify-center">
          <table className="w-2/3 text-left bg-neutral-800 rounded-lg overflow-hidden">
            <thead className="bg-orange-400 text-black">
              <tr><th className="px-4 py-2">Account</th><th className="px-4 py-2">Balance</th></tr>
            </thead>
            <tbody>
              <tr><td className="px-4 py-2">Checking</td><td className="px-4 py-2">$5,000</td></tr>
              <tr><td className="px-4 py-2">Savings</td><td className="px-4 py-2">$20,000</td></tr>
            </tbody>
          </table>
        </div>
      )}
      {subpage === 'Transfers' && (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Transfer Widget]</div>
        </div>
      )}
      {subpage === 'Statements' && (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Statements PDF]</div>
        </div>
      )}
    </div>
  );
} 