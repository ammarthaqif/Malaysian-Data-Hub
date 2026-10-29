import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Download, TrendingUp, DollarSign, Users, Briefcase, BarChart2, MapPin } from 'lucide-react';
import {
  CURATED_FUEL_PRICES,
  CURATED_CPI,
  CURATED_GDP,
  CURATED_LABOUR,
  CURATED_STATE_INCOME,
} from '../data/curatedIndicators';
import { exportToCSV } from '../services/api';

type IndicatorTab = 'fuel' | 'cpi' | 'gdp' | 'labour' | 'income';

export const IndicatorsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IndicatorTab>('fuel');
  const [dateRange, setDateRange] = useState<'1Y' | '3Y' | 'ALL'>('ALL');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');

  // Filtered Fuel data
  const filteredFuel = React.useMemo(() => {
    if (dateRange === '1Y') return CURATED_FUEL_PRICES.slice(-8);
    if (dateRange === '3Y') return CURATED_FUEL_PRICES.slice(-14);
    return CURATED_FUEL_PRICES;
  }, [dateRange]);

  // Filtered CPI data
  const filteredCpi = React.useMemo(() => {
    if (dateRange === '1Y') return CURATED_CPI.slice(-5);
    if (dateRange === '3Y') return CURATED_CPI.slice(-10);
    return CURATED_CPI;
  }, [dateRange]);

  // Filtered GDP data
  const filteredGdp = React.useMemo(() => {
    if (dateRange === '1Y') return CURATED_GDP.slice(-5);
    if (dateRange === '3Y') return CURATED_GDP.slice(-9);
    return CURATED_GDP;
  }, [dateRange]);

  // Filtered Labour data
  const filteredLabour = React.useMemo(() => {
    if (dateRange === '1Y') return CURATED_LABOUR.slice(-5);
    if (dateRange === '3Y') return CURATED_LABOUR.slice(-9);
    return CURATED_LABOUR;
  }, [dateRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Official Government Socioeconomic Statistics</span>
            <span aria-hidden="true">·</span>
            <span>DOSM & Ministry of Finance</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Socioeconomic Indicators & Trend Analytics
          </h2>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date range picker */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {(['1Y', '3Y', 'ALL'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 font-mono rounded-md transition-colors ${
                  dateRange === range
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Chart type switch */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {(['area', 'line', 'bar'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-2.5 py-1 capitalize rounded-md transition-colors ${
                  chartType === type
                    ? 'bg-slate-800 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Export active indicator */}
          <button
            onClick={() => {
              if (activeTab === 'fuel') exportToCSV('fuel_prices_malaysia', filteredFuel);
              else if (activeTab === 'cpi') exportToCSV('cpi_inflation_malaysia', filteredCpi);
              else if (activeTab === 'gdp') exportToCSV('gdp_quarterly_malaysia', filteredGdp);
              else if (activeTab === 'labour') exportToCSV('labour_force_malaysia', filteredLabour);
              else exportToCSV('state_household_income_malaysia', CURATED_STATE_INCOME);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Indicator Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <button
          onClick={() => setActiveTab('fuel')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'fuel'
              ? 'bg-slate-900 border-amber-400/80 ring-1 ring-amber-400/40'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-slate-300">Fuel Prices (APM)</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">RM 2.05</div>
          <div className="text-[11px] text-slate-500 mt-0.5">RON95 / RON97 / Diesel</div>
        </button>

        <button
          onClick={() => setActiveTab('cpi')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'cpi'
              ? 'bg-slate-900 border-amber-400/80 ring-1 ring-amber-400/40'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-slate-300">CPI & Inflation</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">1.9% YoY</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Headline & Basket Indices</div>
        </button>

        <button
          onClick={() => setActiveTab('gdp')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'gdp'
              ? 'bg-slate-900 border-amber-400/80 ring-1 ring-amber-400/40'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-slate-300">Quarterly GDP</span>
            <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">+5.1% Growth</div>
          <div className="text-[11px] text-slate-500 mt-0.5">RM 469.5B Output</div>
        </button>

        <button
          onClick={() => setActiveTab('labour')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'labour'
              ? 'bg-slate-900 border-amber-400/80 ring-1 ring-amber-400/40'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-slate-300">Labour Force</span>
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">3.0% Rate</div>
          <div className="text-[11px] text-slate-500 mt-0.5">17.65M Active Force</div>
        </button>

        <button
          onClick={() => setActiveTab('income')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'income'
              ? 'bg-slate-900 border-amber-400/80 ring-1 ring-amber-400/40'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-slate-300">State Income (HIES)</span>
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">RM 8,479</div>
          <div className="text-[11px] text-slate-500 mt-0.5">National Mean Income</div>
        </button>
      </div>

      {/* Interactive Chart Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        {/* Tab 1: Fuel Prices */}
        {activeTab === 'fuel' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-white">
                  Petroleum & Diesel Price Trends (Weekly Automatic Pricing Mechanism)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Source: Ministry of Finance (MOF) & Domestic Trade Ministry (KPDN). Prices in Ringgit Malaysia (RM) per litre.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> RON95 (Ceiling RM2.05)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> RON97 (RM3.19)
                </span>
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Diesel (RM2.95)
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={filteredFuel} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradRon97" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="gradDiesel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[1.5, 4.0]} stroke="#64748b" fontSize={11} tickFormatter={(v) => `RM${v.toFixed(2)}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      formatter={(val: any) => [`RM ${Number(val).toFixed(2)} / Litre`]}
                    />
                    <Area type="monotone" dataKey="ron97" name="RON97 Petrol" stroke="#10b981" strokeWidth={2} fill="url(#gradRon97)" />
                    <Area type="monotone" dataKey="diesel" name="Diesel (Peninsular)" stroke="#38bdf8" strokeWidth={2} fill="url(#gradDiesel)" />
                    <Line type="monotone" dataKey="ron95" name="RON95 (Subsidised)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                  </AreaChart>
                ) : chartType === 'line' ? (
                  <LineChart data={filteredFuel} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[1.5, 4.0]} stroke="#64748b" fontSize={11} tickFormatter={(v) => `RM${v.toFixed(2)}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      formatter={(val: any) => [`RM ${Number(val).toFixed(2)} / Litre`]}
                    />
                    <Line type="monotone" dataKey="ron97" name="RON97" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="diesel" name="Diesel" stroke="#38bdf8" strokeWidth={2} />
                    <Line type="monotone" dataKey="ron95" name="RON95" stroke="#f59e0b" strokeWidth={2.5} />
                  </LineChart>
                ) : (
                  <BarChart data={filteredFuel} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 4.0]} stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      formatter={(val: any) => [`RM ${Number(val).toFixed(2)}`]}
                    />
                    <Bar dataKey="ron95" fill="#f59e0b" name="RON95" />
                    <Bar dataKey="ron97" fill="#10b981" name="RON97" />
                    <Bar dataKey="diesel" fill="#38bdf8" name="Diesel" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: CPI & Inflation */}
        {activeTab === 'cpi' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-white">
                  Consumer Price Index (CPI 2010=100) & Expenditure Basket Indices
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Source: Department of Statistics Malaysia (DOSM). Measuring price pressures across essential consumer categories.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-amber-400">Headline CPI</span>
                <span className="text-rose-400">Food & Beverage</span>
                <span className="text-sky-400">Housing & Utilities</span>
                <span className="text-emerald-400">Transport</span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredCpi} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[115, 150]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(val: any) => [val, 'Index Point']}
                  />
                  <Line type="monotone" dataKey="headline_cpi" name="Headline Index" stroke="#f59e0b" strokeWidth={3} />
                  <Line type="monotone" dataKey="food_beverage" name="Food & Beverage" stroke="#f43f5e" strokeWidth={2} />
                  <Line type="monotone" dataKey="housing_utilities" name="Housing & Utilities" stroke="#38bdf8" strokeWidth={2} />
                  <Line type="monotone" dataKey="transport" name="Transport" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 3: GDP by Sector */}
        {activeTab === 'gdp' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-white">
                  Quarterly Gross Domestic Product (GDP) Breakdown by Economic Sector
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Source: DOSM National Accounts. Values in RM Billion (Constant 2015 Prices).
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-blue-400">Services (59%)</span>
                <span className="text-emerald-400">Manufacturing (24%)</span>
                <span className="text-amber-400">Agriculture (6%)</span>
                <span className="text-purple-400">Mining & Construction</span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredGdp} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `RM${v}B`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(val: any) => [`RM ${val} Billion`]}
                  />
                  <Bar dataKey="services" stackId="a" fill="#3b82f6" name="Services" />
                  <Bar dataKey="manufacturing" stackId="a" fill="#10b981" name="Manufacturing" />
                  <Bar dataKey="agriculture" stackId="a" fill="#f59e0b" name="Agriculture" />
                  <Bar dataKey="mining" stackId="a" fill="#8b5cf6" name="Mining" />
                  <Bar dataKey="construction" stackId="a" fill="#ec4899" name="Construction" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 4: Labour Market */}
        {activeTab === 'labour' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-white">
                  Labour Force & Monthly National Unemployment Trajectory
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Source: DOSM Labour Force Statistics. Total workforce expanding while unemployment rate declines towards 3.0%.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-emerald-400">Active Labour Force (Thousands)</span>
                <span className="text-rose-400">Unemployment Rate (%)</span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredLabour} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" domain={[16000, 18000]} stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" domain={[2.5, 4.0]} stroke="#f43f5e" fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="labour_force_thousand" name="Workforce (k)" stroke="#10b981" fill="#10b98120" />
                  <Line yAxisId="right" type="monotone" dataKey="unemployment_rate" name="Unemployment Rate (%)" stroke="#f43f5e" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 5: State Income */}
        {activeTab === 'income' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-white">
                  Household Income Disparity: Mean vs Median Income by State (HIES)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Source: DOSM Household Income and Expenditure Survey (HIES). Sorted by median monthly household income.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-amber-400">Mean Income (RM)</span>
                <span className="text-sky-400">Median Income (RM)</span>
              </div>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...CURATED_STATE_INCOME].sort((a, b) => b.median_income - a.median_income)}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `RM${v}`} />
                  <YAxis dataKey="state" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(val: any) => [`RM ${Number(val).toLocaleString()}`]}
                  />
                  <Bar dataKey="median_income" fill="#38bdf8" name="Median Income" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="mean_income" fill="#f59e0b" name="Mean Income" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
