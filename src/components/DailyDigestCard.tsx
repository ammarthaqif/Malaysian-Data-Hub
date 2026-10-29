import React, { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { DailyDigestResponse, DailyDigestHighlight } from '../types/dataset';
import { getDailyDigest } from '../services/api';

interface DailyDigestProps {
  onExploreDataset: (datasetId: string) => void;
}

export const DailyDigestCard: React.FC<DailyDigestProps> = ({ onExploreDataset }) => {
  const [digest, setDigest] = useState<DailyDigestResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fetchDigest = async () => {
    setLoading(true);
    try {
      const data = await getDailyDigest();
      setDigest(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDigest();
  }, []);

  if (loading && !digest) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/4 mb-4" />
        <div className="h-6 bg-slate-800 rounded w-1/2 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-slate-800/60 rounded-xl" />
          <div className="h-32 bg-slate-800/60 rounded-xl" />
          <div className="h-32 bg-slate-800/60 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!digest) return null;

  const categories = ['All', ...Array.from(new Set(digest.highlights.map((h) => h.category)))];

  const filteredHighlights = digest.highlights.filter((h) => {
    if (selectedCategory === 'All') return true;
    return h.category === selectedCategory;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Digest Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Open Data Intelligence Bulletin</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-400">{digest.digest_date}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Malaysia Open Data Daily Digest
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Tabs */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs overflow-x-auto max-w-xs sm:max-w-none">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 whitespace-nowrap rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={fetchDigest}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title="Refresh Digest"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Lead Narrative Summary */}
      <div className="py-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal bg-slate-950/40 p-4 rounded-xl my-5 border border-slate-800/80">
        <span className="font-semibold text-amber-300">Executive Snapshot: </span>
        {digest.lead_summary}
      </div>

      {/* Impactful Highlights Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHighlights.map((item) => (
          <div
            key={item.id}
            className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Card Meta Header */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[11px] font-mono text-amber-400 font-semibold">
                  {item.badge}
                </span>
                <span className="text-[11px] text-slate-500">{item.category}</span>
              </div>

              {/* Title & Key Stat Value */}
              <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>

              <div className="bg-slate-900 border border-slate-800/80 rounded-lg px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-200 mb-3">
                {item.value}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {item.impact_summary}
              </p>
            </div>

            {/* Footer with Source & Quick Action */}
            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 truncate max-w-[170px]" title={item.source}>
                {item.source}
              </span>

              <button
                onClick={() => {
                  if (item.id === 'fuel_digest') onExploreDataset('fuelprice');
                  else if (item.id === 'cpi_digest') onExploreDataset('cpi_headline');
                  else if (item.id === 'weather_digest') onExploreDataset('weather_warning');
                  else if (item.id === 'labour_digest') onExploreDataset('labour_force');
                  else onExploreDataset('exchange_rate');
                }}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                <span>View Data</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
