interface SideNavBarProps {
  subpages: string[];
  subpage: string;
  setSubpage: (s: string) => void;
}

export default function SideNavBar({ subpages, subpage, setSubpage }: SideNavBarProps) {
  return (
    <aside className="w-56 min-h-full bg-black border-r border-neutral-800 flex flex-col py-8 px-4">
      <nav className="flex flex-col gap-2">
        {subpages.map((sp) => (
          <button
            key={sp}
            onClick={() => setSubpage(sp)}
            className={`text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${subpage === sp ? 'bg-orange-400 text-black shadow' : 'text-neutral-200 hover:bg-neutral-800 hover:text-orange-200'}`}
          >
            {sp}
          </button>
        ))}
      </nav>
    </aside>
  );
} 