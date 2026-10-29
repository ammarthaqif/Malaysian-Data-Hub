import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Sliders,
  Download,
  Plus,
  Trash2,
  TrendingUp,
  Percent,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CURATED_FUEL_PRICES, CURATED_CPI, CURATED_LABOUR, CURATED_GDP } from '../data/curatedIndicators';
import { exportToCSV } from '../services/api';

interface AvailableMetric {
  id: string;
  name: string;
  category: string;
  unit: string;
  color: string;
  data: { date: string; value: number }[];
}

interface CompareViewProps {
  queuedDatasetIds: string[];
  onRemoveFromQueue: (id: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  queuedDatasetIds,
  onRemoveFromQueue,
}) => {
  // Build standard comparative series indexed on quarterly / common dates
  const availableMetrics: AvailableMetric[] = useMemo(() => [
    {
      id: 'ron95',
      name: 'RON95 Subsidised Fuel',
      category: 'Energy',
      unit: 'RM / L',
      color: '#f59e0b',
      data: CURATED_FUEL_PRICES.map((p) => ({ date: p.date.substring(0, 7), value: p.ron95 })),
    },
    {
      id: 'ron97',
      name: 'RON97 Market Fuel',
      category: 'Energy',
      unit: 'RM / L',
      color: '#10b981',
      data: CURATED_FUEL_PRICES.map((p) => ({ date: p.date.substring(0, 7), value: p.ron97 })),
    },
    {
      id: 'diesel',
      name: 'Diesel Fuel',
      category: 'Energy',
      unit: 'RM / L',
      color: '#0284c7',
      data: CURATED_FUEL_PRICES.map((p) => ({ date: p.date.substring(0, 7), value: p.diesel })),
    },
    {
      id: 'cpi_headline',
      name: 'Headline CPI Index',
      category: 'Inflation',
      unit: 'Index Pt',
      color: '#8b5cf6',
      data: CURATED_CPI.map((c) => ({ date: c.date, value: c.headline_cpi })),
    },
    {
      id: 'cpi_food',
      name: 'Food & Beverage CPI',
      category: 'Cost of Living',
      unit: 'Index Pt',
      color: '#f43f5e',
      data: CURATED_CPI.map((c) => ({ date: c.date, value: c.food_beverage })),
    },
    {
      id: 'cpi_transport',
      name: 'Transport CPI',
      category: 'Cost of Living',
      unit: 'Index Pt',
      color: '#06b6d4',
      data: CURATED_CPI.map((c) => ({ date: c.date, value: c.transport })),
    },
    {
      id: 'unemployment',
      name: 'Unemployment Rate',
      category: 'Labour',
      unit: '%',
      color: '#ec4899',
      data: CURATED_LABOUR.map((l) => ({ date: l.date, value: l.unemployment_rate })),
    },
    {
      id: 'labour_force',
      name: 'Workforce Expansion',
      category: 'Labour',
      unit: 'Million',
      color: '#34d399',
      data: CURATED_LABOUR.map((l) => ({ date: l.date, value: +(l.labour_force_thousand / 1000).toFixed(2) })),
    },
    {
      id: 'gdp_growth',
      name: 'GDP YoY Growth',
      category: 'Economy',
      unit: '% YoY',
      color: '#fbbf24',
      data: CURATED_GDP.map((g) => ({ date: `${g.year}-${g.quarter === 'Q1' ? '03' : g.quarter === 'Q2' ? '06' : g.quarter === 'Q3' ? '09' : '12'}`, value: g.growth_rate_yoy })),
    },
  ], []);

  // Selected metrics to compare
  const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>([
    'ron97',
    'cpi_headline',
    'cpi_transport',
  ]);

  const [normalizeMode, setNormalizeMode] = useState<boolean>(true);

  // If items in queue from Catalogue, auto-select them
  React.useEffect(() => {
    if (queuedDatasetIds.length > 0) {
      const matchable = availableMetrics
        .filter((m) => queuedDatasetIds.some((qid) => qid.toLowerCase().includes(m.id)))
        .map((m) => m.id);
      if (matchable.length > 0) {
        setSelectedMetricIds((prev) => Array.from(new Set([...prev, ...matchable])));
      }
    }
  }, [queuedDatasetIds, availableMetrics]);

  // Merge timestamps for multi-line comparison
  const mergedChartData = useMemo(() => {
    const activeMetrics = availableMetrics.filter((m) => selectedMetricIds.includes(m.id));
    if (activeMetrics.length === 0) return [];

    // Collect all unique dates across active metrics
    const dateSet = new Set<string>();
    activeMetrics.forEach((m) => m.data.forEach((d) => dateSet.add(d.date)));
    const sortedDates = Array.from(dateSet).sort();

    // Find baseline values for normalization (first non-null value)
    const baselineMap: Record<string, number> = {};
    activeMetrics.forEach((m) => {
      const firstValid = m.data.find((d) => d.value !== undefined && d.value !== null);
      baselineMap[m.id] = firstValid ? firstValid.value : 1;
    });

    return sortedDates.map((date) => {
      const row: Record<string, any> = { date };
      activeMetrics.forEach((m) => {
        // find exact date or closest preceding date
        const match = m.data.find((d) => d.date === date);
        if (match) {
          if (normalizeMode) {
            const base = baselineMap[m.id] || 1;
            // Base = 100
            row[m.id] = +((match.value / base) * 100).toFixed(1);
          } else {
            row[m.id] = match.value;
          }
        }
      });
      return row;
    });
  }, [selectedMetricIds, normalizeMode, availableMetrics]);

  // Presets
  const applyPreset = (preset: 'energy_inflation' | 'growth_labour' | 'living_costs') => {
    if (preset === 'energy_inflation') {
      setSelectedMetricIds(['ron97', 'ron95', 'cpi_headline', 'cpi_transport']);
      setNormalizeMode(true);
    } else if (preset === 'growth_labour') {
      setSelectedMetricIds(['gdp_growth', 'unemployment', 'labour_force']);
      setNormalizeMode(false);
    } else if (preset === 'living_costs') {
      setSelectedMetricIds(['cpi_food', 'cpi_headline', 'ron95']);
      setNormalizeMode(true);
    }
  };

  const toggleMetric = (id: string) => {
    if (selectedMetricIds.includes(id)) {
      if (selectedMetricIds.length > 1) {
        setSelectedMetricIds(selectedMetricIds.filter((item) => item !== id));
      }
    } else {
      setSelectedMetricIds([...selectedMetricIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Multi-Dataset Normalization & Correlation</span>
            <span aria-hidden="true">·</span>
            <span>Comparative Studio</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Cross-Indicator Comparative Trends
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Normalization Mode Switch */}
          <button
            onClick={() => setNormalizeMode(!normalizeMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              normalizeMode
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>{normalizeMode ? 'Normalized (Base 100)' : 'Raw Values'}</span>
          </button>

          <button
            onClick={() => exportToCSV('comparative_indicators_export', mergedChartData)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Comparison CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold text-white">Analytical Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('energy_inflation')}
            className="px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            Energy Costs vs CPI Inflation
          </button>
          <button
            onClick={() => applyPreset('growth_labour')}
            className="px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            GDP Output vs Labour Force
          </button>
          <button
            onClick={() => applyPreset('living_costs')}
            className="px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            Essential Food Basket vs Fuel Subsidies
          </button>
        </div>
      </div>

      {/* Metric Selector Chips */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="text-xs text-slate-400 font-medium mb-3">
          Select Indicators to Overlay (Active: {selectedMetricIds.length})
        </div>

        <div className="flex flex-wrap gap-2">
          {availableMetrics.map((metric) => {
            const isSelected = selectedMetricIds.includes(metric.id);
            return (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400/80 text-white font-medium shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: metric.color }}
                />
                <span>{metric.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">({metric.unit})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Chart Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">
              {normalizeMode
                ? 'Indexed Trend Progression (Base Period = 100)'
                : 'Raw Values Multi-Indicator Overlay'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {normalizeMode
                ? 'All selected series are scaled to 100 at baseline. Values above 100 indicate growth/inflation relative to starting period.'
                : 'Displaying exact metric units. Note that scales may vary.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {availableMetrics
              .filter((m) => selectedMetricIds.includes(m.id))
              .map((m) => (
                <div key={m.id} className="flex items-center gap-1.5" style={{ color: m.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span>{m.name}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={normalizeMode ? ['dataMin - 5', 'dataMax + 5'] : ['auto', 'auto']}
                tickFormatter={(v) => (normalizeMode ? `${v}` : `${v}`)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(val: any, name: any) => {
                  const metric = availableMetrics.find((m) => m.id === name);
                  const label = metric ? metric.name : name;
                  const unit = normalizeMode ? 'pts (Indexed)' : metric?.unit || '';
                  return [`${val} ${unit}`, label];
                }}
              />
              {availableMetrics
                .filter((m) => selectedMetricIds.includes(m.id))
                .map((m) => (
                  <Line
                    key={m.id}
                    type="monotone"
                    dataKey={m.id}
                    name={m.id}
                    stroke={m.color}
                    strokeWidth={2.5}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Insights Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableMetrics
          .filter((m) => selectedMetricIds.includes(m.id))
          .map((m) => {
            const first = m.data[0]?.value || 1;
            const last = m.data[m.data.length - 1]?.value || 1;
            const diffPct = (((last - first) / first) * 100).toFixed(1);
            const isUp = +diffPct >= 0;

            return (
              <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-medium">{m.category}</div>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                </div>
                <div className="text-base font-bold text-white mb-1">{m.name}</div>
                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span className="text-slate-400">Latest: {last} {m.unit}</span>
                  <span className={isUp ? 'text-amber-400' : 'text-emerald-400'}>
                    {isUp ? `+${diffPct}%` : `${diffPct}%`} total shift
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
