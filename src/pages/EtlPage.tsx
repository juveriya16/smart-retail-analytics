import React, { useEffect, useState } from 'react';
import { GitMerge, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const EtlPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/etl-pipeline')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Loading ETL Pipeline Execution Metrics...</p>
      </div>
    );
  }

  const steps = [
    { title: 'SOURCE DATA', desc: 'Online Retail II Excel (2009-2011)', stat: '45.6 MB File', color: 'from-blue-600 to-indigo-600' },
    { title: 'EXTRACT', desc: 'Fast Rust-based Calamine reader', stat: `${(data.extract.raw_records || 0).toLocaleString()} Rows`, color: 'from-cyan-600 to-teal-600' },
    { title: 'TRANSFORM & CLEAN', desc: 'Deduplicate, parse date, currency revenue', stat: `${(data.load.fact_table_records || 0).toLocaleString()} Valid Sales`, color: 'from-purple-600 to-indigo-600' },
    { title: 'FEATURE ENG.', desc: 'RFM metrics, basket encoding, customer tiers', stat: '6 Features Generated', color: 'from-pink-600 to-rose-600' },
    { title: 'LOAD & WAREHOUSE', desc: 'SQLite Star Schema Fact & Dimensions', stat: '5 Dimension Tables', color: 'from-emerald-600 to-teal-600' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="card-theme p-6 rounded-2xl space-y-3 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-md">
            <GitMerge size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Data Preprocessing & Automated ETL Architecture
            </h2>
            <p className="text-xs text-slate-700">
              High-performance extraction, transformation, data cleaning, and automated loading into the Star Schema Data Warehouse
            </p>
          </div>
        </div>
      </div>

      {/* Visual ETL Flow */}
      <div className="card-theme p-6 rounded-2xl space-y-6">
        <h3 className="text-sm font-bold text-slate-900">
          ETL Process Flow Visualization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-600">
                  STEP 0{idx + 1}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                <p className="text-[11px] text-slate-700 mt-0.5">{step.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-extrabold text-indigo-600 font-mono">
                  {step.stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transformations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Cleaning Rules Applied
          </h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2 text-slate-700">
              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              <span>Removed <strong>{(data.clean.duplicates_removed || 0).toLocaleString()}</strong> exact duplicate transaction rows.</span>
            </li>
            <li className="flex items-center gap-2 text-slate-700">
              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              <span>Isolated <strong>{(data.clean.cancelled_removed || 0).toLocaleString()}</strong> cancelled invoice records (prefix 'C').</span>
            </li>
            <li className="flex items-center gap-2 text-slate-700">
              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              <span>Filtered <strong>{(data.clean.invalid_qty_removed || 0).toLocaleString()}</strong> non-positive quantity adjustments.</span>
            </li>
            <li className="flex items-center gap-2 text-slate-700">
              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              <span>Filtered <strong>{(data.clean.invalid_price_removed || 0).toLocaleString()}</strong> zero/negative unit price entries.</span>
            </li>
          </ul>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Engineered Features
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-indigo-600">Revenue = Quantity × UnitPrice</span>
              <p className="text-slate-700 text-[11px]">Calculated per line item in GBP (£).</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-indigo-600">RFM Metrics (Recency, Frequency, Monetary)</span>
              <p className="text-slate-700 text-[11px]">Calculated for all 5,878 verified customer accounts.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-indigo-600">Market Basket One-Hot Encoding</span>
              <p className="text-slate-700 text-[11px]">Transactions converted to basket matrix for Apriori mining.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
