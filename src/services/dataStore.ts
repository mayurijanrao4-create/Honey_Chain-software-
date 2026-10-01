import QRCode from 'qrcode';
import {
  Alert,
  Apiary,
  AuditLog,
  BlockchainBlock,
  BlockchainTransaction,
  HoneyBatch,
  Hive,
  PackagingRecord,
  ProcessingRecord,
  QualityInspection,
  SensorReading,
  SensorThresholds,
  ShipmentRecord,
  User,
  UserRole,
} from '../types';
import { calculateBlockHash, calculateMerkleRoot, mineBlock, syncSha256, verifyBlockchainIntegrity } from './blockchain';
import { localDataService, StorageKey } from './localDataService';

// Pre-seeded Demo Users
export const DEMO_USERS: User[] = [
  {
    id: 'USR-ADMIN-01',
    name: 'Dr. Vikramaditya Rao',
    email: 'admin@honeychain.io',
    role: 'admin',
    phone: '+91 98230 11223',
    address: 'Honey Board of India, Shivaji Nagar, Pune, Maharashtra',
    organization: 'National Bee & Honey Authority',
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'USR-BEEKEEPER-01',
    name: 'Raj Patil',
    email: 'raj.patil@greenvalley.com',
    role: 'beekeeper',
    phone: '+91 94220 54321',
    address: 'Post Medha, Jawali Taluka, Satara District, Maharashtra 415012',
    organization: 'Green Valley Organic Apiaries',
    createdAt: '2026-02-01T10:30:00Z',
  },
  {
    id: 'USR-BEEKEEPER-02',
    name: 'Anita Sharma',
    email: 'anita.sharma@himalayanpure.in',
    role: 'beekeeper',
    phone: '+91 98160 45678',
    address: 'Kotkhai Valley, Shimla District, Himachal Pradesh 171202',
    organization: 'Himalayan Pure Mountain Honey Co-op',
    createdAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'USR-INSPECTOR-01',
    name: 'Dr. Sunita Kulkarni',
    email: 'sunita.k@apilab.gov.in',
    role: 'inspector',
    phone: '+91 98221 88990',
    address: 'Central Bee Research & Quality Testing Lab, Pune',
    organization: 'FSSAI Accredited Apiary Testing Laboratory',
    createdAt: '2026-01-20T08:00:00Z',
  },
  {
    id: 'USR-PROCESSOR-01',
    name: 'Suresh Deshmukh',
    email: 'processing@sataraorganic.com',
    role: 'processor',
    phone: '+91 97654 33210',
    address: 'Plot 42, MIDC Industrial Area, Satara, Maharashtra',
    organization: 'Satara Natural Cold-Extraction Facility',
    createdAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'USR-DISTRIBUTOR-01',
    name: 'Pooja Varma',
    email: 'logistics@coldchainorganics.com',
    role: 'distributor',
    phone: '+91 99887 76655',
    address: 'Central Logistics Hub, Wagholi, Pune, Maharashtra',
    organization: 'AgriCold Logistics Network',
    createdAt: '2026-02-20T12:00:00Z',
  },
  {
    id: 'USR-CONSUMER-01',
    name: 'Kavita Joshi',
    email: 'kavita.joshi@gmail.com',
    role: 'consumer',
    phone: '+91 98200 12345',
    address: 'Kalyani Nagar, Pune, Maharashtra',
    createdAt: '2026-03-01T16:00:00Z',
  },
];

export const INITIAL_APIARIES: Apiary[] = [
  {
    id: 'API-001',
    name: 'Green Valley Apiary',
    beekeeperId: 'USR-BEEKEEPER-01',
    beekeeperName: 'Raj Patil',
    location: 'Medha, Satara Foothills',
    state: 'Maharashtra',
    district: 'Satara',
    latitude: 17.6805,
    longitude: 73.8167,
    hiveCount: 18,
    beeSpecies: 'Apis cerana indica (Indian Honey Bee)',
    floralSource: 'Multifloral, Wild Jamun (Syzygium cumini) & Hirda',
    establishedDate: '2022-04-10',
    altitudeMeters: 740,
    organicCertified: true,
  },
  {
    id: 'API-002',
    name: 'Himalayan Pure Apiary',
    beekeeperId: 'USR-BEEKEEPER-02',
    beekeeperName: 'Anita Sharma',
    location: 'Kotkhai Valley, Shimla',
    state: 'Himachal Pradesh',
    district: 'Shimla',
    latitude: 31.1144,
    longitude: 77.5312,
    hiveCount: 24,
    beeSpecies: 'Apis mellifera (Western Honey Bee)',
    floralSource: 'White Acacia (Robinia pseudoacacia) & Wild Apple Blossom',
    establishedDate: '2021-06-18',
    altitudeMeters: 1850,
    organicCertified: true,
  },
  {
    id: 'API-003',
    name: 'Western Ghats Flora Reserve',
    beekeeperId: 'USR-BEEKEEPER-01',
    beekeeperName: 'Raj Patil',
    location: 'Mahabaleshwar Forest Boundary',
    state: 'Maharashtra',
    district: 'Satara',
    latitude: 17.9237,
    longitude: 73.6586,
    hiveCount: 12,
    beeSpecies: 'Apis cerana indica',
    floralSource: 'Wild Karvi (Strobilanthes callosa) & Forest Herbs',
    establishedDate: '2023-01-15',
    altitudeMeters: 1200,
    organicCertified: true,
  },
];

export const INITIAL_HIVES: Hive[] = [
  {
    id: 'HIVE-101',
    hiveCode: 'H-101',
    apiaryId: 'API-001',
    apiaryName: 'Green Valley Apiary',
    hiveType: 'Langstroth',
    beeColony: 'Colony A-Alpha',
    queenStatus: 'Healthy Laying',
    queenAgeMonths: 8,
    installationDate: '2024-03-10',
    status: 'active',
    lastInspectionDate: '2026-09-28',
    honeySuperFrames: 10,
    latestSensorReading: {
      id: 'SNS-101-LATEST',
      hiveId: 'HIVE-101',
      timestamp: '2026-10-01T07:15:00Z',
      ambientTempC: 28.2,
      internalTempC: 34.8,
      humidityPercent: 58.4,
      weightKg: 46.8,
      batteryLevelPercent: 92,
      audioFrequencyHz: 185,
      activityLevel: 'normal',
    },
  },
  {
    id: 'HIVE-102',
    hiveCode: 'H-102',
    apiaryId: 'API-001',
    apiaryName: 'Green Valley Apiary',
    hiveType: 'Langstroth',
    beeColony: 'Colony A-Beta',
    queenStatus: 'Healthy Laying',
    queenAgeMonths: 5,
    installationDate: '2024-05-12',
    status: 'active',
    lastInspectionDate: '2026-09-29',
    honeySuperFrames: 10,
    latestSensorReading: {
      id: 'SNS-102-LATEST',
      hiveId: 'HIVE-102',
      timestamp: '2026-10-01T07:15:00Z',
      ambientTempC: 28.1,
      internalTempC: 37.4, // Slightly high temperature triggers IoT warning demo
      humidityPercent: 54.1,
      weightKg: 42.1,
      batteryLevelPercent: 88,
      audioFrequencyHz: 210,
      activityLevel: 'high',
    },
  },
  {
    id: 'HIVE-103',
    hiveCode: 'H-103',
    apiaryId: 'API-001',
    apiaryName: 'Green Valley Apiary',
    hiveType: 'Top-Bar',
    beeColony: 'Colony A-Gamma',
    queenStatus: 'Healthy Laying',
    queenAgeMonths: 11,
    installationDate: '2024-01-20',
    status: 'active',
    lastInspectionDate: '2026-09-25',
    honeySuperFrames: 8,
    latestSensorReading: {
      id: 'SNS-103-LATEST',
      hiveId: 'HIVE-103',
      timestamp: '2026-10-01T07:15:00Z',
      ambientTempC: 28.0,
      internalTempC: 34.6,
      humidityPercent: 61.2,
      weightKg: 38.5,
      batteryLevelPercent: 74,
      audioFrequencyHz: 190,
      activityLevel: 'normal',
    },
  },
  {
    id: 'HIVE-201',
    hiveCode: 'H-201',
    apiaryId: 'API-002',
    apiaryName: 'Himalayan Pure Apiary',
    hiveType: 'Langstroth',
    beeColony: 'Colony HP-01',
    queenStatus: 'Healthy Laying',
    queenAgeMonths: 7,
    installationDate: '2024-04-05',
    status: 'active',
    lastInspectionDate: '2026-09-20',
    honeySuperFrames: 10,
    latestSensorReading: {
      id: 'SNS-201-LATEST',
      hiveId: 'HIVE-201',
      timestamp: '2026-10-01T07:15:00Z',
      ambientTempC: 19.5,
      internalTempC: 35.1,
      humidityPercent: 59.0,
      weightKg: 51.2,
      batteryLevelPercent: 95,
      audioFrequencyHz: 180,
      activityLevel: 'normal',
    },
  },
  {
    id: 'HIVE-301',
    hiveCode: 'H-301',
    apiaryId: 'API-003',
    apiaryName: 'Western Ghats Flora Reserve',
    hiveType: 'Langstroth',
    beeColony: 'Colony WG-01',
    queenStatus: 'Healthy Laying',
    queenAgeMonths: 4,
    installationDate: '2025-01-10',
    status: 'active',
    lastInspectionDate: '2026-09-27',
    honeySuperFrames: 10,
    latestSensorReading: {
      id: 'SNS-301-LATEST',
      hiveId: 'HIVE-301',
      timestamp: '2026-10-01T07:15:00Z',
      ambientTempC: 26.5,
      internalTempC: 34.9,
      humidityPercent: 68.0,
      weightKg: 44.0,
      batteryLevelPercent: 82,
      audioFrequencyHz: 175,
      activityLevel: 'normal',
    },
  },
];

