import React, { useEffect, useState } from 'react';
import { ListOrdered } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const FeatureImportancePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/classification')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Extracting Feature Importances...</p>
      </div>
    );
  }

  const features = data.feature_importances || [];

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600">
            <ListOrdered size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Feature Importance Ranking Analysis</h2>
            <p className="text-xs text-slate-700">Gini impurity reduction weights for predictive customer features</p>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="card-theme p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Predictor Variable Importance Weights
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={features} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="feature" width={140} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [Number(val).toFixed(4), 'Gini Weight']} />
              <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Ranking Table */}
      <div className="card-theme rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Detailed Feature Weight & Rank Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Feature Name</th>
                <th className="p-3 text-right">Gini Importance Weight</th>
                <th className="p-3">Percentage Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {features.map((item: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-600">#{i + 1}</td>
                  <td className="p-3 font-bold text-indigo-600 font-mono">{item.feature}</td>
                  <td className="p-3 text-right font-mono font-bold">{item.importance}</td>
                  <td className="p-3 font-mono font-bold text-purple-600">
                    {(item.importance * 100).toFixed(2)}%
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
