import React, { useEffect, useState } from 'react';
import { BarChart3, Boxes, Target, Layers } from 'lucide-react';
import axios from 'axios';

export const ModelEvaluationPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/model-evaluation')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Compiling Cross-Algorithm Model Evaluation Dashboard...</p>
      </div>
    );
  }

  const kmeans = data.kmeans || {};
  const clf = data.classification || {};
  const apriori = data.apriori || {};

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Unified Machine Learning Model Evaluation</h2>
            <p className="text-xs text-slate-700">Cross-algorithm metric validation for Clustering, Classification, and Association Mining</p>
          </div>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* K-Means Evaluation */}
        <div className="card-theme p-6 rounded-2xl space-y-4 border-t-4 border-t-pink-500">
          <div className="flex items-center gap-2 text-pink-600">
            <Boxes size={20} />
            <h3 className="text-sm font-bold uppercase">K-Means Clustering</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-slate-700">Optimal K:</span>
              <span className="font-bold text-slate-900 font-mono">K = {kmeans.optimal_k || 4}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-slate-700">Silhouette Score:</span>
              <span className="font-bold text-pink-600 font-mono">{kmeans.silhouette_score}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-slate-700">Total Clusters:</span>
              <span className="font-bold text-slate-900 font-mono">{kmeans.cluster_profiles?.length || 4}</span>
            </div>
          </div>
        </div>

        {/* Classification Evaluation */}
        <div className="card-theme p-6 rounded-2xl space-y-4 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-2 text-blue-600">
            <Target size={20} />
            <h3 className="text-sm font-bold uppercase">ML Classification</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-slate-700">Accuracy:</span>
              <span className="font-bold text-emerald-600 font-mono">{((clf.accuracy || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-slate-700">Precision / Recall:</span>
              <span className="font-bold text-blue-600 font-mono">{((clf.precision || 0) * 100).toFixed(1)}% / {((clf.recall || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-slate-700">F1-Score:</span>
              <span className="font-bold text-purple-600 font-mono">{((clf.f1_score || 0) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Apriori Evaluation */}
        <div className="card-theme p-6 rounded-2xl space-y-4 border-t-4 border-t-purple-500">
          <div className="flex items-center gap-2 text-purple-600">
            <Layers size={20} />
            <h3 className="text-sm font-bold uppercase">Apriori Mining</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-slate-700">Frequent Itemsets:</span>
              <span className="font-bold text-slate-900 font-mono">{apriori.total_frequent_itemsets}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-slate-700">Total Mined Rules:</span>
              <span className="font-bold text-indigo-600 font-mono">{apriori.total_rules}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-slate-700">Max Lift Achieved:</span>
              <span className="font-bold text-purple-600 font-mono">{apriori.max_lift}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