export const INITIAL_THRESHOLDS: SensorThresholds = {
  minInternalTempC: 32.0,
  maxInternalTempC: 36.5,
  minHumidityPercent: 45.0,
  maxHumidityPercent: 75.0,
  minWeightKg: 20.0,
  weightDropAlertKg: 4.0,
  lowBatteryPercent: 20,
};

// Realistic batches representing complete lifecycle
export const INITIAL_BATCHES: HoneyBatch[] = [
  {
    id: 'HC-2026-00001',
    hiveId: 'HIVE-101',
    hiveCode: 'H-101',
    apiaryId: 'API-001',
    apiaryName: 'Green Valley Apiary',
    beekeeperId: 'USR-BEEKEEPER-01',
    beekeeperName: 'Raj Patil',
    location: 'Medha, Satara, Maharashtra',
    honeyType: 'Raw Multifloral Honey',
    floralSource: 'Wild Jamun (Syzygium cumini) & Forest Meadow Flora',
    harvestDate: '2026-09-15',
    quantityKg: 25.0,
    harvestNotes: 'First spring-autumn harvest. High capped comb ratio (>95%). Clean amber hue with floral aroma.',
    status: 'DELIVERED',
    qualityStatus: 'Approved',
    processingStatus: 'Completed',
    packagingStatus: 'Completed',
    distributionStatus: 'Delivered',
    qrCodeUrl: '/verify/HC-2026-00001',
    currentBlockHash: '00a4d1f2b6e890c3741528639201bcde88f01a392817456bc91234ef09876543',
    lastUpdated: '2026-09-24T15:30:00Z',
  },
  {
    id: 'HC-2026-00002',
    hiveId: 'HIVE-201',
    hiveCode: 'H-201',
    apiaryId: 'API-002',
    apiaryName: 'Himalayan Pure Apiary',
    beekeeperId: 'USR-BEEKEEPER-02',
    beekeeperName: 'Anita Sharma',
    location: 'Kotkhai Valley, Shimla, Himachal Pradesh',
    honeyType: 'Pure Himalayan White Acacia Honey',
    floralSource: 'Robinia pseudoacacia (Himalayan White Acacia)',
    harvestDate: '2026-09-22',
    quantityKg: 40.0,
    harvestNotes: 'Cold mountain elevation harvest. Crystallization-resistant high fructose natural ratio.',
    status: 'DISTRIBUTED',
    qualityStatus: 'Approved',
    processingStatus: 'Completed',
    packagingStatus: 'Completed',
    distributionStatus: 'In Transit',
    qrCodeUrl: '/verify/HC-2026-00002',
    currentBlockHash: '00f8901234abcd5678ef90123456789abcdef0123456789abcdef0123456789a',
    lastUpdated: '2026-09-28T11:00:00Z',
  },
  {
    id: 'HC-2026-00003',
    hiveId: 'HIVE-103',
    hiveCode: 'H-103',
    apiaryId: 'API-001',
    apiaryName: 'Green Valley Apiary',
    beekeeperId: 'USR-BEEKEEPER-01',
    beekeeperName: 'Raj Patil',
    location: 'Medha, Satara, Maharashtra',
    honeyType: 'Single-Origin Jamun Blossom Honey',
    floralSource: 'Syzygium cumini (Indian Blackberry / Jamun)',
    harvestDate: '2026-09-27',
    quantityKg: 30.0,
    harvestNotes: 'Distinctive dark amber tone with therapeutic low-glycemic profile.',
    status: 'PACKAGED',
    qualityStatus: 'Approved',
    processingStatus: 'Completed',
    packagingStatus: 'Completed',
    distributionStatus: 'Prepared',
    qrCodeUrl: '/verify/HC-2026-00003',
    currentBlockHash: '00b1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    lastUpdated: '2026-09-30T14:20:00Z',
  },
  {
    id: 'HC-2026-00004',
    hiveId: 'HIVE-301',
    hiveCode: 'H-301',
    apiaryId: 'API-003',
    apiaryName: 'Western Ghats Flora Reserve',
    beekeeperId: 'USR-BEEKEEPER-01',
    beekeeperName: 'Raj Patil',
    location: 'Mahabaleshwar Forest Boundary, Satara',
    honeyType: 'Wild Karvi Forest Honey',
    floralSource: 'Strobilanthes callosa & Mountain Wildflowers',
    harvestDate: '2026-09-29',
    quantityKg: 32.5,
    harvestNotes: 'Rare medicinal forest blossom harvest. Sealed frames harvested under pristine conditions.',
    status: 'QUALITY_CHECK',
    qualityStatus: 'Pending',
    processingStatus: 'Not Started',
    packagingStatus: 'Not Started',
    distributionStatus: 'Pending',
    qrCodeUrl: '/verify/HC-2026-00004',
    currentBlockHash: '00d4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    lastUpdated: '2026-09-30T09:15:00Z',
  },
  {
    id: 'HC-2026-00005',
    hiveId: 'HIVE-102',
    hiveCode: 'H-102',
    apiaryId: 'API-001',
    apiaryName: 'Green Valley Apiary',
    beekeeperId: 'USR-BEEKEEPER-01',
    beekeeperName: 'Raj Patil',
    location: 'Medha, Satara, Maharashtra',
    honeyType: 'Wild Flora & Mustard Honey',
    floralSource: 'Brassica juncea & Wild Sunflower',
    harvestDate: '2026-10-01',
    quantityKg: 22.0,
    harvestNotes: 'Fresh morning harvest. High active pollen count.',
    status: 'HARVESTED',
    qualityStatus: 'Pending',
    processingStatus: 'Not Started',
    packagingStatus: 'Not Started',
    distributionStatus: 'Pending',
    qrCodeUrl: '/verify/HC-2026-00005',
    currentBlockHash: '00c9876543210fedcba9876543210fedcba9876543210fedcba9876543210fed',
    lastUpdated: '2026-10-01T08:00:00Z',
  },
];

