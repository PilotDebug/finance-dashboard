import { useState } from 'react';
import PortfolioPage from './pages/PortfolioPage';
import TradingActivityPage from './pages/TradingActivityPage';
import StocksPage from './pages/StocksPage';
import DeFiPage from './pages/DeFiPage';
import BankingPage from './pages/BankingPage';
import BackendServicesPage from './pages/BackendServicesPage';
import NotFoundPage from './pages/NotFoundPage';

const SECTIONS = [
  'Portfolio',
  'Trading Activity',
  'Stocks',
  'DeFi',
  'Banking',
  'Backend Services',
];

const SUBPAGES = {
  Portfolio: ['Overview', 'Performance', 'Holdings'],
  'Trading Activity': ['History', 'Open Orders', 'Analytics'],
  Stocks: ['RKLB', 'Watchlist', 'Alerts'],
  DeFi: ['Opportunities', 'DEX', 'CEX'],
  Banking: ['Accounts', 'Transfers', 'Statements'],
  'Backend Services': ['Health', 'Logs', 'Settings'],
} as const;

type Section = keyof typeof SUBPAGES;

function TitleCard() {
  return (
    <div
      className="w-full flex items-center justify-center font-mono"
      style={{
        height: '16vh',
        minHeight: 120,
        background: 'linear-gradient(90deg, #18181b 80%, #ff9100 120%)',
        borderBottom: '3px solid #ff9100',
      }}
    >
      <div className="flex items-center justify-center w-full max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-center gap-8 w-full">
          <svg width="120" height="120" viewBox="0 0 48 48" fill="none" className="flex-shrink-0">
            <circle cx="24" cy="24" r="22" stroke="#ff9100" strokeWidth="4" fill="#18181b" />
            <polygon points="24,10 34,36 24,30 14,36" fill="#ff9100" stroke="#fff8e1" strokeWidth="2" />
            <rect x="22.5" y="30" width="3" height="8" rx="1.5" fill="#fff8e1" />
          </svg>
          <span
            className="font-extrabold text-orange-400 tracking-widest font-mono drop-shadow-lg"
            style={{
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              letterSpacing: '0.2em',
              textShadow: '0 2px 16px #ff9100',
              lineHeight: 1,
              width: '50%',
              textAlign: 'center',
            }}
          >
            PILOT DEBUG
          </span>
        </div>
      </div>
    </div>
  );
}

function MainNavBar({ section, setSection }: { section: Section; setSection: (s: Section) => void }) {
  return (
    <nav
      className="w-full"
      style={{
        height: '12vh',
        minHeight: 80,
        background: 'linear-gradient(90deg, #18181b 80%, #ff9100 120%)',
        borderBottom: '3px solid #ff9100',
      }}
    >
      <div className="flex w-full h-full">
        {SECTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => setSection(s as Section)}
            className={`h-full font-bold flex items-center justify-center transition-all duration-200 ${section === s ? 'bg-orange-400 text-black shadow-lg' : 'bg-black text-orange-200 hover:bg-neutral-900 hover:text-orange-300'} focus:outline-none`}
            style={{
              width: `${100 / SECTIONS.length}%`,
              borderRight: i < SECTIONS.length - 1 ? '2px solid #ff9100' : 'none',
              fontFamily: 'inherit',
              fontSize: 'clamp(0.9rem, 1.5vw, 1.5rem)',
              padding: '0.5rem',
            }}
          >
            <span className="text-center leading-tight">{s}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function SideNavBar({ subpages, subpage, setSubpage }: { subpages: string[]; subpage: string; setSubpage: (s: string) => void }) {
  return (
    <aside 
      className="h-full w-full flex flex-col justify-start items-center"
      style={{
        background: 'linear-gradient(180deg, #18181b 80%, #ff9100 120%)',
      }}
    >
      <nav className="flex flex-col w-full h-full pt-12 px-6 gap-4">
        {subpages.map((sp, i) => (
          <button
            key={sp}
            onClick={() => setSubpage(sp)}
            className={`w-full text-center px-8 py-8 rounded-xl font-bold text-xl transition-all duration-200 border-l-4 ${subpage === sp ? 'border-orange-400 bg-orange-400/20 text-orange-200 shadow-xl scale-105' : 'border-transparent text-neutral-200 hover:bg-neutral-800 hover:text-orange-200 hover:border-orange-300'}`}
            style={{ 
              minHeight: '80px', 
              fontFamily: 'inherit',
              fontSize: 'clamp(1rem, 1.2vw, 1.4rem)',
            }}
          >
            {sp}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function MainContentCard({ section, subpage }: { section: Section; subpage: string }) {
  let PageComponent: React.ComponentType<{ subpage: string }> | null = null;
  switch (section) {
    case 'Portfolio':
      PageComponent = PortfolioPage;
      break;
    case 'Trading Activity':
      PageComponent = TradingActivityPage;
      break;
    case 'Stocks':
      PageComponent = StocksPage;
      break;
    case 'DeFi':
      PageComponent = DeFiPage;
      break;
    case 'Banking':
      PageComponent = BankingPage;
      break;
    case 'Backend Services':
      PageComponent = BackendServicesPage;
      break;
    default:
      PageComponent = null;
  }
  return (
    <div className="h-full w-full p-8 overflow-y-auto font-mono flex flex-col" style={{ background: 'linear-gradient(135deg, #18181b 80%, #ff9100 120%)', boxShadow: '0 0 32px #ff910033' }}>
      <div className="w-full">
        <h2 className="text-3xl font-extrabold text-orange-200 mb-6">{section} - {subpage}</h2>
        {PageComponent ? <PageComponent subpage={subpage} /> : <NotFoundPage />}
      </div>
    </div>
  );
}

export default function App() {
  const [section, setSection] = useState<Section>('Portfolio');
  const [subpage, setSubpage] = useState<string>(SUBPAGES['Portfolio'][0]);

  // When section changes, reset subpage
  const handleSectionChange = (newSection: Section) => {
    setSection(newSection);
    setSubpage(SUBPAGES[newSection][0]);
  };

  // Calculate heights for layout
  const headerHeight = 16; // vh
  const navHeight = 12; // vh (updated to match new nav height)
  const contentHeight = 100 - headerHeight - navHeight; // 72vh

  return (
    <div className="min-h-screen w-screen bg-black font-mono overflow-hidden flex flex-col" style={{ minHeight: '100vh' }}>
      {/* Title Card */}
      <TitleCard />
      {/* Main Nav Bar */}
      <MainNavBar section={section} setSection={handleSectionChange} />
      {/* Content Row */}
      <div
        className="flex flex-row flex-1 min-h-0 w-full"
        style={{ height: `${contentHeight}vh` }}
      >
        {/* Side Nav Bar */}
        <div className="flex-none h-full" style={{ width: '25%', minWidth: '300px', borderRight: '3px solid #ff9100' }}>
          <SideNavBar
            subpages={[...SUBPAGES[section]]}
            subpage={subpage}
            setSubpage={setSubpage}
          />
        </div>
        {/* Main Content Card */}
        <div className="flex-1 h-full min-h-0">
          <MainContentCard section={section} subpage={subpage} />
        </div>
      </div>
      <style>{`
        html, body, #root { height: 100%; width: 100vw; margin: 0; padding: 0; overflow: hidden; font-family: 'Fira Mono', 'JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace !important; }
        body { background: #000 !important; }
      `}</style>
    </div>
  );
}
