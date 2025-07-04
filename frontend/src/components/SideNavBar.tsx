interface SideNavBarProps {
  subpages: string[];
  subpage: string;
  setSubpage: (s: string) => void;
}

export default function SideNavBar({ subpages, subpage, setSubpage }: SideNavBarProps) {
  return (
    <aside className="w-full h-full flex flex-col justify-center items-center bg-black/90 py-8 px-2">
      <nav className="flex flex-col justify-center items-center w-full h-full gap-2">
        {subpages.map((sp, i) => (
          <button
            key={sp}
            onClick={() => setSubpage(sp)}
            className={`w-11/12 text-left px-6 py-4 rounded-lg font-medium transition-all duration-200 border-l-4 ${subpage === sp ? 'border-orange-400 bg-neutral-900 text-orange-200 shadow' : 'border-transparent text-neutral-200 hover:bg-neutral-800 hover:text-orange-200'} ${i < subpages.length - 1 ? 'mb-2 border-b-2 border-b-orange-900' : ''}`}
            style={{ minHeight: '56px' }}
          >
            {sp}
          </button>
        ))}
      </nav>
    </aside>
  );
} 