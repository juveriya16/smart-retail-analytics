import React, { useEffect, useState } from 'react';
import { Users, Crown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const CustomerAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/customer-analytics')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Processing Customer Behavioral Metrics...</p>
      </div>
    );
  }

  const spenders = data.top_spenders || [];
  const recencyDist = data.recency_distribution || [];
  const segments = data.segments || [];

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Customer Behavioral Intelligence</h2>
            <p className="text-xs text-slate-700">Deep customer spend profiling, purchase recency, and customer lifetime value</p>
          </div>
        </div>
      </div>

      {/* Recency Distribution & Segment Spend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Customer Recency Distribution (Days Since Last Order)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recencyDist}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="recency_bin" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [Number(val).toLocaleString(), 'Customers']} />
                <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Average Spend per Behavioral Segment (£)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={segments}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tickFormatter={(val) => `£${val}`} />
                <YAxis type="category" dataKey="rfm_segment" width={120} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => [`£${Number(val).toFixed(2)}`, 'Avg Spend']} />
                <Bar dataKey="avg_spend" fill="#a855f7" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top VIP Spenders Table */}
      <div className="card-theme rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Crown size={18} className="text-amber-500" />
          Top 10 VIP Spenders (Lifetime Monetary Value)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Customer ID</th>
                <th className="p-3">Country</th>
                <th className="p-3 text-right">Orders (Frequency)</th>
                <th className="p-3 text-right">Recency (Days)</th>
                <th className="p-3 text-right">Monetary Spend (£)</th>
                <th className="p-3">Behavioral Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {spenders.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-indigo-600">{row.customer_id}</td>
                  <td className="p-3 font-semibold text-slate-800">{row.country}</td>
                  <td className="p-3 text-right font-mono font-bold">{row.frequency}</td>
                  <td className="p-3 text-right font-mono">{row.recency} days</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-600">
                    £{Number(row.monetary).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-600">
                      {row.rfm_segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
