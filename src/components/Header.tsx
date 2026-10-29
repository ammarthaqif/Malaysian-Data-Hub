import React from 'react';
import { FileText, Radio, Sparkles, MapPin, BrainCircuit, Activity } from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'digest'
  | 'catalogue'
  | 'indicators'
  | 'map'
  | 'projections'
  | 'compare'
  | 'stream'
  | 'health';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenReportModal: () => void;
  isStreamingActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  isStreamingActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark (single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="text-left font-bold text-lg tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 rotate-45 inline-block" />
            <span className="whitespace-nowrap">data.gov.my Explorer</span>
          </button>
        </div>

        {/* Zone 2: Single-line navigation links */}
        <nav className="hidden xl:flex items-center gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('digest')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'digest'
                ? 'text-white border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Digest</span>
          </button>

          <button
            onClick={() => setActiveTab('catalogue')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'catalogue'
                ? 'text-white border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Catalogue
          </button>

          <button
            onClick={() => setActiveTab('indicators')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'indicators'
                ? 'text-white border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Indicators
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'map'
                ? 'text-white border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Map</span>
          </button>

          <button
            onClick={() => setActiveTab('projections')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'projections'
                ? 'text-white border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Forecast</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'compare'
                ? 'text-white border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Compare
          </button>

          <button
            onClick={() => setActiveTab('stream')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'stream'
                ? 'text-white border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isStreamingActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'health'
                ? 'text-white border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>API Health</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-slate-950" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
