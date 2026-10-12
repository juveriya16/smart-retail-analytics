import React, { useEffect, useState } from 'react';
import { PieChart, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const RfmPage: React.FC = () => {
  const [rfmData, setRfmData] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRfm = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/rfm', {
      params: { search, segment: segmentFilter || undefined, page, limit: 20 }
    })
      .then(res => setRfmData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRfm();
  }, [segmentFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRfm();
  };

  if (loading || !rfmData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Calculating RFM Scores & Customer Segments...</p>
      </div>
    );
  }

  const summaries = rfmData.segments_summary || [];
  const customers = rfmData.customers || [];
  const totalCustomers = rfmData.total_customers || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600">
            <PieChart size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">RFM Customer Segmentation (Recency, Frequency, Monetary)</h2>
            <p className="text-xs text-slate-700">Quantile-based 1-5 scoring for all 5,878 customer accounts</p>
          </div>
        </div>
      </div>

      {/* RFM Workflow Visualizer */}
      <div className="card-theme p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900">RFM Segmentation Workflow</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-indigo-500 uppercase">Input</span>
            <h4 className="text-xs font-bold text-slate-900">Clean Transactions</h4>
          </div>
          <ArrowRight size={18} className="text-slate-600" />
          <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-indigo-500 uppercase">Aggregation</span>
            <h4 className="text-xs font-bold text-slate-900">Customer Metrics</h4>
          </div>
          <ArrowRight size={18} className="text-slate-600" />
          <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-indigo-500 uppercase">Quantiles</span>
            <h4 className="text-xs font-bold text-slate-900">RFM Scores (1-5)</h4>
          </div>
          <ArrowRight size={18} className="text-slate-600" />
          <div className="flex-1 p-3 rounded-xl bg-indigo-50 border border-indigo-200">
            <span className="text-[10px] font-bold text-indigo-600 uppercase">Output</span>
            <h4 className="text-xs font-bold text-indigo-700">Behavioral Tiers</h4>
          </div>
        </div>
      </div>

      {/* Segment Breakdown Chart */}
      <div className="card-theme p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Customer Count & Revenue by RFM Segment
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaries}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="rfm_segment" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any, name?: any) => [
                name === 'count' ? Number(val).toLocaleString() : `£${Number(val).toLocaleString()}`,
                name === 'count' ? 'Customers' : 'Revenue'
              ]} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer RFM Table */}
      <div className="card-theme rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900">
            Customer RFM Scores & Segment Table ({totalCustomers.toLocaleString()} accounts)
          </h3>

          <div className="flex items-center gap-3">
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 bg-white text-slate-900"
            >
              <option value="">All Segments</option>
              <option value="Champions">Champions</option>
              <option value="Loyal Customers">Loyal Customers</option>
              <option value="Promising / New">Promising / New</option>
              <option value="At Risk">At Risk</option>
              <option value="Hibernating / Lost">Hibernating / Lost</option>
            </select>

            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search Customer ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 bg-white text-slate-900"
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Customer ID</th>
                <th className="p-3">Country</th>
                <th className="p-3 text-right">Recency (Days)</th>
                <th className="p-3 text-right">Frequency</th>
                <th className="p-3 text-right">Monetary (£)</th>
                <th className="p-3 text-center">R-F-M Score</th>
                <th className="p-3">RFM Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-indigo-600">{row.customer_id}</td>
                  <td className="p-3 text-slate-700">{row.country}</td>
                  <td className="p-3 text-right font-mono">{row.recency}</td>
                  <td className="p-3 text-right font-mono font-bold">{row.frequency}</td>
                  <td className="p-3 text-right font-mono font-bold text-purple-600">
                    £{Number(row.monetary).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {row.rfm_score}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-indigo-600">{row.rfm_segment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
