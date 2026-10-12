import React, { useEffect, useState } from 'react';
import { Share2, Network, ArrowRight } from 'lucide-react';
import axios from 'axios';

export const MarketBasketPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/apriori')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-700">Constructing Market Basket Product Network...</p>
      </div>
    );
  }

  const network = data.network || { nodes: [], edges: [] };
  const edges = network.edges || [];

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="card-theme p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-600">
            <Share2 size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Market Basket Network Visualizer</h2>
            <p className="text-xs text-slate-700">Product co-occurrence graph showing affinity pairings and cross-selling bundles</p>
          </div>
        </div>
      </div>

      {/* Network Visualization Container */}
      <div className="card-theme p-6 rounded-2xl space-y-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Network size={18} className="text-indigo-500" />
          Product Pair Association Network ({edges.length} Mined Pairings)
        </h3>

        <div className="p-6 rounded-2xl bg-white text-white min-h-[380px] border border-slate-200 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Interactive Network Topology
            </span>
            <p className="text-xs text-slate-600">Nodes represent top SKUs; edges represent strong lift values</p>
          </div>

          {/* Grid of Product Connection Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-5xl">
            {edges.slice(0, 12).map((edge: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-indigo-300 truncate max-w-[40%]">{edge.source}</span>
                  <div className="flex items-center gap-1 text-slate-600">
                    <ArrowRight size={12} />
                    <span className="text-[10px] font-mono text-emerald-400">Lift {edge.weight}</span>
                  </div>
                  <span className="text-pink-300 truncate max-w-[40%] text-right">{edge.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Affinity Rules Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Strongest Product Co-Purchases
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {edges.slice(0, 6).map((edge: any, idx: number) => (
            <div key={idx} className="card-theme card-theme-hover p-5 rounded-2xl space-y-2 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-600">Pair #{idx + 1}</span>
                <span className="font-mono font-bold text-emerald-600">Lift: {edge.weight}</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{edge.source}</p>
              <p className="text-[11px] text-slate-700 flex items-center gap-1">
                Frequently bought with <ArrowRight size={12} className="text-slate-600" />
              </p>
              <p className="text-xs font-bold text-pink-600">{edge.target}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
