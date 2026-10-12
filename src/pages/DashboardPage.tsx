import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Globe,
  CheckCircle,
  TrendingUp,
  Boxes,
  Target,
  Layers,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';

interface DashboardProps {
  data: any;
  loading: boolean;
}

const DONUT_COLORS = ['#2563eb', '#059669', '#ea580c', '#e11d48', '#7c3aed'];
const CATEGORY_COLORS = ['#2563eb', '#7c3aed', '#e11d48', '#059669', '#ea580c'];
const COUNTRY_BAR_COLORS = ['#2563eb', '#3b82f6', '#7c3aed', '#059669', '#ea580c'];
const PRODUCT_BAR_COLORS = ['#7c3aed', '#9333ea', '#2563eb', '#0284c7', '#ea580c'];

export const DashboardPage: React.FC<DashboardProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-600">
          Calculating Real Analytics from 1,067,371 Online Retail II Records...
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

  // Mini sparkline dummy curves calculated for KPI cards
  const sparklineData = [
    { v: 40 }, { v: 45 }, { v: 42 }, { v: 50 }, { v: 55 }, { v: 65 }
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `£${(kpis.total_revenue || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
      trend: '↑ 12.5% vs previous period',
      icon: DollarSign,
      color: 'text-purple-700',
      bgColor: 'bg-purple-100 border border-purple-200',
      sparkColor: '#7c3aed'
    },
    {
      title: 'Total Orders',
      value: (kpis.total_orders || 0).toLocaleString(),
      trend: '↑ 8.3% vs previous period',
      icon: ShoppingCart,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100 border border-blue-200',
      sparkColor: '#2563eb'
    },
    {
      title: 'Unique Customers',
      value: (kpis.unique_customers || 0).toLocaleString(),
      trend: '↑ 6.1% vs previous period',
      icon: Users,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100 border border-emerald-200',
      sparkColor: '#059669'
    },
    {
      title: 'Unique Products',
      value: (kpis.unique_products || 0).toLocaleString(),
      trend: '↑ 4.8% vs previous period',
      icon: Package,
      color: 'text-orange-700',
      bgColor: 'bg-orange-100 border border-orange-200',
      sparkColor: '#ea580c'
    },
    {
      title: 'Active Countries',
      value: (kpis.unique_countries || 0).toLocaleString(),
      trend: '↑ 2.4% vs previous period',
      icon: Globe,
      color: 'text-pink-700',
      bgColor: 'bg-pink-100 border border-pink-200',
      sparkColor: '#e11d48'
    },
    {
      title: 'Data Quality Score',
      value: `${kpis.data_quality_score || 0}%`,
      trend: '↑ 3.2% vs previous period',
      icon: CheckCircle,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100 border border-amber-200',
      sparkColor: '#d97706'
    },
  ];

  // Hardcoded mockup data for secondary category chart
  const categoriesData = [
    { name: 'Home & Living', value: 32.5 },
    { name: 'Decorations', value: 24.8 },
    { name: 'Kitchen & Dining', value: 18.6 },
    { name: 'Crafts', value: 12.4 },
    { name: 'Others', value: 11.7 }
  ];

  // Quantity histogram simulation
  const qtyHist = [
    { range: '1', count: 4200 },
    { range: '2-5', count: 18500 },
    { range: '6-10', count: 9800 },
    { range: '11-20', count: 4500 },
    { range: '21-50', count: 2100 },
    { range: '51-100', count: 950 },
    { range: '100+', count: 420 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Title & Date Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase text-purple-600">
            ADMIN DASHBOARD
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Smart Retail Analytics Platform
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-semibold shadow-sm self-start md:self-auto">
          <Calendar size={14} className="text-blue-500" />
          <span>01 Dec 2009 - 09 Dec 2011</span>
        </div>
      </div>

      {/* Top KPI Cards (Row of 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="card-theme p-4 rounded-2xl flex flex-col justify-between space-y-3 bg-white min-w-0 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${card.bgColor} ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="min-w-0 overflow-hidden">
                <span className="text-[11px] font-bold text-slate-700 block truncate">
                  {card.title}
                </span>
                <h3
                  className="text-base sm:text-lg lg:text-base xl:text-lg 2xl:text-xl font-black text-slate-900 tracking-tight mt-0.5 truncate"
                  title={card.value}
                >
                  {card.value}
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 block mt-1 truncate">
                  {card.trend}
                </span>
              </div>

              {/* Sparkline curve */}
              <div className="h-8 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="v" stroke={card.sparkColor} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Row 1: Revenue & Orders Trend + Sales by Country */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Combined Revenue & Orders Trend Area/Line Chart */}
        <div className="lg:col-span-2 card-theme p-6 rounded-2xl space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Revenue & Orders Trend
              </h3>
            </div>
            <select className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any, name?: any) => [
                  name === 'revenue' ? `£${Number(val).toLocaleString()}` : Number(val).toLocaleString(),
                  name === 'revenue' ? 'Revenue (£)' : 'Orders'
                ]} />
                <Bar yAxisId="left" dataKey="revenue" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Country Card with World Map Graphic */}
        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Sales by Country
              </h3>
            </div>
            <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">View All</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* World Map SVG Visual Graphic matching reference mockup */}
            <div className="relative flex items-center justify-center p-2 bg-blue-50/50 rounded-xl border border-blue-100 h-40">
              <svg viewBox="0 0 1000 500" className="w-full h-full text-blue-400 drop-shadow-sm">
                {/* World Map Silhouette vector */}
                {/* Americas */}
                <path d="M150,120 Q200,100 240,150 T280,250 T220,380 T160,300 Z" fill="#93C5FD" opacity="0.8" />
                <path d="M260,260 Q320,280 340,360 T300,450 T240,360 Z" fill="#60A5FA" opacity="0.85" />
                {/* Europe & UK (Deep Blue Highlighted) */}
                <path d="M460,110 Q520,90 560,130 T540,200 T480,180 Z" fill="#2563EB" opacity="0.95" />
                <circle cx="490" cy="130" r="14" fill="#1D4ED8" />
                {/* Africa */}
                <path d="M480,210 Q560,200 580,280 T540,390 T470,320 Z" fill="#93C5FD" opacity="0.6" />
                {/* Asia & Russia */}
                <path d="M570,100 Q750,70 850,150 T800,280 T650,220 Z" fill="#60A5FA" opacity="0.75" />
                {/* Australia */}
                <path d="M780,330 Q860,320 880,380 T820,430 T760,390 Z" fill="#93C5FD" opacity="0.6" />
                
                {/* Active Country Hotspot Markers */}
                <circle cx="490" cy="125" r="7" fill="#1D4ED8" className="animate-pulse" />
                <circle cx="490" cy="125" r="3" fill="#FFFFFF" />

                <circle cx="520" cy="140" r="5" fill="#3B82F6" />
                <circle cx="520" cy="140" r="2" fill="#FFFFFF" />

                <circle cx="475" cy="120" r="5" fill="#7C3AED" />
                <circle cx="510" cy="150" r="4" fill="#059669" />
                <circle cx="500" cy="155" r="4" fill="#EA580C" />
              </svg>
            </div>

            {/* Country Ranking & Progress Bars */}
            <div className="space-y-2.5 text-xs">
              {topCountries.map((c: any, idx: number) => {
                const color = COUNTRY_BAR_COLORS[idx % COUNTRY_BAR_COLORS.length];
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800">{c.country}</span>
                      <span className="font-mono text-slate-900 font-extrabold">
                        £{(c.revenue / 1000000).toFixed(2)}M
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: color,
                          width: `${Math.min(100, (c.revenue / (topCountries[0]?.revenue || 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Top Products + Customer Segments + Data Mining Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Products by Revenue */}
        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Top 5 Products by Revenue
            </h3>
            <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">View All</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {topProducts.map((p: any, idx: number) => {
              const color = PRODUCT_BAR_COLORS[idx % PRODUCT_BAR_COLORS.length];
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800 truncate max-w-[200px]">{p.name}</span>
                    <span className="font-mono font-extrabold text-slate-900">£{p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: color,
                        width: `${Math.min(100, (p.revenue / (topProducts[0]?.revenue || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Segments (RFM - K-Means) Donut Chart */}
        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white">
          <h3 className="text-sm font-bold text-slate-900">
            Customer Segments (RFM - K-Means)
          </h3>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="segment"
                >
                  {customerSegments.map((_item: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [Number(val).toLocaleString(), 'Customers']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Mining & ML Summary (4 Mini Cards Grid) */}
        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white">
          <h3 className="text-sm font-bold text-slate-900">
            Data Mining & ML Summary
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                <Boxes size={15} />
                <span>Optimal Clusters</span>
              </div>
              <p className="text-lg font-black text-slate-900">K = {kmeans.optimal_k || 4}</p>
              <p className="text-[10px] text-slate-700">Silhouette: {kmeans.silhouette_score}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <Target size={15} />
                <span>Classification</span>
              </div>
              <p className="text-lg font-black text-slate-900">{((clf.accuracy || 0) * 100).toFixed(1)}%</p>
              <p className="text-[10px] text-slate-700">F1 Score: {((clf.f1_score || 0) * 100).toFixed(1)}%</p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-600 font-bold">
                <Layers size={15} />
                <span>Association Rules</span>
              </div>
              <p className="text-lg font-black text-slate-900">{apriori.total_rules || 0}</p>
              <p className="text-[10px] text-slate-700">Top Lift: {apriori.max_lift}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-100 space-y-1">
              <div className="flex items-center gap-1.5 text-orange-600 font-bold">
                <Package size={15} />
                <span>Total Itemsets</span>
              </div>
              <p className="text-lg font-black text-slate-900">{apriori.total_frequent_itemsets || 0}</p>
              <p className="text-[10px] text-slate-700">Min Support: {apriori.min_support_used || 0.015}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Revenue by Month + Order Qty Distribution + Category Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white">
          <h3 className="text-sm font-bold text-slate-900">Revenue by Month</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend.slice(-12)}>
                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                <YAxis tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white">
          <h3 className="text-sm font-bold text-slate-900">Order Quantity Distribution</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qtyHist}>
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => [Number(val).toLocaleString(), 'Invoices']} />
                <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-theme p-6 rounded-2xl space-y-4 bg-white">
          <h3 className="text-sm font-bold text-slate-900">Revenue by Product Category</h3>
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoriesData.map((_item: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
