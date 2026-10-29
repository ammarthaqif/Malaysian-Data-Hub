import React, { useState } from 'react';
import { Download, Printer, Check, X, FileText, Database, ShieldCheck } from 'lucide-react';
import {
  CURATED_FUEL_PRICES,
  CURATED_CPI,
  CURATED_GDP,
  CURATED_LABOUR,
  CURATED_STATE_INCOME,
} from '../data/curatedIndicators';
import { exportToCSV, exportToJSON } from '../services/api';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<'comprehensive' | 'energy_cpi' | 'demographics' | 'realtime'>('comprehensive');
  const [format, setFormat] = useState<'csv' | 'json' | 'print'>('csv');
  const [includeMetadata, setIncludeMetadata] = useState(true);

  if (!isOpen) return null;

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];

    if (reportType === 'comprehensive') {
      const summaryData = {
        title: 'Malaysia Socioeconomic Indicators Executive Report',
        generated_at: new Date().toISOString(),
        source: 'OpenDOSM & Ministry of Finance via data.gov.my Open API',
        latest_cpi: CURATED_CPI[CURATED_CPI.length - 1],
        latest_fuel: CURATED_FUEL_PRICES[CURATED_FUEL_PRICES.length - 1],
        latest_gdp: CURATED_GDP[CURATED_GDP.length - 1],
        latest_labour: CURATED_LABOUR[CURATED_LABOUR.length - 1],
      };

      if (format === 'json') {
        exportToJSON(`malaysia_socioeconomic_briefing_${timestamp}`, summaryData);
      } else if (format === 'csv') {
        // Flatten into unified rows
        const rows = CURATED_CPI.map((c, i) => {
          const f = CURATED_FUEL_PRICES[i] || CURATED_FUEL_PRICES[CURATED_FUEL_PRICES.length - 1];
          const l = CURATED_LABOUR[i] || CURATED_LABOUR[CURATED_LABOUR.length - 1];
          return {
            period: c.date,
            headline_cpi: c.headline_cpi,
            inflation_rate_yoy: c.inflation_rate_yoy,
            food_cpi: c.food_beverage,
            transport_cpi: c.transport,
            fuel_ron95: f.ron95,
            fuel_ron97: f.ron97,
            fuel_diesel: f.diesel,
            unemployment_rate: l.unemployment_rate,
            labour_force_k: l.labour_force_thousand,
          };
        });
        exportToCSV(`malaysia_socioeconomic_briefing_${timestamp}`, rows);
      } else {
        window.print();
      }
    } else if (reportType === 'energy_cpi') {
      if (format === 'json') {
        exportToJSON(`malaysia_energy_and_cpi_${timestamp}`, { fuel: CURATED_FUEL_PRICES, cpi: CURATED_CPI });
      } else if (format === 'csv') {
        exportToCSV(`malaysia_energy_prices_${timestamp}`, CURATED_FUEL_PRICES);
      } else {
        window.print();
      }
    } else if (reportType === 'demographics') {
      if (format === 'json') {
        exportToJSON(`malaysia_state_demographics_${timestamp}`, CURATED_STATE_INCOME);
      } else if (format === 'csv') {
        exportToCSV(`malaysia_state_demographics_${timestamp}`, CURATED_STATE_INCOME);
      } else {
        window.print();
      }
    } else {
      if (format === 'json') {
        exportToJSON(`malaysia_labour_and_gdp_${timestamp}`, { gdp: CURATED_GDP, labour: CURATED_LABOUR });
      } else if (format === 'csv') {
        exportToCSV(`malaysia_gdp_quarterly_${timestamp}`, CURATED_GDP);
      } else {
        window.print();
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Generate Socioeconomic Report</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Report Scope */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Report Scope:
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'comprehensive',
                  title: 'Executive National Socioeconomic Briefing',
                  desc: 'Unified report covering GDP, Labour, Inflation, and Fuel Trends (2023–2026)',
                },
                {
                  id: 'energy_cpi',
                  title: 'Energy & Cost of Living Analysis',
                  desc: 'Weekly APM petroleum prices, diesel subsidy transition, and CPI basket indices',
                },
                {
                  id: 'demographics',
                  title: 'Household Income & State Disparity Profile',
                  desc: 'Mean/Median income, Gini ratio, and poverty indices across all 16 states',
                },
                {
                  id: 'realtime',
                  title: 'National Output & Labour Dynamics (GDP + Jobs)',
                  desc: 'Sectoral GDP output, workforce expansion, and monthly unemployment rate',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setReportType(item.id as any)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    reportType === item.id
                      ? 'bg-slate-800 border-amber-400/80 ring-1 ring-amber-400/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Output Format:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'csv', label: 'CSV Spreadsheet', desc: 'Raw tabular rows (.csv)' },
                { id: 'json', label: 'JSON Dataset', desc: 'API compatible (.json)' },
                { id: 'print', label: 'Printable / PDF', desc: 'Print layout view' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    format === f.id
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{f.label}</div>
                  <div className={`text-[10px] mt-0.5 ${format === f.id ? 'text-slate-800' : 'text-slate-500'}`}>
                    {f.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Attribution notice */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span>Official Government Citation: Data sourced directly from </span>
              <strong className="text-slate-200">developer.data.gov.my</strong>
              <span>, OpenDOSM, Ministry of Finance, and MET Malaysia under the Malaysian Open Government Licence.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors shadow-sm"
          >
            {format === 'print' ? <Printer className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{format === 'print' ? 'Open Print / PDF View' : 'Download Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
