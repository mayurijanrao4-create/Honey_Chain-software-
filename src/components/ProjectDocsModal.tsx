import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Database,
  Boxes,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Code,
  Terminal,
} from 'lucide-react';

interface ProjectDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeDocSection, setActiveDocSection] = useState<'overview' | 'architecture' | 'blockchain' | 'apis' | 'viva'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-900 text-xs font-bold mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Final Year Engineering Project Documentation</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold text-stone-900">
              Honey Chain Project Documentation & Viva Guide
            </h2>
            <p className="text-xs text-stone-500">
              Complete technical specification, architectural diagrams, blockchain mechanics, and viva Q&A.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-100 text-xs font-semibold">
          {[
            { id: 'overview', label: '1. Overview & Problem Statement' },
            { id: 'architecture', label: '2. System Architecture' },
            { id: 'blockchain', label: '3. Blockchain Workflow' },
            { id: 'apis', label: '4. REST API Endpoints' },
            { id: 'viva', label: '5. Viva Examination Q&A' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveDocSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                activeDocSection === sec.id
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-xs text-stone-700 leading-relaxed">
          {activeDocSection === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-900">
                1. Project Title & Problem Statement
              </h3>
              <p>
                <strong>Title:</strong> Honey Chain – Blockchain-Based Honey Traceability and Smart Beekeeping Management System.
              </p>
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                <span className="font-bold text-amber-950 block">Problem Statement:</span>
                <p>
                  Honey is globally recognized as the third most adulterated agricultural commodity.
                  Commercial adulterants (corn syrup, rice syrup, inverted beet sugar) are blended into commercial honey,
                  diluting therapeutic benefits and defrauding consumers. Conventional supply chains suffer from centralized
                  database manipulation, opaque origin claims, and lack of real-time colony health monitoring for beekeepers.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-stone-900 block">Project Objectives:</span>
                <ul className="list-disc pl-5 space-y-1 text-stone-600">
                  <li>Combine cryptographic blockchain records with smart beekeeping telemetry.</li>
                  <li>Track honey batches from the individual hive/apiary to consumer jar.</li>
                  <li>Incorporate FSSAI/Codex Alimentarius physico-chemical testing (moisture, pH, HMF, C3/C4 sugar isotope tests).</li>
                  <li>Simulate multi-sensor IoT metrics (temperature, humidity, scale weight, colony acoustics).</li>
                  <li>Provide QR-code verifiable public consumer passports with tamper detection.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-stone-900 block">6 User Roles & Permissions:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong>Admin:</strong> System oversight, beekeeper approvals, quality standards, audit logs, and global analytics.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong>Beekeeper:</strong> Apiary/hive registration, colony inspections, harvest recording, and IoT sensor monitoring.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong>Quality Inspector:</strong> Laboratory testing (moisture, purity, HMF, sugar adulteration), approval/rejection certification.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong>Processor:</strong> Cold-extraction (&lt;38°C), mechanical mesh filtration, and settling vat logging.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong>Distributor:</strong> Consignment waybills, refrigerated vehicle temperature monitoring, and delivery confirmation.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong>Consumer:</strong> Scan QR code, review the 8-stage timeline, and verify cryptographic blockchain hashes.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDocSection === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-900">
                2. System & IoT Architecture
              </h3>

              <div className="p-4 bg-stone-900 text-stone-200 rounded-2xl font-mono text-[11px] space-y-3">
                <div className="text-amber-400 font-bold">Traceability Flow:</div>
                <div>Frontend (React, TypeScript, Tailwind CSS)</div>
                <div>&nbsp;&nbsp;↓ REST API (JSON Payloads / Bearer Auth)</div>
                <div>Backend (Node.js & Express.js Services)</div>
                <div>&nbsp;&nbsp;↓ Relational 3NF Persistence</div>
                <div>MySQL Database (16 Normalized Tables)</div>
                <div>&nbsp;&nbsp;↓ Cryptographic State Anchoring</div>
                <div>Blockchain Engine (SHA-256 Hashing, Merkle Trees & PoW Mining)</div>
              </div>

              <div className="p-4 bg-stone-900 text-stone-200 rounded-2xl font-mono text-[11px] space-y-3">
                <div className="text-amber-400 font-bold">IoT Smart Beekeeping Flow:</div>
                <div>Hardware Sensors (DS18B20 Temp, DHT22 Humidity, HX711 Load Cell, I2S Mic)</div>
                <div>&nbsp;&nbsp;↓ Microcontroller (ESP32 / LoRaWAN Gateway)</div>
                <div>Smart Monitoring Telemetry Ingestion API</div>
                <div>&nbsp;&nbsp;↓ Threshold Rules Engine</div>
                <div>Hive Telemetry Dashboard & Real-Time Colony Alerts</div>
              </div>
            </div>
          )}

          {activeDocSection === 'blockchain' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-900">
                3. Blockchain Ledger Workflow
              </h3>

              <p>
                The ledger is implemented with standard cryptographic SHA-256 blocks:
              </p>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono text-[11px] space-y-1">
                <div>Block Header Structure:</div>
                <div className="text-stone-600 pl-4">Index: Integer (0 = Genesis)</div>
                <div className="text-stone-600 pl-4">Timestamp: ISO8601 UTC</div>
                <div className="text-stone-600 pl-4">PreviousHash: 64-char Hex (Points to Parent Block)</div>
                <div className="text-stone-600 pl-4">MerkleRoot: 64-char Hex (Cryptographic hash of enclosed transactions)</div>
                <div className="text-stone-600 pl-4">Nonce: Integer (Proof-of-Work solution)</div>
                <div className="text-amber-700 font-bold pl-4">CurrentHash: SHA256(Index + PrevHash + Timestamp + MerkleRoot + Nonce)</div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-stone-900 block">Tamper Evident Proof:</span>
                <p>
                  If any record in a prior block (such as moisture content or harvest quantity) is modified,
                  its transaction hash changes. This invalidates the Merkle root of the block, which alters the block&apos;s
                  current hash, immediately breaking the &ldquo;PreviousHash&rdquo; link in all subsequent blocks.
                  The verification function flags the exact block index where tampering occurred.
                </p>
              </div>
            </div>
          )}

          {activeDocSection === 'apis' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-900">
                4. REST API Endpoint Specification
              </h3>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-emerald-700 font-bold">GET</span> /api/trace/:batchId — Retrieve public 8-stage journey
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-blue-700 font-bold">POST</span> /api/batches/harvest — Create batch & mine harvest block
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-blue-700 font-bold">POST</span> /api/quality/inspect — Submit FSSAI inspection report
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-blue-700 font-bold">POST</span> /api/processing — Record cold extraction & filtration
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-blue-700 font-bold">POST</span> /api/packaging — Generate serial packaging & QR codes
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-blue-700 font-bold">POST</span> /api/shipments — Dispatch refrigerated transport
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-emerald-700 font-bold">GET</span> /api/blockchain — Inspect chain blocks & transactions
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-emerald-700 font-bold">GET</span> /api/sensors/:hiveId — Fetch live telemetry & thresholds
                </div>
              </div>
            </div>
          )}

          {activeDocSection === 'viva' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-900">
                5. College Viva Examination Questions & Model Answers
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
                  <strong className="text-amber-950 block">Q1: Why use blockchain instead of a conventional relational database?</strong>
                  <p className="text-stone-700">
                    A centralized database allows any database administrator to update or overwrite records retroactively.
                    In honey traceability, adulteration often occurs via forged paper certificates. Blockchain ensures that once
                    a beekeeper records an extraction or a lab signs a purity certificate, that record is immutably sealed by
                    cryptographic hash pointers and cannot be modified without invalidating the entire subsequent chain.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
                  <strong className="text-amber-950 block">Q2: What is the significance of the Merkle Tree?</strong>
                  <p className="text-stone-700">
                    The Merkle tree summarizes all transactions within a block into a single 32-byte hash (Merkle Root).
                    This allows rapid mathematical verification of whether a specific transaction is present in a block without
                    requiring download or recalculation of the entire transaction payload.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
                  <strong className="text-amber-950 block">Q3: What parameters are tested to detect honey adulteration?</strong>
                  <p className="text-stone-700">
                    Key tests include: moisture content (Codex standard &lt;20%), Hydroxymethylfurfural (HMF &lt;40 mg/kg),
                    diastase enzymatic activity (&gt;8 Schade units), and carbon isotope ratio analysis (C3/C4 sugar screening)
                    which detects foreign corn or cane sugar syrup.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
