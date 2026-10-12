import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const DataQualityPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/data-quality')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Auditing Data Quality & Health Metrics...</p>
      </div>
    );
  }

  const issues = data.issues || [];
  const pipeline = data.pipeline_stages || [];
  const score = data.quality_score || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Top Quality Score Gauge & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-theme p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-transparent">
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-indigo-500/20 border-t-indigo-600 flex items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{score}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Data Quality Index</h3>
            <p className="text-xs text-slate-700">Validated against retail ETL business rules</p>
          </div>
        </div>

        <div className="md:col-span-2 card-theme p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Data Hygiene & Quality Audit</h3>
              <p className="text-xs text-slate-700">
                Empirical audit of 1,067,371 raw transaction records from Online Retail II
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-600">Raw Records</span>
              <span className="block text-lg font-black text-slate-900">
                {(data.raw_count || 0).toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-600">Cleaned Valid Sales</span>
              <span className="block text-lg font-black text-emerald-600">
                {(data.cleaned_count || 0).toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-600">Filter Exclusion</span>
              <span className="block text-lg font-black text-amber-600">
                {((data.raw_count || 0) - (data.cleaned_count || 0)).toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-600">Hygiene Pass Rate</span>
              <span className="block text-lg font-black text-indigo-600">
                {score}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Workflow Pipeline */}
      <div className="card-theme p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity size={18} className="text-indigo-500" />
          Visual Data Quality Pipeline
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
          {pipeline.map((stg: any, idx: number) => (
            <React.Fragment key={idx}>
              <div className="flex-1 w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-indigo-600">
                  Stage {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{stg.stage}</h4>
                <p className="text-sm font-mono font-black text-slate-700">
                  {stg.records.toLocaleString()} rows
                </p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-600">
                  {stg.status}
                </span>
              </div>
              {idx < pipeline.length - 1 && (
                <ArrowRight size={20} className="hidden md:block text-slate-600 rotate-90 md:rotate-0 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Data Quality Issues Breakdown Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Data Quality Issue Breakdown
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={issues} margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="issue" width={130} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => [Number(val).toLocaleString(), 'Affected Rows']} />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Diagnostic Issue Details Table
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="p-3">Data Quality Flag</th>
                  <th className="p-3 text-right">Affected Count</th>
                  <th className="p-3 text-right">% of Dataset</th>
                  <th className="p-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {issues.map((iss: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{iss.issue}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-700">
                      {iss.count.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-amber-600">
                      {iss.percentage}%
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        iss.severity === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {iss.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
