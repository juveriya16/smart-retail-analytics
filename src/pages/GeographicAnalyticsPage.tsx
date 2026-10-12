import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const GeographicAnalyticsPage: React.FC = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/geographic-analytics')
      .then(res => setCountries(res.data.countries || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Aggregating Geographic Market Data...</p>
      </div>
    );
  }

  const top10 = countries.slice(0, 10);

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-600">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Geographic & Regional Analytics</h2>
            <p className="text-xs text-slate-700">International market rankings across {countries.length} active retail countries</p>
          </div>
        </div>
      </div>

      {/* Top 10 Countries Bar Chart */}
      <div className="card-theme p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Top 10 International Retail Markets by Total Revenue (£)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top10} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="country" angle={-15} textAnchor="end" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="total_revenue" fill="#ec4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Country Table */}
      <div className="card-theme rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Complete Geographic Performance Ranking Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Country</th>
                <th className="p-3 text-right">Unique Customers</th>
                <th className="p-3 text-right">Total Orders</th>
                <th className="p-3 text-right">Total Quantity</th>
                <th className="p-3 text-right">Total Revenue (£)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {countries.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-600">#{i + 1}</td>
                  <td className="p-3 font-bold text-slate-900">{row.country}</td>
                  <td className="p-3 text-right font-mono">{row.total_customers ? row.total_customers.toLocaleString() : 'N/A'}</td>
                  <td className="p-3 text-right font-mono">{row.total_orders.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono">{row.total_quantity.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-purple-600">
                    £{Number(row.total_revenue).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
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
