# Honey Chain – Blockchain-Based Honey Traceability and Smart Beekeeping Management System

An enterprise-grade, end-to-end food provenance platform combining cryptographic blockchain ledger architecture with IoT smart hive scale telemetry and FSSAI/Codex Alimentarius quality verification.

---

## 1. Problem Statement & Objective

### The Problem
Commercial honey is globally ranked among the top three most adulterated food commodities. Industrial fraudulent practices—such as diluting raw honey with inverted corn/cane syrups, foreign C3/C4 sugar blending, premature extraction of high-moisture unripe nectar, and unauthorized thermal ultra-filtration—cheat consumers, destroy medicinal enzymes, and suppress indigenous beekeeper livelihoods. Traditional paper certificates and centralized databases remain vulnerable to retroactive falsification.

### The Objective
Honey Chain bridges physical apiary harvesting with a decentralized cryptographic ledger. Every critical event—colony registration, harvest extraction, physico-chemical lab inspection, low-temperature cold processing, retail bottling, and cold-chain transport—is mathematically sealed as an immutable SHA-256 block. Consumers scan a public QR code to inspect complete verifiable provenance from hive to home.

---

## 2. Key System Architecture

```
[IoT Hardware Layer]
  - DS18B20 Brood Nest Probe (34.5°C - 35.5°C core monitoring)
  - DHT22 Relative Humidity Sensor
  - HX711 Precision Load Cell Hive Scale (24h weight flux)
  - Acoustic I2S Colony Microphone (Swarming hum detection)
            │
            ▼ (JSON Telemetry Packets)
[Smart Monitoring & Ingestion Service]
            │
            ▼ (REST API / Bearer Auth)
[Application Backend (Node.js & Express.js)]
      │                                   │
      ▼ (Relational 3NF Storage)          ▼ (Cryptographic State Anchoring)
[MySQL 8.0+ Database]              [Cryptographic Blockchain Layer]
(16 Structured Tables)             - SHA-256 Block Hashing
                                   - Merkle Tree Root Calculation
                                   - Proof-of-Work Nonce Mining
                                   - Dynamic Previous-Hash Linkage
                                   - Tamper-Detection Engine
            │
            ▼ (Interactive Web UI)
[React 19 + TypeScript + Vite + Tailwind CSS]
  - Public Traceability Portal (/verify/:batchId)
  - Dedicated Blockchain Explorer & Tamper Simulator
  - Beekeeper Apiary & Hive Console
  - FSSAI Laboratory Quality Inspection Suite
  - Supply Chain Processing, Packaging & Logistics Hub
  - 16-Table MySQL DDL Exporter (.sql)
```

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **Cryptography & Blockchain**: Native Web Crypto SHA-256, Merkle Tree aggregation, Proof-of-Work nonce calculation, previous-hash linkage, and automated chain integrity audits.
- **QR Code Engine**: High-density QR code SVG/DataURL generation linking to public passport URLs (`/verify/HC-2026-00001`).
- **Database**: MySQL 8.0+ normalized relational design with 16 tables, foreign keys, indexes, and full DDL generator.
- **IoT Simulation**: Real-time multi-sensor telemetry ticker modeling brood nest thermal regulation, nocturnal weight settling, and acoustic swarming indicators.

---

## 4. User Roles & Access Control (RBAC)

1. **System Administrator (Dr. Vikramaditya Rao)**:
   - System-wide analytics, beekeeper verification, quality standards audit, and compliance monitoring.
2. **Beekeeper (Raj Patil & Anita Sharma)**:
   - Apiary registration, hive telemetry logging, colony queen inspections, and harvest batch creation with instant block mining.
3. **Quality Inspector (Dr. Sunita Kulkarni)**:
   - Laboratory testing for moisture (<20%), pH, HMF (<40 mg/kg), pollen purity, and C3/C4 isotopic sugar adulteration tests. Issues official FSSAI digital certificates.
