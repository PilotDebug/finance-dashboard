interface TopNavBarProps {
  section: string;
  setSection: (s: string) => void;
  sections: string[];
}

export default function TopNavBar({ section, setSection, sections }: TopNavBarProps) {
  return (
    <nav className="w-full h-full grid grid-cols-6 items-center justify-center font-mono">
      {sections.map((s, i) => (
        <button
          key={s}
          onClick={() => setSection(s)}
          className={`h-full w-full text-xl font-bold flex items-center justify-center transition-all duration-200 border-0 border-r-4 ${i < sections.length - 1 ? 'border-orange-400' : ''} ${section === s ? 'bg-orange-400 text-black shadow-lg' : 'bg-black text-orange-200 hover:bg-neutral-900 hover:text-orange-300'} focus:outline-none`}
          style={{ borderLeft: i === 0 ? 'none' : '2px solid #ff9100', borderRight: i === sections.length - 1 ? 'none' : '2px solid #ff9100', fontFamily: 'inherit' }}
        >
          {s}
        </button>
      ))}
    </nav>
  );
} 