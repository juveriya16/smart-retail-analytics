import React, { useState, useEffect } from 'react';
import { Search, Database, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

export const DatasetPage: React.FC = () => {
  const [tableType, setTableType] = useState<'cleaned' | 'raw'>('cleaned');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sortBy, setSortBy] = useState('invoice_date_str');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [datasetData, setDatasetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/dataset', {
        params: {
          table_type: tableType,
          search,
          page,
          limit,
          sort_by: sortBy,
          sort_dir: sortDir
        }
      });
      setDatasetData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableType, page, limit, sortBy, sortDir]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  };

  const schema = datasetData?.schema || [];
  const rows = datasetData?.data || [];
  const totalRecords = datasetData?.total_records || 0;
  const totalPages = datasetData?.total_pages || 1;

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card-theme p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Online Retail II Transaction Explorer
            </h2>
            <p className="text-xs text-slate-700">
              Paginated & searchable transaction database ({totalRecords.toLocaleString()} matching records)
            </p>
          </div>
        </div>

        {/* Raw vs Cleaned Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => { setTableType('cleaned'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tableType === 'cleaned'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cleaned Sales (1.00M Rows)
          </button>
          <button
            onClick={() => { setTableType('raw'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tableType === 'raw'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw Dataset (1.06M Rows)
          </button>
        </div>
      </div>

      {/* Dataset Schema Info Cards */}
      <div className="card-theme p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">
          Dataset Relational Schema & Attribute Specifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {schema.map((col: any, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-600 font-mono">
                  {col.column}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  {col.data_type}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                {col.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Table Toolbar: Search & Limit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search invoice, SKU, description, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-slate-600" />
        </form>

        <div className="flex items-center gap-3 text-xs text-slate-700">
          <span>Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-900 font-bold"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Interactive Records Table */}
      <div className="card-theme rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider sticky top-0 border-b border-slate-200">
              <tr>
                <th onClick={() => handleSort('invoice')} className="p-3 cursor-pointer hover:text-indigo-600">
                  <div className="flex items-center gap-1">Invoice <ArrowUpDown size={12} /></div>
                </th>
                <th onClick={() => handleSort('stock_code')} className="p-3 cursor-pointer hover:text-indigo-600">
                  <div className="flex items-center gap-1">Stock Code <ArrowUpDown size={12} /></div>
                </th>
                <th onClick={() => handleSort('description')} className="p-3 cursor-pointer hover:text-indigo-600">
                  <div className="flex items-center gap-1">Description <ArrowUpDown size={12} /></div>
                </th>
                <th onClick={() => handleSort('quantity')} className="p-3 cursor-pointer hover:text-indigo-600 text-right">
                  <div className="flex items-center justify-end gap-1">Qty <ArrowUpDown size={12} /></div>
                </th>
                <th onClick={() => handleSort('unit_price')} className="p-3 cursor-pointer hover:text-indigo-600 text-right">
                  <div className="flex items-center justify-end gap-1">Price (£) <ArrowUpDown size={12} /></div>
                </th>
                {tableType === 'cleaned' && (
                  <th onClick={() => handleSort('revenue')} className="p-3 cursor-pointer hover:text-indigo-600 text-right">
                    <div className="flex items-center justify-end gap-1">Revenue (£) <ArrowUpDown size={12} /></div>
                  </th>
                )}
                <th onClick={() => handleSort('customer_id')} className="p-3 cursor-pointer hover:text-indigo-600">
                  <div className="flex items-center gap-1">Customer ID <ArrowUpDown size={12} /></div>
                </th>
                <th onClick={() => handleSort('country')} className="p-3 cursor-pointer hover:text-indigo-600">
                  <div className="flex items-center gap-1">Country <ArrowUpDown size={12} /></div>
                </th>
                <th onClick={() => handleSort('invoice_date_str')} className="p-3 cursor-pointer hover:text-indigo-600">
                  <div className="flex items-center gap-1">Invoice Date <ArrowUpDown size={12} /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-700">
                    Loading records from SQLite database...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-700">
                    No transactions match your search query.
                  </td>
                </tr>
              ) : (
                rows.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-600">
                      {row.invoice}
                    </td>
                    <td className="p-3 font-mono text-slate-700">
                      {row.stock_code}
                    </td>
                    <td className="p-3 text-slate-900 font-medium truncate max-w-xs">
                      {row.description}
                    </td>
                    <td className="p-3 text-right font-mono font-semibold text-slate-900">
                      {row.quantity}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-700">
                      £{Number(row.unit_price).toFixed(2)}
                    </td>
                    {tableType === 'cleaned' && (
                      <td className="p-3 text-right font-mono font-bold text-purple-600">
                        £{Number(row.revenue).toFixed(2)}
                      </td>
                    )}
                    <td className="p-3 font-mono text-slate-700">
                      {row.customer_id ? row.customer_id : <span className="text-amber-500 italic">N/A</span>}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {row.country}
                    </td>
                    <td className="p-3 text-slate-700 font-mono">
                      {row.invoice_date_str}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-700">
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalRecords.toLocaleString()} total rows)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100:bg-slate-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
