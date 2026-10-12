import React from 'react';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

interface AccessRestrictedProps {
  onGoBack?: () => void;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({ onGoBack }) => {

  return (
    <div className="p-8 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="card-theme p-8 rounded-3xl max-w-lg w-full space-y-6 border-t-4 border-t-rose-500 shadow-xl bg-white">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
          <ShieldAlert size={36} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-rose-100 text-rose-700">
            Access Restricted
          </span>
          <h2 className="text-xl font-black text-slate-900">
            Administrative Privileges Required
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Your current account role (<strong>Analyst / User</strong>) does not have permission to view or manage raw database tables, ETL pipelines, warehouse schemas, model parameters, or administrative settings.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Lock size={14} className="text-slate-600" />
            <span>Restricted Administrative Features:</span>
          </div>
          <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 pl-1">
            <li>Raw dataset exploration & data quality overrides</li>
            <li>ETL pipeline transformations & database rebuilds</li>
            <li>Star Schema dimension updates & SQL management</li>
            <li>User account creation & platform settings</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
