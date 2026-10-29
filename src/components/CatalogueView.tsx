import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Code,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw,
  SlidersHorizontal,
  PlusCircle,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
} from 'lucide-react';
import { DatasetItem, DatasetListResponse } from '../types/dataset';
import { getDatasetsList, fetchLiveCatalogueRecords, exportToCSV, exportToJSON } from '../services/api';

interface CatalogueViewProps {
  initialSearch?: string;
  onSelectForCompare: (datasetId: string) => void;
  comparedIds: string[];
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  initialSearch = '',
  onSelectForCompare,
  comparedIds,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedFrequency, setSelectedFrequency] = useState('All');

  const [loading, setLoading] = useState(true);
  const [catalogData, setCatalogData] = useState<DatasetListResponse>({
    total: 0,
    total_catalog: 0,
    offset: 0,
    limit: 50,
    categories: [],
    sources: [],
    frequencies: [],
    datasets: [],
  });

  // Modal inspection state
  const [inspectDataset, setInspectDataset] = useState<DatasetItem | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [previewRecords, setPreviewRecords] = useState<any[]>([]);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await getDatasetsList({
        q: searchQuery,
        category: selectedCategory,
        source: selectedSource,
        frequency: selectedFrequency,
        limit: 100,
      });
      setCatalogData(res);
    } catch (err) {
      console.error('Error fetching datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatalog();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedSource, selectedFrequency]);

  // Open dataset inspector and test query
  const handleOpenInspector = async (item: DatasetItem) => {
    setInspectDataset(item);
    setInspectLoading(true);
    setPreviewRecords([]);
    try {
      const records = await fetchLiveCatalogueRecords(item.id, 10);
      setPreviewRecords(records);
    } catch (err) {
      console.error(err);
    } finally {
      setInspectLoading(false);
    }
  };

  const getCurlSnippet = (id: string, endpoint?: string) => {
    const isOpendosm = ['cpi', 'gdp', 'labour', 'unemployment', 'exchange', 'bipd', 'hies', 'balance'].some(k => id.toLowerCase().includes(k));
    const base = isOpendosm ? 'https://api.data.gov.my/opendosm/' : 'https://api.data.gov.my/data-catalogue/';
    return `curl -X GET "${base}?id=${id}&limit=10" \\
  -H "Accept: application/json"`;
  };

  const getJsSnippet = (id: string) => {
    const isOpendosm = ['cpi', 'gdp', 'labour', 'unemployment', 'exchange', 'bipd', 'hies', 'balance'].some(k => id.toLowerCase().includes(k));
    const base = isOpendosm ? 'https://api.data.gov.my/opendosm/' : 'https://api.data.gov.my/data-catalogue/';
    return `const response = await fetch("${base}?id=${id}&limit=10");
const data = await response.json();
console.log(data);`;
  };

  const getPythonSnippet = (id: string) => {
    const isOpendosm = ['cpi', 'gdp', 'labour', 'unemployment', 'exchange', 'bipd', 'hies', 'balance'].some(k => id.toLowerCase().includes(k));
    const base = isOpendosm ? 'https://api.data.gov.my/opendosm/' : 'https://api.data.gov.my/data-catalogue/';
    return `import requests

url = "${base}"
params = {"id": "${id}", "limit": 10}
response = requests.get(url, params=params)
data = response.json()
print(data)`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>data.gov.my API Directory</span>
            <span aria-hidden="true">·</span>
            <span>{catalogData.total} of {catalogData.total_catalog || 355} Datasets Available</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Unified Malaysian Open API Catalogue
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV('malaysia_open_data_catalogue_index', catalogData.datasets)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Catalogue CSV</span>
          </button>
          <button
            onClick={fetchCatalog}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors border border-slate-700"
            title="Refresh catalogue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Text Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dataset ID, English title, Malay title, or keywords..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Categories</option>
              {catalogData.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Agency Dropdown */}
          <div className="w-full lg:w-56">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Agencies / Sources</option>
              {catalogData.sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency Dropdown */}
          <div className="w-full lg:w-40">
            <select
              value={selectedFrequency}
              onChange={(e) => setSelectedFrequency(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Frequencies</option>
              {catalogData.frequencies.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-500 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Quick Filter:
          </span>
          {['All', 'Prices', 'Demography', 'Economy', 'Households', 'Labour', 'Healthcare', 'Public Safety'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Dataset Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-slate-900 border border-slate-800 rounded-xl animate-pulse p-4" />
          ))}
        </div>
      ) : catalogData.datasets.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
          <Database className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No datasets matched your criteria</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
            Try resetting your search query or broadening the selected agency and category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedSource('All');
              setSelectedFrequency('All');
            }}
            className="px-4 py-2 text-xs font-medium bg-slate-800 text-white hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogData.datasets.map((item) => {
            const isCompared = comparedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-sm"
              >
                <div>
                  {/* Metadata Row (Clean unboxed text with typographic separators) */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 truncate">
                    <span className="text-amber-400/90 font-mono text-[11px] font-semibold">{item.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.category_en}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.frequency}</span>
                  </div>

                  <h3 className="text-base font-semibold text-white tracking-tight mb-1.5 leading-snug line-clamp-2">
                    {item.title_en}
                  </h3>

                  {item.title_bm && item.title_bm !== item.title_en && (
                    <p className="text-xs text-slate-400 italic mb-3 line-clamp-1">
                      {item.title_bm}
                    </p>
                  )}

                  {/* Attributes */}
                  <div className="text-xs text-slate-400 space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Source:</span>
                      <span className="text-slate-300 font-medium truncate max-w-[190px]">{item.source}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Coverage:</span>
                      <span className="text-slate-300 font-mono">{item.geography} {item.dataset_begin ? `(${item.dataset_begin}–${item.dataset_end || 'Present'})` : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenInspector(item)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Inspect API</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectForCompare(item.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
                        isCompared
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title={isCompared ? 'Added to compare studio' : 'Add to compare'}
                    >
                      {isCompared ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Compare</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dataset Inspector Modal */}
      {inspectDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="font-mono text-amber-400">{inspectDataset.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>{inspectDataset.category_en}</span>
                  <span aria-hidden="true">·</span>
                  <span>{inspectDataset.source}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{inspectDataset.title_en}</h3>
                {inspectDataset.title_bm && (
                  <p className="text-xs text-slate-400 italic">{inspectDataset.title_bm}</p>
                )}
              </div>
              <button
                onClick={() => setInspectDataset(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Endpoint Information */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs text-slate-400 mb-1 font-medium">Official REST API Endpoint</div>
                <div className="font-mono text-xs text-emerald-400 break-all select-all">
                  {inspectDataset.api_endpoint || `https://api.data.gov.my/data-catalogue/?id=${inspectDataset.id}`}
                </div>
              </div>

              {/* Code Snippets Generator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">Integration Code Snippet:</span>
                    <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg text-xs">
                      {(['curl', 'js', 'python'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveSnippetTab(tab)}
                          className={`px-2.5 py-1 rounded-md capitalize font-mono text-[11px] ${
                            activeSnippetTab === tab
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab === 'js' ? 'Fetch JS' : tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const code =
                        activeSnippetTab === 'curl'
                          ? getCurlSnippet(inspectDataset.id)
                          : activeSnippetTab === 'js'
                          ? getJsSnippet(inspectDataset.id)
                          : getPythonSnippet(inspectDataset.id);
                      copyToClipboard(code);
                    }}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-md"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                  {activeSnippetTab === 'curl' && getCurlSnippet(inspectDataset.id)}
                  {activeSnippetTab === 'js' && getJsSnippet(inspectDataset.id)}
                  {activeSnippetTab === 'python' && getPythonSnippet(inspectDataset.id)}
                </pre>
              </div>

              {/* Live Data Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-slate-300">
                    Live Data Preview (Latest {previewRecords.length} Records)
                  </div>
                  {previewRecords.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportToCSV(`${inspectDataset.id}_sample`, previewRecords)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download CSV</span>
                      </button>
                      <span className="text-slate-700">|</span>
                      <button
                        onClick={() => exportToJSON(`${inspectDataset.id}_sample`, previewRecords)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </button>
                    </div>
                  )}
                </div>

                {inspectLoading ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                    Fetching live data via data.gov.my gateway...
                  </div>
                ) : previewRecords.length === 0 ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 text-center">
                    No active sample records returned or dataset is large batch archive. Use the full API endpoint to stream records.
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto max-h-56">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                          {Object.keys(previewRecords[0]).map((key) => (
                            <th key={key} className="p-2.5 font-medium whitespace-nowrap">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRecords.map((row, i) => (
                          <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-900/30 font-mono text-[11px] text-slate-300">
                            {Object.keys(previewRecords[0]).map((key) => (
                              <td key={key} className="p-2.5 whitespace-nowrap tabular-nums">
                                {typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key] ?? '-')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
              <a
                href={inspectDataset.api_endpoint || `https://api.data.gov.my/data-catalogue/?id=${inspectDataset.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <span>developer.data.gov.my Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onSelectForCompare(inspectDataset.id);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors"
                >
                  {comparedIds.includes(inspectDataset.id) ? 'Added to Compare' : 'Add to Compare Studio'}
                </button>
                <button
                  onClick={() => setInspectDataset(null)}
                  className="px-3.5 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
