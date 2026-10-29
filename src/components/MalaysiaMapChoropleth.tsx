import React, { useState, useMemo } from 'react';
import { CURATED_STATE_INCOME } from '../data/curatedIndicators';
import { StateHouseholdRecord } from '../types/dataset';
import { MapPin, Info, ArrowUpRight, TrendingUp, Users, DollarSign, ShieldAlert, Award } from 'lucide-react';

type MetricKey = 'median_income' | 'mean_income' | 'gini_coefficient' | 'poverty_incidence' | 'population_thousand';

interface StateSvgPath {
  id: string;
  name: string;
  code: string;
  region: 'Peninsular' | 'Borneo';
  path: string;
  labelX: number;
  labelY: number;
}

// Stylized geographical polygon coordinates representing Malaysian States
const MALAYSIA_STATES_PATHS: StateSvgPath[] = [
  // PENINSULAR MALAYSIA (WEST)
  {
    id: 'Perlis',
    name: 'Perlis',
    code: 'PLS',
    region: 'Peninsular',
    path: 'M 75 40 L 95 38 L 98 52 L 80 58 Z',
    labelX: 86,
    labelY: 48,
  },
  {
    id: 'Kedah',
    name: 'Kedah',
    code: 'KDH',
    region: 'Peninsular',
    path: 'M 78 58 L 105 52 L 125 72 L 120 105 L 90 102 L 82 80 Z',
    labelX: 102,
    labelY: 82,
  },
  {
    id: 'Penang',
    name: 'Penang',
    code: 'PNG',
    region: 'Peninsular',
    path: 'M 72 90 L 84 88 L 86 102 L 74 104 Z',
    labelX: 79,
    labelY: 96,
  },
  {
    id: 'Perak',
    name: 'Perak',
    code: 'PRK',
    region: 'Peninsular',
    path: 'M 90 102 L 120 105 L 142 135 L 135 185 L 102 180 L 88 135 Z',
    labelX: 112,
    labelY: 145,
  },
  {
    id: 'Kelantan',
    name: 'Kelantan',
    code: 'KTN',
    region: 'Peninsular',
    path: 'M 125 72 L 165 65 L 182 105 L 165 142 L 138 128 L 122 102 Z',
    labelX: 152,
    labelY: 104,
  },
  {
    id: 'Terengganu',
    name: 'Terengganu',
    code: 'TRG',
    region: 'Peninsular',
    path: 'M 165 65 L 195 85 L 215 130 L 188 152 L 165 142 L 182 105 Z',
    labelX: 190,
    labelY: 115,
  },
  {
    id: 'Pahang',
    name: 'Pahang',
    code: 'PHG',
    region: 'Peninsular',
    path: 'M 135 140 L 165 142 L 188 152 L 215 130 L 228 190 L 195 235 L 148 215 L 135 185 Z',
    labelX: 178,
    labelY: 185,
  },
  {
    id: 'Selangor',
    name: 'Selangor',
    code: 'SGR',
    region: 'Peninsular',
    path: 'M 102 180 L 135 185 L 145 225 L 115 235 L 100 205 Z',
    labelX: 122,
    labelY: 208,
  },
  {
    id: 'Kuala Lumpur',
    name: 'Kuala Lumpur',
    code: 'KUL',
    region: 'Peninsular',
    path: 'M 122 206 L 132 206 L 132 216 L 122 216 Z',
    labelX: 127,
    labelY: 211,
  },
  {
    id: 'Putrajaya',
    name: 'Putrajaya',
    code: 'PJY',
    region: 'Peninsular',
    path: 'M 124 219 L 131 219 L 131 226 L 124 226 Z',
    labelX: 127,
    labelY: 222,
  },
  {
    id: 'Negeri Sembilan',
    name: 'Negeri Sembilan',
    code: 'NSN',
    region: 'Peninsular',
    path: 'M 135 220 L 165 218 L 175 245 L 145 255 L 132 235 Z',
    labelX: 152,
    labelY: 236,
  },
  {
    id: 'Melaka',
    name: 'Melaka',
    code: 'MLK',
    region: 'Peninsular',
    path: 'M 148 252 L 175 245 L 182 268 L 158 272 Z',
    labelX: 165,
    labelY: 260,
  },
  {
    id: 'Johor',
    name: 'Johor',
    code: 'JHR',
    region: 'Peninsular',
    path: 'M 175 240 L 195 235 L 228 190 L 255 255 L 225 305 L 180 270 L 175 245 Z',
    labelX: 212,
    labelY: 265,
  },

  // EAST MALAYSIA / BORNEO
  {
    id: 'Sarawak',
    name: 'Sarawak',
    code: 'SWK',
    region: 'Borneo',
    path: 'M 320 270 L 350 240 L 395 235 L 435 190 L 475 160 L 510 135 L 530 165 L 470 215 L 420 260 L 370 285 L 330 295 Z',
    labelX: 420,
    labelY: 225,
  },
  {
    id: 'Sabah',
    name: 'Sabah',
    code: 'SBH',
    region: 'Borneo',
    path: 'M 510 135 L 550 75 L 610 82 L 640 125 L 615 175 L 555 170 L 530 165 Z',
    labelX: 575,
    labelY: 125,
  },
  {
    id: 'Labuan',
    name: 'Labuan',
    code: 'LBN',
    region: 'Borneo',
    path: 'M 500 120 L 508 120 L 508 128 L 500 128 Z',
    labelX: 504,
    labelY: 124,
  },
];

