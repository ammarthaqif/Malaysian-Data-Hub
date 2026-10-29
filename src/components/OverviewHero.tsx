import React from 'react';
import { Search, Database, ArrowRight, BarChart3, Radio, ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import heroBgImage from '../assets/images/malaysia_data_horizon_1793233795776.jpg';

interface OverviewHeroProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: any) => void;
  catalogCount: number;
  liveWeatherAlertsCount: number;
  language: Language;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({
  onSearch,
  onNavigateTab,
  catalogCount,
  liveWeatherAlertsCount,
  language,
}) => {
  const [searchInput, setSearchInput] = React.useState('');
  const t = TRANSLATIONS[language];

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
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
        <img
          src={heroBgImage}
          alt="Putrajaya and Kuala Lumpur Civic Infrastructure"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-3xl">
          {/* Metadata breadcrumb without pill */}
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide mb-3">
            <span>{language === 'en' ? 'Official Malaysian Government Open Data' : 'Data Terbuka Rasmi Kerajaan Malaysia'}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'en' ? 'Public Access Portal' : 'Akses Awam Rakyat'}</span>
            <span aria-hidden="true">·</span>
            <span>developer.data.gov.my</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 text-balance">
            {t.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
            {t.heroSubtitle}
          </p>

          {/* Friendly Search Bar */}
          <form onSubmit={handleSubmit} className="relative flex items-center max-w-xl mb-6">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors shadow-sm"
            >
              {t.searchButton}
            </button>
          </form>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300">
            <span className="text-slate-500">{t.popularSearches}</span>
            {[
              { label: language === 'en' ? 'Petrol Price' : 'Harga Petrol', id: 'fuelprice' },
              { label: language === 'en' ? 'CPI Inflation' : 'Kadar Inflasi', id: 'cpi_headline' },
              { label: language === 'en' ? 'State Income' : 'Gaji Negeri', id: 'hies_state' },
              { label: language === 'en' ? 'Weather Warnings' : 'Amaran Cuaca', id: 'weather_warning' },
              { label: language === 'en' ? 'Population' : 'Penduduk', id: 'population_state' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSearch(item.id);
                  onNavigateTab('catalogue');
                }}
                className="hover:text-amber-400 transition-colors text-slate-300 underline underline-offset-4 decoration-slate-700 hover:decoration-amber-400"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Indicator Metric Strip */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>{language === 'en' ? 'Open Datasets' : 'Set Data Terbuka'}</span>
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
            <div className="text-[11px] text-slate-500 mt-1">{language === 'en' ? 'Per Litre (Ceiling)' : 'Seliter (Kadar Siling)'}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>RON97 Petrol</span>
              <span className="text-[10px] text-slate-400 font-mono">FLOAT</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              RM 3.19
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{language === 'en' ? 'Market float price' : 'Harga apungan pasaran'}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Headline CPI</span>
              <span className="text-[10px] text-emerald-400 font-mono">STABLE</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              1.9%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{language === 'en' ? 'Annual Inflation' : 'Kadar Inflasi Tahunan'}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>{language === 'en' ? 'Unemployment' : 'Kadar Pengangguran'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">LOW</span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              3.0%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{language === 'en' ? '17.65M Labour Force' : '17.65J Tenaga Buruh'}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>{language === 'en' ? 'Weather Alerts' : 'Amaran Cuaca'}</span>
              <Radio className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-amber-400">
              {liveWeatherAlertsCount || 2} {language === 'en' ? 'Active' : 'Aktif'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">MET Malaysia</div>
          </div>
        </div>
      </div>
    </div>
  );
};
