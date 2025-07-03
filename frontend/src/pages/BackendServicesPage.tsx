interface Props { subpage: string; }

export default function BackendServicesPage({ subpage }: Props) {
  return (
    <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-orange-300">Backend Services - {subpage}</h2>
      {subpage === 'Health' && (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Health Status]</div>
        </div>
      )}
      {subpage === 'Logs' && (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Log Viewer]</div>
        </div>
      )}
      {subpage === 'Settings' && (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="w-64 h-32 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold text-black">[Settings Panel]</div>
        </div>
      )}
    </div>
  );
} 