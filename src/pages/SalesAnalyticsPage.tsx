import React, { useEffect, useState } from 'react';
import { TrendingUp, Filter } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const SalesAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [countryFilter, setCountryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSales = (c?: string) => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/sales-analytics', { params: { country: c } })
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleFilterChange = (val: string) => {
    setCountryFilter(val);
    fetchSales(val);
  };

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Calculating Temporal Sales Trends...</p>
      </div>
    );
  }

  const monthly = data.monthly_trend || [];
  const dow = data.day_of_week_sales || [];
  const countries = data.country_sales || [];

  return (
    <div className="p-6 space-y-6">
      {/* Filters Bar */}
      <div className="flex items-center justify-between card-theme p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Sales & Temporal Revenue Analytics</h2>
            <p className="text-xs text-slate-700">Dynamic temporal trends, order counts, and day-of-week purchase velocity</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-600" />
          <select
            value={countryFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 bg-white text-slate-900 font-bold"
          >
            <option value="">All Countries</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="EIRE">EIRE</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Netherlands">Netherlands</option>
          </select>
        </div>
      </div>

      {/* Main Revenue Trajectory */}
      <div className="card-theme p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Monthly Revenue Growth Trajectory (£)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month_str" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Day of Week Sales & Country Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Revenue by Day of the Week
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dow}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Top Markets Revenue (£)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={countries}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="country" width={110} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#0d9488" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
