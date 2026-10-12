import React, { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const AprioriPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/apriori')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Mining Association Rules with Apriori / FP-Growth...</p>
      </div>
    );
  }

  const rules = data.rules || [];
  const totalItemsets = data.total_frequent_itemsets || 0;
  const totalRules = data.total_rules || 0;
  const maxLift = data.max_lift || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="card-theme p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-600">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Apriori Association Rule Mining</h2>
            <p className="text-xs text-slate-700">Frequent itemsets, support, confidence, and lift optimization across retail baskets</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-center">
            <span className="text-[10px] text-slate-600 uppercase block">Frequent Itemsets</span>
            <span className="text-sm font-extrabold text-slate-900">{totalItemsets.toLocaleString()}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 text-center">
            <span className="text-[10px] uppercase block font-bold">Mined Rules</span>
            <span className="text-sm font-extrabold">{totalRules}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-700 text-center">
            <span className="text-[10px] uppercase block font-bold">Highest Lift</span>
            <span className="text-sm font-extrabold">{maxLift}</span>
          </div>
        </div>
      </div>

      {/* Support vs Confidence Scatter Plot */}
      <div className="card-theme p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Rule Metrics Distribution: Support vs Confidence vs Lift
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="support" name="Support" unit="" tick={{ fontSize: 11 }} label={{ value: 'Support', position: 'bottom', offset: 0 }} />
              <YAxis dataKey="confidence" name="Confidence" unit="" tick={{ fontSize: 11 }} label={{ value: 'Confidence', angle: -90, position: 'left' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(val: any, name?: any) => [val, name || 'Value']} />
              <Scatter name="Association Rules" data={rules} fill="#ec4899" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Association Rules Table */}
      <div className="card-theme rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Top Mined Association Rules (Sorted by Lift)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Rule ID</th>
                <th className="p-3">Antecedents (If Purchased)</th>
                <th className="p-3">Consequents (Then Also Buys)</th>
                <th className="p-3 text-right">Support</th>
                <th className="p-3 text-right">Confidence</th>
                <th className="p-3 text-right">Lift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rules.map((r: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-600">#{r.id || idx + 1}</td>
                  <td className="p-3 font-bold text-indigo-600 max-w-xs truncate">
                    {r.antecedents.join(', ')}
                  </td>
                  <td className="p-3 font-bold text-pink-600 max-w-xs truncate">
                    {r.consequents.join(', ')}
                  </td>
                  <td className="p-3 text-right font-mono">{r.support}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {(r.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-right font-mono font-black text-emerald-600">
                    {r.lift}
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