interface MalaysiaMapProps {
  onSelectState?: (stateName: string) => void;
}

export const MalaysiaMapChoropleth: React.FC<MalaysiaMapProps> = ({ onSelectState }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('median_income');
  const [activeStateName, setActiveStateName] = useState<string>('Selangor');
  const [hoveredState, setHoveredState] = useState<StateHouseholdRecord | null>(null);

  // Map data lookup
  const stateDataMap = useMemo(() => {
    const map = new Map<string, StateHouseholdRecord>();
    CURATED_STATE_INCOME.forEach((item) => {
      map.set(item.state.toLowerCase(), item);
    });
    return map;
  }, []);

  // Compute min and max for choropleth scale
  const { minVal, maxVal } = useMemo(() => {
    const vals = CURATED_STATE_INCOME.map((s) => s[selectedMetric]);
    return {
      minVal: Math.min(...vals),
      maxVal: Math.max(...vals),
    };
  }, [selectedMetric]);

  // Color interpolation
  const getColorForValue = (val: number) => {
    if (minVal === maxVal) return '#0284c7';
    // For poverty incidence or Gini, lower can be better or different scale
    const ratio = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal)));

    if (selectedMetric === 'poverty_incidence') {
      // higher poverty = more amber/crimson
      const r = Math.round(56 + ratio * 180);
      const g = Math.round(189 - ratio * 110);
      const b = Math.round(248 - ratio * 180);
      return `rgb(${r}, ${g}, ${b})`;
    }

    // Emerald to Teal to Amber gradient
    const r = Math.round(16 + ratio * 220);
    const g = Math.round(185 - ratio * 30);
    const b = Math.round(129 - ratio * 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const activeStateRecord = useMemo(() => {
    return (
      CURATED_STATE_INCOME.find((s) => s.state.toLowerCase() === activeStateName.toLowerCase()) ||
      CURATED_STATE_INCOME[0]
    );
  }, [activeStateName]);

  // Rank calculation
  const rankedStates = useMemo(() => {
    return [...CURATED_STATE_INCOME].sort((a, b) => {
      if (selectedMetric === 'poverty_incidence') return a[selectedMetric] - b[selectedMetric];
      return b[selectedMetric] - a[selectedMetric];
    });
  }, [selectedMetric]);

  const activeRank = useMemo(() => {
    return rankedStates.findIndex((s) => s.state === activeStateRecord.state) + 1;
  }, [rankedStates, activeStateRecord]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Sub-National Geographic Visualizer</span>
            <span aria-hidden="true">·</span>
            <span>All 16 States & Federal Territories</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>Interactive Malaysia Regional Choropleth Map</span>
          </h2>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          {[
            { key: 'median_income', label: 'Median Income (RM)' },
            { key: 'mean_income', label: 'Mean Income (RM)' },
            { key: 'gini_coefficient', label: 'Gini Disparity' },
            { key: 'poverty_incidence', label: 'Poverty Rate (%)' },
            { key: 'population_thousand', label: 'Population (k)' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key as MetricKey)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedMetric === m.key
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + State Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* SVG Interactive Map (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-slate-400">
              Hover or click any state to inspect socioeconomic indicators:
            </div>
            {/* Dynamic Map Legend */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>Min: {minVal.toLocaleString()}</span>
              <div
                className="w-24 h-2 rounded-full"
                style={{
                  background: 'linear-gradient(to right, #10b981, #f59e0b)',
                }}
              />
              <span>Max: {maxVal.toLocaleString()}</span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[2/1] max-h-[460px] flex items-center justify-center">
            <svg
              viewBox="50 20 620 310"
              className="w-full h-full drop-shadow-md"
              style={{ overflow: 'visible' }}
            >
              {/* Region Label: Peninsular Malaysia */}
              <text x="140" y="35" fill="#64748b" fontSize="10" fontWeight="600" letterSpacing="1">
                SEMENANJUNG MALAYSIA
              </text>
              {/* Region Label: East Malaysia (Borneo) */}
              <text x="440" y="55" fill="#64748b" fontSize="10" fontWeight="600" letterSpacing="1">
                SABAH, SARAWAK & LABUAN
              </text>

              {/* State Polygons */}
              {MALAYSIA_STATES_PATHS.map((statePath) => {
                const record = stateDataMap.get(statePath.name.toLowerCase());
                const val = record ? record[selectedMetric] : minVal;
                const fillColor = getColorForValue(val);
                const isSelected = activeStateName.toLowerCase() === statePath.name.toLowerCase();

                return (
                  <g key={statePath.id} className="cursor-pointer">
                    <path
                      d={statePath.path}
                      fill={fillColor}
                      stroke={isSelected ? '#ffffff' : '#0f172a'}
                      strokeWidth={isSelected ? '2.5' : '1.2'}
                      opacity={isSelected ? 1 : 0.88}
                      className="transition-all duration-200 hover:opacity-100 hover:stroke-white"
                      onClick={() => {
                        setActiveStateName(statePath.name);
                        if (onSelectState) onSelectState(statePath.name);
                      }}
                      onMouseEnter={() => {
                        if (record) setHoveredState(record);
                      }}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                    {/* State Code Label */}
                    <text
                      x={statePath.labelX}
                      y={statePath.labelY}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      pointerEvents="none"
                      className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    >
                      {statePath.code}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Float */}
            {hoveredState && (
              <div className="absolute top-4 left-4 bg-slate-950/95 border border-slate-700/80 px-3.5 py-2.5 rounded-xl shadow-xl backdrop-blur-md pointer-events-none text-xs">
                <div className="font-bold text-white mb-0.5">{hoveredState.state}</div>
                <div className="font-mono tabular-nums text-amber-400">
                  {selectedMetric === 'median_income' && `Median: RM ${hoveredState.median_income.toLocaleString()}`}
                  {selectedMetric === 'mean_income' && `Mean: RM ${hoveredState.mean_income.toLocaleString()}`}
                  {selectedMetric === 'gini_coefficient' && `Gini Ratio: ${hoveredState.gini_coefficient}`}
                  {selectedMetric === 'poverty_incidence' && `Poverty: ${hoveredState.poverty_incidence}%`}
                  {selectedMetric === 'population_thousand' && `Population: ${(hoveredState.population_thousand / 1000).toFixed(2)}M`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected State Socioeconomic Card (1 Column) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
                <span>Rank #{activeRank} of 16</span>
                <span aria-hidden="true">·</span>
                <span>DOSM Open Data</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {activeStateRecord.state}
              </h3>
            </div>

            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 mb-1 flex items-center justify-between">
                <span>Median Income</span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono tabular-nums text-white">
                RM {activeStateRecord.median_income.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Per month / household</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 mb-1 flex items-center justify-between">
                <span>Mean Income</span>
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-base font-bold font-mono tabular-nums text-white">
                RM {activeStateRecord.mean_income.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Household average</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 mb-1 flex items-center justify-between">
                <span>Gini Disparity</span>
                <span className="text-[10px] font-mono text-slate-400">0–1</span>
              </div>
              <div className="text-base font-bold font-mono tabular-nums text-white">
                {activeStateRecord.gini_coefficient}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {activeStateRecord.gini_coefficient < 0.36 ? 'Lower inequality' : 'Moderate inequality'}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 mb-1 flex items-center justify-between">
                <span>Poverty Incidence</span>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-base font-bold font-mono tabular-nums text-white">
                {activeStateRecord.poverty_incidence}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Absolute poverty line</div>
            </div>
          </div>

          {/* Demographic summary */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" /> State Population:
            </span>
            <span className="text-white font-bold text-sm">
              {(activeStateRecord.population_thousand / 1000).toFixed(2)} Million
            </span>
          </div>

          {/* Explanatory Context */}
          <p className="text-xs text-slate-400 leading-relaxed">
            Data sourced from the Household Income and Expenditure Survey (HIES) and administrative population tables published by the Department of Statistics Malaysia.
          </p>
        </div>
      </div>
    </div>
  );
};