export const INITIAL_QUALITY_RECORDS: QualityInspection[] = [
  {
    id: 'QC-2026-001',
    batchId: 'HC-2026-00001',
    inspectorId: 'USR-INSPECTOR-01',
    inspectorName: 'Dr. Sunita Kulkarni',
    inspectionDate: '2026-09-17T11:30:00Z',
    moistureContentPercent: 17.8, // Standard < 20%
    phLevel: 3.92, // Standard 3.4 - 6.1
    colorPfund: '34mm (Extra Light Amber)',
    aromaProfile: 'Rich floral bouquet, caramel hints, zero off-odors',
    purityPercentage: 99.4,
    hmfValueMgKg: 12.4, // Standard < 40 mg/kg
    adulterationTest: 'Negative (C3/C4 Sugar Negative)',
    microbialTest: 'Passed (Zero Pathogens)',
    diastaseActivity: 14.6, // Standard > 8
    overallResult: 'Approved',
    remarks: 'Complies with all FSSAI and Codex Alimentarius raw honey standards. Authentic unadulterated batch.',
    certificateNumber: 'FSSAI-HONEY-CERT-2026-8812',
    testReportFile: 'QC_Report_HC-2026-00001.pdf',
    blockchainTxId: 'TX-QC-00001',
    blockchainHash: 'a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7',
  },
  {
    id: 'QC-2026-002',
    batchId: 'HC-2026-00002',
    inspectorId: 'USR-INSPECTOR-01',
    inspectorName: 'Dr. Sunita Kulkarni',
    inspectionDate: '2026-09-24T14:00:00Z',
    moistureContentPercent: 16.5,
    phLevel: 4.1,
    colorPfund: '14mm (Water White / Extra White)',
    aromaProfile: 'Delicate vanilla and white acacia blossoms',
    purityPercentage: 99.8,
    hmfValueMgKg: 8.6,
    adulterationTest: 'Negative (C3/C4 Sugar Negative)',
    microbialTest: 'Passed (Zero Pathogens)',
    diastaseActivity: 16.2,
    overallResult: 'Approved',
    remarks: 'Premium Grade A mountain honey. Outstanding enzymatic activity and low moisture.',
    certificateNumber: 'FSSAI-HONEY-CERT-2026-8835',
    testReportFile: 'QC_Report_HC-2026-00002.pdf',
    blockchainTxId: 'TX-QC-00002',
    blockchainHash: 'b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8',
  },
  {
    id: 'QC-2026-003',
    batchId: 'HC-2026-00003',
    inspectorId: 'USR-INSPECTOR-01',
    inspectorName: 'Dr. Sunita Kulkarni',
    inspectionDate: '2026-09-29T10:15:00Z',
    moistureContentPercent: 18.2,
    phLevel: 3.85,
    colorPfund: '65mm (Light Amber to Amber)',
    aromaProfile: 'Deep woody Jamun floral fragrance with astringent notes',
    purityPercentage: 99.2,
    hmfValueMgKg: 14.8,
    adulterationTest: 'Negative (C3/C4 Sugar Negative)',
    microbialTest: 'Passed (Zero Pathogens)',
    diastaseActivity: 12.8,
    overallResult: 'Approved',
    remarks: 'Approved single floral variety with verified high antioxidant profile.',
    certificateNumber: 'FSSAI-HONEY-CERT-2026-8860',
    testReportFile: 'QC_Report_HC-2026-00003.pdf',
    blockchainTxId: 'TX-QC-00003',
    blockchainHash: 'c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9',
  },
];

export const INITIAL_PROCESSING_RECORDS: ProcessingRecord[] = [
  {
    id: 'PROC-2026-001',
    batchId: 'HC-2026-00001',
    operatorId: 'USR-PROCESSOR-01',
    operatorName: 'Suresh Deshmukh',
    processingDate: '2026-09-18T09:00:00Z',
    processingUnit: 'Satara Cold-Extract Unit #1',
    filtrationMethod: 'Mechanical multi-stage mesh filtration (200 micron, unpasteurized raw)',
    heatingTemperatureC: 35.0, // Retains live enzymes & pollen
    processingDurationHours: 4.5,
    storageCondition: 'Airtight food-grade stainless steel settling tank #S-04 at 19°C',
    notes: 'No ultrafiltration or pasteurization. Natural beneficial enzymes, propolis, and royal jelly traces preserved.',
    blockchainTxId: 'TX-PROC-00001',
    blockchainHash: 'd1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0',
  },
  {
    id: 'PROC-2026-002',
    batchId: 'HC-2026-00002',
    operatorId: 'USR-PROCESSOR-01',
    operatorName: 'Suresh Deshmukh',
    processingDate: '2026-09-25T10:30:00Z',
    processingUnit: 'Himalayan Cold-Extract Unit #2',
    filtrationMethod: 'Gentle gravity separation & 300 micron natural linen filter',
    heatingTemperatureC: 34.0,
    processingDurationHours: 5.0,
    storageCondition: 'Insulated vacuum tank #H-01 at 16°C',
    notes: 'Zero artificial warming. Crystal clear natural liquid honey.',
    blockchainTxId: 'TX-PROC-00002',
    blockchainHash: 'e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
  },
  {
    id: 'PROC-2026-003',
    batchId: 'HC-2026-00003',
    operatorId: 'USR-PROCESSOR-01',
    operatorName: 'Suresh Deshmukh',
    processingDate: '2026-09-29T16:00:00Z',
    processingUnit: 'Satara Cold-Extract Unit #1',
    filtrationMethod: 'Coarse stainless steel mechanical strainers',
    heatingTemperatureC: 36.0,
    processingDurationHours: 4.0,
    storageCondition: 'Stainless steel tank #S-02 at 20°C',
    notes: 'Preserves bioactive polyphenols and dark natural pigmentation.',
    blockchainTxId: 'TX-PROC-00003',
    blockchainHash: 'f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2',
  },
];

export const INITIAL_PACKAGING_RECORDS: PackagingRecord[] = [
  {
    id: 'PKG-2026-001',
    batchId: 'HC-2026-00001',
    operatorId: 'USR-PROCESSOR-01',
    operatorName: 'Suresh Deshmukh',
    packagingDate: '2026-09-19T14:00:00Z',
    facilityName: 'Certified Organic Packaging Unit MIDC Satara',
    packageSize: '500g Hexagonal Glass Jar (Hermetic Gold Lid)',
    unitCount: 50,
    expiryDate: '2028-09-18',
    productLabelId: 'SKU-HC-RAW-500G-001',
    qrVerificationUrl: '/verify/HC-2026-00001',
    blockchainTxId: 'TX-PKG-00001',
    blockchainHash: '01a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
  },
  {
    id: 'PKG-2026-002',
    batchId: 'HC-2026-00002',
    operatorId: 'USR-PROCESSOR-01',
    operatorName: 'Suresh Deshmukh',
    packagingDate: '2026-09-26T11:00:00Z',
    facilityName: 'Mountain Gold Bottling Unit Shimla',
    packageSize: '1kg Premium Hexagonal Jar',
    unitCount: 40,
    expiryDate: '2028-09-25',
    productLabelId: 'SKU-HC-ACACIA-1KG-002',
    qrVerificationUrl: '/verify/HC-2026-00002',
    blockchainTxId: 'TX-PKG-00002',
    blockchainHash: '12a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3',
  },
  {
    id: 'PKG-2026-003',
    batchId: 'HC-2026-00003',
    operatorId: 'USR-PROCESSOR-01',
    operatorName: 'Suresh Deshmukh',
    packagingDate: '2026-09-30T11:30:00Z',
    facilityName: 'Certified Organic Packaging Unit MIDC Satara',
    packageSize: '500g Glass Jar',
    unitCount: 60,
    expiryDate: '2028-09-29',
    productLabelId: 'SKU-HC-JAMUN-500G-003',
    qrVerificationUrl: '/verify/HC-2026-00003',
    blockchainTxId: 'TX-PKG-00003',
    blockchainHash: '23a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4',
  },
];

