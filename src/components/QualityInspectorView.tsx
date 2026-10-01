import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertTriangle,
  Beaker,
  ShieldCheck,
  Search,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { honeyChainStore } from '../services/dataStore';
import { HoneyBatch, QualityInspection } from '../types';

interface QualityInspectorViewProps {
  onTraceBatch?: (batchId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const QualityInspectorView: React.FC<QualityInspectorViewProps> = ({
  onTraceBatch,
  onNavigateTab,
}) => {
  const [batches, setBatches] = useState<HoneyBatch[]>(honeyChainStore.getBatches());
  const [qualityRecords, setQualityRecords] = useState<QualityInspection[]>(honeyChainStore.getQualityRecords());

  // Form State
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [moisture, setMoisture] = useState('17.5');
  const [ph, setPh] = useState('3.95');
  const [colorPfund, setColorPfund] = useState('34mm (Extra Light Amber)');
  const [aroma, setAroma] = useState('Clean floral notes, balanced acidity, zero caramelization.');
  const [purity, setPurity] = useState('99.5');
  const [hmf, setHmf] = useState('11.8');
  const [adulterationTest, setAdulterationTest] = useState<'Negative (C3/C4 Sugar Negative)' | 'Positive (Adulteration Detected)'>(
    'Negative (C3/C4 Sugar Negative)'
  );
  const [microbialTest, setMicrobialTest] = useState<'Passed (Zero Pathogens)' | 'Failed'>('Passed (Zero Pathogens)');
  const [diastaseActivity, setDiastaseActivity] = useState('14.2');
  const [remarks, setRemarks] = useState('Sample conforms with Codex Alimentarius standard 12-1981 and FSSAI 2026 regulations.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inspectionSuccessMsg, setInspectionSuccessMsg] = useState('');

  React.useEffect(() => {
    return honeyChainStore.subscribe(() => {
      setBatches([...honeyChainStore.getBatches()]);
      setQualityRecords([...honeyChainStore.getQualityRecords()]);
    });
  }, []);

  const pendingBatches = batches.filter(
    (b) => b.status === 'HARVESTED' || b.status === 'QUALITY_CHECK' || b.qualityStatus === 'Pending'
  );

  const handleSelectPending = (b: HoneyBatch) => {
    setSelectedBatchId(b.id);
    setInspectionSuccessMsg('');
  };

  const handleInspectionDecision = (verdict: 'Approved' | 'Rejected') => {
    if (!selectedBatchId) return;
    setIsSubmitting(true);

    try {
      const record = honeyChainStore.submitQualityInspection({
        batchId: selectedBatchId,
        moistureContentPercent: parseFloat(moisture),
        phLevel: parseFloat(ph),
        colorPfund,
        aromaProfile: aroma,
        purityPercentage: parseFloat(purity),
        hmfValueMgKg: parseFloat(hmf),
        adulterationTest,
        microbialTest,
        diastaseActivity: parseFloat(diastaseActivity),
        overallResult: verdict,
        remarks,
      });

      setInspectionSuccessMsg(
        `Batch ${selectedBatchId} was marked ${verdict.toUpperCase()}. Cert: ${record.certificateNumber}. Anchored to blockchain.`
      );
      setSelectedBatchId('');
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>FSSAI & Codex Quality Verification Laboratory</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Quality Inspection & Testing Lab
          </h1>
          <p className="text-stone-400 text-sm max-w-xl">
            Inspect pending honey batches, perform refractometric moisture checks, C3/C4 isotopic sugar tests,
            and issue cryptographic laboratory approval certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-xs">
            <span className="text-stone-400 block">Pending Queue:</span>
            <span className="font-bold text-amber-400 text-lg font-mono">
              {pendingBatches.length} Batches
            </span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {inspectionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs sm:text-sm text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{inspectionSuccessMsg}</span>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('processing')}
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs cursor-pointer"
            >
              Go to Processing Unit →
            </button>
          )}
        </div>
      )}

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Batches Queue */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="font-display text-base font-bold text-stone-900">
              Pending Batches Queue ({pendingBatches.length})
            </h2>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {pendingBatches.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                No batches pending lab inspection.
              </div>
            ) : (
              pendingBatches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectPending(b)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedBatchId === b.id
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400'
                      : 'bg-stone-50 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-stone-900">{b.id}</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-stone-800">{b.honeyType}</div>
                  <div className="text-[11px] text-stone-500 mt-1 flex justify-between">
                    <span>{b.beekeeperName}</span>
                    <span className="font-mono">{b.quantityKg} kg</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Inspection Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold text-stone-900">
                Physico-Chemical Testing Form
              </h2>
              <p className="text-xs text-stone-500">
                Calibrate refractometer and photometer readings according to FSSAI standards.
              </p>
            </div>
            {selectedBatchId ? (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-500 text-stone-950">
                Testing Batch: {selectedBatchId}
              </span>
            ) : (
              <span className="text-xs text-stone-400 italic">Select a batch from the left queue</span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            {/* Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Moisture Content (% wt) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold"
                  required
                />
                <span className="text-[10px] text-stone-400">Codex limit: &lt; 20.0%</span>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">pH Acidity Level *</label>
                <input
                  type="number"
                  step="0.01"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold"
                  required
                />
                <span className="text-[10px] text-stone-400">Normal range: 3.4 - 6.1</span>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Purity Percentage (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={purity}
                  onChange={(e) => setPurity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-emerald-700"
                  required
                />
                <span className="text-[10px] text-stone-400">Pollen count verified</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  HMF Content (mg/kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={hmf}
                  onChange={(e) => setHmf(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold"
                  required
                />
                <span className="text-[10px] text-stone-400">Max limit: 40 mg/kg</span>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  C3/C4 Sugar Isotope Adulteration *
                </label>
                <select
                  value={adulterationTest}
                  onChange={(e) => setAdulterationTest(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold bg-white"
                >
                  <option value="Negative (C3/C4 Sugar Negative)">Negative (Unadulterated Pure)</option>
                  <option value="Positive (Adulteration Detected)">Positive (C3/C4 Sugar Detected)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Microbial Pathogen Screen *</label>
                <select
                  value={microbialTest}
                  onChange={(e) => setMicrobialTest(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold bg-white"
                >
                  <option value="Passed (Zero Pathogens)">Passed (Zero Pathogens)</option>
                  <option value="Failed">Failed (Pathogens Present)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Optical Color (Pfund Scale)</label>
                <input
                  type="text"
                  value={colorPfund}
                  onChange={(e) => setColorPfund(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Organoleptic Aroma Profile</label>
                <input
                  type="text"
                  value={aroma}
                  onChange={(e) => setAroma(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Inspector Remarks & Certification Notes</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            {/* Decision Buttons with Duplicate Prevention */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={!selectedBatchId || isSubmitting}
                onClick={() => handleInspectionDecision('Approved')}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 ${
                  !selectedBatchId || isSubmitting
                    ? 'bg-emerald-300 text-white cursor-not-allowed opacity-60'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Mining Blockchain Approval...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Issue FSSAI Approval & Mine Block</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={!selectedBatchId || isSubmitting}
                onClick={() => handleInspectionDecision('Rejected')}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 ${
                  !selectedBatchId || isSubmitting
                    ? 'bg-rose-300 text-white cursor-not-allowed opacity-60'
                    : 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Rejection...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Reject Batch (Trigger Quality Alert)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Laboratory Certifications Table */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-stone-900">
          Certified Inspection Archive ({qualityRecords.length})
        </h2>

        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Certificate #</th>
                  <th className="px-6 py-3 font-semibold">Batch ID</th>
                  <th className="px-6 py-3 font-semibold">Inspector</th>
                  <th className="px-6 py-3 font-semibold">Moisture</th>
                  <th className="px-6 py-3 font-semibold">Purity</th>
                  <th className="px-6 py-3 font-semibold">HMF</th>
                  <th className="px-6 py-3 font-semibold">Sugar Test</th>
                  <th className="px-6 py-3 font-semibold">Verdict</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {qualityRecords.map((q) => (
                  <tr key={q.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-stone-900">
                      {q.certificateNumber}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-amber-700">{q.batchId}</td>
                    <td className="px-6 py-4">{q.inspectorName}</td>
                    <td className="px-6 py-4 font-mono">{q.moistureContentPercent}%</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                      {q.purityPercentage}%
                    </td>
                    <td className="px-6 py-4 font-mono">{q.hmfValueMgKg} mg/kg</td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-700 font-semibold text-[11px]">NEGATIVE</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          q.overallResult === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {q.overallResult}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {onTraceBatch && (
                        <button
                          onClick={() => onTraceBatch(q.batchId)}
                          className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Trace</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
