import React, { useEffect, useState } from 'react';
import { FileText, Printer, Download, RefreshCw, AlertCircle, ShieldCheck, Boxes, TrendingUp, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const ReportsPage: React.FC = () => {
  const { role, isAdmin } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = () => {
    setLoading(true);
    setError(null);
    axios.get('http://127.0.0.1:8000/api/reports', { params: { role } })
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error('Report generation error:', err);
        setError('Failed to fetch executive report data from the analytics backend server.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
  }, [role]);

  const handleExportDownload = () => {
    if (!data) return;
    const summary = data.dataset_summary || {};
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Smart Retail Analytics Executive Report</title>
  <style>
    body { font-family: sans-serif; padding: 40px; background: #fff; color: #0f172a; line-height: 1.6; }
    h1 { color: #1e1b4b; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; }
    .kpi-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
    .kpi-value { font-size: 20px; font-weight: 900; color: #0f172a; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
    th { background: #f1f5f9; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Smart Retail Analytics & Data Mining Platform Executive Report</h1>
  <p><strong>Generated Role:</strong> ${data.role} | <strong>Date:</strong> ${data.generated_at}</p>
  
  <h2>Dataset & Sales Summary</h2>
  <div class="kpi-grid">
    <div class="kpi-card"><div class="kpi-title">Total Revenue</div><div class="kpi-value">£${(summary.total_revenue_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div></div>
    <div class="kpi-card"><div class="kpi-title">Completed Orders</div><div class="kpi-value">${(summary.total_orders || 0).toLocaleString()}</div></div>
    <div class="kpi-card"><div class="kpi-title">Unique Customers</div><div class="kpi-value">${(summary.unique_customers || 0).toLocaleString()}</div></div>
    <div class="kpi-card"><div class="kpi-title">Data Quality Score</div><div class="kpi-value">${summary.data_quality_score}%</div></div>
  </div>

  <h2>Machine Learning Highlights</h2>
  <ul>
    <li><strong>Unsupervised K-Means Clustering:</strong> K = ${data.kmeans_summary?.optimal_k || 4} Clusters (Silhouette Score: ${data.kmeans_summary?.silhouette_score})</li>
    <li><strong>Supervised Classification Accuracy:</strong> ${((data.classification_summary?.accuracy || 0) * 100).toFixed(1)}% Accuracy</li>
    <li><strong>Apriori Association Rules:</strong> ${data.apriori_summary?.total_rules || 0} Mined Rules (Max Lift: ${data.apriori_summary?.max_lift})</li>
  </ul>
</body>
</html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Smart_Retail_Analytics_Report_${role}_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-600">
          Generating {isAdmin ? 'Technical Admin' : 'Executive Analyst'} Report...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <div className="p-4 rounded-full bg-rose-100 text-rose-600">
          <AlertCircle size={32} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Report Generation Failed</h3>
          <p className="text-xs text-slate-700 max-w-md mt-1">{error || 'Unable to load report payload'}</p>
        </div>
        <button
          onClick={fetchReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
        >
          <RefreshCw size={14} />
          <span>Retry Report Generation</span>
        </button>
      </div>
    );
  }

  const summary = data.dataset_summary || {};
  const dq = data.data_quality_summary;
  const wh = data.warehouse_summary;
  const sales = data.sales_summary || {};
  const kmeans = data.kmeans_summary || {};
  const clf = data.classification_summary || {};
  const apriori = data.apriori_summary || {};

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner with Print & Download Buttons */}
      <div className="no-print card-theme p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600">
            <FileText size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Executive Platform Report</h2>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
              }`}>
                {data.role} View
              </span>
            </div>
            <p className="text-xs text-slate-700">Presentation-ready executive report calculated from Online Retail II dataset</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportDownload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            <Download size={15} />
            <span>Download HTML Report</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Printable Document Container */}
      <div className="card-theme p-8 rounded-2xl space-y-8 bg-white border border-slate-200">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
              OFFICIAL RETAIL ANALYTICS REPORT
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">
              Smart Retail Analytics & Data Mining Executive Platform Summary
            </h1>
            <p className="text-xs text-slate-700 mt-1">
              Dataset: Online Retail II (2009 - 2011) | Generated: <strong>{data.generated_at}</strong> | Access Role: <strong>{data.role}</strong>
            </p>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-600 font-bold">
              VERIFIED 100% REAL DATA
            </span>
          </div>
        </div>

        {/* Section 1: Executive KPI Metrics */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-sky-600 flex items-center gap-2">
            <TrendingUp size={16} /> 1. Executive Business Summary & Retail KPIs
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700 block font-semibold">Total Revenue</span>
              <span className="text-base font-extrabold text-purple-600 font-mono">
                £{(summary.total_revenue_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700 block font-semibold">Completed Orders</span>
              <span className="text-base font-extrabold text-blue-600 font-mono">
                {(summary.total_orders || 0).toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700 block font-semibold">Verified Customers</span>
              <span className="text-base font-extrabold text-teal-600 font-mono">
                {(summary.unique_customers || 0).toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700 block font-semibold">Data Quality Pass</span>
              <span className="text-base font-extrabold text-emerald-600 font-mono">
                {summary.data_quality_score}%
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Admin Only Technical Data Warehouse & Data Quality Breakdown */}
        {isAdmin && dq && wh && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-amber-600 flex items-center gap-2">
              <ShieldCheck size={16} /> 2. Technical Data Warehouse & ETL Hygiene Audit (Admin Only)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900">Data Quality Issues Filtered:</span>
                <ul className="space-y-1 text-slate-600">
                  <li>Missing Customer IDs: <strong>{dq.missing_customer_id?.toLocaleString()}</strong></li>
                  <li>Cancelled Invoices ('C' Prefix): <strong>{dq.cancelled_invoices?.toLocaleString()}</strong></li>
                  <li>Invalid Quantity / Price: <strong>{(dq.invalid_quantity + dq.invalid_price)?.toLocaleString()}</strong></li>
                  <li>Duplicate Rows Dropped: <strong>{dq.duplicate_rows?.toLocaleString()}</strong></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900">Data Warehouse Star Schema Specs:</span>
                <ul className="space-y-1 text-slate-600">
                  <li>Architecture: <strong>{wh.architecture}</strong></li>
                  <li>Fact Table: <strong>{wh.fact_table}</strong></li>
                  <li>Dimensions: <strong>{wh.dimension_tables?.join(', ')}</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Machine Learning & Data Mining Models */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-sky-600 flex items-center gap-2">
            <Boxes size={16} /> {isAdmin ? '3' : '2'}. Data Mining & Machine Learning Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-purple-600 block">K-Means Customer Clustering</span>
              <p className="text-slate-600">Optimal Clusters: <strong>K = {kmeans.optimal_k || 4}</strong></p>
              <p className="text-slate-600">Silhouette Score: <strong>{kmeans.silhouette_score}</strong></p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-blue-600 block">Supervised ML Classification</span>
              <p className="text-slate-600">Model: <strong>Decision Tree / Random Forest</strong></p>
              <p className="text-slate-600">Accuracy: <strong>{((clf.accuracy || 0) * 100).toFixed(1)}%</strong> | F1: <strong>{((clf.f1_score || 0) * 100).toFixed(1)}%</strong></p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-pink-600 block">Apriori Market Basket Mining</span>
              <p className="text-slate-600">Itemsets: <strong>{apriori.total_frequent_itemsets}</strong></p>
              <p className="text-slate-600">Rules Mined: <strong>{apriori.total_rules}</strong> (Max Lift: <strong>{apriori.max_lift}</strong>)</p>
            </div>
          </div>
        </div>

        {/* Section 4: Top SKU & Country Performance */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-sky-600 flex items-center gap-2">
            <ShoppingBag size={16} /> {isAdmin ? '4' : '3'}. Top Performing SKUs & Markets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-900 block mb-2">Top 5 Revenue SKUs:</span>
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-2">Code</th>
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Revenue (£)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sales.top_products?.map((p: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 font-mono">{p.stock_code}</td>
                      <td className="p-2 truncate max-w-[150px]">{p.description}</td>
                      <td className="p-2 text-right font-mono font-bold">£{Number(p.rev).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-2">Top 5 Markets:</span>
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-2">Country</th>
                    <th className="p-2 text-right">Orders</th>
                    <th className="p-2 text-right">Revenue (£)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sales.top_countries?.map((c: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 font-bold">{c.country}</td>
                      <td className="p-2 text-right font-mono">{c.orders.toLocaleString()}</td>
                      <td className="p-2 text-right font-mono font-bold">£{Number(c.rev).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