export const INITIAL_SHIPMENTS: ShipmentRecord[] = [
  {
    id: 'SHP-2026-001',
    batchId: 'HC-2026-00001',
    distributorId: 'USR-DISTRIBUTOR-01',
    distributorName: 'Pooja Varma (AgriCold Logistics)',
    shipmentId: 'WAYBILL-AC-789012',
    sourceLocation: 'MIDC Satara Packaging Warehouse',
    destination: 'Nature Basket Organic Retail Store, Kalyani Nagar, Pune',
    transportMethod: 'Temperature Controlled Eco-Van (Maintained 18-22°C)',
    dispatchDate: '2026-09-20T08:30:00Z',
    expectedDelivery: '2026-09-20T17:00:00Z',
    actualDelivery: '2026-09-20T16:15:00Z',
    status: 'Delivered',
    currentLocation: 'Store Shelf / Consumer Dispatch',
    temperatureMaintainedC: 20.4,
    trackingNotes: 'Direct store delivery accepted and signed by store inventory manager.',
    blockchainTxId: 'TX-SHP-00001',
    blockchainHash: '34a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
  },
  {
    id: 'SHP-2026-002',
    batchId: 'HC-2026-00002',
    distributorId: 'USR-DISTRIBUTOR-01',
    distributorName: 'Pooja Varma (AgriCold Logistics)',
    shipmentId: 'WAYBILL-AC-789045',
    sourceLocation: 'Shimla Regional Hub',
    destination: 'Delhi NCR Gourmet Distribution Center, Gurugram',
    transportMethod: 'Refrigerated Express Transit',
    dispatchDate: '2026-09-27T06:00:00Z',
    expectedDelivery: '2026-10-02T18:00:00Z',
    status: 'In Transit',
    currentLocation: 'Transit Highway Hub, Ambala Junction',
    temperatureMaintainedC: 18.2,
    trackingNotes: 'Vehicle GPS and internal container logger normal.',
    blockchainTxId: 'TX-SHP-00002',
    blockchainHash: '45a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
  },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-101',
    type: 'HIGH_TEMP',
    severity: 'warning',
    hiveId: 'HIVE-102',
    message: 'Hive H-102 internal temperature reached 37.4°C (above 36.5°C threshold). Potential solar heat stress.',
    timestamp: '2026-10-01T06:45:00Z',
    status: 'active',
  },
  {
    id: 'ALT-102',
    type: 'SUDDEN_WEIGHT_DROP',
    severity: 'info',
    hiveId: 'HIVE-101',
    message: 'Hive H-101 recorded weight reduction of 25.0 kg following scheduled harvest.',
    timestamp: '2026-09-15T11:00:00Z',
    status: 'resolved',
    actionTaken: 'Verified expected weight change from harvest of Batch HC-2026-00001.',
  },
  {
    id: 'ALT-103',
    type: 'LOW_BATTERY',
    severity: 'info',
    hiveId: 'HIVE-103',
    message: 'Hive H-103 IoT sensor telemetry solar battery level at 74%. Still within normal bounds.',
    timestamp: '2026-09-30T18:20:00Z',
    status: 'active',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-09-15T10:00:00Z',
    user: 'Raj Patil',
    role: 'beekeeper',
    action: 'HARVEST_BATCH_CREATED',
    entity: 'HoneyBatch',
    entityId: 'HC-2026-00001',
    ipAddress: '157.34.120.45',
    txHash: '00a4d1f2b6e890c3741528639201bcde88f01a392817456bc91234ef09876543',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-09-17T11:30:00Z',
    user: 'Dr. Sunita Kulkarni',
    role: 'inspector',
    action: 'QUALITY_CERTIFICATE_ISSUED',
    entity: 'QualityInspection',
    entityId: 'QC-2026-001',
    ipAddress: '115.111.45.89',
    txHash: 'a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-09-18T09:00:00Z',
    user: 'Suresh Deshmukh',
    role: 'processor',
    action: 'COLD_EXTRACTION_RECORDED',
    entity: 'ProcessingRecord',
    entityId: 'PROC-2026-001',
    ipAddress: '49.36.18.22',
    txHash: 'd1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0',
  },
  {
    id: 'LOG-004',
    timestamp: '2026-09-19T14:00:00Z',
    user: 'Suresh Deshmukh',
    role: 'processor',
    action: 'PACKAGING_AND_QR_GENERATED',
    entity: 'PackagingRecord',
    entityId: 'PKG-2026-001',
    ipAddress: '49.36.18.22',
    txHash: '01a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
  },
  {
    id: 'LOG-005',
    timestamp: '2026-09-20T08:30:00Z',
    user: 'Pooja Varma',
    role: 'distributor',
    action: 'SHIPMENT_DISPATCHED',
    entity: 'ShipmentRecord',
    entityId: 'SHP-2026-001',
    ipAddress: '103.24.88.19',
    txHash: '34a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
  },
];

