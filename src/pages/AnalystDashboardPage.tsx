import React from 'react';
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Sparkles,
  PieChart,
  Target,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AnalystDashboardProps {
  data: any;
  loading: boolean;
  onNavigate?: (pageId: string) => void;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#0d9488', '#f97316', '#ec4899', '#f59e0b', '#6366f1'];

export const AnalystDashboardPage: React.FC<AnalystDashboardProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-600">
          Compiling Business Intelligence from Online Retail II Dataset...
        </p>
      </div>
    );
  }

  const kpis = data.kpis || {};
  const monthlyTrend = data.monthly_trend || [];
  const topProducts = data.top_products || [];
  const topCountries = data.top_countries || [];
  const customerSegments = data.customer_segments || [];
  const kmeans = data.kmeans_summary || {};
  const clf = data.classification_summary || {};
  const apriori = data.apriori_summary || {};

  const businessKPIs = [
    {
      title: 'Total Revenue',
      value: `£${(kpis.total_revenue || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
      subtitle: 'Realized Valid Retail Sales',
      icon: DollarSign,
      color: 'from-purple-600 to-indigo-600',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Total Transactions',
      value: (kpis.total_orders || 0).toLocaleString(),
      subtitle: 'Completed Retail Invoices',
      icon: ShoppingCart,
      color: 'from-blue-600 to-cyan-600',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Active Customers',
      value: (kpis.unique_customers || 0).toLocaleString(),
      subtitle: 'Verified Customer Accounts',
      icon: Users,
      color: 'from-teal-600 to-emerald-600',
      badgeColor: 'bg-teal-100 text-teal-700'
    },
    {
      title: 'Active SKUs',
      value: (kpis.unique_products || 0).toLocaleString(),
      subtitle: 'Distinct Retail Products',
      icon: Package,
      color: 'from-orange-500 to-amber-500',
      badgeColor: 'bg-orange-100 text-orange-700'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Welcome Banner */}
      <div className="card-theme p-6 rounded-2xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/30 text-sky-200 text-xs font-semibold mb-2 backdrop-blur-sm border border-sky-400/20">
              <Sparkles size={14} /> Analytics & Data Mining Explorer
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Retail Executive Intelligence Dashboard
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time analytics dashboard showcasing temporal sales trajectory, SKU revenue rankings, customer segmentation, ML lifetime value classification, and product market basket insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-xs text-slate-300 block">VIP High-Value Accuracy</span>
              <span className="text-lg font-black text-emerald-400">
                {((clf.accuracy || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-xs text-slate-300 block">Customer Clusters</span>
              <span className="text-lg font-black text-white">K = {kmeans.optimal_k || 4}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {businessKPIs.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className="card-theme card-theme-hover p-5 rounded-2xl flex flex-col justify-between bg-white min-w-0 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.color} text-white shadow-md shrink-0`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-3 min-w-0 overflow-hidden">
                <h3
                  className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight truncate"
                  title={kpi.value}
                >
                  {kpi.value}
                </h3>
                <div className="mt-1 truncate">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${kpi.badgeColor}`}>
                    {kpi.subtitle}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1: Revenue Trajectory & Country Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-theme p-6 rounded-2xl space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Monthly Retail Revenue Trajectory (£)
              </h3>
              <p className="text-xs text-slate-700">
                Monthly aggregated growth from valid transaction history
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-600 text-xs font-bold">
              Time Series
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="analystRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#analystRevGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Revenue Market Share by Country
            </h3>
            <p className="text-xs text-slate-700">
              Top 5 international retail markets
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={topCountries}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="revenue"
                  nameKey="country"
                >
                  {topCountries.map((_item: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Top Products & Customer RFM Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white">
          <h3 className="text-sm font-bold text-slate-900">
            Top Performing Product SKUs (£ Revenue)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topProducts} margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#f97316" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white">
          <h3 className="text-sm font-bold text-slate-900">
            Customer Behavioral Segment Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegments} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="segment" angle={-15} textAnchor="end" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [Number(val).toLocaleString(), 'Customers']} />
                <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Mining Highlights for Analysts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-theme p-5 rounded-2xl space-y-2 border-l-4 border-l-purple-500 bg-white">
          <div className="flex items-center gap-2 text-purple-600">
            <PieChart size={18} />
            <span className="text-xs font-bold uppercase">Customer Personas</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            {kmeans.optimal_k || 4} Distinct K-Means Clusters
          </p>
          <p className="text-xs text-slate-700">
            Silhouette Score: <strong>{kmeans.silhouette_score || 0}</strong>
          </p>
        </div>

        <div className="card-theme p-5 rounded-2xl space-y-2 border-l-4 border-l-blue-500 bg-white">
          <div className="flex items-center gap-2 text-blue-600">
            <Target size={18} />
            <span className="text-xs font-bold uppercase">VIP Prediction</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            Supervised High-Value Model
          </p>
          <p className="text-xs text-slate-700">
            F1 Score: <strong>{((clf.f1_score || 0) * 100).toFixed(1)}%</strong>
          </p>
        </div>

        <div className="card-theme p-5 rounded-2xl space-y-2 border-l-4 border-l-pink-500 bg-white">
          <div className="flex items-center gap-2 text-pink-600">
            <Layers size={18} />
            <span className="text-xs font-bold uppercase">Cross-Sell Rules</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            {apriori.total_rules || 0} Product Affinity Rules
          </p>
          <p className="text-xs text-slate-700">
            Max Lift: <strong>{apriori.max_lift || 0}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
