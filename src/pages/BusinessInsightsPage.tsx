import React, { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import axios from 'axios';

export const BusinessInsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/business-insights')
      .then(res => setInsights(res.data.insights || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Synthesizing Data-Driven Business Insights...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
            <Lightbulb size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Synthesized Data-Driven Business Insights</h2>
            <p className="text-xs text-slate-700">Actionable operational intelligence automatically computed from Online Retail II dataset statistics</p>
          </div>
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((item, idx) => (
          <div key={idx} className="card-theme card-theme-hover p-6 rounded-2xl space-y-3 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-amber-100 text-amber-700">
                {item.category}
              </span>
              <span className="text-xs font-bold text-indigo-600">Impact: {item.impact}</span>
            </div>

            <h3 className="text-sm font-extrabold text-slate-900">{item.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
