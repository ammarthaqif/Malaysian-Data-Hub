import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { OverviewHero } from './components/OverviewHero';
import { CitizenQuickAnswers } from './components/CitizenQuickAnswers';
import { DailyDigestCard } from './components/DailyDigestCard';
import { CatalogueView } from './components/CatalogueView';
import { IndicatorsView } from './components/IndicatorsView';
import { MalaysiaMapChoropleth } from './components/MalaysiaMapChoropleth';
import { AiTrendProjectionView } from './components/AiTrendProjectionView';
import { CompareView } from './components/CompareView';
import { RealTimeStreamView } from './components/RealTimeStreamView';
import { ApiHealthView } from './components/ApiHealthView';
import { ReportExportModal } from './components/ReportExportModal';
import { RealtimeStreamEvent } from './types/dataset';
import { Language, TRANSLATIONS } from './data/translations';
import { subscribeToRealtimeStream, getDatasetsList, getWeatherWarnings } from './services/api';
import {
  ExternalLink,
  Database,
  BarChart3,
  GitCompare,
  Radio,
  MapPin,
  BrainCircuit,
  Sparkles,
  Code2,
  ShieldCheck,
  Info,
  Activity,
  Heart,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [comparedIds, setComparedIds] = useState<string[]>(['ron97', 'cpi_headline']);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);

  // Real-time telemetry state
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [events, setEvents] = useState<RealtimeStreamEvent[]>([]);
  const [catalogCount, setCatalogCount] = useState<number>(355);
  const [liveWeatherAlertsCount, setLiveWeatherAlertsCount] = useState<number>(2);

  const t = TRANSLATIONS[language];

  // Subscribe to real-time telemetry stream
  useEffect(() => {
    if (!isStreaming) return;

    const unsubscribe = subscribeToRealtimeStream(
      (newEvent) => {
        setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
      },
      (err) => {
        console.warn('Realtime subscription error:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isStreaming]);

  // Initial metadata fetch
  useEffect(() => {
    const initData = async () => {
      try {
        const [cat, warnings] = await Promise.all([
          getDatasetsList({ limit: 1 }),
          getWeatherWarnings(),
        ]);
        if (cat.total_catalog) setCatalogCount(cat.total_catalog);
        if (warnings && warnings.length) setLiveWeatherAlertsCount(warnings.length);
      } catch (err) {
        console.warn('Initial data load error:', err);
      }
    };
    initData();
  }, []);

  const handleSelectForCompare = (id: string) => {
    if (!comparedIds.includes(id)) {
      setComparedIds([...comparedIds, id]);
    }
  };

  const handleRemoveFromCompare = (id: string) => {
    setComparedIds(comparedIds.filter((item) => item !== id));
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('catalogue');
  };

  const handleDigestExplore = (datasetId: string) => {
    setSearchQuery(datasetId);
    setActiveTab('catalogue');
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'bm' : 'en'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setReportModalOpen(true)}
        isStreamingActive={isStreaming}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Hero Banner with Search */}
            <OverviewHero
              onSearch={handleHeroSearch}
              onNavigateTab={setActiveTab}
              catalogCount={catalogCount}
              liveWeatherAlertsCount={liveWeatherAlertsCount}
              language={language}
            />

            {/* Citizen Quick Answers Widget - Specifically for the General Public */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CitizenQuickAnswers
                language={language}
                onNavigateToTab={setActiveTab}
              />
            </div>

            {/* Daily Digest Section on Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <DailyDigestCard onExploreDataset={handleDigestExplore} />
            </div>

            {/* Platform Feature Workspaces Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>{language === 'en' ? 'Explore Open Data Workspaces' : 'Terokai Ruang Kerja Data Terbuka'}</span>
                <span aria-hidden="true">·</span>
                <span>developer.data.gov.my</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-6">
                {language === 'en' ? 'Integrated Public Analytics Workspaces' : 'Ruang Kerja Analisis Awam Bersepadu'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div
                  onClick={() => setActiveTab('catalogue')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    {language === 'en' ? `Dataset Catalogue (${catalogCount}+)` : `Katalog Data (${catalogCount}+)`}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'en'
                      ? 'Search and query datasets across DOSM, MOF, JPJ, PDRM, and JPN with interactive API inspectors.'
                      : 'Cari dan semak set data daripada pelbagai kementerian dengan penganalisis API interaktif.'}
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('map')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">
                    {language === 'en' ? 'Regional Choropleth Map' : 'Peta Wilayah & Negeri'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'en'
                      ? 'Explore household incomes, Gini inequality ratios, and population distribution across all 16 states.'
                      : 'Ketahui pendapatan median, jurang Gini, dan jumlah penduduk merentasi semua 16 negeri & wilayah.'}
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('projections')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {language === 'en' ? 'AI Trend Projections' : 'Ramalan Aliran AI'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'en'
                      ? 'Gemini API machine learning macroeconomic trajectories, confidence intervals, and policy insights.'
                      : 'Unjuran trajektori ekonomi berasaskan kecerdasan buatan Gemini API dengan julat keyakinan.'}
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('health')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {language === 'en' ? 'API Health Monitor' : 'Status Kesihatan API'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'en'
                      ? 'Real-time status, latency tracker, HTTP response codes, and probe sparklines across open data endpoints.'
                      : 'Pemantau kependaman milisaat dan kelancaran sambungan ke pelayan data.gov.my secara langsung.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Live Indicator Charts on Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <IndicatorsView />
            </div>
          </div>
        )}

        {activeTab === 'digest' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DailyDigestCard onExploreDataset={handleDigestExplore} />
          </div>
        )}

        {activeTab === 'catalogue' && (
          <CatalogueView
            initialSearch={searchQuery}
            onSelectForCompare={handleSelectForCompare}
            comparedIds={comparedIds}
          />
        )}

        {activeTab === 'indicators' && <IndicatorsView />}

        {activeTab === 'map' && <MalaysiaMapChoropleth />}

        {activeTab === 'projections' && <AiTrendProjectionView />}

        {activeTab === 'compare' && (
          <CompareView
            queuedDatasetIds={comparedIds}
            onRemoveFromQueue={handleRemoveFromCompare}
          />
        )}

        {activeTab === 'stream' && (
          <RealTimeStreamView
            events={events}
            isStreaming={isStreaming}
            onToggleStreaming={() => setIsStreaming(!isStreaming)}
            onClearEvents={() => setEvents([])}
          />
        )}

        {activeTab === 'health' && <ApiHealthView />}
      </main>

      {/* Exportable Reports Modal */}
      <ReportExportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* Platform Info & Developer Modal */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">About Malaysia Open Data Explorer</h3>
              </div>
              <button
                onClick={() => setAboutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                A public analytics platform designed to scrape, aggregate, and visualize official open datasets from{' '}
                <strong className="text-amber-300">developer.data.gov.my</strong>, OpenDOSM, and the Ministry of Finance.
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Developed By:</span>
                  <span className="text-amber-400 font-bold">Ammar Thaqif</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact / Email:</span>
                  <span className="text-slate-200">ammarthaqif.ar@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Intelligence Engine:</span>
                  <span className="text-emerald-400">Google Gemini API (3.8 Flash)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deployment Targets:</span>
                  <span className="text-slate-300">GitHub Actions CI/CD & Vercel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data License:</span>
                  <span className="text-slate-300">Malaysian Open Government Licence</span>
                </div>
              </div>

              <p className="text-slate-400">
                Features real-time Server-Sent Events (SSE) telemetry, D3/SVG regional choropleth mapping across all 16 states, and multi-format report exports (CSV, JSON, PDF).
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setAboutModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Footer with Developer Attribution */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Malaysia Open Data Explorer</span>
            <span aria-hidden="true">·</span>
            <span>{t.developedBy} <strong className="text-amber-400 font-medium">Ammar Thaqif</strong></span>
            <span aria-hidden="true">·</span>
            <span className="text-[11px] text-slate-500">ammarthaqif.ar@gmail.com</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('health')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'API Health' : 'Status API'}</span>
            </button>
            <button
              onClick={() => setAboutModalOpen(true)}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Platform Info' : 'Maklumat Portal'}</span>
            </button>
            <a
              href="https://developer.data.gov.my"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>developer.data.gov.my</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://open.dosm.gov.my"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>OpenDOSM</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setReportModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              {t.exportReport}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
