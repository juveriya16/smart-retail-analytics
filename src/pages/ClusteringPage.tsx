import React, { useEffect, useState } from 'react';
import { Boxes } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const ClusteringPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/kmeans')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Calculating K-Means Clusters & Silhouette Scores...</p>
      </div>
    );
  }

  const elbow = data.elbow_data || [];
  const profiles = data.cluster_profiles || [];
  const optimalK = data.optimal_k || 4;
  const silhouette = data.silhouette_score || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="card-theme p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-600">
            <Boxes size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">K-Means Customer Clustering (Unsupervised ML)</h2>
            <p className="text-xs text-slate-700">RFM Feature vector clustering with Elbow Inertia & Silhouette score optimization</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="px-4 py-2 rounded-xl bg-pink-100 text-pink-700 border border-pink-200 text-center">
            <span className="text-[10px] uppercase font-bold block">Selected K</span>
            <span className="text-xl font-black">K = {optimalK}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 text-center">
            <span className="text-[10px] uppercase font-bold block">Silhouette Score</span>
            <span className="text-xl font-black">{silhouette}</span>
          </div>
        </div>
      </div>

      {/* Elbow Method & Silhouette Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Elbow Method (WCSS Inertia vs K)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={elbow}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="k" label={{ value: 'Number of Clusters (K)', position: 'bottom', offset: 0 }} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [Number(val).toLocaleString(), 'Inertia (WCSS)']} />
                <Line type="monotone" dataKey="inertia" stroke="#ec4899" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Silhouette Score Analysis vs K
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={elbow}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="k" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 0.6]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [Number(val).toFixed(4), 'Silhouette Score']} />
                <Bar dataKey="silhouette" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cluster Profiles Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Cluster Profiles & Automatically Generated Segment Characteristics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((p: any, idx: number) => (
            <div key={idx} className="card-theme card-theme-hover p-5 rounded-2xl space-y-3 border-t-4 border-t-pink-500">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-100 text-pink-700 font-bold">
                  CLUSTER {p.cluster_id}
                </span>
                <span className="text-xs font-bold text-slate-700">{p.percentage}%</span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">{p.name}</h4>

              <div className="space-y-1 text-xs pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-700">Customers:</span>
                  <span className="font-mono font-bold text-slate-900">{p.count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Avg Recency:</span>
                  <span className="font-mono font-bold text-slate-900">{p.avg_recency} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Avg Frequency:</span>
                  <span className="font-mono font-bold text-slate-900">{p.avg_frequency} orders</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Avg Spend:</span>
                  <span className="font-mono font-bold text-emerald-600">£{p.avg_monetary.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
