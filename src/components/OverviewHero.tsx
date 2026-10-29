import React from 'react';
import { Search, Database, ArrowRight, BarChart3, Radio, ShieldCheck, ExternalLink } from 'lucide-react';

interface OverviewHeroProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: 'overview' | 'catalogue' | 'indicators' | 'compare' | 'stream') => void;
  catalogCount: number;
  liveWeatherAlertsCount: number;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({
  onSearch,
  onNavigateTab,
  catalogCount,
  liveWeatherAlertsCount,
}) => {
  const [searchInput, setSearchInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      onNavigateTab('catalogue');
    }
  };

  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
      {/* Background Graphic with Scrim */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity">
        <img
          src="/src/assets/images/malaysia_data_horizon_1793233795776.jpg"
          alt="Putrajaya and Kuala Lumpur Civic Infrastructure"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-3xl">
          {/* Metadata breadcrumb without pill */}
          <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium tracking-wide mb-3">
            <span>Official developer.data.gov.my Integration</span>
            <span aria-hidden="true">·</span>
            <span>National Open API Gateway</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Public Feeds</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 text-balance">
            Malaysia Open Data Centralized Dashboard
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
            A unified public analytics platform scraping, aggregating, and visualizing open data across Malaysian ministries. Explore macroeconomic indices, commodity prices, demographic distributions, and live telemetry feeds.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="relative flex items-center max-w-xl mb-8">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search 355+ datasets (e.g. CPI inflation, fuel price, GDP, population, weather)..."
              className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors"
            >
              Explore
            </button>
          </form>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <span className="text-slate-500">Popular Queries:</span>
            {['fuelprice', 'cpi_headline', 'gdp_quarterly', 'labour_force', 'weather_warning'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  onSearch(term);
                  onNavigateTab('catalogue');
                }}
                className="hover:text-amber-400 transition-colors text-slate-300 underline underline-offset-4 decoration-slate-700 hover:decoration-amber-400"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Indicator Metric Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Catalogued Datasets</span>
              <Database className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              {catalogCount || 355}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">DOSM, MOF, PDRM, MET</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>RON95 Petrol</span>
              <span className="text-[10px] text-emerald-400 font-mono">FIXED</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              RM 2.05
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Per Litre (Weekly APM)</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>RON97 Petrol</span>
              <span className="text-[10px] text-slate-400 font-mono">FLOAT</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              RM 3.19
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Market float price</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Headline CPI</span>
              <span className="text-[10px] text-emerald-400 font-mono">STABLE</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              1.9%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Year-on-Year Inflation</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Unemployment Rate</span>
              <span className="text-[10px] text-emerald-400 font-mono">LOW</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              3.0%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">17.65M Labour Force</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Live Weather Alerts</span>
              <Radio className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-amber-400">
              {liveWeatherAlertsCount || 2} Active
            </div>
            <div className="text-[11px] text-slate-500 mt-1">MET Thunderstorm Warning</div>
          </div>
        </div>
      </div>
    </div>
  );
};