// Helper to construct initial cryptographic chain
function buildInitialBlockchain(): BlockchainBlock[] {
  const blocks: BlockchainBlock[] = [];

  // Block 0: Genesis Block
  const genesisTx: BlockchainTransaction = {
    txId: 'GENESIS-TX-000',
    batchId: 'SYSTEM-GENESIS',
    action: 'HARVEST_RECORDED',
    actorRole: 'admin',
    actorName: 'Honey Chain System Protocol',
    timestamp: '2026-01-01T00:00:00Z',
    payloadSummary: 'Genesis Block initialized for Honey Chain Traceability Protocol.',
    data: { protocol: 'HoneyChain-v1.0', network: 'Academic-Consensus-Ledger' },
    txHash: syncSha256('HoneyChain Genesis Block Initialization'),
  };
  const genesisMerkle = calculateMerkleRoot([genesisTx]);
  const genesisHash = calculateBlockHash(
    0,
    '0000000000000000000000000000000000000000000000000000000000000000',
    '2026-01-01T00:00:00Z',
    genesisMerkle,
    1482
  );
  blocks.push({
    blockIndex: 0,
    timestamp: '2026-01-01T00:00:00Z',
    transactions: [genesisTx],
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: genesisHash,
    nonce: 1482,
    merkleRoot: genesisMerkle,
    isGenesis: true,
  });

  // Block 1: Batch HC-2026-00001 Harvest
  const b1Tx: BlockchainTransaction = {
    txId: 'TX-HARVEST-00001',
    batchId: 'HC-2026-00001',
    action: 'HARVEST_RECORDED',
    actorRole: 'beekeeper',
    actorName: 'Raj Patil',
    timestamp: '2026-09-15T09:30:00Z',
    payloadSummary: 'Harvested 25.0 kg Raw Multifloral Honey from Hive H-101, Green Valley Apiary, Satara.',
    data: { hiveCode: 'H-101', quantityKg: 25.0, honeyType: 'Raw Multifloral Honey' },
    txHash: syncSha256('TX-HARVEST-00001-HC-2026-00001-25.0kg'),
  };
  blocks.push(mineBlock(1, blocks[0].currentHash, [b1Tx], '00'));

  // Block 2: Quality Inspection Approved
  const b2Tx: BlockchainTransaction = {
    txId: 'TX-QC-00001',
    batchId: 'HC-2026-00001',
    action: 'QUALITY_APPROVED',
    actorRole: 'inspector',
    actorName: 'Dr. Sunita Kulkarni',
    timestamp: '2026-09-17T11:30:00Z',
    payloadSummary: 'Quality Inspection Approved. Moisture 17.8%, Purity 99.4%, HMF 12.4 mg/kg. Cert #FSSAI-HONEY-CERT-2026-8812.',
    data: { moisture: 17.8, purity: 99.4, cert: 'FSSAI-HONEY-CERT-2026-8812' },
    txHash: syncSha256('TX-QC-00001-APPROVED-FSSAI-CERT'),
  };
  blocks.push(mineBlock(2, blocks[1].currentHash, [b2Tx], '00'));

  // Block 3: Processing & Cold Extraction
  const b3Tx: BlockchainTransaction = {
    txId: 'TX-PROC-00001',
    batchId: 'HC-2026-00001',
    action: 'PROCESSING_COMPLETED',
    actorRole: 'processor',
    actorName: 'Suresh Deshmukh',
    timestamp: '2026-09-18T09:00:00Z',
    payloadSummary: 'Cold-extraction and micro-filtration (35°C max, unpasteurized) completed.',
    data: { tempC: 35.0, durationHours: 4.5, unit: 'Satara Cold-Extract Unit #1' },
    txHash: syncSha256('TX-PROC-00001-COLD-EXTRACTION'),
  };
  blocks.push(mineBlock(3, blocks[2].currentHash, [b3Tx], '00'));

  // Block 4: Packaging & QR Generation
  const b4Tx: BlockchainTransaction = {
    txId: 'TX-PKG-00001',
    batchId: 'HC-2026-00001',
    action: 'PACKAGING_COMPLETED',
    actorRole: 'processor',
    actorName: 'Suresh Deshmukh',
    timestamp: '2026-09-19T14:00:00Z',
    payloadSummary: 'Bottled into 50 x 500g Hexagonal Glass Jars. Public QR Code generated.',
    data: { unitCount: 50, packageSize: '500g Hexagonal Glass Jar', sku: 'SKU-HC-RAW-500G-001' },
    txHash: syncSha256('TX-PKG-00001-50-UNITS-500G'),
  };
  blocks.push(mineBlock(4, blocks[3].currentHash, [b4Tx], '00'));

  // Block 5: Logistics & Delivery
  const b5Tx1: BlockchainTransaction = {
    txId: 'TX-SHP-DISPATCH-00001',
    batchId: 'HC-2026-00001',
    action: 'SHIPMENT_DISPATCHED',
    actorRole: 'distributor',
    actorName: 'Pooja Varma',
    timestamp: '2026-09-20T08:30:00Z',
    payloadSummary: 'Dispatched via Temperature-Controlled Van to Pune Retail Hub.',
    data: { waybill: 'WAYBILL-AC-789012', vehicle: 'Eco-Van MH-12-QC-5544' },
    txHash: syncSha256('TX-SHP-DISPATCH-00001-WAYBILL'),
  };
  const b5Tx2: BlockchainTransaction = {
    txId: 'TX-SHP-DELIVERY-00001',
    batchId: 'HC-2026-00001',
    action: 'SHIPMENT_DELIVERED',
    actorRole: 'distributor',
    actorName: 'Pooja Varma',
    timestamp: '2026-09-20T16:15:00Z',
    payloadSummary: 'Consignment successfully delivered to Organic Retail Store, Kalyani Nagar, Pune.',
    data: { status: 'Delivered', recipient: 'Nature Basket' },
    txHash: syncSha256('TX-SHP-DELIVERY-00001-CONFIRMED'),
  };
  blocks.push(mineBlock(5, blocks[4].currentHash, [b5Tx1, b5Tx2], '00'));

  // Block 6: Batch HC-2026-00002 Harvest & Quality
  const b6Tx: BlockchainTransaction = {
    txId: 'TX-HARVEST-00002',
    batchId: 'HC-2026-00002',
    action: 'HARVEST_RECORDED',
    actorRole: 'beekeeper',
    actorName: 'Anita Sharma',
    timestamp: '2026-09-22T08:00:00Z',
    payloadSummary: 'Harvested 40.0 kg Pure Himalayan White Acacia Honey from Hive H-201, Kotkhai Valley, Shimla.',
    data: { hiveCode: 'H-201', quantityKg: 40.0, honeyType: 'Pure Himalayan White Acacia Honey' },
    txHash: syncSha256('TX-HARVEST-00002-HC-2026-00002-40.0kg'),
  };
  blocks.push(mineBlock(6, blocks[5].currentHash, [b6Tx], '00'));

  return blocks;
}

