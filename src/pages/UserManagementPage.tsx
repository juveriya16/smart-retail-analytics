import React, { useState } from 'react';
import { UserCog, ShieldCheck, UserCheck, Plus, CheckCircle2 } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [usersList] = useState([
    { id: 1, name: 'Platform Admin', email: 'admin@retailanalytics.io', role: 'admin', status: 'Active', lastLogin: 'Just now' },
    { id: 2, name: 'Retail Business Analyst', email: 'analyst@retailanalytics.io', role: 'analyst', status: 'Active', lastLogin: '5 mins ago' },
    { id: 3, name: 'Senior Data Scientist', email: 'ds@retailanalytics.io', role: 'admin', status: 'Active', lastLogin: '1 hour ago' },
    { id: 4, name: 'Marketing Lead', email: 'marketing@retailanalytics.io', role: 'analyst', status: 'Active', lastLogin: 'Yesterday' }
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
            <UserCog size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">User & Role Permission Management</h2>
            <p className="text-xs text-slate-700">Configure role-based access control (RBAC), access tokens, and privileges</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors">
          <Plus size={16} />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Role Comparison Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-3 border-t-4 border-t-amber-500">
          <div className="flex items-center gap-2 text-amber-600">
            <ShieldCheck size={20} />
            <h3 className="text-sm font-bold uppercase">Administrator Role Privileges</h3>
          </div>
          <ul className="text-xs space-y-2 text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Full database ETL & schema administration</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Raw & cleaned data table overrides</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> ML model training, parameter tuning & evaluation</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Technical data quality & pipeline diagnostics</li>
          </ul>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-3 border-t-4 border-t-sky-500">
          <div className="flex items-center gap-2 text-sky-600">
            <UserCheck size={20} />
            <h3 className="text-sm font-bold uppercase">Analyst / User Role Privileges</h3>
          </div>
          <ul className="text-xs space-y-2 text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Interactive business analytics dashboard & charts</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Customer segment exploration & RFM breakdowns</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Product market basket affinity rule viewing</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Executive business insights & report printing</li>
          </ul>
        </div>
      </div>

      {/* Users Accounts Table */}
      <div className="card-theme rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Active System Accounts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{u.name}</td>
                  <td className="p-3 font-mono text-slate-700">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-600">{u.status}</td>
                  <td className="p-3 font-mono text-slate-600">{u.lastLogin}</td>
                  <td className="p-3 text-right">
                    <span className="text-xs font-bold text-slate-600">
                      Configured
                    </span>
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
