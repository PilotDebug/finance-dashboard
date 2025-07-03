import { useState } from 'react';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
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

const PAGE_COMPONENTS = {
  Portfolio: PortfolioPage,
  'Trading Activity': TradingActivityPage,
  Stocks: StocksPage,
  DeFi: DeFiPage,
  Banking: BankingPage,
  'Backend Services': BackendServicesPage,
};

export default function App() {
  const [section, setSection] = useState<Section>('Portfolio');
  const [subpage, setSubpage] = useState<string>(SUBPAGES['Portfolio'][0]);

  const handleSectionChange = (newSection: string) => {
    setSection(newSection as Section);
    setSubpage(SUBPAGES[newSection as Section][0]);
  };

  const handleSubpageChange = (newSubpage: string) => {
    setSubpage(newSubpage);
  };

  const validSection = SECTIONS.includes(section);
  const validSubpage = validSection && SUBPAGES[section as Section].includes(subpage);
  const PageComponent = validSection ? PAGE_COMPONENTS[section] : null;

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans">
      {/* Starfield background */}
      <div className="fixed inset-0 -z-10 bg-black">
        <svg width="100%" height="100%" className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }}>
          {Array.from({ length: 180 }).map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * window.innerWidth}
              cy={Math.random() * window.innerHeight}
              r={Math.random() * 1.2 + 0.2}
              fill="#fff8e1"
              opacity={Math.random() * 0.7 + 0.2}
            />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/3 w-[700px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-orange-400 via-pink-600 to-indigo-900" />
      </div>
      <TopNavBar
        section={section}
        setSection={handleSectionChange}
        sections={SECTIONS}
      />
      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <SideNavBar
          subpages={[...SUBPAGES[section]]}
          subpage={subpage}
          setSubpage={handleSubpageChange}
        />
        <main className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-black via-indigo-950 to-black">
          <div className="w-full max-w-3xl">
            {validSection && validSubpage && PageComponent ? (
              <PageComponent subpage={subpage} />
            ) : (
              <NotFoundPage />
            )}
          </div>
        </main>
      </div>
      <style>{`
        body { background: #000 !important; }
      `}</style>
    </div>
  );
}