// Generate QR Code data URL helper
export async function createBatchQRCodeDataUrl(batchId: string): Promise<string> {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://honeychain.io';
    const verifyUrl = `${origin}/verify/${batchId}`;
    return await QRCode.toDataURL(verifyUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

class HoneyChainDataStore {
  private users: User[] = DEMO_USERS;
  private currentUser: User = DEMO_USERS[0]; // Dr. Vikramaditya Rao (Admin default, switchable easily)
  private apiaries: Apiary[] = INITIAL_APIARIES;
  private hives: Hive[] = INITIAL_HIVES;
  private thresholds: SensorThresholds = INITIAL_THRESHOLDS;
  private batches: HoneyBatch[] = INITIAL_BATCHES;
  private qualityRecords: QualityInspection[] = INITIAL_QUALITY_RECORDS;
  private processingRecords: ProcessingRecord[] = INITIAL_PROCESSING_RECORDS;
  private packagingRecords: PackagingRecord[] = INITIAL_PACKAGING_RECORDS;
  private shipments: ShipmentRecord[] = INITIAL_SHIPMENTS;
  private alerts: Alert[] = INITIAL_ALERTS;
  private auditLogs: AuditLog[] = INITIAL_AUDIT_LOGS;
  private blockchain: BlockchainBlock[] = buildInitialBlockchain();
  private subscribers: Array<() => void> = [];
  private isTamperedForDemo = false;
  private tamperedBlockCopy?: BlockchainBlock;

  constructor() {
    this.loadFromStorage();
    this.initQRCodes();
    // Auto sync latest block hashes to batches
    this.syncBatchBlockHashes();
  }

  private loadFromStorage() {
    if (localDataService.hasStoredData()) {
      this.users = localDataService.getData('users', DEMO_USERS);
      this.currentUser = localDataService.getData('currentUser', DEMO_USERS[0]);
      this.apiaries = localDataService.getData('apiaries', INITIAL_APIARIES);
      this.hives = localDataService.getData('hives', INITIAL_HIVES);
      this.thresholds = localDataService.getData('sensorThresholds', INITIAL_THRESHOLDS);
      this.batches = localDataService.getData('honeyBatches', INITIAL_BATCHES);
      this.qualityRecords = localDataService.getData('qualityRecords', INITIAL_QUALITY_RECORDS);
      this.processingRecords = localDataService.getData('processingRecords', INITIAL_PROCESSING_RECORDS);
      this.packagingRecords = localDataService.getData('packagingRecords', INITIAL_PACKAGING_RECORDS);
      this.shipments = localDataService.getData('shipments', INITIAL_SHIPMENTS);
      this.alerts = localDataService.getData('alerts', INITIAL_ALERTS);
      this.auditLogs = localDataService.getData('auditLogs', INITIAL_AUDIT_LOGS);
      this.blockchain = localDataService.getData('blockchainRecords', buildInitialBlockchain());
    } else {
      this.saveAllToStorage();
    }
  }

  public saveAllToStorage() {
    localDataService.saveData('users', this.users);
    localDataService.saveData('currentUser', this.currentUser);
    localDataService.saveData('apiaries', this.apiaries);
    localDataService.saveData('hives', this.hives);
    localDataService.saveData('sensorThresholds', this.thresholds);
    localDataService.saveData('honeyBatches', this.batches);
    localDataService.saveData('qualityRecords', this.qualityRecords);
    localDataService.saveData('processingRecords', this.processingRecords);
    localDataService.saveData('packagingRecords', this.packagingRecords);
    localDataService.saveData('shipments', this.shipments);
    localDataService.saveData('alerts', this.alerts);
    localDataService.saveData('auditLogs', this.auditLogs);
    localDataService.saveData('blockchainRecords', this.blockchain);
  }

  public resetToFactoryData(): void {
    localDataService.clearAll();
    this.users = JSON.parse(JSON.stringify(DEMO_USERS));
    this.currentUser = JSON.parse(JSON.stringify(DEMO_USERS[0]));
    this.apiaries = JSON.parse(JSON.stringify(INITIAL_APIARIES));
    this.hives = JSON.parse(JSON.stringify(INITIAL_HIVES));
    this.thresholds = JSON.parse(JSON.stringify(INITIAL_THRESHOLDS));
    this.batches = JSON.parse(JSON.stringify(INITIAL_BATCHES));
    this.qualityRecords = JSON.parse(JSON.stringify(INITIAL_QUALITY_RECORDS));
    this.processingRecords = JSON.parse(JSON.stringify(INITIAL_PROCESSING_RECORDS));
    this.packagingRecords = JSON.parse(JSON.stringify(INITIAL_PACKAGING_RECORDS));
    this.shipments = JSON.parse(JSON.stringify(INITIAL_SHIPMENTS));
    this.alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.blockchain = buildInitialBlockchain();
    this.isTamperedForDemo = false;
    this.tamperedBlockCopy = undefined;
    this.saveAllToStorage();
    this.initQRCodes();
    this.syncBatchBlockHashes();
    this.notify();
  }

  private saveKey(key: StorageKey) {
    switch (key) {
      case 'users': localDataService.saveData('users', this.users); break;
      case 'currentUser': localDataService.saveData('currentUser', this.currentUser); break;
      case 'apiaries': localDataService.saveData('apiaries', this.apiaries); break;
      case 'hives': localDataService.saveData('hives', this.hives); break;
      case 'sensorThresholds': localDataService.saveData('sensorThresholds', this.thresholds); break;
      case 'honeyBatches': localDataService.saveData('honeyBatches', this.batches); break;
      case 'qualityRecords': localDataService.saveData('qualityRecords', this.qualityRecords); break;
      case 'processingRecords': localDataService.saveData('processingRecords', this.processingRecords); break;
      case 'packagingRecords': localDataService.saveData('packagingRecords', this.packagingRecords); break;
      case 'shipments': localDataService.saveData('shipments', this.shipments); break;
      case 'alerts': localDataService.saveData('alerts', this.alerts); break;
      case 'auditLogs': localDataService.saveData('auditLogs', this.auditLogs); break;
      case 'blockchainRecords': localDataService.saveData('blockchainRecords', this.blockchain); break;
    }
  }

  private async initQRCodes() {
    for (const b of this.batches) {
      if (!b.qrCodeUrl || b.qrCodeUrl.startsWith('/verify')) {
        const dataUrl = await createBatchQRCodeDataUrl(b.id);
        b.qrCodeUrl = dataUrl;
      }
    }
    this.notify();
  }

  private syncBatchBlockHashes() {
    for (const batch of this.batches) {
      for (let i = this.blockchain.length - 1; i >= 0; i--) {
        const blk = this.blockchain[i];
        const match = blk.transactions.some((tx) => tx.batchId === batch.id);
        if (match) {
          batch.currentBlockHash = blk.currentHash;
          break;
        }
      }
    }
  }

  public subscribe(cb: () => void) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  }

  private notify() {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // State Getters
  public getUsers() { return this.users; }
  public getCurrentUser() { return this.currentUser; }
  public getApiaries() { return this.apiaries; }
  public getHives() { return this.hives; }
  public getSensorThresholds() { return this.thresholds; }
  public getBatches() { return this.batches; }
  public getQualityRecords() { return this.qualityRecords; }
  public getProcessingRecords() { return this.processingRecords; }
  public getPackagingRecords() { return this.packagingRecords; }
  public getShipments() { return this.shipments; }
  public getAlerts() { return this.alerts; }
  public getAuditLogs() { return this.auditLogs; }
  public getBlockchain() { return this.blockchain; }
  public getIsTamperedForDemo() { return this.isTamperedForDemo; }

  // User & Role Switching
  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.saveKey('currentUser');
    this.addAuditLog('USER_SESSION_SWITCH', 'User', user.id);
    this.notify();
  }

  public switchRole(role: UserRole) {
    const user = this.users.find((u) => u.role === role);
    if (user) {
      this.setCurrentUser(user);
    } else {
      // Mock switch
      this.currentUser = {
        ...this.currentUser,
        role,
      };
      this.saveKey('currentUser');
      this.notify();
    }
  }

  public registerUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: `USR-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.currentUser = newUser;
    this.saveKey('users');
    this.saveKey('currentUser');
    this.addAuditLog('USER_REGISTERED', 'User', newUser.id);
    this.notify();
    return newUser;
  }

  // Blockchain Mining & Transactions
  public appendBlockchainTransaction(txData: Omit<BlockchainTransaction, 'txId' | 'txHash' | 'timestamp'>): BlockchainBlock {
    const timestamp = new Date().toISOString();
    const txId = `TX-${Date.now().toString().slice(-8)}`;
    const txHash = syncSha256(`${txId}-${txData.batchId}-${txData.action}-${JSON.stringify(txData.data)}`);

    const fullTx: BlockchainTransaction = {
      ...txData,
      txId,
      timestamp,
      txHash,
    };

    const previousBlock = this.blockchain[this.blockchain.length - 1];
    const newBlockIndex = this.blockchain.length;
    const newBlock = mineBlock(newBlockIndex, previousBlock.currentHash, [fullTx], '00');

    this.blockchain.push(newBlock);

    // Update batch current block hash
    const targetBatch = this.batches.find((b) => b.id === txData.batchId);
    if (targetBatch) {
      targetBatch.currentBlockHash = newBlock.currentHash;
    }

    this.saveKey('blockchainRecords');
    this.saveKey('honeyBatches');
    this.notify();
    return newBlock;
  }

  // Actions
  public async recordHarvest(params: {
    hiveId: string;
    honeyType: string;
    floralSource: string;
    harvestDate: string;
    quantityKg: number;
    harvestNotes: string;
  }): Promise<HoneyBatch> {
    const hive = this.hives.find((h) => h.id === params.hiveId);
    if (!hive) throw new Error('Selected hive does not exist.');

    const apiary = this.apiaries.find((a) => a.id === hive.apiaryId);
    if (!apiary) throw new Error('Apiary not found for hive.');

    const currentYear = new Date().getFullYear();
    const batchCount = this.batches.length + 1;
    const batchId = `HC-${currentYear}-${batchCount.toString().padStart(5, '0')}`;

    // Generate QR Code data URL
    const qrCodeUrl = await createBatchQRCodeDataUrl(batchId);

    const newBatch: HoneyBatch = {
      id: batchId,
      hiveId: hive.id,
      hiveCode: hive.hiveCode,
      apiaryId: apiary.id,
      apiaryName: apiary.name,
      beekeeperId: this.currentUser.id,
      beekeeperName: this.currentUser.name,
      location: `${apiary.location}, ${apiary.state}`,
      honeyType: params.honeyType,
      floralSource: params.floralSource || apiary.floralSource,
      harvestDate: params.harvestDate,
      quantityKg: params.quantityKg,
      harvestNotes: params.harvestNotes,
      status: 'HARVESTED',
      qualityStatus: 'Pending',
      processingStatus: 'Not Started',
      packagingStatus: 'Not Started',
      distributionStatus: 'Pending',
      qrCodeUrl,
      lastUpdated: new Date().toISOString(),
    };

    this.batches.unshift(newBatch);

    // Update hive weight drop
    if (hive.latestSensorReading) {
      hive.latestSensorReading.weightKg = Math.max(15, hive.latestSensorReading.weightKg - params.quantityKg);
    }

    // Mine blockchain transaction
    const block = this.appendBlockchainTransaction({
      batchId,
      action: 'HARVEST_RECORDED',
      actorRole: this.currentUser.role,
      actorName: this.currentUser.name,
      payloadSummary: `Harvested ${params.quantityKg} kg of ${params.honeyType} from Hive ${hive.hiveCode} (${apiary.name}).`,
      data: {
        batchId,
        hiveCode: hive.hiveCode,
        quantityKg: params.quantityKg,
        harvestDate: params.harvestDate,
        honeyType: params.honeyType,
        beekeeper: this.currentUser.name,
      },
    });

    newBatch.currentBlockHash = block.currentHash;

    this.saveKey('honeyBatches');
    this.saveKey('hives');
    this.addAuditLog('HARVEST_RECORDED', 'HoneyBatch', batchId, block.transactions[0].txHash);
    this.notify();
    return newBatch;
  }

  public submitQualityInspection(params: {
    batchId: string;
    moistureContentPercent: number;
    phLevel: number;
    colorPfund: string;
    aromaProfile: string;
    purityPercentage: number;
    hmfValueMgKg: number;
    adulterationTest: 'Negative (C3/C4 Sugar Negative)' | 'Positive (Adulteration Detected)';
    microbialTest: 'Passed (Zero Pathogens)' | 'Failed';
    diastaseActivity: number;
    overallResult: 'Approved' | 'Rejected';
    remarks: string;
  }): QualityInspection {
    const batch = this.batches.find((b) => b.id === params.batchId);
    if (!batch) throw new Error('Batch not found');

    const certNumber = `FSSAI-HONEY-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const inspectionId = `QC-2026-${Date.now().toString().slice(-4)}`;

    const newRecord: QualityInspection = {
      id: inspectionId,
      inspectorId: this.currentUser.id,
      inspectorName: this.currentUser.name,
      inspectionDate: new Date().toISOString(),
      ...params,
      certificateNumber: certNumber,
      testReportFile: `QC_Report_${params.batchId}.pdf`,
    };

    this.qualityRecords.unshift(newRecord);

    // Update batch status
    if (params.overallResult === 'Approved') {
      batch.qualityStatus = 'Approved';
      batch.status = 'APPROVED';
    } else {
      batch.qualityStatus = 'Rejected';
      batch.status = 'REJECTED';
      // Trigger Alert
      this.alerts.unshift({
        id: `ALT-QC-${Date.now().toString().slice(-4)}`,
        type: 'QUALITY_REJECTED',
        severity: 'critical',
        batchId: params.batchId,
        message: `Batch ${params.batchId} failed quality standards (${params.remarks || 'Criteria not met'}).`,
        timestamp: new Date().toISOString(),
        status: 'active',
      });
    }

    batch.lastUpdated = new Date().toISOString();

    // Blockchain transaction
    const block = this.appendBlockchainTransaction({
      batchId: params.batchId,
      action: params.overallResult === 'Approved' ? 'QUALITY_APPROVED' : 'QUALITY_REJECTED',
      actorRole: this.currentUser.role,
      actorName: this.currentUser.name,
      payloadSummary: `Quality inspection ${params.overallResult}. Moisture: ${params.moistureContentPercent}%, Purity: ${params.purityPercentage}%, HMF: ${params.hmfValueMgKg} mg/kg. Cert: ${certNumber}`,
      data: {
        certificateNumber: certNumber,
        result: params.overallResult,
        moisture: params.moistureContentPercent,
        purity: params.purityPercentage,
        inspector: this.currentUser.name,
      },
    });

    newRecord.blockchainTxId = block.transactions[0].txId;
    newRecord.blockchainHash = block.transactions[0].txHash;
    batch.currentBlockHash = block.currentHash;

    this.saveKey('qualityRecords');
    this.saveKey('honeyBatches');
    this.saveKey('alerts');
    this.addAuditLog('QUALITY_INSPECTED', 'QualityInspection', inspectionId, block.transactions[0].txHash);
    this.notify();
    return newRecord;
  }

  public recordProcessing(params: {
    batchId: string;
    processingUnit: string;
    filtrationMethod: string;
    heatingTemperatureC: number;
    processingDurationHours: number;
    storageCondition: string;
    notes: string;
  }): ProcessingRecord {
    const batch = this.batches.find((b) => b.id === params.batchId);
    if (!batch) throw new Error('Batch not found');

    const procId = `PROC-2026-${Date.now().toString().slice(-4)}`;
    const newRecord: ProcessingRecord = {
      id: procId,
      operatorId: this.currentUser.id,
      operatorName: this.currentUser.name,
      processingDate: new Date().toISOString(),
      ...params,
    };

    this.processingRecords.unshift(newRecord);
    batch.processingStatus = 'Completed';
    batch.status = 'PROCESSING';
    batch.lastUpdated = new Date().toISOString();

    const block = this.appendBlockchainTransaction({
      batchId: params.batchId,
      action: 'PROCESSING_COMPLETED',
      actorRole: this.currentUser.role,
      actorName: this.currentUser.name,
      payloadSummary: `Processing at ${params.processingUnit}. Temperature: ${params.heatingTemperatureC}°C, Method: ${params.filtrationMethod}.`,
      data: { ...params, operator: this.currentUser.name },
    });

    newRecord.blockchainTxId = block.transactions[0].txId;
    newRecord.blockchainHash = block.transactions[0].txHash;
    batch.currentBlockHash = block.currentHash;

    this.saveKey('processingRecords');
    this.saveKey('honeyBatches');
    this.addAuditLog('PROCESSING_RECORDED', 'ProcessingRecord', procId, block.transactions[0].txHash);
    this.notify();
    return newRecord;
  }

  public recordPackaging(params: {
    batchId: string;
    facilityName: string;
    packageSize: string;
    unitCount: number;
    expiryDate: string;
    productLabelId: string;
  }): PackagingRecord {
    const batch = this.batches.find((b) => b.id === params.batchId);
    if (!batch) throw new Error('Batch not found');

    const pkgId = `PKG-2026-${Date.now().toString().slice(-4)}`;
    const newRecord: PackagingRecord = {
      id: pkgId,
      operatorId: this.currentUser.id,
      operatorName: this.currentUser.name,
      packagingDate: new Date().toISOString(),
      qrVerificationUrl: `/verify/${params.batchId}`,
      ...params,
    };

    this.packagingRecords.unshift(newRecord);
    batch.packagingStatus = 'Completed';
    batch.status = 'PACKAGED';
    batch.lastUpdated = new Date().toISOString();

    const block = this.appendBlockchainTransaction({
      batchId: params.batchId,
      action: 'PACKAGING_COMPLETED',
      actorRole: this.currentUser.role,
      actorName: this.currentUser.name,
      payloadSummary: `Packaged ${params.unitCount} units (${params.packageSize}) at ${params.facilityName}. Exp: ${params.expiryDate}.`,
      data: { ...params, operator: this.currentUser.name },
    });

    newRecord.blockchainTxId = block.transactions[0].txId;
    newRecord.blockchainHash = block.transactions[0].txHash;
    batch.currentBlockHash = block.currentHash;

    this.saveKey('packagingRecords');
    this.saveKey('honeyBatches');
    this.addAuditLog('PACKAGING_RECORDED', 'PackagingRecord', pkgId, block.transactions[0].txHash);
    this.notify();
    return newRecord;
  }

  public recordShipment(params: {
    batchId: string;
    shipmentId: string;
    sourceLocation: string;
    destination: string;
    transportMethod: string;
    expectedDelivery: string;
    trackingNotes: string;
  }): ShipmentRecord {
    const batch = this.batches.find((b) => b.id === params.batchId);
    if (!batch) throw new Error('Batch not found');

    const shpId = `SHP-2026-${Date.now().toString().slice(-4)}`;
    const newRecord: ShipmentRecord = {
      id: shpId,
      distributorId: this.currentUser.id,
      distributorName: this.currentUser.name,
      dispatchDate: new Date().toISOString(),
      status: 'In Transit',
      temperatureMaintainedC: 20.0,
      currentLocation: params.sourceLocation,
      ...params,
    };

    this.shipments.unshift(newRecord);
    batch.distributionStatus = 'In Transit';
    batch.status = 'DISTRIBUTED';
    batch.lastUpdated = new Date().toISOString();

    const block = this.appendBlockchainTransaction({
      batchId: params.batchId,
      action: 'SHIPMENT_DISPATCHED',
      actorRole: this.currentUser.role,
      actorName: this.currentUser.name,
      payloadSummary: `Dispatched consignment ${params.shipmentId} from ${params.sourceLocation} to ${params.destination}. Method: ${params.transportMethod}.`,
      data: { ...params, distributor: this.currentUser.name },
    });

    newRecord.blockchainTxId = block.transactions[0].txId;
    newRecord.blockchainHash = block.transactions[0].txHash;
    batch.currentBlockHash = block.currentHash;

    this.saveKey('shipments');
    this.saveKey('honeyBatches');
    this.addAuditLog('SHIPMENT_DISPATCHED', 'ShipmentRecord', shpId, block.transactions[0].txHash);
    this.notify();
    return newRecord;
  }

  public markShipmentDelivered(shipmentId: string, notes?: string): void {
    const shp = this.shipments.find((s) => s.id === shipmentId);
    if (!shp) return;

    shp.status = 'Delivered';
    shp.actualDelivery = new Date().toISOString();
    shp.currentLocation = shp.destination;
    if (notes) shp.trackingNotes += ` | ${notes}`;

    const batch = this.batches.find((b) => b.id === shp.batchId);
    if (batch) {
      batch.distributionStatus = 'Delivered';
      batch.status = 'DELIVERED';
      batch.lastUpdated = new Date().toISOString();
    }

    const block = this.appendBlockchainTransaction({
      batchId: shp.batchId,
      action: 'SHIPMENT_DELIVERED',
      actorRole: this.currentUser.role,
      actorName: this.currentUser.name,
      payloadSummary: `Shipment ${shp.shipmentId} successfully delivered to ${shp.destination}.`,
      data: { shipmentId: shp.shipmentId, destination: shp.destination },
    });

    shp.blockchainTxId = block.transactions[0].txId;
    shp.blockchainHash = block.transactions[0].txHash;

    this.saveKey('shipments');
    this.saveKey('honeyBatches');
    this.addAuditLog('SHIPMENT_DELIVERED', 'ShipmentRecord', shipmentId, block.transactions[0].txHash);
    this.notify();
  }

  public createApiary(data: Omit<Apiary, 'id'>): Apiary {
    const newApiary: Apiary = {
      ...data,
      id: `API-${(this.apiaries.length + 1).toString().padStart(3, '0')}`,
    };
    this.apiaries.push(newApiary);
    this.saveKey('apiaries');
    this.addAuditLog('APIARY_CREATED', 'Apiary', newApiary.id);
    this.notify();
    return newApiary;
  }

  public createHive(data: Omit<Hive, 'id' | 'latestSensorReading'>): Hive {
    const newHive: Hive = {
      ...data,
      id: `HIVE-${Date.now().toString().slice(-4)}`,
      latestSensorReading: {
        id: `SNS-${Date.now().toString().slice(-4)}`,
        hiveId: `HIVE-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        ambientTempC: 27.5,
        internalTempC: 34.6,
        humidityPercent: 58.0,
        weightKg: 35.0,
        batteryLevelPercent: 100,
        audioFrequencyHz: 180,
        activityLevel: 'normal',
      },
    };
    this.hives.push(newHive);
    // Update apiary count
    const apiary = this.apiaries.find((a) => a.id === data.apiaryId);
    if (apiary) {
      apiary.hiveCount += 1;
    }
    this.saveKey('hives');
    this.saveKey('apiaries');
    this.addAuditLog('HIVE_REGISTERED', 'Hive', newHive.id);
    this.notify();
    return newHive;
  }

  public updateThresholds(t: Partial<SensorThresholds>) {
    this.thresholds = { ...this.thresholds, ...t };
    this.saveKey('sensorThresholds');
    this.notify();
  }

  public resolveAlert(alertId: string, actionNote: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      alert.actionTaken = actionNote || 'Resolved by operator';
      this.saveKey('alerts');
      this.addAuditLog('ALERT_RESOLVED', 'Alert', alertId);
      this.notify();
    }
  }

  // IoT Simulation Tick
  public simulateIoTTick() {
    this.hives.forEach((hive) => {
      if (!hive.latestSensorReading) return;
      const reading = hive.latestSensorReading;
      // Slight natural fluctuations
      const tempDelta = (Math.random() - 0.48) * 0.4;
      reading.internalTempC = +(reading.internalTempC + tempDelta).toFixed(1);
      reading.ambientTempC = +(reading.ambientTempC + (Math.random() - 0.5) * 0.3).toFixed(1);
      reading.humidityPercent = +(reading.humidityPercent + (Math.random() - 0.5) * 0.5).toFixed(1);
      reading.weightKg = +(reading.weightKg + (Math.random() - 0.49) * 0.05).toFixed(2);
      reading.audioFrequencyHz = Math.round(reading.audioFrequencyHz + (Math.random() - 0.5) * 8);
      reading.timestamp = new Date().toISOString();

      // Check thresholds
      if (reading.internalTempC > this.thresholds.maxInternalTempC) {
        const existing = this.alerts.find((a) => a.hiveId === hive.id && a.type === 'HIGH_TEMP' && a.status === 'active');
        if (!existing) {
          this.alerts.unshift({
            id: `ALT-T-${Date.now().toString().slice(-4)}`,
            type: 'HIGH_TEMP',
            severity: 'warning',
            hiveId: hive.id,
            message: `Hive ${hive.hiveCode} internal temp rose to ${reading.internalTempC}°C (exceeds ${this.thresholds.maxInternalTempC}°C).`,
            timestamp: new Date().toISOString(),
            status: 'active',
          });
        }
      }
    });
    this.notify();
  }

  // Interactive Blockchain Tamper Demonstration for Viva
  public tamperBlockForDemo(blockIndex: number) {
    if (this.isTamperedForDemo || blockIndex >= this.blockchain.length || blockIndex === 0) return;
    const targetBlock = this.blockchain[blockIndex];
    this.tamperedBlockCopy = JSON.parse(JSON.stringify(targetBlock));

    // Tamper with transaction payload data
    if (targetBlock.transactions.length > 0) {
      targetBlock.transactions[0].payloadSummary = '[TAMPERED BY ATTACKER]: Quantity falsified to 150.0 kg.';
      // Tampering the payload breaks the Merkle root and block hash validation!
    }
    this.isTamperedForDemo = true;
    this.alerts.unshift({
      id: `ALT-TAMPER-${Date.now().toString().slice(-4)}`,
      type: 'UNAUTHORIZED_TAMPER',
      severity: 'critical',
      message: `Security Warning: Tamper simulation triggered on Block #${blockIndex}. The cryptographic ledger verification will fail until restored.`,
      timestamp: new Date().toISOString(),
      status: 'active',
    });
    this.notify();
  }

  public restoreBlockchainFromTamper() {
    if (!this.isTamperedForDemo || !this.tamperedBlockCopy) return;
    const idx = this.tamperedBlockCopy.blockIndex;
    this.blockchain[idx] = this.tamperedBlockCopy;
    this.isTamperedForDemo = false;
    this.tamperedBlockCopy = undefined;
    this.saveKey('blockchainRecords');
    this.notify();
  }

  private addAuditLog(action: string, entity: string, entityId: string, txHash?: string) {
    this.auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      user: this.currentUser.name,
      role: this.currentUser.role,
      action,
      entity,
      entityId,
      ipAddress: '157.34.120.45',
      txHash,
    });
    this.saveKey('auditLogs');
  }
}

export const honeyChainStore = new HoneyChainDataStore();
