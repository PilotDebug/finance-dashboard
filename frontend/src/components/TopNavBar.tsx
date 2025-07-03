interface TopNavBarProps {
  section: string;
  setSection: (s: string) => void;
  sections: string[];
}

export default function TopNavBar({ section, setSection, sections }: TopNavBarProps) {
  return (
    <header className="w-full h-16 flex items-center px-8 bg-black border-b-4 border-orange-400 shadow-lg z-20">
      <div className="flex items-center gap-3 mr-8">
        <span className="text-2xl font-extrabold text-orange-400 tracking-widest">&#9679; PilotDebug</span>
      </div>
      <nav className="flex gap-6 flex-1">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`text-lg font-semibold px-4 py-2 rounded transition-all duration-200 border-b-2 ${section === s ? 'border-orange-400 text-orange-300 bg-neutral-900' : 'border-transparent text-neutral-200 hover:text-orange-200 hover:bg-neutral-800'}`}
          >
            {s}
          </button>
        ))}
      </nav>
    </header>
  );
} 