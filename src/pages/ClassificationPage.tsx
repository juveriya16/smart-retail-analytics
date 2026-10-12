import React, { useEffect, useState } from 'react';
import { Target, Activity } from 'lucide-react';
import axios from 'axios';

export const ClassificationPage: React.FC = () => {
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
        <p className="text-sm font-semibold text-slate-700">Training Classification Machine Learning Model...</p>
      </div>
    );
  }

  const cm = data.confusion_matrix || { tn: 0, fp: 0, fn: 0, tp: 0 };
  const acc = (data.accuracy || 0) * 100;
  const prec = (data.precision || 0) * 100;
  const rec = (data.recall || 0) * 100;
  const f1 = (data.f1_score || 0) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Supervised ML Classification Model</h2>
            <p className="text-xs text-slate-700">Predictive Decision Tree / Random Forest Classifier targeting High-Value Customers</p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-theme p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-700 uppercase">Accuracy</span>
          <h3 className="text-3xl font-black text-blue-600">{acc.toFixed(1)}%</h3>
          <p className="text-[11px] text-slate-600">Overall prediction accuracy</p>
        </div>
        <div className="card-theme p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-700 uppercase">Precision</span>
          <h3 className="text-3xl font-black text-indigo-600">{prec.toFixed(1)}%</h3>
          <p className="text-[11px] text-slate-600">Positive predictive value</p>
        </div>
        <div className="card-theme p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-700 uppercase">Recall</span>
          <h3 className="text-3xl font-black text-teal-600">{rec.toFixed(1)}%</h3>
          <p className="text-[11px] text-slate-600">Sensitivity / True positive rate</p>
        </div>
        <div className="card-theme p-5 rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-slate-700 uppercase">F1-Score</span>
          <h3 className="text-3xl font-black text-purple-600">{f1.toFixed(1)}%</h3>
          <p className="text-[11px] text-slate-600">Harmonic mean of precision & recall</p>
        </div>
      </div>

      {/* Confusion Matrix Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity size={18} className="text-indigo-500" />
            Confusion Matrix
          </h3>
          <div className="grid grid-cols-2 gap-3 font-mono text-center">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-600">True Negative (TN)</span>
              <p className="text-2xl font-black text-emerald-700">{cm.tn}</p>
              <p className="text-[10px] text-slate-700">Correctly predicted non-high value</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-600">False Positive (FP)</span>
              <p className="text-2xl font-black text-rose-700">{cm.fp}</p>
              <p className="text-[10px] text-slate-700">Type I Error</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-600">False Negative (FN)</span>
              <p className="text-2xl font-black text-amber-700">{cm.fn}</p>
              <p className="text-[10px] text-slate-700">Type II Error</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-600">True Positive (TP)</span>
              <p className="text-2xl font-black text-indigo-700">{cm.tp}</p>
              <p className="text-[10px] text-slate-700">Correctly predicted VIP High-Value</p>
            </div>
          </div>
        </div>

        {/* Model Spec Card */}
        <div className="card-theme p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Model Training Specification</h3>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              Target Variable: <strong>{data.target_variable}</strong>
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-700">Algorithm:</span>
              <span className="font-bold text-indigo-600">{data.model_name}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-700">Training Samples (80%):</span>
              <span className="font-mono font-bold text-slate-900">{data.train_size?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-700">Test Samples (20%):</span>
              <span className="font-mono font-bold text-slate-900">{data.test_size?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
