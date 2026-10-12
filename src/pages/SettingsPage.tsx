import React from 'react';
import { Sliders, Database, Save, RefreshCw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-500/10 text-slate-600">
            <Sliders size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Platform Configuration & System Settings</h2>
            <p className="text-xs text-slate-700">Manage data warehouse threshold settings, model hyper-parameters, and storage limits</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors">
          <Save size={16} />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Settings Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database size={18} className="text-indigo-500" />
            ETL & Data Warehouse Parameters
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Currency Symbol</label>
              <input type="text" defaultValue="£ (GBP)" disabled className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-700" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Row Batch Processing Size</label>
              <input type="number" defaultValue={50000} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-mono" />
            </div>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw size={18} className="text-pink-500" />
            Machine Learning Thresholds
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Apriori Minimum Support Threshold</label>
              <input type="text" defaultValue="0.015 (1.5%)" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-mono" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Apriori Minimum Lift Threshold</label>
              <input type="text" defaultValue="1.2" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-mono" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
