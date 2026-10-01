import React, { useState, useEffect } from 'react';
import {
  Layers,
  Boxes,
  PlusCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  QrCode,
  FileText,
  AlertTriangle,
  Scale,
  Award,
  Loader2,
} from 'lucide-react';
import { honeyChainStore } from '../services/dataStore';
import { Apiary, Hive, HoneyBatch } from '../types';

interface BeekeeperDashboardProps {
  onNavigateTab: (tab: string) => void;
  onTraceBatch: (batchId: string) => void;
}

export const BeekeeperDashboard: React.FC<BeekeeperDashboardProps> = ({
  onNavigateTab,
  onTraceBatch,
}) => {
  const [activeTab, setActiveTab] = useState<'apiaries' | 'hives' | 'harvest'>('harvest');
  const [apiaries, setApiaries] = useState<Apiary[]>(honeyChainStore.getApiaries());
  const [hives, setHives] = useState<Hive[]>(honeyChainStore.getHives());
  const [batches, setBatches] = useState<HoneyBatch[]>(honeyChainStore.getBatches());

  // Modals
  const [showAddApiaryModal, setShowAddApiaryModal] = useState(false);
  const [showAddHiveModal, setShowAddHiveModal] = useState(false);

  // Harvest Form State
  const [harvestHiveId, setHarvestHiveId] = useState(hives[0]?.id || '');
  const [harvestHoneyType, setHarvestHoneyType] = useState('Raw Multifloral Honey');
  const [harvestFloralSource, setHarvestFloralSource] = useState('Wild Jamun & Forest Blossoms');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [harvestQuantityKg, setHarvestQuantityKg] = useState('28.5');
  const [harvestNotes, setHarvestNotes] = useState('Clean capped comb extraction. Deep amber aroma, unheated raw extraction.');
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [lastHarvestedBatch, setLastHarvestedBatch] = useState<HoneyBatch | null>(null);

  // Add Apiary Form State
  const [newApiaryName, setNewApiaryName] = useState('');
  const [newApiaryLocation, setNewApiaryLocation] = useState('');
  const [newApiaryState, setNewApiaryState] = useState('Maharashtra');
  const [newApiaryDistrict, setNewApiaryDistrict] = useState('Satara');
  const [newApiarySpecies, setNewApiarySpecies] = useState('Apis cerana indica');
  const [newApiaryFlora, setNewApiaryFlora] = useState('Multifloral & Wild Thyme');

  // Add Hive Form State
  const [newHiveCode, setNewHiveCode] = useState('');
  const [newHiveApiaryId, setNewHiveApiaryId] = useState(apiaries[0]?.id || '');
  const [newHiveType, setNewHiveType] = useState<'Langstroth' | 'Top-Bar' | 'Warre' | 'Traditional Clay/Log'>('Langstroth');
  const [newHiveColony, setNewHiveColony] = useState('Colony S-01');

  useEffect(() => {
    return honeyChainStore.subscribe(() => {
      setApiaries([...honeyChainStore.getApiaries()]);
      setHives([...honeyChainStore.getHives()]);
      setBatches([...honeyChainStore.getBatches()]);
    });
  }, []);

  const totalHarvestKg = batches.reduce((sum, b) => sum + b.quantityKg, 0);

  // Handle Harvest Submission
  const handleHarvestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!harvestHiveId || !harvestQuantityKg) return;

    setIsHarvesting(true);
    try {
      const newBatch = await honeyChainStore.recordHarvest({
        hiveId: harvestHiveId,
        honeyType: harvestHoneyType,
        floralSource: harvestFloralSource,
        harvestDate,
        quantityKg: parseFloat(harvestQuantityKg),
        harvestNotes,
      });
      setLastHarvestedBatch(newBatch);
      setIsHarvesting(false);
    } catch (err) {
      console.error(err);
      setIsHarvesting(false);
    }
  };

  const handleCreateApiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiaryName || !newApiaryLocation) return;
    honeyChainStore.createApiary({
      name: newApiaryName,
      beekeeperId: honeyChainStore.getCurrentUser().id,
      beekeeperName: honeyChainStore.getCurrentUser().name,
      location: newApiaryLocation,
      state: newApiaryState,
      district: newApiaryDistrict,
      latitude: 17.68,
      longitude: 73.81,
      hiveCount: 0,
      beeSpecies: newApiarySpecies,
      floralSource: newApiaryFlora,
      establishedDate: new Date().toISOString().split('T')[0],
      altitudeMeters: 800,
      organicCertified: true,
    });
    setShowAddApiaryModal(false);
    setNewApiaryName('');
    setNewApiaryLocation('');
  };

  const handleCreateHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHiveCode || !newHiveApiaryId) return;
    const targetApiary = apiaries.find((a) => a.id === newHiveApiaryId);
    honeyChainStore.createHive({
      hiveCode: newHiveCode,
      apiaryId: newHiveApiaryId,
      apiaryName: targetApiary ? targetApiary.name : 'Main Apiary',
      hiveType: newHiveType,
      beeColony: newHiveColony,
      queenStatus: 'Healthy Laying',
      queenAgeMonths: 3,
      installationDate: new Date().toISOString().split('T')[0],
      status: 'active',
      lastInspectionDate: new Date().toISOString().split('T')[0],
      honeySuperFrames: 10,
    });
    setShowAddHiveModal(false);
    setNewHiveCode('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Apiary Operations & Field Harvest Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Beekeeper Management Console
          </h1>
          <p className="text-stone-400 text-sm max-w-xl">
            Register apiaries, connect smart hives, and record harvests.
            Each harvest triggers a SHA-256 block mining event and generates an immutable batch record.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-800/90 rounded-2xl border border-stone-700">
          <button
            onClick={() => setActiveTab('harvest')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'harvest'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Harvest Honey
          </button>
          <button
            onClick={() => setActiveTab('apiaries')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'apiaries'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            My Apiaries ({apiaries.length})
          </button>
          <button
            onClick={() => setActiveTab('hives')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'hives'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Hives ({hives.length})
          </button>
        </div>
      </div>

      {/* Beekeeper Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-400">Total Apiaries</span>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">{apiaries.length}</div>
          <span className="text-[10px] text-emerald-600 font-medium">All Certified</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-400">Total Hives</span>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">{hives.length}</div>
          <span className="text-[10px] text-stone-500 font-medium">Equipped with IoT</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-400">Active Colonies</span>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">
            {hives.filter((h) => h.status === 'active').length}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">100% Colony Health</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-400">Total Harvested</span>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">{totalHarvestKg.toFixed(1)}</div>
          <span className="text-[10px] text-stone-500 font-medium">Kilograms recorded</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-400">Active Batches</span>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">{batches.length}</div>
          <span className="text-[10px] text-stone-500 font-medium">Tracked in ledger</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-400">Colony Alerts</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">Nominal</div>
          <span className="text-[10px] text-stone-500 font-medium">Real-time IoT sync</span>
        </div>
      </div>

      {/* TAB 1: HARVEST HONEY WIZARD */}
      {activeTab === 'harvest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Harvest Recording Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="font-display text-xl font-bold text-stone-900">
                Record New Honey Extraction
              </h2>
              <p className="text-xs text-stone-500">
                Submitting this form creates a cryptographic block on the blockchain and generates a public QR passport.
              </p>
            </div>

            <form onSubmit={handleHarvestSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Select Source Hive *</label>
                  <select
                    value={harvestHiveId}
                    onChange={(e) => setHarvestHiveId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:border-amber-500 focus:outline-none"
                    required
                  >
                    {hives.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.hiveCode} — {h.apiaryName} ({h.hiveType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Harvest Extraction Date *</label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Honey Varietal / Type *</label>
                  <input
                    type="text"
                    value={harvestHoneyType}
                    onChange={(e) => setHarvestHoneyType(e.target.value)}
                    placeholder="e.g. Raw Multifloral Honey"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Floral Nectar Source *</label>
                  <input
                    type="text"
                    value={harvestFloralSource}
                    onChange={(e) => setHarvestFloralSource(e.target.value)}
                    placeholder="e.g. Wild Jamun & Meadow Blossoms"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Harvested Quantity (Kilograms) *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="500"
                    value={harvestQuantityKg}
                    onChange={(e) => setHarvestQuantityKg(e.target.value)}
                    className="w-full p-2.5 pr-10 rounded-xl border border-stone-300 font-mono font-bold focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 text-stone-400 font-semibold">kg</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Field Observation & Capping Notes</label>
                <textarea
                  rows={3}
                  value={harvestNotes}
                  onChange={(e) => setHarvestNotes(e.target.value)}
                  placeholder="Note weather conditions, capping percentage, color, aroma..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Submit Button with Loading & Duplicate Submission Prevention */}
              <button
                type="submit"
                disabled={isHarvesting}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isHarvesting
                    ? 'bg-amber-300 text-stone-700 cursor-not-allowed opacity-80'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20 cursor-pointer active:scale-[0.99]'
                }`}
              >
                {isHarvesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-800" />
                    <span>Mining Cryptographic Block & Recording Batch...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Harvest & Mine Blockchain Block</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Last Harvested Batch Preview / Success Panel */}
          <div className="lg:col-span-5 space-y-6">
            {lastHarvestedBatch ? (
              <div className="bg-emerald-50/70 border border-emerald-300 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-display text-lg font-bold">
                    Batch Successfully Anchored!
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-stone-700">
                  <div className="flex justify-between border-b border-emerald-200/60 pb-2">
                    <span className="text-stone-500">Generated Batch ID:</span>
                    <span className="font-bold font-mono text-emerald-900">{lastHarvestedBatch.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200/60 pb-2">
                    <span className="text-stone-500">Honey Varietal:</span>
                    <span className="font-semibold text-stone-900">{lastHarvestedBatch.honeyType}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200/60 pb-2">
                    <span className="text-stone-500">Harvest Quantity:</span>
                    <span className="font-bold text-stone-900 font-mono">{lastHarvestedBatch.quantityKg} kg</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200/60 pb-2">
                    <span className="text-stone-500">Current Status:</span>
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      {lastHarvestedBatch.status}
                    </span>
                  </div>

                  {/* QR Code Preview */}
                  <div className="pt-2 text-center space-y-2">
                    <span className="font-bold text-stone-800 block">Verification QR Code:</span>
                    {lastHarvestedBatch.qrCodeUrl && (
                      <img
                        src={lastHarvestedBatch.qrCodeUrl}
                        alt="Batch QR Code"
                        className="w-32 h-32 mx-auto rounded-xl p-1 bg-white border border-emerald-200 shadow-xs"
                      />
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onTraceBatch(lastHarvestedBatch.id)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs text-center cursor-pointer"
                  >
                    View Batch Timeline
                  </button>
                  <button
                    onClick={() => onNavigateTab('quality')}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs text-center cursor-pointer"
                  >
                    Send to Quality Lab
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200/90 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Boxes className="w-7 h-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-stone-900">
                  Cryptographic Provenance
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                  Fill in the extraction details on the left. The system will calculate the transaction SHA-256 hash,
                  link it to the previous blockchain block, and produce an authentic QR passport.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY APIARIES */}
      {activeTab === 'apiaries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-stone-900">Registered Apiaries</h2>
              <p className="text-xs text-stone-500">Locations, organic certifications, and micro-flora flora.</p>
            </div>
            <button
              onClick={() => setShowAddApiaryModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New Apiary</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiaries.map((apiary) => (
              <div
                key={apiary.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-stone-900">{apiary.name}</h3>
                    <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {apiary.location}, {apiary.district}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Organic
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Hives</span>
                    <span className="font-bold font-mono text-stone-800">{apiary.hiveCount} Units</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Bee Species</span>
                    <span className="font-bold text-stone-800 truncate block">{apiary.beeSpecies}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 block text-[11px]">Floral Source</span>
                    <span className="font-semibold text-stone-800">{apiary.floralSource}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <span>Est: {apiary.establishedDate}</span>
                  <span className="font-mono text-stone-400">Alt: {apiary.altitudeMeters}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HIVES MANAGEMENT */}
      {activeTab === 'hives' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-stone-900">Hive Telemetry & Colonies</h2>
              <p className="text-xs text-stone-500">Physical box types, queen bee statuses, and super frames.</p>
            </div>
            <button
              onClick={() => setShowAddHiveModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New Hive</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Hive Tag</th>
                    <th className="px-6 py-3 font-semibold">Apiary Location</th>
                    <th className="px-6 py-3 font-semibold">Architecture</th>
                    <th className="px-6 py-3 font-semibold">Colony</th>
                    <th className="px-6 py-3 font-semibold">Queen Status</th>
                    <th className="px-6 py-3 font-semibold">Internal Temp</th>
                    <th className="px-6 py-3 font-semibold">Scale Weight</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {hives.map((h) => (
                    <tr key={h.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold font-mono text-stone-900">{h.hiveCode}</td>
                      <td className="px-6 py-4">{h.apiaryName}</td>
                      <td className="px-6 py-4">{h.hiveType}</td>
                      <td className="px-6 py-4 font-mono">{h.beeColony}</td>
                      <td className="px-6 py-4 text-emerald-700 font-semibold">{h.queenStatus}</td>
                      <td className="px-6 py-4 font-mono font-bold">
                        {h.latestSensorReading?.internalTempC || '34.8'}°C
                      </td>
                      <td className="px-6 py-4 font-mono font-bold">
                        {h.latestSensorReading?.weightKg || '42.0'} kg
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Apiary */}
      {showAddApiaryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-display text-lg font-bold text-stone-900">Register New Apiary</h3>
              <button
                onClick={() => setShowAddApiaryModal(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateApiary} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Apiary Name *</label>
                <input
                  type="text"
                  value={newApiaryName}
                  onChange={(e) => setNewApiaryName(e.target.value)}
                  placeholder="e.g. Sahyadri Blossom Apiary"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Location / Village *</label>
                <input
                  type="text"
                  value={newApiaryLocation}
                  onChange={(e) => setNewApiaryLocation(e.target.value)}
                  placeholder="e.g. Panchgani Valley"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={newApiaryState}
                    onChange={(e) => setNewApiaryState(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={newApiaryDistrict}
                    onChange={(e) => setNewApiaryDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Surrounding Flora</label>
                <input
                  type="text"
                  value={newApiaryFlora}
                  onChange={(e) => setNewApiaryFlora(e.target.value)}
                  placeholder="e.g. Wild Berries, Acacia & Mustard"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddApiaryModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold"
                >
                  Save Apiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Hive */}
      {showAddHiveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-display text-lg font-bold text-stone-900">Register Smart Hive</h3>
              <button
                onClick={() => setShowAddHiveModal(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateHive} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Hive Code (ID) *</label>
                <input
                  type="text"
                  value={newHiveCode}
                  onChange={(e) => setNewHiveCode(e.target.value)}
                  placeholder="e.g. H-104"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Select Apiary *</label>
                <select
                  value={newHiveApiaryId}
                  onChange={(e) => setNewHiveApiaryId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                >
                  {apiaries.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.location})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Colony Identifier</label>
                <input
                  type="text"
                  value={newHiveColony}
                  onChange={(e) => setNewHiveColony(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHiveModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold"
                >
                  Save Hive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
