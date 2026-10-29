import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Sliders,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { AiProjectionResponse } from '../types/dataset';
import { analyzeTrendProjection, exportToCSV } from '../services/api';
import {
  CURATED_CPI,
  CURATED_FUEL_PRICES,
  CURATED_GDP,
  CURATED_LABOUR,
} from '../data/curatedIndicators';

export const AiTrendProjectionView: React.FC = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>('Consumer Price Index (CPI)');
  const [horizonMonths, setHorizonMonths] = useState<number>(6);
  const [scenario, setScenario] = useState<string>('Base Case');

  const [loading, setLoading] = useState<boolean>(false);
  const [projection, setProjection] = useState<AiProjectionResponse | null>(null);

  // Get historical baseline for the selected indicator
  const getHistoricalSeries = () => {
    if (selectedIndicator.includes('Fuel') || selectedIndicator.includes('RON97')) {
      return CURATED_FUEL_PRICES.slice(-8).map((p) => ({
        date: p.date.substring(0, 7),
        actual_value: p.ron97,
      }));
    }
    if (selectedIndicator.includes('GDP')) {
      return CURATED_GDP.slice(-6).map((g) => ({
        date: `${g.year}-${g.quarter === 'Q1' ? '03' : g.quarter === 'Q2' ? '06' : g.quarter === 'Q3' ? '09' : '12'}`,
        actual_value: g.growth_rate_yoy,
      }));
    }
    if (selectedIndicator.includes('Unemployment')) {
      return CURATED_LABOUR.slice(-8).map((l) => ({
        date: l.date,
        actual_value: l.unemployment_rate,
      }));
    }
    // Default CPI
    return CURATED_CPI.slice(-8).map((c) => ({
      date: c.date,
      actual_value: c.headline_cpi,
    }));
  };

  const runProjection = async () => {
    setLoading(true);
    try {
      const history = getHistoricalSeries();
      const res = await analyzeTrendProjection({
        indicator: selectedIndicator,
        horizonMonths,
        scenario,
        historicalData: history,
      });
      setProjection(res);
    } catch (err) {
      console.error('Projection execution error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runProjection();
  }, [selectedIndicator, horizonMonths, scenario]);

  // Combined chart data: historical points + projected points
  const combinedChartData = React.useMemo(() => {
    const history = getHistoricalSeries().map((h) => ({
      date: h.date,
      actual: h.actual_value,
      projected: undefined as number | undefined,
      lower_bound: undefined as number | undefined,
      upper_bound: undefined as number | undefined,
    }));

    if (!projection?.projected_points) return history;

    // Last historical point connects to first projected point
    const lastHist = history[history.length - 1];
    const bridgePoint = {
      date: lastHist.date,
      actual: lastHist.actual,
      projected: lastHist.actual,
      lower_bound: lastHist.actual,
      upper_bound: lastHist.actual,
    };

    const futurePoints = projection.projected_points.map((p) => ({
      date: p.date,
      actual: undefined as number | undefined,
      projected: p.projected_value,
      lower_bound: p.lower_bound,
      upper_bound: p.upper_bound,
    }));

    // Replace last element with bridge, then append future points
    return [...history.slice(0, -1), bridgePoint, ...futurePoints];
  }, [projection, selectedIndicator]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <BrainCircuit className="w-4 h-4 text-amber-400" />
            <span>Machine Learning & Econometric Forecasting Engine</span>
            <span aria-hidden="true">·</span>
            <span>Gemini API Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>AI-Powered Trend Projections & Macro Trajectories</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {projection && (
            <button
              onClick={() => exportToCSV('ai_macro_projection', combinedChartData)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Projection CSV</span>
            </button>
          )}

          <button
            onClick={runProjection}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing...' : 'Re-run Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Indicator, Horizon, Scenario */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Indicator Switcher */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Select Economic Indicator:
          </label>
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="Consumer Price Index (CPI)">Consumer Price Index (Headline CPI)</option>
            <option value="RON97 Market Float Fuel Price">RON97 Petroleum Float Price (RM/L)</option>
            <option value="Quarterly GDP Growth (% YoY)">Quarterly GDP YoY Growth (%)</option>
            <option value="Monthly National Unemployment Rate">National Unemployment Rate (%)</option>
          </select>
        </div>

        {/* Forecast Horizon */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Forecast Horizon:
          </label>
          <div className="flex items-center p-1 bg-slate-950 border border-slate-700 rounded-lg text-xs">
            {[
              { val: 3, label: '3 Months' },
              { val: 6, label: '6 Months' },
              { val: 12, label: '12 Months' },
            ].map((h) => (
              <button
                key={h.val}
                onClick={() => setHorizonMonths(h.val)}
                className={`flex-1 py-1 text-center font-medium rounded-md transition-colors ${
                  horizonMonths === h.val
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        {/* Economic Scenario */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Macro Scenario:
          </label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="Base Case">Base Case (Consensus Baseline)</option>
            <option value="Bull">Optimistic (High FDI & Low Inflation)</option>
            <option value="Bear">Bearish (Global Energy & Trade Shocks)</option>
          </select>
        </div>
      </div>

      {/* Interactive Projection Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{selectedIndicator} Trajectory Projection</span>
              <span className="text-xs font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                {scenario}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Solid line represents official DOSM/MOF historical series; dashed line represents AI model forecasted trajectory with confidence interval bounds.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-0.5 bg-slate-300" /> Historical
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-400" /> AI Projected
            </span>
            <span className="flex items-center gap-1.5 text-amber-400/50">
              <span className="w-2.5 h-2.5 bg-amber-400/20 rounded-sm" /> Confidence Interval
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(val: any, name: any) => [
                  val !== undefined ? `${val}` : '-',
                  name === 'actual' ? 'Official Historical' : name === 'projected' ? 'Projected Trajectory' : name,
                ]}
              />
              {/* Confidence Interval Band */}
              <Area
                type="monotone"
                dataKey="upper_bound"
                stroke="none"
                fill="url(#confidenceBand)"
                name="Confidence Range"
              />
              {/* Historical Line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#94a3b8"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                name="actual"
              />
              {/* Projected Line */}
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
                name="projected"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Analytical Insights Panel */}
      {projection && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Executive Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:col-span-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Trajectory Summary</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Engine: {projection.model_used}
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {projection.projection_summary}
            </p>
          </div>

          {/* Key Drivers */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Growth & Stabilization Drivers</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {projection.key_growth_drivers.map((driver, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Downside Risk Factors */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold text-rose-400 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Downside Macro Risks</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {projection.risk_factors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Implications */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold text-sky-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Policy & Fiscal Implications</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {projection.policy_implications}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
