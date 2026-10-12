import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const ProductAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/product-analytics', { params: { search, page, limit: 15 } })
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Analyzing Product SKU Performance...</p>
      </div>
    );
  }

  const topRev = data.top_by_revenue || [];
  const topQty = data.top_by_quantity || [];
  const products = data.products || [];

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="card-theme p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Product Intelligence & SKU Analytics</h2>
            <p className="text-xs text-slate-700">Performance rankings across 4,917 distinct products by total sales revenue and quantity</p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search product description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-white text-slate-900"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-slate-600" />
        </form>
      </div>

      {/* Top Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Top 10 SKUs by Total Revenue (£)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topRev}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="stock_code" width={70} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="total_revenue" fill="#f97316" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Top 10 SKUs by Quantity Sold
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topQty}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="stock_code" width={70} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => [Number(val).toLocaleString(), 'Units Sold']} />
                <Bar dataKey="total_quantity_sold" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="card-theme rounded-2xl overflow-hidden p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Product SKU Performance Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Stock Code</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Avg Unit Price (£)</th>
                <th className="p-3 text-right">Qty Sold</th>
                <th className="p-3 text-right">Total Revenue (£)</th>
                <th className="p-3 text-right">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-indigo-600">{row.stock_code}</td>
                  <td className="p-3 font-medium text-slate-900">{row.description}</td>
                  <td className="p-3 text-right font-mono">£{Number(row.avg_unit_price).toFixed(2)}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">{row.total_quantity_sold.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-purple-600">
                    £{Number(row.total_revenue).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono">{row.total_orders.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
