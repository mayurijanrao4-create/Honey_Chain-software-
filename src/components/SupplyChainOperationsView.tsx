import React, { useState } from 'react';
import {
  Cpu,
  Boxes,
  Truck,
  QrCode,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Printer,
  Sparkles,
  ExternalLink,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { honeyChainStore } from '../services/dataStore';
import { HoneyBatch, PackagingRecord, ProcessingRecord, ShipmentRecord } from '../types';

interface SupplyChainOperationsViewProps {
  initialSubTab?: 'processing' | 'packaging' | 'distribution';
  onTraceBatch?: (batchId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const SupplyChainOperationsView: React.FC<SupplyChainOperationsViewProps> = ({
  initialSubTab = 'processing',
  onTraceBatch,
  onNavigateTab,
}) => {
  const [subTab, setSubTab] = useState<'processing' | 'packaging' | 'distribution'>(initialSubTab);

  const [batches, setBatches] = useState<HoneyBatch[]>(honeyChainStore.getBatches());
  const [processingRecords, setProcessingRecords] = useState<ProcessingRecord[]>(
    honeyChainStore.getProcessingRecords()
  );
  const [packagingRecords, setPackagingRecords] = useState<PackagingRecord[]>(
    honeyChainStore.getPackagingRecords()
  );
  const [shipments, setShipments] = useState<ShipmentRecord[]>(honeyChainStore.getShipments());

  // Processing Form State
  const [procBatchId, setProcBatchId] = useState('');
  const [procUnit, setProcUnit] = useState('Satara Cold-Extract Unit #1');
  const [filtrationMethod, setFiltrationMethod] = useState(
    'Micro-mesh mechanical filter (unpasteurized raw, 200 micron)'
  );
  const [heatingTempC, setHeatingTempC] = useState('35.0');
  const [durationHours, setDurationHours] = useState('4.5');
  const [storageCondition, setStorageCondition] = useState(
    'Airtight stainless steel settling vat at 19°C, dark'
  );
  const [procNotes, setProcNotes] = useState('Cold extraction preserves active diastase and invertase enzymes.');

  // Packaging Form State
  const [pkgBatchId, setPkgBatchId] = useState('');
  const [facilityName, setFacilityName] = useState('MIDC Satara Certified Organic Bottling Unit');
  const [packageSize, setPackageSize] = useState('500g Hexagonal Glass Jar (Hermetic Gold Lid)');
  const [unitCount, setUnitCount] = useState('50');
  const [expiryDate, setExpiryDate] = useState('2028-09-30');
  const [productLabelId, setProductLabelId] = useState('SKU-HC-RAW-500G');

  // Distribution Form State
  const [shpBatchId, setShpBatchId] = useState('');
  const [shipmentWaybill, setShipmentWaybill] = useState('WAYBILL-AC-994120');
  const [sourceLocation, setSourceLocation] = useState('MIDC Satara Packaging Facility');
  const [destination, setDestination] = useState('Gourmet Supermarket, Baner, Pune');
  const [transportMethod, setTransportMethod] = useState('Temperature-Controlled Cold Van (18-20°C)');
  const [expectedDelivery, setExpectedDelivery] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [trackingNotes, setTrackingNotes] = useState('Chilled transit, calibrated IoT datalogger active.');

  const [operationSuccessMsg, setOperationSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastHandledBatchId, setLastHandledBatchId] = useState('');
  const [lastActionType, setLastActionType] = useState<'processing' | 'packaging' | 'distribution' | ''>('');

  React.useEffect(() => {
    return honeyChainStore.subscribe(() => {
      setBatches([...honeyChainStore.getBatches()]);
      setProcessingRecords([...honeyChainStore.getProcessingRecords()]);
      setPackagingRecords([...honeyChainStore.getPackagingRecords()]);
      setShipments([...honeyChainStore.getShipments()]);
    });
  }, []);

  // Approved batches ready for processing
  const approvedForProcessing = batches.filter(
    (b) => b.qualityStatus === 'Approved' && b.processingStatus !== 'Completed'
  );

  // Processed batches ready for packaging
  const readyForPackaging = batches.filter(
    (b) => b.processingStatus === 'Completed' && b.packagingStatus !== 'Completed'
  );

  // Packaged batches ready for shipment
  const readyForDistribution = batches.filter(
    (b) => b.packagingStatus === 'Completed' && b.distributionStatus === 'Pending'
  );

  const handleRecordProcessingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procBatchId || isSubmitting) return;

    setIsSubmitting(true);
    const targetBatch = procBatchId;
    try {
      honeyChainStore.recordProcessing({
        batchId: targetBatch,
        processingUnit: procUnit,
        filtrationMethod,
        heatingTemperatureC: parseFloat(heatingTempC),
        processingDurationHours: parseFloat(durationHours),
        storageCondition,
        notes: procNotes,
      });

      setOperationSuccessMsg(`Cold processing recorded for batch ${targetBatch}. Blockchain block mined!`);
      setLastHandledBatchId(targetBatch);
      setLastActionType('processing');
      setProcBatchId('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordPackagingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgBatchId || isSubmitting) return;

    setIsSubmitting(true);
    const targetBatch = pkgBatchId;
    try {
      honeyChainStore.recordPackaging({
        batchId: targetBatch,
        facilityName,
        packageSize,
        unitCount: parseInt(unitCount, 10),
        expiryDate,
        productLabelId: `${productLabelId}-${targetBatch.slice(-5)}`,
      });

      setOperationSuccessMsg(
        `Packaging completed for batch ${targetBatch}. Public QR code generated and anchored!`
      );
      setLastHandledBatchId(targetBatch);
      setLastActionType('packaging');
      setPkgBatchId('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordShipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shpBatchId || isSubmitting) return;

    setIsSubmitting(true);
    const targetBatch = shpBatchId;
    try {
      honeyChainStore.recordShipment({
        batchId: targetBatch,
        shipmentId: shipmentWaybill,
        sourceLocation,
        destination,
        transportMethod,
        expectedDelivery,
        trackingNotes,
      });

      setOperationSuccessMsg(`Shipment ${shipmentWaybill} dispatched for batch ${targetBatch}.`);
      setLastHandledBatchId(targetBatch);
      setLastActionType('distribution');
      setShpBatchId('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkDelivered = (shipmentId: string) => {
    honeyChainStore.markShipmentDelivered(shipmentId, 'Accepted by retail inventory manager.');
    setOperationSuccessMsg(`Consignment marked DELIVERED and anchored to ledger.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Boxes className="w-3.5 h-3.5" />
            <span>Downstream Supply Chain Modules</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Processing, Packaging & Logistics
          </h1>
          <p className="text-stone-400 text-sm max-w-xl">
            Execute cold processing protocols, bottling with serialized QR label generation,
            and refrigerated cold-chain transit tracking.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-800/90 rounded-2xl border border-stone-700">
          <button
            onClick={() => {
              setSubTab('processing');
              setOperationSuccessMsg('');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              subTab === 'processing'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            1. Processing
          </button>
          <button
            onClick={() => {
              setSubTab('packaging');
              setOperationSuccessMsg('');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              subTab === 'packaging'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            2. Packaging & QR
          </button>
          <button
            onClick={() => {
              setSubTab('distribution');
              setOperationSuccessMsg('');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              subTab === 'distribution'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            3. Distribution
          </button>
        </div>
      </div>

      {/* Success Notification with Action Guidance */}
      {operationSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs sm:text-sm text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{operationSuccessMsg}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {lastActionType === 'processing' && (
              <button
                type="button"
                onClick={() => {
                  setSubTab('packaging');
                  setOperationSuccessMsg('');
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Proceed to Packaging</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {lastActionType === 'packaging' && (
              <button
                type="button"
                onClick={() => {
                  setSubTab('distribution');
                  setOperationSuccessMsg('');
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Proceed to Logistics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {lastHandledBatchId && onTraceBatch && (
              <button
                type="button"
                onClick={() => onTraceBatch(lastHandledBatchId)}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Trace Batch #{lastHandledBatchId}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 1: PROCESSING */}
      {subTab === 'processing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="font-display text-xl font-bold text-stone-900">
                Record Honey Cold-Extraction & Filtration
              </h2>
              <p className="text-xs text-stone-500">
                Enter non-thermal filtration and settling parameters to preserve active honey bio-enzymes.
              </p>
            </div>

            <form onSubmit={handleRecordProcessingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Select Approved Batch for Processing *
                </label>
                <select
                  value={procBatchId}
                  onChange={(e) => setProcBatchId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                  required
                >
                  <option value="">-- Choose quality-approved batch --</option>
                  {approvedForProcessing.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} - {b.honeyType} ({b.quantityKg} kg)
                    </option>
                  ))}
                </select>
                {approvedForProcessing.length === 0 && (
                  <span className="text-[11px] text-amber-700 block mt-1">
                    No approved batches awaiting processing. (Approve batches in Quality Lab first!)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Processing Facility Unit *</label>
                  <input
                    type="text"
                    value={procUnit}
                    onChange={(e) => setProcUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Max Warming Temp (°C) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={heatingTempC}
                    onChange={(e) => setHeatingTempC(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-stone-400">Raw standard &lt; 38°C</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Filtration Method *</label>
                <input
                  type="text"
                  value={filtrationMethod}
                  onChange={(e) => setFiltrationMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Processing Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Storage Condition Spec</label>
                  <input
                    type="text"
                    value={storageCondition}
                    onChange={(e) => setStorageCondition(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Operator Notes</label>
                <textarea
                  rows={2}
                  value={procNotes}
                  onChange={(e) => setProcNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <button
                type="submit"
                disabled={!procBatchId || isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                  !procBatchId || isSubmitting
                    ? 'bg-amber-300 text-stone-600 cursor-not-allowed opacity-60'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-800" />
                    <span>Mining Processing Block...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Processing & Mine Block</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Processing Archive Table */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900">
              Processing History ({processingRecords.length})
            </h3>
            <div className="space-y-3">
              {processingRecords.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold font-mono text-stone-900">{p.batchId}</span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {p.processingDate.split('T')[0]}
                    </span>
                  </div>
                  <div className="text-stone-700">{p.filtrationMethod}</div>
                  <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                    <span>Temp: {p.heatingTemperatureC}°C</span>
                    <span>Operator: {p.operatorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PACKAGING & QR CODE LABELING */}
      {subTab === 'packaging' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="font-display text-xl font-bold text-stone-900">
                Packaging & Serialized QR Labeling
              </h2>
              <p className="text-xs text-stone-500">
                Generate cryptographic packaging blocks, bottle counts, and printable QR label sets.
              </p>
            </div>

            <form onSubmit={handleRecordPackagingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Select Processed Honey Batch *
                </label>
                <select
                  value={pkgBatchId}
                  onChange={(e) => setPkgBatchId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                  required
                >
                  <option value="">-- Choose processed batch --</option>
                  {readyForPackaging.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} - {b.honeyType} ({b.quantityKg} kg)
                    </option>
                  ))}
                </select>
                {readyForPackaging.length === 0 && (
                  <span className="text-[11px] text-amber-700 block mt-1">
                    No batches awaiting packaging. Process batches in Step 1 first!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Packaging Facility *</label>
                  <input
                    type="text"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Package Size / Spec *</label>
                  <input
                    type="text"
                    value={packageSize}
                    onChange={(e) => setPackageSize(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Unit Count (Jars) *</label>
                  <input
                    type="number"
                    value={unitCount}
                    onChange={(e) => setUnitCount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Regulatory SKU Prefix</label>
                  <input
                    type="text"
                    value={productLabelId}
                    onChange={(e) => setProductLabelId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!pkgBatchId || isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                  !pkgBatchId || isSubmitting
                    ? 'bg-amber-300 text-stone-600 cursor-not-allowed opacity-60'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-800" />
                    <span>Anchoring Packaging & Generating QR...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Package Honey & Generate Public QR Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Packaging Records Table */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900">
              Packaged Batches ({packagingRecords.length})
            </h3>
            <div className="space-y-3">
              {packagingRecords.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold font-mono text-stone-900">{pkg.batchId}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {pkg.unitCount} Units
                    </span>
                  </div>
                  <div className="text-stone-700 font-medium">{pkg.packageSize}</div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span>Exp: {pkg.expiryDate}</span>
                    {onTraceBatch && (
                      <button
                        onClick={() => onTraceBatch(pkg.batchId)}
                        className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect QR</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DISTRIBUTION & SHIPMENT */}
      {subTab === 'distribution' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="font-display text-xl font-bold text-stone-900">
                Cold-Chain Logistics & Distribution Dispatch
              </h2>
              <p className="text-xs text-stone-500">
                Record vehicle temperature monitoring and transit waybills from packaging warehouse to stores.
              </p>
            </div>

            <form onSubmit={handleRecordShipmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Select Packaged Honey Batch *
                </label>
                <select
                  value={shpBatchId}
                  onChange={(e) => setShpBatchId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                  required
                >
                  <option value="">-- Choose packaged batch --</option>
                  {readyForDistribution.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} - {b.honeyType} ({b.quantityKg} kg)
                    </option>
                  ))}
                </select>
                {readyForDistribution.length === 0 && (
                  <span className="text-[11px] text-amber-700 block mt-1">
                    No batches awaiting dispatch. Package batches in Step 2 first!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Waybill / Consignment # *</label>
                  <input
                    type="text"
                    value={shipmentWaybill}
                    onChange={(e) => setShipmentWaybill(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Transport Method *</label>
                  <input
                    type="text"
                    value={transportMethod}
                    onChange={(e) => setTransportMethod(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Source Location *</label>
                  <input
                    type="text"
                    value={sourceLocation}
                    onChange={(e) => setSourceLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Destination Address *</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Expected Delivery Date *</label>
                  <input
                    type="date"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tracking Notes</label>
                  <input
                    type="text"
                    value={trackingNotes}
                    onChange={(e) => setTrackingNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!shpBatchId || isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                  !shpBatchId || isSubmitting
                    ? 'bg-amber-300 text-stone-600 cursor-not-allowed opacity-60'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-800" />
                    <span>Mining Dispatch Block & Updating Ledger...</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>Dispatch Shipment & Mine Blockchain Block</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Active Logistics Shipments */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900">
              Active Consignments ({shipments.length})
            </h3>
            <div className="space-y-3">
              {shipments.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold font-mono text-stone-900">{s.shipmentId}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="text-stone-700">
                    <span className="font-bold font-mono">{s.batchId}</span>: {s.sourceLocation} →{' '}
                    {s.destination}
                  </div>
                  <div className="text-[11px] text-stone-500 flex justify-between pt-1">
                    <span>Temp: {s.temperatureMaintainedC || 20.0}°C</span>
                    <span>Carrier: {s.distributorName.split(' ')[0]}</span>
                  </div>

                  {s.status !== 'Delivered' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleMarkDelivered(s.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                      >
                        Confirm Final Delivery
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
