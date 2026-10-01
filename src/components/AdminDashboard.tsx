import React, { useState } from 'react';
import {
  Users,
  Layers,
  Boxes,
  CheckCircle2,
  Clock,
  Truck,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Search,
  ExternalLink,
  Award,
} from 'lucide-react';
import { honeyChainStore } from '../services/dataStore';
import { HoneyBatch, User } from '../types';

interface AdminDashboardProps {
  onTraceBatch?: (batchId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onTraceBatch,
  onNavigateTab,
}) => {
  const [batches, setBatches] = useState<HoneyBatch[]>(honeyChainStore.getBatches());
  const [users, setUsers] = useState<User[]>(honeyChainStore.getUsers());
  const [apiaries, setApiaries] = useState(honeyChainStore.getApiaries());
  const [hives, setHives] = useState(honeyChainStore.getHives());
  const [blockchain, setBlockchain] = useState(honeyChainStore.getBlockchain());
  const [auditLogs, setAuditLogs] = useState(honeyChainStore.getAuditLogs());

  React.useEffect(() => {
    return honeyChainStore.subscribe(() => {
      setBatches([...honeyChainStore.getBatches()]);
      setUsers([...honeyChainStore.getUsers()]);
      setApiaries([...honeyChainStore.getApiaries()]);
      setHives([...honeyChainStore.getHives()]);
      setBlockchain([...honeyChainStore.getBlockchain()]);
      setAuditLogs([...honeyChainStore.getAuditLogs()]);
    });
  }, []);

  const beekeepers = users.filter((u) => u.role === 'beekeeper');
  const approvedBatches = batches.filter((b) => b.qualityStatus === 'Approved');
  const pendingBatches = batches.filter((b) => b.qualityStatus === 'Pending');
  const distributedBatches = batches.filter(
    (b) => b.distributionStatus === 'In Transit' || b.distributionStatus === 'Delivered'
  );

  const totalTxCount = blockchain.reduce((acc, b) => acc + b.transactions.length, 0);

  // Floral source distribution
  const floralDistribution: Record<string, number> = {};
  batches.forEach((b) => {
    const key = b.honeyType.split(' ')[0] || 'Multifloral';
    floralDistribution[key] = (floralDistribution[key] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>National Honey Authority & System Officer Console</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            System Administration & Analytics
          </h1>
          <p className="text-stone-400 text-sm max-w-xl">
            Real-time multi-tier oversight across registered beekeepers, regional apiaries, quality laboratory certifications,
            and distributed cryptographic ledger transactions.
          </p>
        </div>

        <div className="flex gap-2">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('schema')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Export MySQL DDL (.sql)
            </button>
          )}
        </div>
      </div>

      {/* 9 Core Administrative Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Total Users</span>
            <Users className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">{users.length}</div>
          <span className="text-[10px] text-stone-500">6 Distinct Roles</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Beekeepers</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">{beekeepers.length}</div>
          <span className="text-[10px] text-stone-500">Registered Farms</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Total Apiaries</span>
            <Layers className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">{apiaries.length}</div>
          <span className="text-[10px] text-emerald-600">All Geo-Tagged</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Smart Hives</span>
            <Boxes className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">{hives.length}</div>
          <span className="text-[10px] text-stone-500">Live IoT Scales</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Total Batches</span>
            <Boxes className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">{batches.length}</div>
          <span className="text-[10px] text-stone-500">Traceable in Ledger</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Approved Batches</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {approvedBatches.length}
          </div>
          <span className="text-[10px] text-stone-500">FSSAI Certified</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Pending Lab Checks</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">
            {pendingBatches.length}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">In Queue</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Distributed Batches</span>
            <Truck className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">
            {distributedBatches.length}
          </div>
          <span className="text-[10px] text-stone-500">In Transit / Retail</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Blockchain Txs</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">{totalTxCount}</div>
          <span className="text-[10px] text-stone-500">Cryptographically Sealed</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Monthly Honey Production Over Time */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-stone-900">
                Monthly Honey Production (kg)
              </h3>
              <p className="text-xs text-stone-500">Aggregated extraction across all participating apiaries.</p>
            </div>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>

          <div className="h-56 w-full pt-4">
            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              {[30, 70, 110, 150].map((y, i) => (
                <line
                  key={i}
                  x1="30"
                  y1={y}
                  x2="480"
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Monthly Production Bars */}
              {[
                { month: 'Apr', val: 45 },
                { month: 'May', val: 78 },
                { month: 'Jun', val: 62 },
                { month: 'Jul', val: 35 },
                { month: 'Aug', val: 50 },
                { month: 'Sep', val: 125 },
                { month: 'Oct', val: 82 },
              ].map((d, i) => {
                const x = 50 + i * 62;
                const barHeight = (d.val / 140) * 120;
                const y = 150 - barHeight;
                return (
                  <g key={d.month} className="group cursor-pointer">
                    <rect
                      x={x - 14}
                      y={y}
                      width="28"
                      height={barHeight}
                      rx="6"
                      fill={i === 5 ? '#f59e0b' : '#e5e7eb'}
                      className="group-hover:fill-amber-400 transition-colors"
                    />
                    <text
                      x={x}
                      y={y - 6}
                      textAnchor="middle"
                      className="text-[10px] font-mono font-bold fill-stone-700"
                    >
                      {d.val}k
                    </text>
                    <text
                      x={x}
                      y="168"
                      textAnchor="middle"
                      className="text-[11px] font-semibold fill-stone-500"
                    >
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 2: Honey Varietal & Botanical Distribution */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-stone-900">
                Honey Varietal Distribution
              </h3>
              <p className="text-xs text-stone-500">Distribution of registered batches by botanical nectar origin.</p>
            </div>
            <PieChart className="w-5 h-5 text-amber-600" />
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: 'Raw Multifloral Honey (Satara)', percent: 38, count: '65 kg', color: 'bg-amber-500' },
              { label: 'Himalayan White Acacia Honey (Shimla)', percent: 28, count: '40 kg', color: 'bg-yellow-400' },
              { label: 'Jamun Blossom Forest Honey', percent: 20, count: '30 kg', color: 'bg-amber-700' },
              { label: 'Wild Mustard & Floral', percent: 14, count: '22 kg', color: 'bg-stone-400' },
            ].map((v) => (
              <div key={v.label} className="space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-stone-800">{v.label}</span>
                  <span className="font-bold text-stone-900 font-mono">{v.percent}% ({v.count})</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full ${v.color}`} style={{ width: `${v.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Blockchain Audit Activity Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-stone-900">
              Recent Blockchain Ledger Activity
            </h3>
            <p className="text-xs text-stone-500">
              Real-time audit log of smart contract transactions anchoring batch events.
            </p>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('blockchain')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Blocks</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Batch Code</th>
                  <th className="px-6 py-3 font-semibold">Event Action</th>
                  <th className="px-6 py-3 font-semibold">Operator / Signer</th>
                  <th className="px-6 py-3 font-semibold">Timestamp</th>
                  <th className="px-6 py-3 font-semibold">Cryptographic Hash</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-stone-400">
                      No blockchain activity records logged yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.slice(0, 7).map((log) => (
                    <tr key={log.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-stone-900">{log.entityId}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-stone-800">{log.user}</span>
                        <span className="text-[10px] text-stone-400 block capitalize">{log.role}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-stone-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-stone-400 select-all">
                        {log.txHash ? `${log.txHash.slice(0, 16)}...` : 'Pending Proof'}
                      </td>
                      <td className="px-6 py-4">
                        {onTraceBatch && log.entity === 'HoneyBatch' && (
                          <button
                            onClick={() => onTraceBatch(log.entityId)}
                            className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Trace</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
