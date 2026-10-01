export type UserRole =
  | 'admin'
  | 'beekeeper'
  | 'processor'
  | 'inspector'
  | 'distributor'
  | 'consumer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  organization?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Apiary {
  id: string;
  name: string;
  beekeeperId: string;
  beekeeperName: string;
  location: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  hiveCount: number;
  beeSpecies: string; // e.g. "Apis cerana indica" or "Apis mellifera"
  floralSource: string; // e.g. "Multifloral, Acacia & Wild Mustard"
  establishedDate: string;
  altitudeMeters: number;
  organicCertified: boolean;
}

export interface Hive {
  id: string;
  hiveCode: string; // e.g. "H-101"
  apiaryId: string;
  apiaryName: string;
  hiveType: 'Langstroth' | 'Top-Bar' | 'Warre' | 'Traditional Clay/Log';
  beeColony: string;
  queenStatus: 'Healthy Laying' | 'Virgin' | 'Supercedure' | 'Aging';
  queenAgeMonths: number;
  installationDate: string;
  status: 'active' | 'maintenance' | 'swarmed' | 'dormant';
  lastInspectionDate: string;
  honeySuperFrames: number;
  latestSensorReading?: SensorReading;
}

export interface SensorReading {
  id: string;
  hiveId: string;
  timestamp: string;
  ambientTempC: number;
  internalTempC: number; // Brood nest optimal ~34.5°C - 35.5°C
  humidityPercent: number; // Optimal ~55% - 65%
  weightKg: number; // Tracks nectar flow / sudden drops (swarming or honey theft)
  batteryLevelPercent: number;
  audioFrequencyHz: number; // Normal worker hum 100-250Hz; >450Hz indicates piping / swarming intent
  activityLevel: 'low' | 'normal' | 'high' | 'swarming_risk';
}

export interface SensorThresholds {
  minInternalTempC: number;
  maxInternalTempC: number;
  minHumidityPercent: number;
  maxHumidityPercent: number;
  minWeightKg: number;
  weightDropAlertKg: number;
  lowBatteryPercent: number;
}

export type BatchStatus =
  | 'HARVESTED'
  | 'QUALITY_CHECK'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PACKAGED'
  | 'DISTRIBUTED'
  | 'DELIVERED'
  | 'REJECTED';

export interface HoneyBatch {
  id: string; // Format: HC-YYYY-XXXXX e.g. "HC-2026-00001"
  hiveId: string;
  hiveCode: string;
  apiaryId: string;
  apiaryName: string;
  beekeeperId: string;
  beekeeperName: string;
  location: string;
  honeyType: string; // e.g. "Raw Multifloral Honey"
  floralSource: string; // e.g. "Jamun & Wild Meadow Flowers"
  harvestDate: string;
  quantityKg: number;
  harvestNotes: string;
  status: BatchStatus;
  qualityStatus: 'Pending' | 'Approved' | 'Rejected';
  processingStatus: 'Not Started' | 'In Process' | 'Completed';
  packagingStatus: 'Not Started' | 'Completed';
  distributionStatus: 'Pending' | 'Prepared' | 'In Transit' | 'Delivered';
  qrCodeUrl?: string;
  currentBlockHash?: string;
  lastUpdated: string;
}

export interface QualityInspection {
  id: string;
  batchId: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  moistureContentPercent: number; // FSSAI/Codex standard < 20%
  phLevel: number; // Normal raw honey 3.4 - 6.1
  colorPfund: string; // e.g. "34mm Extra Light Amber"
  aromaProfile: string; // e.g. "Floral with subtle herbal undertones"
  purityPercentage: number; // e.g. 99.4%
  hmfValueMgKg: number; // Hydroxymethylfurfural (Fresh raw honey < 15 mg/kg, max permitted 40-80 mg/kg)
  adulterationTest: 'Negative (C3/C4 Sugar Negative)' | 'Positive (Adulteration Detected)';
  microbialTest: 'Passed (Zero Pathogens)' | 'Failed';
  diastaseActivity: number; // Standard > 8 Schade units
  overallResult: 'Approved' | 'Rejected' | 'Pending';
  remarks: string;
  certificateNumber: string;
  testReportFile?: string;
  blockchainTxId?: string;
  blockchainHash?: string;
}

export interface ProcessingRecord {
  id: string;
  batchId: string;
  operatorId: string;
  operatorName: string;
  processingDate: string;
  processingUnit: string;
  filtrationMethod: string; // e.g. "Micro-mesh mechanical filter (unpasteurized raw)"
  heatingTemperatureC: number; // e.g. 35°C (no denaturing heating)
  processingDurationHours: number;
  storageCondition: string; // e.g. "Airtight stainless steel tank, 18°C, dark"
  notes: string;
  blockchainTxId?: string;
  blockchainHash?: string;
}

export interface PackagingRecord {
  id: string;
  batchId: string;
  operatorId: string;
  operatorName: string;
  packagingDate: string;
  facilityName: string;
  packageSize: string; // e.g. "500g Hexagonal Glass Jar"
  unitCount: number;
  expiryDate: string;
  productLabelId: string;
  qrVerificationUrl: string;
  blockchainTxId?: string;
  blockchainHash?: string;
}

export interface ShipmentRecord {
  id: string;
  batchId: string;
  distributorId: string;
  distributorName: string;
  shipmentId: string;
  sourceLocation: string;
  destination: string;
  transportMethod: string; // e.g. "Refrigerated Eco-Van"
  dispatchDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: 'Prepared' | 'In Transit' | 'Delivered' | 'Delayed';
  currentLocation?: string;
  temperatureMaintainedC?: number;
  trackingNotes: string;
  blockchainTxId?: string;
  blockchainHash?: string;
}

export interface BlockchainTransaction {
  txId: string;
  batchId: string;
  action:
    | 'HARVEST_RECORDED'
    | 'QUALITY_INSPECTION_RECORDED'
    | 'QUALITY_APPROVED'
    | 'QUALITY_REJECTED'
    | 'PROCESSING_COMPLETED'
    | 'PACKAGING_COMPLETED'
    | 'SHIPMENT_DISPATCHED'
    | 'SHIPMENT_DELIVERED';
  actorRole: UserRole;
  actorName: string;
  timestamp: string;
  payloadSummary: string;
  data: Record<string, unknown>;
  txHash: string;
}

export interface BlockchainBlock {
  blockIndex: number;
  timestamp: string;
  transactions: BlockchainTransaction[];
  previousHash: string;
  currentHash: string;
  nonce: number;
  merkleRoot: string;
  isGenesis?: boolean;
}

export interface Alert {
  id: string;
  type:
    | 'HIGH_TEMP'
    | 'LOW_HUMIDITY'
    | 'SUDDEN_WEIGHT_DROP'
    | 'LOW_BATTERY'
    | 'QUALITY_REJECTED'
    | 'SWARMING_RISK'
    | 'SHIPMENT_DELAY'
    | 'UNAUTHORIZED_TAMPER';
  severity: 'critical' | 'warning' | 'info';
  hiveId?: string;
  batchId?: string;
  message: string;
  timestamp: string;
  status: 'active' | 'resolved';
  actionTaken?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  txHash?: string;
}
