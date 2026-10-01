import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Cpu,
  Layers,
  QrCode,
  Truck,
  Award,
  ArrowRight,
  CheckCircle2,
  Boxes,
  Database,
  Eye,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { honeyChainStore } from '../services/dataStore';

interface LandingPageProps {
  onSearchBatch: (batchId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSearchBatch, onNavigateTab }) => {
  const [searchInput, setSearchInput] = useState('');
  const batches = honeyChainStore.getBatches();
  const apiaries = honeyChainStore.getApiaries();
  const hives = honeyChainStore.getHives();
  const blockchain = honeyChainStore.getBlockchain();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchBatch(searchInput.trim().toUpperCase());
    }
  };

  const sampleBatches = [
    { id: 'HC-2026-00001', label: 'Multifloral Honey (Satara)', status: 'Delivered' },
    { id: 'HC-2026-00002', label: 'Himalayan Acacia (Shimla)', status: 'In Transit' },
    { id: 'HC-2026-00003', label: 'Jamun Blossom Honey', status: 'Packaged' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-12 lg:pb-20 border-b border-amber-900/10 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Cryptographic Food Provenance & Smart Beekeeping</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.12]">
                From Hive to Home,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600">
                  Every Drop You Can Trust.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl">
                A blockchain-powered honey traceability and smart beekeeping management platform. Trace origin,
                inspect laboratory purity certificates, and verify every step of the supply chain with immutable
                cryptographic proof.
              </p>

              {/* Direct Batch Search Box */}
              <div className="pt-2">
                <form
                  onSubmit={handleSearchSubmit}
                  className="bg-white p-2 rounded-2xl shadow-xl shadow-amber-950/5 border border-stone-200 flex flex-col sm:flex-row gap-2 max-w-xl"
                >
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-5 h-5 text-stone-400 absolute left-3.5" />
                    <input
                      type="text"
                      placeholder="Enter Batch ID (e.g. HC-2026-00001)"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-stone-900 placeholder-stone-400 text-sm font-medium focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Trace Honey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Demo Batch Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-stone-500">
                  <span className="font-semibold text-stone-700">Try sample batch:</span>
                  {sampleBatches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => onSearchBatch(b.id)}
                      className="px-2.5 py-1 rounded-md bg-white border border-stone-200 hover:border-amber-500 text-stone-700 hover:text-amber-700 font-mono transition-colors cursor-pointer shadow-xs"
                    >
                      {b.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <span>Enter Platform Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigateTab('blockchain')}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm border border-stone-300 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Boxes className="w-4 h-4 text-amber-600" />
                  <span>Explore Blockchain Ledger</span>
                </button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-amber-200/80 shadow-2xl bg-amber-950/10 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
                <img
                  src="/src/assets/images/honey_trace_hero_1790840039074.jpg"
                  alt="Artisanal pure honey with natural honeycomb and wooden dipper"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cryptographically Anchored Origin</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Green Valley Single-Origin Raw Honey
                  </h3>
                  <p className="text-xs text-stone-200 mt-1">
                    Batch #HC-2026-00001 · Unpasteurized · Moisture: 17.8% · FSSAI Certified
                  </p>
                </div>
              </div>

              {/* Floating Verified Certificate Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-stone-200 flex items-center gap-3.5 max-w-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">100% Pure Honey Verified</div>
                  <div className="text-[11px] text-stone-500">
                    C3/C4 Sugar Negative · Zero Pathogens · Live Enzymes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Platform Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1 border-r border-stone-800 last:border-none">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-400">
              {batches.length}
            </div>
            <div className="text-xs font-medium text-stone-400">Total Tracked Batches</div>
          </div>
          <div className="space-y-1 border-r border-stone-800 last:border-none">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
              {apiaries.length}
            </div>
            <div className="text-xs font-medium text-stone-400">Registered Apiaries</div>
          </div>
          <div className="space-y-1 border-r border-stone-800 last:border-none">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-400">
              {hives.length}
            </div>
            <div className="text-xs font-medium text-stone-400">Smart Connected Hives</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-400">
              {blockchain.length}
            </div>
            <div className="text-xs font-medium text-stone-400">Immutable Blockchain Blocks</div>
          </div>
        </div>
      </section>

      {/* How It Works Section (8-Step Traceability Journey) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-bold text-amber-600 tracking-wider">
            STEP-BY-STEP LIFECYCLE
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900">
            How Honey Chain Works
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Every transition in the honey lifecycle generates a tamper-evident cryptographic block,
            guaranteeing end-to-end provenance from the apiary to your breakfast table.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Apiary & Hive Registration',
              desc: 'Beekeeper logs colony details, bee species (Apis cerana indica/mellifera), and connects IoT sensors.',
              icon: Layers,
            },
            {
              step: '02',
              title: 'Honey Harvested',
              desc: 'Harvest event is recorded with hive code, extraction location, weight, and initial weather notes.',
              icon: Boxes,
            },
            {
              step: '03',
              title: 'Batch & Block Created',
              desc: 'System assigns unique ID (e.g. HC-2026-00001) and mines a Proof-of-Work blockchain block.',
              icon: Database,
            },
            {
              step: '04',
              title: 'Quality Testing & Cert',
              desc: 'FSSAI lab conducts moisture, pH, purity, and C3/C4 adulteration tests with digital certification.',
              icon: FileCheck,
            },
            {
              step: '05',
              title: 'Cold Processing & Bottling',
              desc: 'Processor verifies cold extraction (<38°C), mechanical filtration, and hermetic jar packaging.',
              icon: Cpu,
            },
            {
              step: '06',
              title: 'QR Code Generation',
              desc: 'Tamper-evident tamper-proof QR code label printed for every glass jar with direct verification link.',
              icon: QrCode,
            },
            {
              step: '07',
              title: 'Cold-Chain Distribution',
              desc: 'Logistics records consignment waybill, refrigerated vehicle temperature, and retail delivery.',
              icon: Truck,
            },
            {
              step: '08',
              title: 'Consumer Verification',
              desc: 'Shopper scans QR code on jar to inspect full journey, chemical certificates, and blockchain hashes.',
              icon: Eye,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-400 group-hover:text-amber-600 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Platform Pillars / Features */}
      <section className="bg-stone-900 text-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-bold text-amber-400 tracking-wider">
              TECHNOLOGICAL ARCHITECTURE
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Built on 6 Core Pillars
            </h2>
            <p className="text-stone-400 text-sm sm:text-base">
              A comprehensive system uniting Internet of Things (IoT), cryptographic ledger technology,
              and FSSAI food quality standards into one cohesive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Blockchain Traceability',
                desc: 'Immutable distributed ledger simulation utilizing SHA-256 cryptographic hashes, previous hash linking, and Merkle tree roots.',
                icon: Boxes,
              },
              {
                title: 'Honey Authenticity',
                desc: 'Full protection against sugar syrup adulteration. Direct proof of floral source, beekeeper identity, and geo-coordinates.',
                icon: ShieldCheck,
              },
              {
                title: 'Smart Hive IoT Telemetry',
                desc: 'Live sensors monitoring internal brood nest temperature (34.5°C), relative humidity, weight trends, and acoustic colony swarming hums.',
                icon: Cpu,
              },
              {
                title: 'Laboratory Quality Control',
                desc: 'Standardized digital lab certificates verifying moisture (<20%), pH levels, HMF (<40 mg/kg), and C3/C4 sugar isotope tests.',
                icon: Award,
              },
              {
                title: 'Supply Chain Logistics',
                desc: 'Complete consignment tracking with vehicle temperature logs from the processor facility to consumer retail shelves.',
                icon: Truck,
              },
              {
                title: 'Public QR Verification',
                desc: 'Zero-app requirement for consumers. Instant mobile camera scanning opens the certified provenance timeline in under 1 second.',
                icon: QrCode,
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700/80 hover:border-amber-500/40 transition-colors space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual Showcase: Apiary & Lab */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Card 1: Smart Apiary */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-lg flex flex-col">
            <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
              <img
                src="/src/assets/images/apiary_nature_landscape_1790840056945.jpg"
                alt="Green Valley Smart Apiary in Satara"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white">
                Satara Foothills, Maharashtra
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-stone-900">Green Valley Smart Apiary</h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Organic Certified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                18 Langstroth hives equipped with real-time temperature, humidity and scale load cells.
                Beekeeper Raj Patil manages indigenous Apis cerana indica colonies foraging on Jamun blossoms.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100">
                <span className="text-stone-500">Latest Harvest: 25 kg Raw Multifloral</span>
                <button
                  onClick={() => onNavigateTab('apiaries')}
                  className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Apiary Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Quality Lab */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-lg flex flex-col">
            <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
              <img
                src="/src/assets/images/honey_lab_testing_1790840074279.jpg"
                alt="Honey Quality Testing Laboratory"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white">
                FSSAI Accredited Laboratory
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-stone-900">Physico-Chemical Lab Testing</h3>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Lab Accredited
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                Every honey batch is subjected to refractometer moisture measurement, digital pH calibration,
                HMF photometric tests, and carbon-isotope C3/C4 adulteration screening before release.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100">
                <span className="text-stone-500">Inspector: Dr. Sunita Kulkarni</span>
                <button
                  onClick={() => onNavigateTab('quality')}
                  className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Lab Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Examiners & College Viva Demonstration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 rounded-3xl p-8 sm:p-12 text-stone-950 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-block px-3 py-1 rounded-full bg-stone-950/10 text-xs font-extrabold uppercase tracking-wide">
              Engineering Viva & Final Year Project
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
              Explore Live Roles, Blockchain Explorer & IoT Telemetry
            </h2>
            <p className="text-stone-900/90 text-sm leading-relaxed">
              Test the full end-to-end simulation: harvest a new batch, verify the block on the cryptographic
              ledger, test the tamper-detection mechanism, and inspect the complete MySQL relational schema.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('trace')}
              className="px-6 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-bold text-sm transition-colors cursor-pointer shadow-md text-center"
            >
              Trace Live Batch
            </button>
            <button
              onClick={() => onNavigateTab('schema')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm border border-stone-300 transition-colors cursor-pointer text-center"
            >
              View MySQL Schema & SQL
            </button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © 2026 Honey Chain · Blockchain Honey Traceability & Smart Beekeeping Management System
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigateTab('blockchain')} className="hover:text-stone-800 cursor-pointer">
            Blockchain
          </button>
          <button onClick={() => onNavigateTab('iot')} className="hover:text-stone-800 cursor-pointer">
            IoT Sensors
          </button>
          <button onClick={() => onNavigateTab('schema')} className="hover:text-stone-800 cursor-pointer">
            MySQL Schema
          </button>
          <button onClick={() => onNavigateTab('landing')} className="hover:text-stone-800 cursor-pointer">
            Back to Top
          </button>
        </div>
      </footer>
    </div>
  );
};
