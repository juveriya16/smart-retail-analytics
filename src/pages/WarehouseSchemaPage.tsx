import React, { useEffect, useState } from 'react';
import { Network, Database, Layers, Filter } from 'lucide-react';
import axios from 'axios';

export const WarehouseSchemaPage: React.FC = () => {
  const [schemaData, setSchemaData] = useState<any>(null);
  const [olapData, setOlapData] = useState<any[]>([]);
  const [yearFilter, setYearFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/warehouse')
      .then(res => setSchemaData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    fetchOlap();
  }, []);

  const fetchOlap = (y?: string, c?: string) => {
    const params: any = {};
    if (y) params.year = y;
    if (c) params.country = c;

    axios.get('http://127.0.0.1:8000/api/olap', { params })
      .then(res => setOlapData(res.data.results || []))
      .catch(err => console.error(err));
  };

  const handleApplyOlap = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOlap(yearFilter, countryFilter);
  };

  if (loading || !schemaData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Loading Data Warehouse Star Schema Metadata...</p>
      </div>
    );
  }

  const fact = schemaData.fact_table || {};
  const dims = schemaData.dimension_tables || [];

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="card-theme p-6 rounded-2xl bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-600 text-white shadow-md">
            <Network size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Data Warehouse Architecture & Star Schema
            </h2>
            <p className="text-xs text-slate-700">
              Dimensional modeling with central FACT_SALES surrounded by 5 normalized Dimension tables for fast OLAP slice & dice analytics
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Visual Star Schema Diagram */}
      <div className="card-theme p-6 rounded-2xl space-y-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers size={18} className="text-indigo-500" />
          Interactive Star Schema Diagram
        </h3>

        <div className="relative p-6 rounded-2xl bg-white text-white border border-slate-200 min-h-[420px] flex flex-col items-center justify-center overflow-x-auto">
          {/* Central Fact Table */}
          <div className="z-10 p-5 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 shadow-2xl border border-purple-400/30 text-center w-64 space-y-2">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-purple-200 bg-black/20 px-2 py-0.5 rounded">
              FACT TABLE
            </span>
            <h4 className="text-base font-extrabold text-white">{fact.name}</h4>
            <p className="text-[11px] text-purple-100 font-mono">
              {(fact.records || 0).toLocaleString()} Fact Records
            </p>
            <div className="text-[10px] text-left bg-black/30 p-2.5 rounded-xl space-y-1 font-mono">
              <span className="text-indigo-300 font-bold block">Measures:</span>
              <p className="text-slate-300">quantity, unit_price, revenue</p>
              <span className="text-purple-300 font-bold block mt-1">Foreign Keys:</span>
              <p className="text-slate-300">customer_id, stock_code, date_key, country</p>
            </div>
          </div>

          {/* Dimension Cards Surrounding Central Fact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
            {dims.map((dim: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-indigo-500 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-bold">
                    DIMENSION
                  </span>
                  <span className="text-[10px] font-mono text-slate-600">
                    {(dim.records || 0).toLocaleString()} rows
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Database size={14} className="text-indigo-400" />
                  {dim.name}
                </h5>
                <div className="text-[10px] font-mono text-slate-300 space-y-1">
                  <p className="text-amber-400">PK: {dim.primary_key}</p>
                  <p className="text-slate-600 truncate">Attrs: {dim.attributes.slice(0, 4).join(', ')}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive OLAP Query Operations Section */}
      <div className="card-theme p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter size={18} className="text-indigo-500" />
              OLAP Slice, Dice & Drill-Down Query Engine
            </h3>
            <p className="text-xs text-slate-700">
              Query pre-aggregated measures across Date and Country dimension hierarchies
            </p>
          </div>

          <form onSubmit={handleApplyOlap} className="flex items-center gap-2">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 bg-white text-slate-900"
            >
              <option value="">All Years</option>
              <option value="2009">2009</option>
              <option value="2010">2010</option>
              <option value="2011">2011</option>
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 bg-white text-slate-900"
            >
              <option value="">All Countries</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="EIRE">EIRE</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Netherlands">Netherlands</option>
            </select>

            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Slice & Dice
            </button>
          </form>
        </div>

        {/* OLAP Query Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Year</th>
                <th className="p-3">Month</th>
                <th className="p-3">Country</th>
                <th className="p-3 text-right">Orders</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-right">Revenue (£)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {olapData.slice(0, 15).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-indigo-600">{row.year}</td>
                  <td className="p-3 font-semibold text-slate-800">{row.month_name}</td>
                  <td className="p-3 text-slate-700">{row.country}</td>
                  <td className="p-3 text-right font-mono">{row.orders.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono">{row.total_quantity.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-purple-600">
                    £{Number(row.revenue).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
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