4. **Honey Processor (Suresh Deshmukh)**:
   - Cold processing (<38°C unpasteurized extraction) and mechanical stainless-steel mesh filtration logging.
5. **Packager & Logistics (Pooja Varma)**:
   - Serialized bottling (500g / 1kg glass jars), QR label issuance, refrigerated cold-van dispatch, and delivery confirmation.
6. **Consumer (Kavita Joshi)**:
   - Camera scan of jar QR code or manual Batch ID lookup to view the certified 8-stage timeline and cryptographic proof.

---

## 5. Relational Database Design (MySQL 8.0+)

The system defines 16 relational tables with primary keys, foreign key constraints, and performance indexes:

1. `users`: RBAC authentication and contact profiles.
2. `apiaries`: Geographic bee yard coordinates, altitudes, and surrounding flora.
3. `hives`: Physical bee boxes, architecture (Langstroth, Top-Bar), and queen colony status.
4. `hive_sensor_data`: Time-series sensor readings (internal temp, ambient temp, humidity, scale weight, audio frequency).
5. `honey_batches`: Master batch tracking record through all 8 lifecycle states.
6. `harvest_records`: Extraction field notes and capped comb ratios.
7. `quality_inspections`: Physico-chemical lab parameters and digital certificate numbers.
8. `processing_records`: Mechanical filtration and temperature stabilization logs.
9. `packaging_records`: Packaging facility units, SKU labels, and QR codes.
10. `shipments`: Waybill numbers, cold-chain temperature logs, and recipient sign-offs.
11. `blockchain_blocks`: Immutable block headers, previous hash pointers, and nonces.
12. `blockchain_transactions`: Atomic signed batch events within each block.
13. `qr_codes`: Public verification URL registry and access logs.
14. `alerts`: IoT threshold breaches (high temp, low humidity, weight drop) and quality rejections.
15. `audit_logs`: Immutable chronological log of all operator interactions and IP addresses.
16. `system_settings`: Global IoT threshold parameters and difficulty targets.

*(A ready-to-run `.sql` dump can be exported directly from the "Database SQL" tab in the application).*

---

## 6. Blockchain Workflow & Viva Defense Highlights

### How Hash Linkage Prevents Fraud:
- Every block stores the SHA-256 hash of the previous block (`previousHash`).
- The block's own hash (`currentHash`) is computed from:
  `SHA256(blockIndex + previousHash + timestamp + merkleRoot + nonce)`
- If a bad actor modifies even 1 digit (e.g., changes moisture content from 17.8% to 19.5% in Block #2), that block's Merkle root changes.
- The recalculated hash of Block #2 will no longer match the `previousHash` pointer stored in Block #3.
- When an examiner clicks **"Verify Blockchain"**, the system flags:
  `✗ Blockchain Integrity Failed: Broken Hash Link at Block #2.`
- The included **"Simulate Attacker Tampering"** feature allows live demonstration of this exact mathematical defense during viva presentations.

---

## 7. Demo Credentials

Quick 1-click persona switching is available directly in the top navigation bar:
- **Admin**: `admin@honeychain.io`
- **Beekeeper**: `raj.patil@greenvalley.com`
- **Quality Inspector**: `sunita.k@apilab.gov.in`
- **Processor**: `processing@sataraorganic.com`
- **Distributor**: `logistics@coldchainorganics.com`

---

## 8. Installation & Local Execution (Zero Database Configuration)

The project operates in **College Project / Demo Mode**:
- **No MySQL database server, external credentials, or daemon setup required**.
- All user sessions, honey batches, blockchain blocks, quality records, packaging logs, and IoT telemetry are stored and persisted across reloads using the centralized `localDataService` via browser `localStorage`.
- Ready to run directly on any machine:

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

Open `http://localhost:3000` to interact with the system. An interactive "Reset Demo" button in the navigation bar allows resetting state back to the factory demonstration data at any time.
