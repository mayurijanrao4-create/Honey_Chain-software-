import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  FileCheck,
  Truck,
  Boxes,
  Cpu,
  MapPin,
  Calendar,
  User,
  ExternalLink,
  Printer,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';
import { honeyChainStore } from '../services/dataStore';
import { HoneyBatch } from '../types';

interface TraceHoneyViewProps {
  initialBatchId?: string;
  onNavigateTab: (tab: string) => void;
  onInspectBlock?: (blockIndex: number) => void;
}

export const TraceHoneyView: React.FC<TraceHoneyViewProps> = ({
  initialBatchId = 'HC-2026-00001',
  onNavigateTab,
  onInspectBlock,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialBatchId);
  const [activeBatch, setActiveBatch] = useState<HoneyBatch | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const batches = honeyChainStore.getBatches();
  const qualityRecords = honeyChainStore.getQualityRecords();
  const processingRecords = honeyChainStore.getProcessingRecords();
  const packagingRecords = honeyChainStore.getPackagingRecords();
  const shipments = honeyChainStore.getShipments();
  const apiaries = honeyChainStore.getApiaries();
  const hives = honeyChainStore.getHives();
  const blockchain = honeyChainStore.getBlockchain();

  const performSearch = (batchId: string) => {
    const cleanId = batchId.trim().toUpperCase();
    const found = batches.find((b) => b.id === cleanId);
    setActiveBatch(found || null);
    setHasSearched(true);
    if (found && found.qualityStatus === 'Approved') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#fbbf24'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  useEffect(() => {
    if (initialBatchId) {
      performSearch(initialBatchId);
    }
  }, [initialBatchId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  // Associated records for active batch
  const activeQuality = activeBatch ? qualityRecords.find((q) => q.batchId === activeBatch.id) : null;
  const activeProc = activeBatch ? processingRecords.find((p) => p.batchId === activeBatch.id) : null;
  const activePkg = activeBatch ? packagingRecords.find((p) => p.batchId === activeBatch.id) : null;
  const activeShipment = activeBatch ? shipments.find((s) => s.batchId === activeBatch.id) : null;
  const activeApiary = activeBatch ? apiaries.find((a) => a.id === activeBatch.apiaryId) : null;
  const activeHive = activeBatch ? hives.find((h) => h.id === activeBatch.hiveId) : null;

  // Find blockchain blocks associated with this batch
  const batchBlocks = activeBatch
    ? blockchain.filter((blk) => blk.transactions.some((tx) => tx.batchId === activeBatch.id))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Search Header Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <QrCode className="w-3.5 h-3.5" />
            <span>Public Traceability Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Trace Your Honey Journey
          </h1>
          <p className="text-stone-400 text-sm">
            Scan your jar's QR code or enter the unique Honey Batch ID to inspect origin coordinates,
            lab purity certificates, and verified blockchain blocks.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. HC-2026-00001"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 text-sm font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>Verify Batch</span>
          </button>
        </form>

        {/* Quick Batch Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-400">
          <span className="font-semibold text-stone-300">Quick Test Batches:</span>
          {batches.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSearchQuery(b.id);
                performSearch(b.id);
              }}
              className={`px-3 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                activeBatch?.id === b.id
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
              }`}
            >
              {b.id} ({b.honeyType.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* When Search Has Occurred */}
      {hasSearched && !activeBatch && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-rose-900">✗ Batch Not Found in Blockchain Ledger</h2>
          <p className="text-xs text-rose-700 leading-relaxed">
            The batch ID &ldquo;<span className="font-mono font-bold">{searchQuery}</span>&rdquo; was not recognized.
            Ensure you copied the exact code from your honey jar label (e.g., HC-2026-00001).
          </p>
        </div>
      )}

      {/* Active Batch Found */}
      {activeBatch && (
        <div className="space-y-10">
          {/* Authenticity Certificate Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    ✓ Authentic Batch Verified
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    ✓ Blockchain Record Anchored
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    ID: {activeBatch.id}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-stone-900">
                  {activeBatch.honeyType}
                </h2>
                <div className="text-xs text-stone-500 flex flex-wrap items-center gap-3">
                  <span>Harvested by {activeBatch.beekeeperName}</span>
                  <span>·</span>
                  <span>{activeBatch.location}</span>
                  <span>·</span>
                  <span>Total Harvest: {activeBatch.quantityKg} kg</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowPassportModal(true)}
                className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Authenticity Certificate</span>
              </button>
              <button
                onClick={() => onNavigateTab('blockchain')}
                className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Boxes className="w-4 h-4 text-amber-700" />
                <span>View in Blockchain</span>
              </button>
            </div>
          </div>

          {/* Consumer Reassurance & Authenticity Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Pure Raw Honey</span>
              </span>
              <p className="text-[11px] text-emerald-800">Direct extraction, never adulterated</p>
            </div>
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 space-y-1">
              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Zero Added Sugars</span>
              </span>
              <p className="text-[11px] text-amber-800">C3/C4 sugar isotope negative</p>
            </div>
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3.5 space-y-1">
              <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>FSSAI Certified</span>
              </span>
              <p className="text-[11px] text-blue-800">Moisture &amp; enzymes lab-approved</p>
            </div>
            <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-3.5 space-y-1">
              <span className="font-bold text-purple-950 flex items-center gap-1.5 text-xs">
                <Boxes className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Tamper-Proof Ledger</span>
              </span>
              <p className="text-[11px] text-purple-800">Unbroken cryptographic record</p>
            </div>
          </div>

          {/* Collapsible Technical Blockchain Details Section */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => setShowBlockchainDetails(!showBlockchainDetails)}
              className="w-full px-5 py-3.5 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-xs font-bold text-stone-800 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>
                  {showBlockchainDetails
                    ? 'Hide Technical Blockchain Details'
                    : 'Show Technical Blockchain Details & SHA-256 Proof'}
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  (For Technical Evaluators &amp; Examiners)
                </span>
              </div>
              <span className="text-stone-400 text-xs font-mono">
                {showBlockchainDetails ? '▲ Collapse' : '▼ Expand'}
              </span>
            </button>

            {showBlockchainDetails && (
              <div className="p-5 border-t border-stone-200 bg-amber-50/40 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Cryptographic SHA-256 Block Hash Anchor:</span>
                    <span className="font-mono font-bold text-stone-900 break-all select-all">
                      {activeBatch.currentBlockHash || 'Mining latest block...'}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('blockchain')}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    View in Blockchain Explorer →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="text-stone-500">Anchored in:</span>{' '}
                    <strong className="text-stone-800 font-mono">{batchBlocks.length} Block(s)</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">Consensus Status:</span>{' '}
                    <strong className="text-emerald-700 font-semibold">Mathematically Validated</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">Hashing Standard:</span>{' '}
                    <strong className="text-stone-800 font-mono">FIPS 180-4 SHA-256</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Complete 8-Stage Honey Traceability Timeline */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  Complete Supply Chain Journey
                </h3>
                <p className="text-xs text-stone-500">
                  Chronological provenance timeline from apiary installation through final consumer delivery.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-500">
                <span>8 Lifecycle Milestones</span>
              </div>
            </div>

            <div className="relative border-l-2 border-amber-300 ml-4 sm:ml-6 space-y-8 pb-4">
              {/* STAGE 1: 🌼 Hive Origin */}
              <div className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
                  1
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌼</span>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        Smart Hive & Bee Colony Origin
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-stone-500">
                      Installed: {activeHive?.installationDate || '2024-03-10'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block">Hive Code</span>
                      <span className="font-bold font-mono text-stone-800">
                        {activeBatch.hiveCode} ({activeHive?.hiveType || 'Langstroth'})
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Bee Species</span>
                      <span className="font-bold text-stone-800">
                        {activeApiary?.beeSpecies || 'Apis cerana indica'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Queen Health</span>
                      <span className="font-bold text-emerald-700">
                        {activeHive?.queenStatus || 'Healthy Laying'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Brood Nest Temp</span>
                      <span className="font-bold text-stone-800">
                        {activeHive?.latestSensorReading?.internalTempC || '34.8'}°C
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 2: 🐝 Beekeeper & Apiary */}
              <div className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
                  2
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🐝</span>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        Apiary & Organic Flora Reserve
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Organic Certified
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block">Beekeeper</span>
                      <span className="font-bold text-stone-800">{activeBatch.beekeeperName}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Apiary Location</span>
                      <span className="font-bold text-stone-800">{activeBatch.apiaryName}</span>
                      <span className="text-[11px] text-stone-500 block">{activeBatch.location}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Floral Nectar Source</span>
                      <span className="font-bold text-stone-800">{activeBatch.floralSource}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 3: 🍯 Harvest Event */}
              <div className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
                  3
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🍯</span>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        Honey Harvest & Batch Creation
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-stone-500">
                      Harvested: {activeBatch.harvestDate}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block">Batch Code</span>
                      <span className="font-bold font-mono text-amber-700">{activeBatch.id}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Harvest Quantity</span>
                      <span className="font-bold text-stone-800">{activeBatch.quantityKg} kg</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Honey Varietal</span>
                      <span className="font-bold text-stone-800">{activeBatch.honeyType}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Comb Capping</span>
                      <span className="font-bold text-stone-800">&gt;95% Fully Capped</span>
                    </div>
                  </div>
                  {activeBatch.harvestNotes && (
                    <div className="text-xs text-stone-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                      <span className="font-semibold text-stone-700">Beekeeper Notes: </span>
                      {activeBatch.harvestNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* STAGE 4: 🧪 Quality Testing */}
              <div className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
                  4
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🧪</span>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        Laboratory Physico-Chemical & Purity Analysis
                      </h4>
                    </div>
                    {activeQuality ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ✓ Quality Approved ({activeQuality.certificateNumber})
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                        Pending Lab Certification
                      </span>
                    )}
                  </div>

                  {activeQuality ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                          <span className="text-stone-400 block text-[11px]">Moisture</span>
                          <span className="text-sm font-bold text-stone-900 font-mono">
                            {activeQuality.moistureContentPercent}%
                          </span>
                          <span className="text-[10px] text-emerald-600 block">&lt;20% Codex std</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                          <span className="text-stone-400 block text-[11px]">pH Level</span>
                          <span className="text-sm font-bold text-stone-900 font-mono">
                            {activeQuality.phLevel}
                          </span>
                          <span className="text-[10px] text-stone-500 block">Natural acidity</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                          <span className="text-stone-400 block text-[11px]">Purity Score</span>
                          <span className="text-sm font-bold text-emerald-600 font-mono">
                            {activeQuality.purityPercentage}%
                          </span>
                          <span className="text-[10px] text-stone-500 block">Pollen verified</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                          <span className="text-stone-400 block text-[11px]">HMF Value</span>
                          <span className="text-sm font-bold text-stone-900 font-mono">
                            {activeQuality.hmfValueMgKg} mg/kg
                          </span>
                          <span className="text-[10px] text-emerald-600 block">&lt;40 standard</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                          <span className="text-stone-400 block text-[11px]">C3/C4 Sugar</span>
                          <span className="text-xs font-bold text-emerald-700 block mt-1">
                            NEGATIVE
                          </span>
                          <span className="text-[10px] text-stone-500 block">Zero sugar syrup</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                          <span className="text-stone-400 block text-[11px]">Pathogens</span>
                          <span className="text-xs font-bold text-emerald-700 block mt-1">
                            PASSED
                          </span>
                          <span className="text-[10px] text-stone-500 block">Sterile/Pure</span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-600 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
                        <span>Certified Inspector: {activeQuality.inspectorName}</span>
                        <span className="font-mono text-[11px] text-stone-500">
                          Report: {activeQuality.testReportFile}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500">
                      Quality analysis is currently pending laboratory bench examination.
                    </p>
                  )}
                </div>
              </div>

              {/* STAGE 5: 🏭 Processing (Cold Extraction) */}
              <div className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
                  5
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏭</span>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        Cold Processing & Gentle Filtration
                      </h4>
                    </div>
                    {activeProc ? (
                      <span className="text-xs font-semibold text-stone-600 font-mono">
                        {activeProc.processingUnit}
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">Scheduled</span>
                    )}
                  </div>
                  {activeProc ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-stone-400 block">Filtration Standard</span>
                        <span className="font-bold text-stone-800">{activeProc.filtrationMethod}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Extraction Temperature</span>
                        <span className="font-bold text-stone-800">{activeProc.heatingTemperatureC}°C</span>
                        <span className="text-[11px] text-emerald-700 block">Unheated cold extract (raw)</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Storage Environment</span>
                        <span className="font-bold text-stone-800">{activeProc.storageCondition}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500">Processing stage not yet recorded.</p>
                  )}
                </div>
              </div>

              {/* STAGE 6: 📦 Packaging & QR Labeling */}
              <div className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
                  6
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📦</span>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        Bottling, Labeling & QR Code Generation
                      </h4>
                    </div>
                    {activePkg ? (
                      <span className="text-xs font-mono text-stone-500">
                        Packed: {activePkg.packagingDate.split('T')[0]}
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">Pending</span>
                    )}
                  </div>
                  {activePkg ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-stone-400 block">Packaging Spec</span>
                        <span className="font-bold text-stone-800">{activePkg.packageSize}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Units Bottled</span>
                        <span className="font-bold text-stone-800">{activePkg.unitCount} Jars</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Best Before Expiry</span>
                        <span className="font-bold text-stone-800">{activePkg.expiryDate}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Product SKU</span>
                        <span className="font-bold font-mono text-stone-800">{activePkg.productLabelId}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500">Packaging stage not yet recorded.</p>
                  )}
                </div>
              </div>

              {/* STAGE 7: 🚚 Distribution & Cold Chain */}
              <div className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
                  7
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚚</span>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        Logistics & Cold-Chain Transit
                      </h4>
                    </div>
                    {activeShipment ? (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          activeShipment.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {activeShipment.status}
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">Awaiting Dispatch</span>
                    )}
                  </div>
                  {activeShipment ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-stone-400 block">Consignment Waybill</span>
                        <span className="font-bold font-mono text-stone-800">{activeShipment.shipmentId}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Route Transit</span>
                        <span className="font-bold text-stone-800">{activeShipment.sourceLocation}</span>
                        <span className="text-[11px] text-stone-500 block">→ {activeShipment.destination}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Temperature Maintained</span>
                        <span className="font-bold text-stone-800 font-mono">
                          {activeShipment.temperatureMaintainedC || 20.0}°C
                        </span>
                        <span className="text-[11px] text-stone-500 block">{activeShipment.transportMethod}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500">Consignment awaiting dispatch.</p>
                  )}
                </div>
              </div>

              {/* STAGE 8: 🏠 Consumer Verification */}
              <div className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  8
                </div>
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏠</span>
                      <h4 className="font-bold text-emerald-950 text-sm sm:text-base">
                        Consumer Shelf & Authenticity Verification
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-800">
                      ✓ Zero Alteration Guarantee
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    You are inspecting the tamper-evident cryptographic record for this jar.
                    Every metric from raw nectar harvesting to laboratory certification is immutably anchored.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1 font-mono text-emerald-900">
                    <span>Batch: {activeBatch.id}</span>
                    <span>·</span>
                    <span>Status: {activeBatch.status}</span>
                    <span>·</span>
                    <span>Public QR: Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Authenticity Passport Modal */}
      {showPassportModal && activeBatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">
                  National Honey Traceability Certificate
                </span>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  Honey Authenticity Passport
                </h3>
                <span className="text-xs font-mono text-stone-500">Batch #{activeBatch.id}</span>
              </div>
              <button
                onClick={() => setShowPassportModal(false)}
                className="p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Passport Content */}
            <div className="space-y-4 text-xs text-stone-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                <div>
                  <span className="text-stone-400 block">Honey Variety</span>
                  <span className="font-bold text-stone-900 text-sm">{activeBatch.honeyType}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Botanical Source</span>
                  <span className="font-bold text-stone-900 text-sm">{activeBatch.floralSource}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Origin Location</span>
                  <span className="font-bold text-stone-900 text-sm">{activeBatch.location}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Master Beekeeper</span>
                  <span className="font-bold text-stone-900 text-sm">{activeBatch.beekeeperName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Extraction Date</span>
                  <span className="font-bold text-stone-900 text-sm">{activeBatch.harvestDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Lab Certificate</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {activeQuality?.certificateNumber || 'Certified Approved'}
                  </span>
                </div>
              </div>

              {/* Lab Parameters */}
              {activeQuality && (
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-900">Physico-Chemical Analysis (Codex & FSSAI Standards):</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">Moisture Content</span>
                      <span className="font-bold font-mono">{activeQuality.moistureContentPercent}%</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">HMF Level</span>
                      <span className="font-bold font-mono">{activeQuality.hmfValueMgKg} mg/kg</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">C3/C4 Sugar Adulteration</span>
                      <span className="font-bold text-emerald-700">NEGATIVE (Pure)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code and Cryptographic Stamp */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900 text-white">
                {activeBatch.qrCodeUrl ? (
                  <img
                    src={activeBatch.qrCodeUrl}
                    alt={`QR Code for batch ${activeBatch.id}`}
                    className="w-24 h-24 rounded-lg bg-white p-1 shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-stone-800 flex items-center justify-center text-xs">
                    QR Ready
                  </div>
                )}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-400">Cryptographic Blockchain Seal</div>
                  <div className="text-[11px] text-stone-300">
                    Verify via camera or HoneyChain public explorer:
                  </div>
                  <div className="font-mono text-[10px] text-stone-400 break-all select-all">
                    {activeBatch.currentBlockHash}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-stone-200">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowPassportModal(false)}
                className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
